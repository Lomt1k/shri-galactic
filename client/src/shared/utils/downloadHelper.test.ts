import { describe, test, expect, vi } from 'vitest';
import { downloadBlob } from './downloadHelper'; // замените на ваш путь

describe('Функция downloadBlob', () => {
  test('корректно создаёт ссылку и запускает скачивание', () => {
    // подготовка
    const blob = new Blob(['test content']);
    const filename = 'test.txt';

    const mockCreateObjectURL = vi.fn().mockReturnValue('mocked-url');
    const mockRevokeObjectURL = vi.fn();

    vi.stubGlobal('URL', {
      createObjectURL: mockCreateObjectURL,
      revokeObjectURL: mockRevokeObjectURL,
    });

    // создаём реальный <a>-элемент вместо полного мока
    const link = document.createElement('a');
    const createElementMock = vi.fn(() => link);

    vi.spyOn(document, 'createElement').mockImplementation(createElementMock);

    const mockAppendChild = vi.spyOn(document.body, 'appendChild');
    const mockRemoveChild = vi.spyOn(document.body, 'removeChild');

    const mockClick = vi.fn();
    link.click = mockClick;

    // действие
    downloadBlob(blob, filename);

    // проверка
    expect(mockCreateObjectURL).toHaveBeenCalledWith(blob);
    expect(createElementMock).toHaveBeenCalledWith('a');
    expect(mockAppendChild).toHaveBeenCalledWith(link);
    expect(link.href).toBe(location.href + 'mocked-url');
    expect(link.download).toBe(filename);
    expect(mockClick).toHaveBeenCalled();
    expect(mockRevokeObjectURL).toHaveBeenCalledWith('mocked-url');
    expect(mockRemoveChild).toHaveBeenCalledWith(link);
  });
});
