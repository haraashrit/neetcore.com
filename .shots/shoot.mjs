import { chromium } from 'playwright';

const pages = [
  ["home", "http://localhost:4321/"],
  ["practice", "http://localhost:4321/practice"],
  ["login", "http://localhost:4321/login"],
  ["about", "http://localhost:4321/about"],
];

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
for (const [name, url] of pages) {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(700);
  await page.screenshot({ path: `D:/New folder/neetcore.com/.shots/${name}.png`, fullPage: true });
  console.log('shot', name);
}
await browser.close();
