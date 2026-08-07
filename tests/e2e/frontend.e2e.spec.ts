import { expect, test } from '@playwright/test'

test.describe('Frontend', () => {
  test('homepage loads', async ({ page }) => {
    const response = await page.goto('http://localhost:3000')

    expect(response?.ok()).toBe(true)
    await expect(page).toHaveTitle(/Payload Blank Template/)
    await expect(page.locator('h1').first()).toBeVisible()
  })
})
