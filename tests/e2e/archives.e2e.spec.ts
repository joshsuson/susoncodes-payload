import { expect, test } from '@playwright/test'

test.describe('Archives and Artifact breadcrumbs', () => {
  test('projects archive lists published Projects and breadcrumb returns to Building', async ({
    page,
  }) => {
    const response = await page.goto('/projects')

    expect(response?.ok()).toBe(true)
    await expect(page.locator('[data-chat-shell]')).toBeVisible()
    await expect(page.locator('[data-content-library="projects"]')).toBeVisible()
    await expect(page.locator('[data-archive-rows]')).toBeVisible()
    await expect(
      page.locator('[data-archive-row="definitely-fake-e2e-draft-project"]'),
    ).toHaveCount(0)
    await expect(page.getByText('Definitely Fake E2E Draft Project')).toHaveCount(0)

    const firstRow = page.locator('[data-archive-row]').first()
    await expect(firstRow).toBeVisible()
    await expect(firstRow).toHaveRole('link')

    const href = await firstRow.getAttribute('href')
    expect(href).toMatch(/^\/building\//)

    await firstRow.click()
    await page.waitForURL('**/building/**')
    await expect(page.locator('[data-chat-shell]')).toBeVisible()
    await expect(page.locator('[data-project-artifact]')).toBeVisible()

    const breadcrumb = page.locator('[data-artifact-breadcrumb="building"]')
    await expect(breadcrumb).toBeVisible()
    await expect(breadcrumb.getByRole('link', { name: 'building', exact: true })).toHaveAttribute(
      'href',
      '/building',
    )

    await breadcrumb.getByRole('link', { name: 'building', exact: true }).click()
    await page.waitForURL('**/building')
    await expect(page.locator('[data-building-list]')).toBeVisible()
    await expect(page.locator('[data-browse-all="projects"]')).toHaveAttribute('href', '/projects')
  })

  test('thoughts archive lists published Thoughts and breadcrumb returns to Written', async ({
    page,
  }) => {
    const response = await page.goto('/thoughts')

    expect(response?.ok()).toBe(true)
    await expect(page.locator('[data-chat-shell]')).toBeVisible()
    await expect(page.locator('[data-content-library="thoughts"]')).toBeVisible()
    await expect(page.locator('[data-archive-rows]')).toBeVisible()
    await expect(
      page.locator('[data-archive-row="definitely-fake-e2e-draft-thought"]'),
    ).toHaveCount(0)
    await expect(page.getByText('Definitely Fake E2E Draft Thought')).toHaveCount(0)

    const firstRow = page.locator('[data-archive-row]').first()
    await expect(firstRow).toBeVisible()
    await expect(firstRow).toHaveRole('link')

    const href = await firstRow.getAttribute('href')
    expect(href).toMatch(/^\/written\//)

    await firstRow.click()
    await page.waitForURL('**/written/**')
    await expect(page.locator('[data-chat-shell]')).toBeVisible()
    await expect(page.locator('[data-thought-artifact]')).toBeVisible()

    const breadcrumb = page.locator('[data-artifact-breadcrumb="written"]')
    await expect(breadcrumb).toBeVisible()
    await expect(breadcrumb.getByRole('link', { name: 'written', exact: true })).toHaveAttribute(
      'href',
      '/written',
    )

    await breadcrumb.getByRole('link', { name: 'written', exact: true }).click()
    await page.waitForURL('**/written')
    await expect(page.locator('[data-written-list]')).toBeVisible()
    await expect(page.locator('[data-browse-all="thoughts"]')).toHaveAttribute('href', '/thoughts')
  })
})
