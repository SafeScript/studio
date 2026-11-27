const { chromium } = require('playwright');
const packed = require('@sparticuz/chromium').default;
const fs = require('fs');
const path = require('path');

const root = __dirname;
const shots = path.join(root, 'final-screenshots');
fs.mkdirSync(shots, { recursive: true });

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: await packed.executablePath(),
    args: packed.args
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('file://' + path.join(root, 'safe-studio-standalone.html'));
  await page.waitForTimeout(200);

  await page.locator('.cv-tour-start').click();
  const tourVisible = await page.locator('#ss-tour-overlay').evaluate(el => el.classList.contains('open'));
  if (!tourVisible) throw new Error('Quick-start tour did not open from the empty canvas');
  await page.screenshot({ path: path.join(shots, 'quick-start-tour-desktop.png') });
  await page.locator('.ss-tour-close').click();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator('.cv-tour-start').click();
  const mobileCard = await page.locator('#ss-tour-card').boundingBox();
  if (!mobileCard || mobileCard.y < 0 || mobileCard.y + mobileCard.height > 844) {
    throw new Error('Quick-start card escaped the mobile viewport: ' + JSON.stringify(mobileCard));
  }
  await page.screenshot({ path: path.join(shots, 'quick-start-tour-mobile.png') });
  await page.locator('.ss-tour-close').click();

  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.evaluate(() => {
    state.page.sections = [{ layoutKey: 'sidebar-right', blocks: [
      { role: 'content', tool: 'Streams/html', content: '<h2>Lead story</h2>' },
      { role: 'sidebar', tool: 'Streams/html', content: '<p>More stories</p>' }
    ] }];
    renderAll();
    SS.selectBlock(0, 0);
  });
  await page.getByRole('button', { name: 'Build layout inside' }).click();
  const dialog = await page.evaluate(() => ({
    title: document.querySelector('#tool-editor-body .te-title').textContent,
    advancedOpen: document.querySelector('.te-advanced').open,
    idHidden: !document.querySelector('#te-id').getClientRects().length,
    layoutVisible: !!document.querySelector('#te-layout').getClientRects().length
  }));
  if (!dialog.title.includes('mini-layout') || dialog.advancedOpen || !dialog.idHidden || !dialog.layoutVisible) {
    throw new Error('Nested layout setup is not simplified: ' + JSON.stringify(dialog));
  }
  await page.screenshot({ path: path.join(shots, 'nested-layout-setup-desktop.png') });
  await page.locator('.te-cancel').click();

  await page.setViewportSize({ width: 390, height: 844 });
  await page.evaluate(() => SS.createNestedLayout(0, 0));
  const mobileDialog = await page.locator('#tool-editor-body').boundingBox();
  if (!mobileDialog || mobileDialog.x < 0 || mobileDialog.x + mobileDialog.width > 390 || mobileDialog.y < 0 || mobileDialog.y + mobileDialog.height > 844) {
    throw new Error('Nested layout dialog escaped the mobile viewport: ' + JSON.stringify(mobileDialog));
  }
  await page.screenshot({ path: path.join(shots, 'nested-layout-setup-mobile.png') });

  if (errors.length) throw new Error(errors.join('; '));
  console.log(JSON.stringify({ dialog, mobileDialog, screenshots: [
    'quick-start-tour-desktop.png', 'quick-start-tour-mobile.png',
    'nested-layout-setup-desktop.png', 'nested-layout-setup-mobile.png'
  ], browserErrors: errors }, null, 2));
  await browser.close();
})().catch(error => {
  console.error(error);
  process.exit(1);
});
