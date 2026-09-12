import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    if (!sessionStorage.getItem('__devtoolkit_e2e_initialized')) {
      localStorage.clear();
      sessionStorage.setItem('__devtoolkit_e2e_initialized', 'true');
    }
  });
  await page.goto('/');
});

test('opens the branded app and lazy-loads a tool', async ({ page }) => {
  await expect(page).toHaveTitle('DevToolKit | Essential Developer Tools');

  await page.locator('h3', { hasText: 'JSON Prettify' }).click();

  await expect(page.getByRole('heading', { name: 'JSON Prettify' })).toBeVisible();
  await expect(page.getByText('Input Buffer')).toBeVisible();
});

test('persists favorites and recent tools, then resets them', async ({ page }) => {
  await page.getByTitle('Add to favorites').first().click();
  await expect(page.locator('aside button').filter({ hasText: 'JSON Prettify' })).toBeVisible();

  await page.getByRole('button', { name: 'Favorites', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'Favorite Tools' })).toBeVisible();
  await expect(page.locator('h3', { hasText: 'JSON Prettify' })).toBeVisible();

  await page.locator('h3', { hasText: 'JSON Prettify' }).click();
  await expect(page.locator('aside button').filter({ hasText: 'JSON Prettify' })).toHaveCount(2);

  await page.reload();
  await expect(page.locator('aside button').filter({ hasText: 'JSON Prettify' })).toHaveCount(2);

  await page.getByTitle('Settings').click();
  await page.getByRole('button', { name: 'Clear Local Data' }).click();
  await expect(page.getByText('No favorites yet')).toBeVisible();
  await expect(page.getByText('No recent tools')).toBeVisible();
});

test('renders the main workflow on a mobile viewport', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Explore Library' })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Essential Tools for Modern Developers/ })).toBeVisible();

  await page.locator('h3', { hasText: 'JSON Prettify' }).click();
  await expect(page.getByRole('heading', { name: 'JSON Prettify' })).toBeVisible();
});

test('focuses search with keyboard shortcuts', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /Essential Tools for Modern Developers/ })).toBeVisible();
  const search = page.getByRole('textbox', { name: 'Search developer tools' }).last();

  await page.keyboard.press('Control+k');
  await expect(search).toBeFocused();

  await page.keyboard.press('Escape');
  await page.keyboard.press('/');
  await expect(search).toBeFocused();
});

test('opens search from the mobile header', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Mobile header search is only rendered on mobile layouts');
  await page.getByRole('button', { name: 'Open search' }).click();
  await expect(page.getByRole('textbox', { name: 'Search developer tools' })).toBeFocused();
});

test('has no critical or serious accessibility violations', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /Essential Tools for Modern Developers/ })).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  const blockingViolations = results.violations.filter(violation =>
    violation.impact === 'critical' || violation.impact === 'serious'
  );

  expect(blockingViolations).toEqual([]);
});

test('loads the app offline after the PWA service worker is ready', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /Essential Tools for Modern Developers/ })).toBeVisible();
  await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.register('/sw.js');
    await new Promise<void>((resolve, reject) => {
      if (registration.active) {
        resolve();
        return;
      }
      registration.addEventListener('updatefound', () => {
        const worker = registration.installing;
        worker?.addEventListener('statechange', () => {
          if (worker.state === 'activated') resolve();
          if (worker.state === 'redundant') reject(new Error('Service worker became redundant'));
        });
      });
    });
  });
  await page.reload();

  await page.context().setOffline(true);
  await page.reload();

  await expect(page).toHaveTitle('DevToolKit | Essential Developer Tools');
  await expect(page.getByRole('heading', { name: /Essential Tools for Modern Developers/ })).toBeVisible();
});