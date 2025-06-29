import { validateResponse } from './validateResponse';
import { expect, describe, test } from 'vitest';

describe('API validateResponse', () => {
  test('не выбрасывает исключение при корректном Response', async () => {
    const response = new Response(JSON.stringify({ status: 'OK' }), {
      status: 200,
      statusText: 'OK',
    });

    await expect(validateResponse(response)).resolves.not.toThrow();
  });

  test('выбрасывает исключение с текстом ошибки от сервера', async () => {
    const response = new Response(
      JSON.stringify({
        error: 'Неверный формат данных',
      }),
      {
        status: 400,
        statusText: 'Bad Request',
      }
    );

    await expect(validateResponse(response)).rejects.toThrow('Неверный формат данных');
  });

  test('выбрасывает стандартную ошибку при отсутствии текста ошибки от сервера', async () => {
    const response = new Response(null, {
      status: 500,
      statusText: 'Internal Server Error',
    });

    await expect(validateResponse(response)).rejects.toThrow('500 Internal Server Error');
  });
});
