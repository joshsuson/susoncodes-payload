import { expect, test, type Page } from '@playwright/test'

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

  for (const artifact of [
    {
      crumb: 'building' as const,
      href: '/building',
      path: '/building/definitely-fake-seed-project-1',
      root: '[data-project-artifact]',
    },
    {
      crumb: 'written' as const,
      href: '/written',
      path: '/written/definitely-fake-seed-thought-1',
      root: '[data-thought-artifact]',
    },
  ]) {
    test(`pins the ${artifact.crumb} Artifact breadcrumb while the message column scrolls`, async ({
      page,
    }) => {
      await page.goto(artifact.path)
      await expect(page.locator('[data-chat-shell]')).toBeVisible()
      await expect(page.locator(artifact.root)).toBeVisible()

      const crumbNav = page.locator(`[data-artifact-breadcrumb="${artifact.crumb}"]`)
      const breadcrumb = page.locator('.artifact-breadcrumb')
      const column = page.locator('[data-message-column]')

      await expect(crumbNav.getByRole('link', { name: artifact.crumb, exact: true })).toHaveAttribute(
        'href',
        artifact.href,
      )

      const material = await breadcrumb.evaluate((element) => {
        const styles = getComputedStyle(element)
        return {
          backdropFilter: styles.backdropFilter,
          height: styles.height,
          position: styles.position,
          top: styles.top,
        }
      })

      expect(material.position).toBe('sticky')
      expect(material.top).toBe('0px')
      expect(material.height).toBe('48px')
      expect(material.backdropFilter).toContain('blur(16px)')

      await page.evaluate((rootSelector) => {
        const messageColumn = document.querySelector('[data-message-column]')
        const root = document.querySelector(rootSelector)
        if (!(messageColumn instanceof HTMLElement) || !(root instanceof HTMLElement)) return
        if (messageColumn.scrollHeight > messageColumn.clientHeight) return

        const spacer = document.createElement('div')
        spacer.dataset.stickyScrollSpacer = ''
        spacer.style.height = `${messageColumn.clientHeight + 240}px`
        root.append(spacer)
      }, artifact.root)

      const before = await readStickyScroll(page)
      expect(before.columnScroll).toBe(0)
      expect(before.windowScroll).toBe(0)

      await column.evaluate((element) => {
        element.scrollTop = 240
      })

      const after = await readStickyScroll(page)
      expect(after.columnScroll).toBeGreaterThanOrEqual(200)
      expect(after.windowScroll).toBe(0)
      expect(Math.abs(after.crumbTop - before.crumbTop)).toBeLessThan(1)
      await expect(breadcrumb).toBeVisible()
    })
  }
})

async function readStickyScroll(page: Page) {
  return page.evaluate(() => {
    const crumb = document.querySelector('.artifact-breadcrumb')
    const messageColumn = document.querySelector('[data-message-column]')
    if (!(crumb instanceof HTMLElement) || !(messageColumn instanceof HTMLElement)) {
      throw new Error('missing Artifact breadcrumb or message column')
    }

    return {
      columnScroll: messageColumn.scrollTop,
      crumbTop: crumb.getBoundingClientRect().top,
      windowScroll: window.scrollY,
    }
  })
}
