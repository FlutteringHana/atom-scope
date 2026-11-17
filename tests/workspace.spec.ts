import { expect, test } from '@playwright/test';

test('knowledge map, part navigation, search, filters and relationships', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.part-card')).toHaveCount(3);
  await page.getByRole('textbox', { name: '搜索知识主题' }).fill('玻尔');
  await expect(page.locator('.topic-row')).toHaveCount(2);
  await page.getByRole('button', { name: '清空搜索' }).click();
  await page.getByRole('button', { name: '交互探索', exact: true }).click();
  await expect(page.locator('.topic-row')).toHaveCount(9);
  await page.getByRole('button', { name: '知识关联', exact: true }).click();
  await expect(page.locator('.relationship-list article')).toHaveCount(7);
  await page.goto('/#/part/3');
  await expect(page.locator('.topic-row')).toHaveCount(5);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('量子力学初步');
});
test('coordinated Bohr views, presentation state, playback, and reset', async ({ page }) => {
  await page.goto('/#/topic/bohr');
  await expect(page.locator('.readouts')).toContainText('656.11 nm');
  await page.getByLabel('单电子体系').selectOption('2');
  await page.getByRole('button', { name: '初态 n = 4', exact: true }).click();
  await expect(page.locator('.readouts')).toContainText('121.50 nm');
  await page.getByRole('button', { name: '播放动画' }).click();
  await expect(page.getByRole('button', { name: '暂停动画' })).toBeVisible();
  await page.getByRole('button', { name: '演示模式' }).click();
  await expect(page.locator('.control-panel')).toHaveCount(0);
  await page.getByRole('button', { name: '返回工作台' }).click();
  await expect(page.getByLabel('单电子体系')).toHaveValue('2');
  await expect(page.getByRole('button', { name: '初态 n = 4', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('tab', { name: '能级图' }).click();
  await page.getByRole('button', { name: '物理解释', exact: true }).click();
  await expect(page.locator('.context-content')).toContainText('当前视图 · 能级图');
  await page.getByRole('button', { name: '参数控制', exact: true }).click();
  await page.getByRole('tab', { name: '光谱', exact: true }).click();
  await page.locator('.spectrum-lines button').filter({ hasText: '3 → 2' }).click();
  await expect(page.getByRole('button', { name: '初态 n = 3', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('button', { name: '重置参数' }).click();
  await expect(page.getByLabel('单电子体系')).toHaveValue('1');
  await expect(page.locator('.readouts')).toContainText('656.11 nm');
  await page.getByRole('button', { name: '初态 n = 1', exact: true }).click();
  await expect(page.locator('.spectrum-view')).toContainText('吸收系列初态 n = 1');
  await page.locator('.spectrum-lines button').filter({ hasText: '1 → 3' }).click();
  await expect(page.getByLabel('末态主量子数')).toHaveValue('3');
  await expect(page.locator('.readouts')).toContainText('102.52 nm');
});
test('scattering, Planck, matter and orbital controls update physics', async ({ page }) => {
  for (const id of ['rutherford', 'blackbody', 'matter-waves', 'orbitals']) {
    await page.goto(`/#/topic/${id}`);
    await expect(page.locator('.visual-content svg')).toBeVisible();
    const before = await page.locator('.readouts').innerText();
    if (id === 'orbitals') await page.getByLabel('氢原子量子态').selectOption('2s');
    else {
      const slider = page.getByRole('slider').first();
      await slider.focus();
      await page.keyboard.press('ArrowRight');
    }
    await expect(page.locator('.readouts')).not.toHaveText(before);
  }
});
test('photoelectric intensity affects rate but not maximum kinetic energy', async ({ page }) => {
  await page.goto('/#/topic/photoelectric');
  const kinetic = await page.locator('.readouts dd').first().innerText();
  const intensity = page.getByRole('slider', { name: '相对光强' });
  await intensity.focus();
  await page.keyboard.press('End');
  await expect(page.locator('.readouts dd').first()).toHaveText(kinetic);
  await expect(page.locator('.photo-electron')).toHaveCount(10);
  await page.keyboard.press('Home');
  await expect(page.locator('.photo-electron')).toHaveCount(0);
  await expect(page.locator('.readouts')).toContainText('光源关闭');
  await page.getByRole('slider', { name: '入射光波长' }).focus();
  await page.keyboard.press('End');
  await expect(page.locator('.readouts dd').first()).toHaveText('0.000 eV');
});
test('all routes render without runtime errors or horizontal overflow', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  for (const id of [
    'electrons',
    'thomson',
    'rutherford',
    'classical',
    'blackbody',
    'photoelectric',
    'bohr',
    'hydrogen-like',
    'sommerfeld',
    'transitions',
    'spectroscopy',
    'franck-hertz',
    'duality',
    'matter-waves',
    'wavefunction',
    'schrodinger',
    'orbitals',
  ]) {
    await page.goto(`/#/topic/${id}`);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      `${id} overflow`,
    ).toBe(true);
    if (
      testInfo.project.name === 'desktop' &&
      ['rutherford', 'blackbody', 'photoelectric', 'matter-waves', 'orbitals'].includes(id)
    ) {
      await page.locator('.visual-panel').screenshot({ path: `artifacts/desktop-${id}.png` });
    }
  }
  await page.goto('/#/reference');
  await expect(page.getByRole('table')).toBeVisible();
  await page.goto('/#/unknown');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('没有找到这个知识入口');
  expect(errors).toEqual([]);
  await page.goto('/');
  await page.screenshot({ path: `artifacts/${testInfo.project.name}-map.png`, fullPage: true });
  await page.goto('/#/topic/bohr');
  await page.screenshot({ path: `artifacts/${testInfo.project.name}-bohr.png`, fullPage: true });
});
test('reduced motion, skip link and details navigation remain usable', async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/#/topic/bohr');
  await expect(page.getByRole('button', { name: '播放动画' })).toBeDisabled();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: '跳至主要内容' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main-content')).toBeFocused();
  await expect(page).toHaveURL(/topic\/bohr$/);
  await page.getByRole('tab', { name: '原子模型', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: '能级图', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await page.keyboard.press('Home');
  await expect(page.getByRole('tab', { name: '原子模型', exact: true })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await page.getByRole('button', { name: '演示模式' }).click();
  await page.getByRole('link', { name: '知识详解', exact: true }).click();
  await expect(page.locator('#knowledge-details')).toBeVisible();
  await expect(page.getByRole('button', { name: '演示模式' })).toBeVisible();
  if (testInfo.project.name === 'mobile') {
    await page.getByRole('button', { name: '打开目录' }).click();
    await page
      .locator('.sidebar')
      .getByRole('link', { name: '德布罗意物质波', exact: true })
      .click();
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('德布罗意物质波');
    await expect(page.getByRole('button', { name: '打开目录' })).toBeVisible();
  }
});
