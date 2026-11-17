import { expect, test, type Page } from '@playwright/test';

async function openControls(page: Page) {
  await page.locator('.rf-module').waitFor();
  const toggle = page.getByRole('button', { name: '调整参数与物理量', exact: false });
  if (await toggle.isVisible()) await toggle.click();
}

test('Rutherford geometry has linked quantities, vectors, pinning and exact head-on limit', async ({
  page,
}) => {
  await page.goto('/#/topic/rutherford');
  await openControls(page);
  await expect(page.locator('.rf-module')).toBeVisible();
  await expect(page.getByTestId('rutherford-state')).toContainText('b=40 fm');
  await page
    .locator('.rf-formula-panel')
    .getByRole('button', { name: '检查 θ · 偏转角', exact: true })
    .click();
  await expect(page.getByLabel('选择物理量')).toHaveValue('scattering-angle');
  await expect(
    page.getByRole('button', { name: '检查 scattering-angle', exact: true }),
  ).toHaveAttribute('aria-pressed', 'true');
  await page.getByLabel('选择物理量').selectOption('force');
  await expect(page.getByRole('button', { name: '检查 force', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true',
  );
  await page.getByRole('button', { name: '固定当前数值' }).click();
  const snapshot = await page.locator('.rf-pinned strong').innerText();
  await page.getByRole('slider', { name: '当前轨道位置', exact: true }).focus();
  await page.keyboard.press('End');
  await expect(page.locator('.rf-pinned strong')).toHaveText(snapshot);
  await expect(page.locator('.rf-quantity-value strong')).not.toHaveText(snapshot.split(' ')[0]);
  await page.getByRole('button', { name: '正碰 b=0', exact: true }).click();
  await expect(page.getByTestId('rutherford-angle')).toHaveText('θ=180.000°');
  await expect(page.locator('.rf-formula-panel')).not.toContainText('Infinity');
  const drag = page.getByRole('slider', { name: '拖动入射线调整 b', exact: true });
  await drag.focus();
  await page.keyboard.press('ArrowUp');
  await expect(page.getByTestId('rutherford-state')).toContainText('b=1 fm');
  await page.getByRole('button', { name: 'θ=90°', exact: true }).click();
  await expect(page.getByTestId('rutherford-angle')).toHaveText('θ=90.000°');
});

test('both derivation routes render every mathematical step and preserve the same physics', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/#/topic/rutherford');
  await openControls(page);
  const before = await page.getByTestId('rutherford-state').innerText();
  const theta = await page.getByTestId('rutherford-angle').innerText();
  await page.getByRole('button', { name: '推导 θ：为什么可以消去 r²？ →', exact: true }).click();
  await expect(page.locator('.rf-step-card h3')).toHaveText('代入 dt，消去 r²');
  for (const route of ['A · 矢量冲量', 'B · 径向积分']) {
    await page.getByRole('button', { name: route, exact: true }).click();
    for (let step = 1; step <= 6; step++) {
      await page.getByRole('button', { name: `推导第 ${step} 步`, exact: true }).click();
      await expect(page.locator('.rf-step-card .katex-error')).toHaveCount(0);
      await page.locator('.rf-step-card details summary').click();
      await expect(page.locator('.rf-step-card details .katex')).toHaveCount(1);
    }
    await expect(page.getByTestId('rutherford-state')).toHaveText(before);
    await expect(page.getByTestId('rutherford-angle')).toHaveText(theta);
  }
  await page.getByRole('button', { name: '对照两种方法', exact: true }).click();
  await expect(page.locator('.rf-compare')).toContainText('2Φ = π−θ');
  await page.getByRole('button', { name: 'C · 分析力学（待补）', exact: true }).click();
  await expect(page.locator('.rf-step-card')).toContainText('未完成路线');
  await expect(page.getByTestId('rutherford-angle')).toHaveText(theta);
  expect(errors).toEqual([]);
});

test('cross-section context, exact ring counts, resampling and energy response are coordinated', async ({
  page,
}) => {
  await page.goto('/#/topic/rutherford');
  await openControls(page);
  await page.getByLabel('选择物理量').selectOption('differential-cross-section');
  await expect(page.getByRole('tab', { name: /截面与测量/ })).toHaveAttribute(
    'aria-selected',
    'true',
  );
  await expect(page.locator('.rf-acceptance-mapping')).toContainText('全方位环带 · 精确');
  await expect(page.locator('.rf-conditional-sample')).toContainText('总事件 = 300');
  await page.locator('.rf-jacobian summary').click();
  await expect(page.locator('.rf-jacobian .katex')).toHaveCount(3);
  const expected = await page.getByTestId('expected-count').innerText();
  const observations = new Set([await page.getByTestId('observed-count').innerText()]);
  for (let i = 0; i < 3; i++) {
    await page.getByRole('button', { name: '重新抽样', exact: true }).click();
    observations.add(await page.getByTestId('observed-count').innerText());
  }
  expect(observations.size).toBeGreaterThan(1);
  await expect(page.getByTestId('expected-count')).toHaveText(expected);
  await page.getByRole('slider', { name: '入射能量 E', exact: true }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByTestId('expected-count')).not.toHaveText(expected);
  await expect(page.getByTestId('rutherford-state')).toContainText('E=5.25 MeV');
  const lower = page.getByRole('slider', { name: '拖动环带下界', exact: true });
  await lower.focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByLabel('环带下界 θ₁ / °', { exact: true })).toHaveValue('61');
  await page.getByLabel('对数纵轴', { exact: true }).uncheck();
  await expect(page.locator('.rf-distribution svg')).toHaveAttribute('aria-label', /线性/);
});

