import { describe, test, expect, vi } from 'vitest';
import { fetchReport } from './Report';
import { validateResponse } from '@/shared/api';

vi.mock('@/shared/api', () => ({
  validateResponse: vi.fn(),
}));

describe('API fetchReport', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(validateResponse).mockResolvedValue(undefined);
  });

  test('должен успешно получить Blob', async () => {
    const mockBlob = new Blob(['test content'], { type: 'text/plain' });

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: vi.fn().mockResolvedValue(mockBlob),
    } as unknown as Response);

    const result = await fetchReport();

    expect(validateResponse).toHaveBeenCalled();
    expect(result).toBe(mockBlob);
    expect(result.type).toBe('text/plain');
  });

  test('должен вызвать validateResponse с response', async () => {
    const mockBlob = new Blob(['content']);
    const mockResponse = {
      ok: true,
      blob: vi.fn().mockResolvedValue(mockBlob),
    } as unknown as Response;

    global.fetch = vi.fn().mockResolvedValue(mockResponse);

    await fetchReport();

    expect(validateResponse).toHaveBeenCalledWith(mockResponse);
  });

  test('должен пробросить ошибку из validateResponse', async () => {
    const error = new Error('Network error');
    vi.mocked(validateResponse).mockRejectedValue(error);

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      blob: vi.fn().mockRejectedValue(error),
    } as unknown as Response);

    await expect(fetchReport()).rejects.toThrow(error);
  });

  test('должен выбросить ошибку, если blob() вернул undefined', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: vi.fn().mockResolvedValue(undefined),
    } as unknown as Response);

    await expect(fetchReport()).rejects.toThrow('Failed to retrieve blob data');
  });
});
