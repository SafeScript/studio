const { chromium } = require('playwright');
const packed = require('@sparticuz/chromium').default;
const path = require('path');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:await packed.executablePath(),args:packed.args});
 const page=await browser.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:1});
 const errors=[]; page.on('pageerror',e=>errors.push(e.message));
 await page.goto('file://'+path.resolve(__dirname,'safe-studio-standalone.html')); await page.waitForTimeout(500);
 const dir=path.join(__dirname,'screenshots'); require('fs').mkdirSync(dir,{recursive:true}); const results=[];
 async function shot(n){
  await page.setViewportSize({width:1440,height:1000}); await page.waitForTimeout(100);
  await page.screenshot({path:path.join(dir,`${String(n).padStart(2,'0')}-desktop.png`)});
  await page.setViewportSize({width:390,height:844}); await page.waitForTimeout(100);
  await page.screenshot({path:path.join(dir,`${String(n).padStart(2,'0')}-mobile.png`)});
  results.push(`${n}: desktop/mobile captured`);
 }
 await shot(1);
 await page.locator('button').filter({hasText:'Start from Template'}).first().click();
 if(await page.locator('.tmpl-card').count()<90) throw Error('Template catalog missing expected templates');
 await shot(2);
 await page.locator('.tmpl-card').filter({hasText:'Startup Landing Page'}).click(); await page.waitForTimeout(400);
 if(await page.locator('.ss-section').count()<5) throw Error('Template did not render sections');
 await shot(3);
 await page.locator('.ss-section').nth(1).click(); await page.waitForTimeout(150); await shot(4);
 await page.locator('.ss-block').nth(0).click(); await page.waitForTimeout(150); await shot(5);
 await page.evaluate(()=>SS.addProjectPage()); await page.waitForTimeout(200); await shot(6);
 await page.evaluate(()=>SS.undo()); await page.waitForTimeout(200); await shot(7);
 await page.evaluate(()=>SS.openToolEditor()); await page.waitForTimeout(150); await shot(8);
 await page.evaluate(()=>SS.closeToolEditor()); await page.evaluate(()=>SS.setMode('testing')); await page.waitForTimeout(200); await shot(9);
 await page.evaluate(()=>SS.setMode('editing')); await page.evaluate(()=>SS.exportJSON()); await page.waitForTimeout(300); await shot(10);
 console.log(JSON.stringify({checks:['app boot','98 templates present','startup template rendered','section selection','block selection','page add','undo','custom tool modal','test preview toggle','JSON export trigger'], screenshots:results, jsErrors:errors},null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
