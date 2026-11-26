import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.getByText('token-ninja', { exact: true })).toBeVisible();
});

test('quotes tokens for a currency amount', async ({ page }) => {
  await page.getByTestId('currency-USD').click();
  await page.getByTestId('purchase-amount').fill('25');
  await expect(page.getByTestId('purchase-result')).toHaveText(
    '25 USD = 2500 tokens (1 USD = 100 tokens)',
  );

  await page.getByTestId('currency-INR').click();
  await expect(page.getByTestId('purchase-result')).toHaveText(
    '25 INR = 30 tokens (1 INR = 1.2 tokens)',
  );
});

test('the same tokens buy different amounts of compute at each vendor', async ({ page }) => {
  await page.getByTestId('vendor-gpu-cloud').click();
  await page.getByTestId('redeem-tokens').fill('500');
  await expect(page.getByTestId('redeem-result')).toHaveText('500 tokens = 2 GPU-hour');

  await page.getByTestId('vendor-render-farm').click();
  await expect(page.getByTestId('redeem-result')).toHaveText('500 tokens = 125 render-minute');
});
