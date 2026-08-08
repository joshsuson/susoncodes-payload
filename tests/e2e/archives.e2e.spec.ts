import { expect, test } from '@playwright/test'

test.describe('Archives and Artifact breadcrumbs', () => {
  test('projects archive lists published Projects and breadcrumb returns from Artifact', async ({
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

    const artifactLink = firstRow.locator('a').first()
    const href = await artifactLink.getAttribute('href')
    expect(href).toMatch(/^\/building\//)

    await artifactLink.click()
    await page.waitForURL('**/building/**')
    await expect(page.locator('[data-chat-shell]')).toBeVisible()
    await expect(page.locator('[data-project-artifact]')).toBeVisible()

    const breadcrumb = page.locator('[data-artifact-breadcrumb="projects"]')
    await expect(breadcrumb).toBeVisible()
    await expect(breadcrumb.getByRole('link', { name: 'Projects' })).toHaveAttribute(
      'href',
      '/projects',
    )

    await breadcrumb.getByRole('link', { name: 'Projects' }).click()
    await page.waitForURL('**/projects')
    await expect(page.locator('[data-content-library="projects"]')).toBeVisible()
  })

  test('thoughts archive lists published Thoughts and breadcrumb returns from Artifact', async ({
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

    const artifactLink = firstRow.locator('a').first()
    const href = await artifactLink.getAttribute('href')
    expect(href).toMatch(/^\/written\//)

    await artifactLink.click()
    await page.waitForURL('**/written/**')
    await expect(page.locator('[data-chat-shell]')).toBeVisible()
    await expect(page.locator('[data-thought-artifact]')).toBeVisible()

    const breadcrumb = page.locator('[data-artifact-breadcrumb="thoughts"]')
    await expect(breadcrumb).toBeVisible()
    await expect(breadcrumb.getByRole('link', { name: 'Thoughts' })).toHaveAttribute(
      'href',
      '/thoughts',
    )

    await breadcrumb.getByRole('link', { name: 'Thoughts' }).click()
    await page.waitForURL('**/thoughts')
    await expect(page.locator('[data-content-library="thoughts"]')).toBeVisible()
  })
})
