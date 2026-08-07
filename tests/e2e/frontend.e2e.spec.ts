import { expect, test } from '@playwright/test'

const suggestions = [
  { label: 'What are you building these days?', path: '/building' },
  { label: 'What have you written?', path: '/written' },
  { label: 'Who is Josh?', path: '/about' },
]

test.describe('Chat Shell Home', () => {
  test('loads the Home Faux Prompt inside the Chat Shell', async ({ page }) => {
    const response = await page.goto('/')

    expect(response?.ok()).toBe(true)
    await expect(page).toHaveTitle(/Josh Bot/)
    await expect(page.locator('[data-chat-shell]')).toBeVisible()
    await expect(page.locator('[data-sidebar]')).toBeVisible()
    await expect(page.locator('[data-message-column]')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Where should we begin?' })).toBeVisible()
    await expect(page.getByText('this is not a live chat', { exact: false })).toBeVisible()
    await expect(page.locator('[data-thread-footer-chips]')).toHaveCount(0)

    await page.getByRole('button', { name: 'Choose a question for Josh Bot' }).click()

    const promptMenu = page.locator('[data-prompt-menu]')
    for (const suggestion of suggestions) {
      await expect(promptMenu.getByRole('link', { name: suggestion.label })).toBeVisible()
    }
  })

  for (const suggestion of suggestions) {
    test(`routes “${suggestion.label}” to ${suggestion.path}`, async ({ page }) => {
      await page.goto('/')
      await page.getByRole('button', { name: 'Choose a question for Josh Bot' }).click()
      await page.locator(`[data-suggestion="${suggestion.path.slice(1)}"]`).click()

      await page.waitForURL(`**${suggestion.path}`)
      expect(page.url().endsWith(suggestion.path)).toBe(true)
      await expect(page.locator('[data-chat-shell]')).toBeVisible()
    })
  }

  test('offers the same Threads in the mobile navigation', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    await expect(page.locator('[data-mobile-nav]')).toBeVisible()
    for (const destination of ['Home', 'Building', 'Written', 'About']) {
      await expect(
        page.locator('[data-mobile-nav]').getByRole('link', { name: destination }),
      ).toBeVisible()
    }
  })
})
