import { expect, test } from '@playwright/test'

test.describe('About Thread', () => {
  test('opens as chat theater with CMS-driven About bubbles', async ({ page }) => {
    const response = await page.goto('/about')

    expect(response?.ok()).toBe(true)
    await expect(page.locator('[data-chat-shell]')).toBeVisible()
    await expect(page.locator('[data-about-thread]')).toBeVisible()
    await expect(page.locator('[data-user-bubble]')).toContainText('Who is Josh, actually?')
    await expect(page.locator('[data-assistant-bubble]')).toBeVisible()
    await expect(page.locator('[data-about-assistant-message]')).toContainText(
      'fourth wall was load-bearing',
    )
    await expect(page.locator('[data-thread-footer-chips]')).toHaveCount(0)
    await expect(page.getByText('Rules For Building')).toHaveCount(0)
  })
})
