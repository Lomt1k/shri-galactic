import { test, expect } from '@playwright/test';
import * as fs from 'node:fs';

test.describe('Генерация CSV файла', () => {
  test('Страница генерации открывается', async ({ page }) => {
    await page.goto('http://localhost:5173/generator');

    expect(page).not.toBeNull();
  });

  test('После нажатия на кнопку "Начать генерацию" файл генерируется и скачивается', async ({ page }) => {
    await page.goto('http://localhost:5173/generator');

    const downloadPromise = page.waitForEvent('download');

    const generateButton = page.getByRole('button', { name: 'Начать генерацию' });
    await generateButton.click();

    const download = await downloadPromise;

    // Проверяем, что загрузка началась
    expect(download).toBeDefined();

    // Получаем имя файла
    const filename = download.suggestedFilename();
    expect(filename).toBe('report.csv');

    // Забираем содержимое файла
    const path = await download.path(); // временный путь к файлу
    const content = await download.createReadStream().toString();

    // Проверяем, что файл не пустой
    expect(content.length).toBeGreaterThan(0);

    // Удаляем файл
    await fs.promises.unlink(path);
  });
});
