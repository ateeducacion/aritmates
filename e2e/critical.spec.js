import {test, expect} from 'playwright/test';

function solveVisible(text) {
  const expr = text.split('=')[0].replaceAll('∙', '*').replace(/\s+/g, '');
  return Function(`"use strict"; return (${expr});`)();
}

test('portada, ejercicio, acierto y resultados', async ({page}) => {
  await page.goto('/');
  await expect(page.locator('#main')).toBeVisible();
  await expect(page).toHaveTitle(/Aritmates/);
  await expect(page.locator('#btnSuma')).toHaveClass(/selected/);
  await expect(page.locator('#btnPositivos')).toHaveClass(/selected/);

  const checkbox = page.locator('#cbDivResto');
  await expect(checkbox).toHaveAttribute('role', 'checkbox');

  await page.locator('#btnComenzar').click();
  await expect(page.locator('.incognita')).toBeVisible();

  for (let n = 1; n <= 10; n++) {
    await expect(page.locator('.numEjercicios')).toContainText(`${n} / 10`);
    const visible = await page.locator('.operacion').innerText();
    const answer = solveVisible(visible);
    await page.locator('.incognita').fill(String(answer));
    await page.locator('#btnEnviarRespuesta').click();
    if (n < 10) {
      await expect(page.locator('.numEjercicios')).toContainText(`${n + 1} / 10`);
    }
  }

  await expect(page.locator('text=Tus Resultados')).toBeVisible();
  await expect(page.locator('#puntuacion')).toContainText('10');
});

test('la hoja de ejercicios abre la vista previa', async ({page}) => {
  await page.goto('/');
  await page.locator('#pdfdown').click();
  await expect(page.locator('#preview')).toBeVisible();
  await expect(page.locator('#paper .ejercicios')).toBeVisible();
  await expect(page.locator('#preview #print')).toBeVisible();
});

test('portada usable en un móvil estrecho', async ({page}) => {
  await page.setViewportSize({width: 375, height: 812});
  await page.goto('/');
  await expect(page.locator('#main')).toBeVisible();
  await expect(page.locator('#btnComenzar')).toBeVisible();
  const overflow = await page.evaluate(() => {
    return document.documentElement.scrollWidth - document.documentElement.clientWidth;
  });
  expect(overflow).toBeLessThan(40);
});
