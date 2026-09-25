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


test('los elementos interactivos visibles tienen un nombre accesible', async ({page}) => {
  await page.goto('/');

  const unnamed = await page.locator(
      'button:visible, a[href]:visible, input:visible, select:visible, textarea:visible, ' +
      '[role="button"]:visible, [role="checkbox"]:visible, [role="switch"]:visible',
  ).evaluateAll((elements) => {
    const hasName = (element) => {
      if ((element.getAttribute('aria-label') || '').trim()) return true;

      const labelledBy = element.getAttribute('aria-labelledby');
      if (labelledBy) {
        const text = labelledBy
            .split(/\s+/)
            .map((id) => document.getElementById(id)?.textContent || '')
            .join(' ')
            .trim();
        if (text) return true;
      }

      if ((element.getAttribute('title') || '').trim()) return true;
      if ((element.textContent || '').trim()) return true;

      if (element.id) {
        const label = document.querySelector(`label[for="${CSS.escape(element.id)}"]`);
        if ((label?.textContent || '').trim()) return true;
      }

      if ((element.getAttribute('placeholder') || '').trim()) return true;
      if ((element.getAttribute('alt') || '').trim()) return true;
      return false;
    };

    return elements
        .filter((element) => !hasName(element))
        .map((element) => element.id || element.outerHTML.slice(0, 120));
  });

  expect(unnamed).toEqual([]);
});

test('la portada no contiene identificadores HTML duplicados', async ({page}) => {
  await page.goto('/');

  const duplicates = await page.evaluate(() => {
    const counts = new Map();
    document.querySelectorAll('[id]').forEach((element) => {
      counts.set(element.id, (counts.get(element.id) || 0) + 1);
    });
    return [...counts.entries()]
        .filter(([, count]) => count > 1)
        .map(([id, count]) => ({id, count}));
  });

  expect(duplicates).toEqual([]);
});
