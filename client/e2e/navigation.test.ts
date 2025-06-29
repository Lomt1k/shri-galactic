import { test, expect } from '@playwright/test';

test.describe('Навигация по приложению', () => {
  test('Проверка перехода по всем ссылкам в nav', async ({ page }) => {
    // Шаг 1: Открываем корень — произойдёт редирект на /analyst
    await page.goto('http://localhost:5173/');

    // Убеждаемся, что мы на /analyst после редиректа
    await expect(page).toHaveURL('http://localhost:5173/analyst');

    const currentUrlAfterRedirect = page.url(); // Сохраняем актуальный URL

    // Шаг 2: Ищем nav и все ссылки внутри
    const nav = page.locator('nav');
    const links = await nav.getByRole('link').all();

    expect(links.length).toBeGreaterThan(0);

    for (const link of links) {
      // Получаем href для проверки
      const href = await link.getAttribute('href');
      if (!href || href === '#') continue;

      // Переходим по ссылке
      await link.click();

      // Ждём загрузки новой страницы
      await page.waitForLoadState('networkidle');

      switch (href) {
        case '/analyst':
          await expect(
            page.getByText('Загрузите csv и получите полную информацию о нём за сверхнизкое время')
          ).toBeVisible();
          break;
        case '/generator':
          await expect(page.getByText('Сгенерируйте готовый csv-файл нажатием одной кнопки')).toBeVisible();
          break;
        case '/history':
          await expect(page.getByText('Сгенерировать больше')).toBeVisible();
          break;
      }

      // Возвращаемся назад
      await page.goto(currentUrlAfterRedirect);

      // Ждём загрузки страницы
      await page.waitForLoadState('networkidle');

      // Ждём, пока страница снова загрузится
      await expect(page).toHaveURL(currentUrlAfterRedirect);

      // Убеждаемся, что вернулись на главную страницу
      await expect(
        page.getByText('Загрузите csv и получите полную информацию о нём за сверхнизкое время')
      ).toBeVisible();
    }
  });
});
