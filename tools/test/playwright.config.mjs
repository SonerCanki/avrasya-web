// Runs the site from the project root on port 5510 and tests it in the installed Google Chrome
// (channel 'chrome'), so no browser download is needed.
import { defineConfig, devices } from '@playwright/test';

const PORT = 5510;
const desktop = { ...devices['Desktop Chrome'], channel: 'chrome', viewport: { width: 1280, height: 800 } };
const phone = { ...devices['Pixel 7'], channel: 'chrome' };

export default defineConfig({
  testDir: './tests',
  outputDir: './sonuc/playwright',
  timeout: 45_000,
  fullyParallel: true,
  reporter: [['list'], ['html', { outputFolder: './sonuc/rapor', open: 'never' }]],
  use: { baseURL: `http://localhost:${PORT}`, trace: 'retain-on-failure' },
  webServer: {
    command: `npx http-server ../.. -p ${PORT} -c-1 --silent`,
    url: `http://localhost:${PORT}/`,
    reuseExistingServer: true,
  },
  projects: [
    { name: 'masaustu', use: desktop },
    { name: 'telefon', use: phone },
    { name: 'masaustu-hareketsiz', use: { ...desktop, reducedMotion: 'reduce' } },
    { name: 'telefon-hareketsiz', use: { ...phone, reducedMotion: 'reduce' } },
    { name: 'javascriptsiz', use: { ...desktop, javaScriptEnabled: false } },
  ],
});
