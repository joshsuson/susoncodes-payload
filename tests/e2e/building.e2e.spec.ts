import { expect, test } from '@playwright/test'

import { PROJECT_LIST_PAGE_SIZE } from '@/lib/projects'

test.describe('Building Thread', () => {
  test('opens as chat theater with the first Project card page', async ({ page }) => {
    const response = await page.goto('/building')

    expect(response?.ok()).toBe(true)
    await expect(page.locator('[data-chat-shell]')).toBeVisible()
    await expect(page.locator('[data-building-list]')).toBeVisible()
    await expect(page.locator('[data-user-bubble]')).toContainText(
      'What are you building these days?',
    )
    await expect(page.locator('[data-building-assistant-message]')).toContainText(
      'Josh keeps a pile of builds in various states of glory',
    )
    await expect(page.locator('[data-project-card]')).toHaveCount(PROJECT_LIST_PAGE_SIZE)
    await expect(page.locator('[data-range-line]')).toContainText(
      `Showing 1–${PROJECT_LIST_PAGE_SIZE} of`,
    )
    await expect(page.locator('[data-show-more="true"]')).toBeVisible()
    await expect(page.locator('[data-thread-footer-chips]')).toHaveCount(0)
    await expect(
      page.locator('[data-project-card="definitely-fake-e2e-draft-project"]'),
    ).toHaveCount(0)
    await expect(page.getByText('Definitely Fake E2E Draft Project')).toHaveCount(0)

    const firstCard = page.locator('[data-project-card]').first()
    await expect(firstCard.locator('[data-build-status]')).toBeVisible()
    await expect(firstCard.getByRole('link').first()).toHaveAttribute('href', /\/building\//)
  })

  test('Show More appends an assistant-only Project bundle', async ({ page }) => {
    await page.goto('/building')

    const initialCards = page.locator('[data-project-card]')
    await expect(initialCards).toHaveCount(PROJECT_LIST_PAGE_SIZE)
    const initialCount = await initialCards.count()

    await page.locator('[data-show-more="true"]').click()

    await expect(page.locator('[data-assistant-only-bundle]')).toHaveCount(1)
    await expect(page.locator('[data-project-card]')).not.toHaveCount(initialCount)
    expect(await page.locator('[data-project-card]').count()).toBeGreaterThan(initialCount)
    await expect(
      page.locator('[data-assistant-only-bundle] [data-project-card]').first(),
    ).toBeVisible()
    await expect(page.locator('[data-user-bubble]')).toHaveCount(1)
    await expect(page.locator('[data-assistant-only-bundle]')).toContainText('More of the pile')
    await expect(page.getByText('Definitely Fake E2E Draft Project')).toHaveCount(0)

    // Keep clicking until the shelf is empty so the append contract is fully exercised.
    while ((await page.locator('[data-show-more="true"]').count()) > 0) {
      await page.locator('[data-show-more="true"]').click()
    }

    await expect(page.locator('[data-end-of-list]')).toBeVisible()
    await expect(page.locator('[data-show-more="true"]')).toHaveCount(0)
  })
})
