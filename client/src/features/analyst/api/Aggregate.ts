import { validateResponse } from '@/shared/api';
import { isStatistic, type Statistic } from '@/shared/types';

export const fetchAggregate = async (file: File, onIntermediateData: (data: Statistic) => void): Promise<Statistic> => {
  const formData = new FormData();
  formData.append('file', file);

  const url = new URL('http://localhost:3000/aggregate');
  url.searchParams.append('rows', '10000');

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  await validateResponse(response).catch((error) => {
    throw error;
  });

  if (!response.body) {
    throw new Error('Получен некорректный ответ от сервера');
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  let lastStats: Statistic | null = null;
  while (true) {
    const { done, value } = await reader.read();

    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');

    // Последняя часть может быть незавершённой — оставляем в буфере
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue;

      let json: unknown;
      try {
        json = JSON.parse(trimmedLine);
      } catch {
        throw new Error('Некорректный JSON');
      }

      if (!isStatistic(json)) throw new Error('Некорректный JSON');
      lastStats = json;
      onIntermediateData(lastStats);
    }
  }

  // Обрабатываем остаток буфера
  if (buffer.trim()) {
    let json: unknown;
    try {
      json = JSON.parse(buffer.trim());
    } catch {
      throw new Error('Некорректный JSON');
    }

    if (!isStatistic(json)) throw new Error('Некорректный JSON');
    lastStats = json;
    onIntermediateData(lastStats);
    return lastStats;
  }

  if (lastStats) return lastStats;

  throw new Error('No valid JSON received in the stream');
};
