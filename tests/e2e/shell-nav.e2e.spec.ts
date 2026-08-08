import { expect, test } from '@playwright/test'

test.describe('Chat Shell navigation and SEO', () => {
  test('marks the active Thread while moving across the shell', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[data-sidebar] [data-nav="home"]')).toHaveAttribute(
      'aria-current',
      'page',
    )
    await expect(page.locator('[data-sidebar] [data-nav="building"]')).not.toHaveAttribute(
      'aria-current',
      'page',
    )

    await page.locator('[data-sidebar] [data-nav="building"]').click()
    await page.waitForURL('**/building')
    await expect(page.locator('[data-sidebar] [data-nav="building"]')).toHaveAttribute(
      'aria-current',
      'page',
    )
    await expect(page.locator('[data-sidebar] [data-nav="home"]')).not.toHaveAttribute(
      'aria-current',
      'page',
    )
    await expect(page.locator('[data-sidebar] [data-sidebar-thread="building"]')).toContainText(
      'What I’m building',
    )

    await page.locator('[data-sidebar] [data-nav="written"]').click()
    await page.waitForURL('**/written')
    await expect(page.locator('[data-sidebar] [data-nav="written"]')).toHaveAttribute(
      'aria-current',
      'page',
    )

    await page.locator('[data-sidebar] [data-nav="about"]').click()
    await page.waitForURL('**/about')
    await expect(page.locator('[data-sidebar] [data-nav="about"]')).toHaveAttribute(
      'aria-current',
      'page',
    )
    await expect(page.locator('[data-thread-footer-chips]')).toHaveCount(0)
  })

  test('filters recent Threads client-side from the sidebar search', async ({ page }) => {
    await page.goto('/')
    await page.locator('[data-sidebar-search-toggle]').click()
    await page.locator('[data-sidebar-search]').fill('written')

    await expect(page.locator('[data-sidebar] [data-sidebar-thread="written"]')).toBeVisible()
    await expect(page.locator('[data-sidebar] [data-sidebar-thread="building"]')).toHaveCount(0)
    await expect(page.locator('[data-sidebar] [data-sidebar-thread="about"]')).toHaveCount(0)
  })

  test('emits document title and description on Home and a Project Artifact', async ({ page }) => {
    await page.goto('/')
    await expect(page).toHaveTitle(/Where should we begin\?/)
    const homeDescription = page.locator('meta[name="description"]')
    await expect(homeDescription).toHaveAttribute('content', /bot wearing his jacket/i)

    await page.goto('/building/definitely-fake-seed-project-1')
    await expect(page).toHaveTitle(/\[FAKE\] Pocket Weather Machine/)
    const artifactDescription = page.locator('meta[name="description"]')
    await expect(artifactDescription).toHaveAttribute('content', /disposable forecast gadget/i)
  })
})
