import {test, expect} from 'playwright/test';

test('el ancla de la ayuda abre esa pestaña', async ({page}) => {
  await page.goto('/#nav-resta');
  const resta = page.locator('#nav-resta');
  await expect(resta).toBeVisible();
  await expect(page.locator('#ayuda')).toHaveClass(/mdc-drawer--open/);
  await expect(page.locator('#nav-suma')).toBeHidden();

  await page.locator('#nav-multiplicacion-tab').click();
  await expect(page.locator('#nav-multiplicacion')).toBeVisible();
  await expect(resta).toBeHidden();
  await expect(page).toHaveURL(/#nav-multiplicacion$/);
});
