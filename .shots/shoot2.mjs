import { chromium } from 'file:///C:/Users/LENOVO/AppData/Local/npm-cache/_npx/e41f203b7505f1fb/node_modules/playwright/index.mjs';

const pages = [
  ["home2", "http://localhost:4321/"],
  ["practice2", "http://localhost:4321/practice"],
  ["login2", "http://localhost:4321/login"],
  ["signup2", "http://localhost:4321/signup"],
];

const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
for (const [name, url] of pages) {
  await page.goto(url, { waitUntil: 'networkidle' });
  // scroll through page to trigger reveal-on-scroll observers
  await page.evaluate(async () => {
    const h = document.body.scrollHeight;
    for (let y = 0; y < h; y += 600) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 120)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(900);
  await page.screenshot({ path: `D:/New folder/neetcore.com/.shots/${name}.png`, fullPage: true });
  console.log('shot', name);
}
await browser.close();
