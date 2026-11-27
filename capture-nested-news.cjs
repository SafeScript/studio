const { chromium } = require('playwright');
const packed = require('@sparticuz/chromium').default;
const fs = require('fs');
const path = require('path');

const root = __dirname;
const artifacts = path.join(root, 'artifacts');
fs.mkdirSync(artifacts, { recursive: true });

async function saveDownload(page, trigger, filename) {
  const pending = page.waitForEvent('download');
  await trigger();
  const download = await pending;
  const dest = path.join(artifacts, filename);
  await download.saveAs(dest);
  return dest;
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: await packed.executablePath(),
    args: packed.args
  });
  const editor = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  editor.on('pageerror', e => errors.push(e.message));
  await editor.goto('file://' + path.join(root, 'safe-studio-standalone.html'));
  await editor.waitForTimeout(250);

  const navLinks = ['U.S.', 'World', 'Business', 'Arts', 'Lifestyle', 'Opinion', 'Video', 'Shows', 'Games', 'Cooking', 'Wirecutter', 'The Athletic']
    .map(label => `<a href="#" style="display:inline-flex;align-items:center;gap:4px;white-space:nowrap;color:#111;font-size:13px">${label} <small style="color:#666">⌄</small></a>`).join('');
  const nav = `<style>
    .ledger-desktop-links{display:flex;align-items:center;justify-content:space-between;gap:6px 14px;flex:1 1 260px;flex-wrap:wrap;min-width:0}
    .ledger-mobile-menu{display:none;position:relative;margin-left:auto;font:14px Arial,sans-serif}
    .ledger-mobile-menu summary{display:flex;align-items:center;justify-content:center;gap:8px;min-width:104px;min-height:44px;padding:8px;border:1px solid #bbb;border-radius:4px;background:#fff;color:#111;cursor:pointer;list-style:none}
    .ledger-mobile-menu summary::-webkit-details-marker{display:none}
    .ledger-mobile-links{position:absolute;right:0;top:calc(100% + 6px);z-index:20;display:grid;grid-template-columns:1fr 1fr;gap:12px;width:min(300px,calc(100vw - 32px));padding:14px;background:#fff;border:1px solid #bbb;box-shadow:0 8px 24px #0002}
    @media(max-width:600px){.ledger-desktop-links{display:none}.ledger-mobile-menu{display:block}}
  </style><nav aria-label="Sections" style="display:flex;align-items:center;justify-content:space-between;gap:8px 12px;flex-wrap:wrap;min-width:0;font:14px Arial,sans-serif;color:#111"><b style="font:700 21px Georgia,serif;letter-spacing:-1px;white-space:nowrap">THE DAILY LEDGER</b><div class="ledger-desktop-links">${navLinks}</div><details class="ledger-mobile-menu"><summary><span aria-hidden="true">☰</span> Sections</summary><div class="ledger-mobile-links">${navLinks}</div></details></nav>`;
  const artwork = `<div style="height:310px;background:#dbe9ec;overflow:hidden;position:relative"><svg viewBox="0 0 800 370" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#a8c5d5"/><stop offset="1" stop-color="#edf0e8"/></linearGradient></defs><rect width="800" height="260" fill="url(#sky)"/><rect y="260" width="800" height="110" fill="#85999a"/><path d="M20 260L170 228 350 248 520 220 800 252V370H20Z" fill="#68777b"/><g fill="#a94a35"><rect x="60" y="210" width="80" height="42"/><rect x="148" y="218" width="72" height="34"/><rect x="235" y="202" width="85" height="50"/><rect x="329" y="215" width="76" height="37"/><rect x="420" y="196" width="88" height="56"/><rect x="516" y="210" width="77" height="42"/><rect x="605" y="190" width="82" height="62"/></g><g fill="#d2a650"><rect x="75" y="222" width="52" height="8"/><rect x="253" y="214" width="52" height="8"/><rect x="439" y="208" width="55" height="8"/><rect x="623" y="204" width="47" height="8"/></g><g stroke="#414c4e" stroke-width="7" fill="none"><path d="M115 205V70h130l-35 18h-95m60-18v135M390 207V55h140l-42 20h-98m65-20v152M660 190V82h100l-28 16h-72m47-16v108"/></g><path d="M0 300h800" stroke="#d9e0d6" stroke-width="5" opacity=".7"/></svg></div><div style="text-align:right;color:#666;font:10px Arial;padding-top:4px">Illustration · The Daily Ledger</div>`;

  await editor.evaluate(({ nav, artwork }) => {
    state.page.title = 'The Daily Ledger';
    state.page.theme = { palette: 'blue', bg: 'light' };
    state.page.sections = [
      {
        layoutKey: 'text-full', padding: '8px 16px', gap: '0',
        customCSS: 'border-bottom:1px solid #111',
        blocks: [{ role: 'nav', tool: 'Streams/html', content: nav }]
      },
      {
        layoutKey: 'sidebar-right', padding: '22px 16px 18px', gap: '32px',
        blocks: [
          { role: 'content', tool: 'Streams/html', content: '<p>These top stories are <b>free to read.</b></p>' },
          { role: 'sidebar', tool: 'Streams/html', content: '' }
        ]
      }
    ];
    renderAll();
    SS.selectBlock(1, 0);
  }, { nav, artwork });

  await editor.getByRole('button', { name: 'Build layout inside' }).click();
  await editor.locator('.te-advanced summary').click();
  await editor.locator('#te-name').fill('Lead Story Composition');
  await editor.locator('#te-id').fill('_custom/lead-story-composition');
  await editor.locator('#te-layout').selectOption('text-image-left');
  await editor.locator('.te-save').click();

  await editor.evaluate(() => SS.selectBlock(0, 1));
  await editor.getByRole('button', { name: 'Build layout inside' }).click();
  await editor.locator('.te-advanced summary').click();
  await editor.locator('#te-name').fill('Port Illustration');
  await editor.locator('#te-id').fill('_custom/port-illustration');
  await editor.locator('#te-layout').selectOption('text-full');
  await editor.locator('.te-save').click();
  await editor.evaluate(artwork => {
    state.page.sections[0].padding = '0';
    state.page.sections[0].gap = '0';
    state.page.sections[0].blocks = [{ role: 'media', tool: 'Streams/html', content: artwork }];
    renderAll();
    SS.exitToolEditor();
    if (state.editingToolId !== '_custom/lead-story-composition') throw new Error('Nested editor did not return to its parent tool');
  }, artwork);

  await editor.evaluate(artwork => {
    var lead = state.page.sections[0];
    lead.padding = '14px 16px';
    lead.gap = '18px';
    lead.customCSS = 'border:1px solid #222;background:#fff';
    lead.blocks[0].content = `<article style="font-family:Georgia,serif;color:#171717"><p style="font:12px Arial,sans-serif;color:#b12b2e;font-weight:bold;letter-spacing:.1em">U.S. POLITICS</p><h1 style="font-size:30px;line-height:1.08;margin:12px 0">Trump Administration Unveils New Tariffs for Dozens of Countries</h1><p style="font-size:16px;line-height:1.35;color:#555">The latest escalation came as the administration was confronting legal obstacles and new scrutiny from an incoming Democratic-led Congress.</p><p style="font:12px Arial,sans-serif;color:#666;margin-top:14px">▢ 751 comments</p><hr style="border:0;border-top:1px solid #ddd;margin:18px 0"><h2 style="font-size:20px;line-height:1.15;margin:0">Another Hot Inflation Reading Keeps Fed on Track to Raise Rates Again</h2><p style="font:12px Arial,sans-serif;color:#777;margin-top:10px">▢ 86 comments</p></article>`;
    SS.addSection('text-3col');
    var stories = state.page.sections[1];
    stories.padding = '18px 16px 14px';
    stories.gap = '22px';
    stories.customCSS = 'border-top:1px solid #222';
    stories.blocks.forEach(function(block, i) {
      var headlines = [
        ['LIVE · 2m ago', 'Army Detonates Toxic Material in Iowa'],
        ['WHAT TO KNOW', 'The Latest on a New Trade Fight'],
        ['ANALYSIS', 'A Cleaner Option Is Rejected']
      ];
      block.content = `<article style="font-family:Georgia,serif"><p style="font:11px Arial,sans-serif;color:#ba252b;font-weight:bold">${headlines[i][0]}</p><h2 style="font-size:20px;line-height:1.15;margin:8px 0">${headlines[i][1]}</h2><p style="font-size:14px;line-height:1.35;color:#555">What happened, why it matters, and what readers should watch next.</p></article>`;
    });
    SS.exitToolEditor();
    state.page.sections[1].blocks[1].content = `<article style="font-family:Georgia,serif;border-bottom:1px solid #ddd;padding-bottom:18px"><div style="height:220px;background:linear-gradient(140deg,#c8edf0,#f3bcb0 52%,#62737b);display:grid;place-items:center;color:#18303a;font:700 22px Georgia,serif;text-align:center;padding:20px">A NATION BLESSED<br>OFFERS ITS THANKS</div><small style="display:block;text-align:right;font:10px Arial;color:#666;margin-top:3px">Roz Chast</small><h2 style="font-size:24px;line-height:1.1;margin:12px 0 6px">Roz Chast: Always a Turkey for My Birthday</h2><p style="font-size:14px;color:#555">In our family, Thanksgiving dinner ends with cake and candles.</p><p style="font:11px Arial;color:#777;margin-top:10px">▢ 121 comments</p></article>`;
    renderAll();
  }, artwork);

  if (errors.length) throw new Error(errors.join('; '));

  const jsonPath = await saveDownload(editor, () => editor.evaluate(() => SS.exportJSON()), 'nested-news-demo.json');
  const htmlPath = await saveDownload(editor, () => editor.evaluate(() => SS.exportHTML()), 'nested-news-demo.html');
  const project = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const parentTool = project.page?.customTools?.find(t => t.id === '_custom/lead-story-composition');
  if (!project.page?.sections?.[1]?.blocks?.[0]?.tool || !parentTool ||
      parentTool.structure.sections[0].blocks[1].tool !== '_custom/port-illustration' ||
      !project.page.customTools.some(t => t.id === '_custom/port-illustration')) {
    throw new Error('JSON export did not preserve the recursive component references and definitions');
  }

  const preview = await browser.newPage({ viewport: { width: 1440, height: 980 } });
  const previewErrors = [];
  preview.on('pageerror', e => previewErrors.push(e.message));
  await preview.goto('file://' + htmlPath);
  await preview.waitForTimeout(200);
  const desktopOverflow = await preview.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  if (desktopOverflow) throw new Error('Desktop exported page overflows horizontally');
  await preview.screenshot({ path: path.join(root, 'final-screenshots', 'nested-news-desktop.png'), fullPage: true });
  await preview.setViewportSize({ width: 390, height: 844 });
  await preview.waitForTimeout(150);
  const mobile = await preview.evaluate(() => ({
    viewport: innerWidth,
    documentWidth: document.documentElement.scrollWidth,
    nestedColumns: getComputedStyle(document.querySelector('.ss-tool-layout')).gridTemplateColumns,
    nestedToolRoots: document.querySelectorAll('.ss-tool-instance').length,
    text: document.body.innerText.slice(0, 120)
  }));
  if (mobile.documentWidth > mobile.viewport || mobile.nestedColumns.split(' ').length !== 1) {
    throw new Error('Mobile nested layout did not stack without overflow: ' + JSON.stringify(mobile));
  }
  const mobileMenu = preview.locator('.ledger-mobile-menu');
  if (await mobileMenu.evaluate(e => getComputedStyle(e).display) === 'none' ||
      await preview.locator('.ledger-desktop-links').evaluate(e => getComputedStyle(e).display) !== 'none') {
    throw new Error('Mobile navigation did not switch to its compact menu');
  }
  await mobileMenu.locator('summary').click();
  const menuState = await mobileMenu.evaluate(e => ({ open: e.open, links: e.querySelectorAll('.ledger-mobile-links a').length, width: e.querySelector('.ledger-mobile-links').getBoundingClientRect().width, documentWidth: document.documentElement.scrollWidth }));
  if (!menuState.open || menuState.links !== 12 || menuState.documentWidth > 390 || menuState.width > 358) {
    throw new Error('Mobile section menu is not usable: ' + JSON.stringify(menuState));
  }
  await mobileMenu.locator('summary').click();
  for (const width of [320, 360, 430]) {
    await preview.setViewportSize({ width, height: 844 });
    const menuBounds = await mobileMenu.locator('.ledger-mobile-links').evaluate(e => { const r=e.getBoundingClientRect(); return { left:r.left, right:r.right, viewport:innerWidth }; });
    if (menuBounds.left < 0 || menuBounds.right > width) throw new Error('Mobile nav menu exceeds ' + width + 'px: ' + JSON.stringify(menuBounds));
  }
  await preview.setViewportSize({ width: 390, height: 844 });
  await preview.screenshot({ path: path.join(root, 'final-screenshots', 'nested-news-mobile.png'), fullPage: true });
  if (previewErrors.length) throw new Error(previewErrors.join('; '));
  console.log(JSON.stringify({
    json: jsonPath,
    html: htmlPath,
    desktopScreenshot: 'final-screenshots/nested-news-desktop.png',
    mobileScreenshot: 'final-screenshots/nested-news-mobile.png',
    nestedTool: project.page.customTools.find(t => t.id === '_custom/lead-story-composition').structure.sections.map(s => s.layoutKey),
    mobile,
    mobileMenu: menuState,
    browserErrors: [...errors, ...previewErrors]
  }, null, 2));
  await browser.close();
})().catch(e => {
  console.error(e);
  process.exit(1);
});