test('patch geometry is explicitly approximate and invalid regimes never report probabilities', async ({
  page,
}) => {
  await page.goto('/#/topic/rutherford');
  await openControls(page);
  await page.getByRole('tab', { name: /截面与测量/ }).click();
  await page.getByLabel('探测器几何', { exact: true }).selectOption('patch');
  await expect(page.locator('.rf-local-patch')).toHaveCount(1);
  await expect(page.locator('.rf-acceptance-mapping')).toContainText('局部面元 · 近似');
  await expect(page.getByTestId('expected-count')).not.toContainText('暂不可用');
  await page.getByLabel('面元立体角 ΔΩ / sr', { exact: true }).fill('1');
  await expect(page.getByRole('alert')).toContainText('小接受度近似不可靠');
  await expect(page.getByTestId('probability-value')).toHaveText('暂不可用');
  await expect(page.getByRole('button', { name: '重新抽样', exact: true })).toBeDisabled();
  await page.getByLabel('探测器几何', { exact: true }).selectOption('ring');
  await page.getByLabel('环带下界 θ₁ / °', { exact: true }).fill('0');
  await expect(page.getByRole('alert')).toContainText('0° < θ₁');
  await expect(page.getByTestId('expected-count')).toContainText('暂不可用');
  await page.getByLabel('环带下界 θ₁ / °', { exact: true }).fill('60');
  await page.getByLabel('靶面密度 nₜ / 核·m⁻²', { exact: true }).fill('1e28');
  await expect(page.getByRole('alert')).toContainText('薄靶条件失效');
  await expect(page.getByTestId('cross-section-value')).not.toContainText('暂不可用');
  await expect(page.getByTestId('probability-value')).toHaveText('暂不可用');
  await page.getByLabel('靶面密度 nₜ / 核·m⁻²', { exact: true }).fill('1e22');
  await page.getByLabel('入射粒子数 N₀', { exact: true }).fill('0');
  await expect(page.getByTestId('expected-count')).toHaveText('0 count');
  await expect(page.getByTestId('observed-count')).toHaveText('0 count');
  await page.getByLabel('显式角度截止 θmin / °', { exact: true }).fill('0');
  await expect(page.getByRole('alert')).toContainText('θ → 0');
  await expect(page.locator('.rf-module')).not.toContainText(/Infinity|NaN/);
});

test('Rutherford playback, presentation state and reduced-motion keyboard inspection', async ({
  page,
}) => {
  await page.goto('/#/topic/rutherford');
  await openControls(page);
  await page.getByRole('button', { name: '播放 Rutherford 动画', exact: true }).click();
  const scrubber = page.getByRole('slider', { name: '当前轨道位置', exact: true });
  await expect.poll(async () => Number(await scrubber.inputValue())).toBeGreaterThan(0.5);
  await page.getByRole('button', { name: '暂停 Rutherford 动画', exact: true }).click();
  await page.getByLabel('选择物理量').selectOption('distance');
  await page.getByRole('button', { name: '固定当前数值' }).click();
  const state = await page.getByTestId('rutherford-state').innerText();
  const position = await scrubber.inputValue();
  await page.getByRole('button', { name: '演示模式', exact: true }).click();
  await expect(page.locator('.rf-sidebar')).toBeHidden();
  await expect(scrubber).toHaveValue(position);
  await page.getByRole('button', { name: '返回工作台', exact: true }).click();
  await expect(page.locator('.rf-pinned')).toBeVisible();
  await expect(page.getByTestId('rutherford-state')).toHaveText(state);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect(
    page.getByRole('button', { name: '播放 Rutherford 动画', exact: true }),
  ).toBeDisabled();
  await page
    .locator('.rf-formula-panel')
    .getByRole('button', { name: '检查 b · 碰撞参数', exact: true })
    .focus();
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('选择物理量')).toHaveValue('impact-parameter');
  await page.getByRole('tab', { name: /散射几何/ }).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('tab', { name: /推导探索/ })).toHaveAttribute(
    'aria-selected',
    'true',
  );
});

test('Rutherford layout and reference equations stay usable on every view', async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await page.goto('/#/topic/rutherford');

  for (const [index, label] of ['散射几何', '推导探索', '截面与测量'].entries()) {
    await page.getByRole('tab', { name: new RegExp(label) }).click();
    await expect(page.locator('.rf-module .katex-error')).toHaveCount(0);
    expect(
      await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
      `${label} page overflow`,
    ).toBe(true);
    await page
      .locator('.rf-module')
      .screenshot({ path: `artifacts/rutherford-${testInfo.project.name}-${index}.png` });
  }
  await page.getByRole('tab', { name: /散射几何/ }).click();
  await openControls(page);
  await page.getByRole('button', { name: '金核基准', exact: true }).click();
  await page.getByRole('button', { name: '重置参数', exact: true }).click();
  await expect(page.getByTestId('rutherford-state')).toHaveText('E=5 MeV · Z=79 · b=40 fm');
  if (testInfo.project.name === 'desktop') {
    for (const width of [320, 768]) {
      await page.setViewportSize({ width, height: 850 });
      for (const label of ['散射几何', '推导探索', '截面与测量']) {
        await page.getByRole('tab', { name: new RegExp(label) }).click();
        expect(
          await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1),
          `${width}px ${label}`,
        ).toBe(true);
      }
    }
  }
  expect(errors).toEqual([]);
});
