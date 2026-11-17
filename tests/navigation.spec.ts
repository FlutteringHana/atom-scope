import { expect, test } from '@playwright/test';

test('course navigation can hide and restore independently of presentation mode', async ({
  page,
}, testInfo) => {
  await page.goto('/#/topic/bohr');
  await page.getByLabel('单电子体系').selectOption('2');
  await page.getByRole('button', { name: '初态 n = 4', exact: true }).click();
  const values = await page.locator('.readouts dd').allTextContents();
  if (testInfo.project.name === 'desktop') {
    const before = await page.locator('#main-content').boundingBox();
    await page.getByRole('button', { name: '收起左侧导航', exact: true }).click();
    await expect(page.getByRole('button', { name: '展开左侧导航', exact: true })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    await expect(page.locator('#course-navigation')).toBeHidden();
    const after = await page.locator('#main-content').boundingBox();
    expect(after!.width).toBeGreaterThan(before!.width + 200);
    await expect(page.locator('.readouts dd')).toHaveText(values);
    await page.getByRole('button', { name: '演示模式', exact: true }).click();
    await expect(page.locator('.control-panel')).toHaveCount(0);
    await page.getByRole('button', { name: '展开左侧导航', exact: true }).click();
    await expect(page.locator('#course-navigation')).toBeVisible();
    await page.getByRole('button', { name: '返回工作台', exact: true }).click();
    await expect(page.getByLabel('单电子体系')).toHaveValue('2');
    await expect(page.locator('.readouts dd')).toHaveText(values);
    await page.getByRole('button', { name: '收起左侧导航', exact: true }).click();
    await page.locator('.app-header').getByRole('link', { name: '数学参考', exact: true }).click();
    await expect(page.getByRole('table')).toBeVisible();
    await expect(page.locator('#course-navigation')).toBeHidden();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole('button', { name: '打开目录', exact: true }).click();
    await expect(page.locator('#course-navigation')).toBeVisible();
    await page.getByRole('button', { name: '关闭目录', exact: true }).click();
    await page.setViewportSize({ width: 1440, height: 1000 });
    await expect(page.locator('#course-navigation')).toBeHidden();
    await page.getByRole('button', { name: '展开左侧导航', exact: true }).focus();
    await page.keyboard.press('Enter');
    await expect(page.locator('#course-navigation')).toBeVisible();
  } else {
    await expect(page.getByRole('button', { name: '收起左侧导航', exact: true })).toBeHidden();
    await page.getByRole('button', { name: '打开目录', exact: true }).click();
    await expect(page.locator('#course-navigation')).toBeVisible();
    await page.getByRole('button', { name: '关闭目录', exact: true }).click();
    await expect(page.locator('#course-navigation')).toBeHidden();
    await expect(page.locator('.readouts dd')).toHaveText(values);
    await page.getByRole('button', { name: '演示模式', exact: true }).click();
    await page.getByRole('button', { name: '返回工作台', exact: true }).click();
    await expect(page.locator('.readouts dd')).toHaveText(values);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1)).toBe(
    true,
  );
});
