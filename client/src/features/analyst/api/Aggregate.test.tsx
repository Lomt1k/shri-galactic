import { describe, test, expect, vi } from 'vitest';
import { fetchAggregate } from './Aggregate';
import { validateResponse } from '@/shared/api';
import { type Statistic } from '@/shared/types';

vi.mock('@/shared/api', () => ({
  validateResponse: vi.fn(),
}));

// Утилита для создания ReadableStream из строки
function createStreamFromString(input: string): ReadableStream {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  return new ReadableStream({
    start(controller) {
      controller.enqueue(data);
      controller.close();
    },
  });
}

const createMockFile = (name: string): File => {
  return new File([''], name);
};

describe('API fetchAggregate', () => {
  const mockOnIntermediateData = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    // По умолчанию считаем, что validateResponse успешен
    vi.mocked(validateResponse).mockResolvedValue(undefined);
  });

  test('корректно обрабатывает успешный поток с одним JSON', async () => {
    const file = createMockFile('test.csv');
    const json: Statistic = {
      rows_affected: 100,
      average_spend_galactic: 500,
      total_spend_galactic: 100500,
    };

    const stream = createStreamFromString(JSON.stringify(json) + '\n');

    const mockResponse = {
      ok: true,
      body: stream,
    } as unknown as Response;

    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    const result = await fetchAggregate(file, mockOnIntermediateData);

    expect(fetch).toHaveBeenCalled();
    expect(validateResponse).toHaveBeenCalled();
    expect(mockOnIntermediateData).toHaveBeenCalledWith(json);
    expect(result).toEqual(json);
  });

  test('корректно обрабатывает несколько сообщений в потоке', async () => {
    const file = createMockFile('test.csv');
    const stats1: Statistic = {
      rows_affected: 100,
      average_spend_galactic: 500,
      total_spend_galactic: 100500,
    };
    const stats2: Statistic = {
      rows_affected: 200,
      average_spend_galactic: 600,
      total_spend_galactic: 120000,
    };

    const stream = createStreamFromString(`${JSON.stringify(stats1)}\n${JSON.stringify(stats2)}\n`);

    const mockResponse = {
      ok: true,
      body: stream,
    } as unknown as Response;

    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    const result = await fetchAggregate(file, mockOnIntermediateData);

    expect(mockOnIntermediateData).toHaveBeenCalledTimes(2);
    expect(mockOnIntermediateData).toHaveBeenNthCalledWith(1, stats1);
    expect(mockOnIntermediateData).toHaveBeenNthCalledWith(2, stats2);
    expect(result).toEqual(stats2);
  });

  test('корректно обрабатывает частичные строки', async () => {
    const file = createMockFile('test.csv');
    const stats: Statistic = {
      rows_affected: 100,
      average_spend_galactic: 500,
      total_spend_galactic: 100500,
    };

    const fullJson = JSON.stringify(stats);
    const halfIndex = Math.floor(fullJson.length / 2);
    const firstPart = fullJson.slice(0, halfIndex);
    const secondPart = fullJson.slice(halfIndex);

    const encoder = new TextEncoder();
    const chunk1 = encoder.encode(firstPart);
    const chunk2 = encoder.encode(secondPart);

    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(chunk1);
        controller.enqueue(chunk2);
        controller.close();
      },
    });

    const mockResponse = {
      ok: true,
      body: stream,
    } as unknown as Response;

    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    const result = await fetchAggregate(file, mockOnIntermediateData);

    expect(mockOnIntermediateData).toHaveBeenCalledWith(stats);
    expect(result).toEqual(stats);
  });

  test('выбрасывает ошибку при невалидном JSON', async () => {
    const file = createMockFile('test.csv');

    const stream = createStreamFromString('invalid-json');

    const mockResponse = {
      ok: true,
      body: stream,
    } as unknown as Response;

    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    await expect(fetchAggregate(file, mockOnIntermediateData)).rejects.toThrow('Некорректный JSON');
  });

  test('выбрасывает ошибку при пустом потоке', async () => {
    const file = createMockFile('test.csv');

    const stream = new ReadableStream({
      start(controller) {
        controller.close();
      },
    });

    const mockResponse = {
      ok: true,
      body: stream,
    } as unknown as Response;

    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    await expect(fetchAggregate(file, mockOnIntermediateData)).rejects.toThrow('No valid JSON received in the stream');
  });

  test('выбрасывает ошибку при отсутствии response.body', async () => {
    const file = createMockFile('test.csv');

    const mockResponse = {
      ok: true,
      body: null,
    } as unknown as Response;

    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    await expect(fetchAggregate(file, mockOnIntermediateData)).rejects.toThrow('Получен некорректный ответ от сервера');
  });

  test('пробрасывает ошибку из validateResponse', async () => {
    const file = createMockFile('test.csv');
    const error = new Error('Network error');

    vi.mocked(validateResponse).mockRejectedValue(error);

    const stream = new ReadableStream({
      start(controller) {
        controller.close();
      },
    });

    const mockResponse = {
      ok: false,
      body: stream,
    } as unknown as Response;

    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    await expect(fetchAggregate(file, mockOnIntermediateData)).rejects.toThrow(error);
  });
});
