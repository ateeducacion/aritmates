import {test, expect} from 'playwright/test';

function trackErrors(page) {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  return errors;
}

test('«faltan opciones» se puede cerrar, reabrir y continuar una vez', async ({page}) => {
  const errors = trackErrors(page);
  await page.goto('/');
  for (const id of ['#btnSuma', '#btnResta', '#btnDiv', '#btnMulti']) {
    await page.locator(id).click();
    await expect(page.locator(id)).not.toHaveClass(/selected/);
  }

  const dialog = page.locator('#faltanOpciones');
  await page.locator('#btnComenzar').click();
  await expect(dialog).toBeVisible();
  await dialog.locator('.button_cancel').click();
  await expect(dialog).toBeHidden();

  await page.locator('#btnComenzar').click();
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveCount(1);
  await dialog.locator('.button_ok').click();

  await expect(dialog).toBeHidden();
  await expect(page.locator('.numEjercicios')).toContainText('1 / 10');
  expect(errors).toEqual([]);
});

test('compartir y cargar un código usan el mismo diálogo sin arrastrar acciones', async ({page}) => {
  const errors = trackErrors(page);
  await page.goto('/');
  const dialog = page.locator('.mdc-dialog').first();

  await page.locator('#btnCompartirHoja').click();
  await expect(dialog).toBeVisible();
  const code = await dialog.locator('input[readonly]').nth(1).inputValue();
  await page.locator('#button_ok').click();
  await expect(dialog).toBeHidden();

  await page.locator('#btnCodigoEjercicio').click();
  await expect(dialog).toBeVisible();
  await page.locator('#userCode').fill(code);
  await page.locator('#button_ok').click();
  await expect(dialog).toBeHidden();

  await page.locator('#btnCompartirHoja').click();
  await expect(dialog).toBeVisible();
  await expect(page.locator('#button_ok')).toContainText('Ok');
  await page.locator('#button_ok').click();
  await expect(dialog).toBeHidden();
  expect(errors).toEqual([]);
});
