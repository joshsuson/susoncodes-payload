import { expect, test } from '@playwright/test'

import { THOUGHT_LIST_PAGE_SIZE } from '@/lib/thoughts'

test.describe('Written Thread', () => {
  test('opens as chat theater with the first Thought card page', async ({ page }) => {
    const response = await page.goto('/written')

    expect(response?.ok()).toBe(true)
    await expect(page.locator('[data-chat-shell]')).toBeVisible()
    await expect(page.locator('[data-written-list]')).toBeVisible()
    await expect(page.locator('[data-user-bubble]')).toContainText('What have you written?')
    await expect(page.locator('[data-written-assistant-message]')).toContainText(
      'Josh dumps light writing here when the itch hits',
    )
    await expect(page.locator('[data-thought-card]')).toHaveCount(THOUGHT_LIST_PAGE_SIZE)
    await expect(page.locator('[data-range-line]')).toContainText(
      `Showing 1–${THOUGHT_LIST_PAGE_SIZE} of`,
    )
    await expect(page.locator('[data-show-more="true"]')).toBeVisible()
    await expect(page.locator('[data-thread-footer-chips]')).toHaveCount(0)
    await expect(
      page.locator('[data-thought-card="definitely-fake-e2e-draft-thought"]'),
    ).toHaveCount(0)
    await expect(page.getByText('Definitely Fake E2E Draft Thought')).toHaveCount(0)

    const firstCard = page.locator('[data-thought-card]').first()
    await expect(firstCard.getByRole('link').first()).toHaveAttribute('href', /\/written\//)
  })

  test('Show More appends an assistant-only Thought bundle', async ({ page }) => {
    await page.goto('/written')

    const initialCards = page.locator('[data-thought-card]')
    await expect(initialCards).toHaveCount(THOUGHT_LIST_PAGE_SIZE)
    const initialCount = await initialCards.count()

    await page.locator('[data-show-more="true"]').click()

    await expect(page.locator('[data-assistant-only-bundle]')).toHaveCount(1)
    await expect(page.locator('[data-thought-card]')).not.toHaveCount(initialCount)
    expect(await page.locator('[data-thought-card]').count()).toBeGreaterThan(initialCount)
    await expect(
      page.locator('[data-assistant-only-bundle] [data-thought-card]').first(),
    ).toBeVisible()
    await expect(page.locator('[data-user-bubble]')).toHaveCount(1)
    await expect(page.locator('[data-assistant-only-bundle]')).toContainText(
      'More from the archive',
    )
    await expect(page.getByText('Definitely Fake E2E Draft Thought')).toHaveCount(0)

    while ((await page.locator('[data-show-more="true"]').count()) > 0) {
      await page.locator('[data-show-more="true"]').click()
    }

    await expect(page.locator('[data-end-of-list]')).toBeVisible()
    await expect(page.locator('[data-show-more="true"]')).toHaveCount(0)
  })
})
