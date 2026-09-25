import {test, expect} from 'playwright/test';

test('los controles personalizados tienen nombre accesible y estado ARIA', async ({page}) => {
  await page.goto('/');

  const divisionRemainder = page.getByRole('checkbox', {name: 'Con Resto'});
  await expect(divisionRemainder).toBeVisible();
  await expect(divisionRemainder).toHaveAttribute('aria-checked', /true|false/);

  const noTimer = page.getByRole('switch', {name: 'Sin cronómetro'});
  await expect(noTimer).toBeVisible();
  await expect(noTimer).toHaveAttribute('aria-checked', /true|false/);

  const equalResult = page.locator('#resultadoIgualA');
  const select = equalResult.locator('select');
  await expect(select).toHaveAttribute('aria-label', 'Resultado igual a');
});

test('checkbox y switch se pueden activar con teclado', async ({page}) => {
  await page.goto('/');

  const checkbox = page.locator('#cbDivResto');
  await checkbox.focus();
  await expect(checkbox).toBeFocused();
  const initialCheckbox = await checkbox.getAttribute('aria-checked');
  await page.keyboard.press('Space');
  await expect(checkbox).not.toHaveAttribute('aria-checked', initialCheckbox);

  const noTimer = page.locator('#switch-crono');
  await noTimer.focus();
  await expect(noTimer).toBeFocused();
  const initialSwitch = await noTimer.getAttribute('aria-checked');
  await page.keyboard.press('Enter');
  await expect(noTimer).not.toHaveAttribute('aria-checked', initialSwitch);
});

test('los controles principales son alcanzables mediante tabulación', async ({page}) => {
  await page.goto('/');

  const focusable = await page.locator(
      'button:visible, a[href]:visible, input:not([disabled]):visible, ' +
      'paper-checkbox[tabindex="0"]:visible, mwc-switch[tabindex="0"]:visible, ' +
      'select:not([disabled]):visible',
  ).count();
  expect(focusable).toBeGreaterThan(5);

  let reachedStart = false;
  for (let i = 0; i < Math.min(focusable + 10, 60); i++) {
    await page.keyboard.press('Tab');
    const id = await page.evaluate(() => document.activeElement?.id || '');
    if (id === 'btnComenzar') {
      reachedStart = true;
      break;
    }
  }
  expect(reachedStart).toBe(true);
});
