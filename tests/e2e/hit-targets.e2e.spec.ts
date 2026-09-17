import { expect, test, type Locator } from '@playwright/test'

const MIN_HIT = 44

async function expectMinHitArea(locator: Locator) {
  const box = await locator.boundingBox()
  expect(box, 'expected a visible hit target').toBeTruthy()
  expect(box!.width).toBeGreaterThanOrEqual(MIN_HIT)
  expect(box!.height).toBeGreaterThanOrEqual(MIN_HIT)
}

async function hitHrefAt(card: Locator, sampleSelector: string) {
  return card.evaluate((el, selector) => {
    const sample = el.querySelector(selector)
    if (!sample) return null
    const rect = sample.getBoundingClientRect()
    const node = document.elementFromPoint(rect.left + 12, rect.top + 8)
    return node?.closest('a')?.getAttribute('href') ?? null
  }, sampleSelector)
}

async function clickAtSample(card: Locator, sampleSelector: string) {
  const box = await card.locator(sampleSelector).first().boundingBox()
  expect(box, 'expected a visible sample point').toBeTruthy()
  await card.page().mouse.click(box!.x + 12, box!.y + Math.min(8, box!.height / 2))
}

test.describe('Hit targets and stretch-link cards', () => {
  test('search, Show More, and Visit Project meet the 44px floor', async ({ page }) => {
    await page.goto('/')
    await expectMinHitArea(page.locator('[data-sidebar-search-toggle]'))

    await page.goto('/building')
    await expectMinHitArea(page.locator('[data-show-more="true"]'))

    await page.goto('/building/definitely-fake-seed-project-1')
    await expectMinHitArea(page.locator('[data-external-link]'))
  })

  test('Project and Thought cards stretch the title Link over the tile', async ({ page }) => {
    await page.goto('/building')

    const projectCard = page.locator('[data-project-card]').first()
    const projectSlug = await projectCard.getAttribute('data-project-card')
    expect(projectSlug).toBeTruthy()

    const projectHref = `/building/${projectSlug}`
    expect(await hitHrefAt(projectCard, 'p')).toBe(projectHref)
    await clickAtSample(projectCard, 'p')
    await page.waitForURL(`**${projectHref}`)
    await expect(page.locator('[data-project-artifact]')).toBeVisible()

    await page.goto('/written')

    const thoughtCard = page.locator('[data-thought-card]').first()
    const thoughtSlug = await thoughtCard.getAttribute('data-thought-card')
    expect(thoughtSlug).toBeTruthy()

    const thoughtHref = `/written/${thoughtSlug}`
    expect(await hitHrefAt(thoughtCard, 'p')).toBe(thoughtHref)
    await clickAtSample(thoughtCard, 'p')
    await page.waitForURL(`**${thoughtHref}`)
    await expect(page.locator('[data-thought-artifact]')).toBeVisible()
  })

  test('card visit project stays above the stretch Link', async ({ page }) => {
    await page.goto('/building')

    const visitProject = page.locator('[data-project-card] [data-external-link]').first()
    await expect(visitProject).toHaveClass(/relative/)
    await expect(visitProject).toHaveClass(/z-10/)

    await expect(visitProject).toHaveAttribute('href', /example\.com/)

    const [popup] = await Promise.all([page.waitForEvent('popup'), visitProject.click()])

    expect(popup.url()).toMatch(/example\.com/)
    await expect(page).toHaveURL(/\/building$/)
  })

  test('mobile nav keeps short lowercase Thread labels', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/')

    const mobileNav = page.locator('[data-mobile-nav]')
    await expect(mobileNav).toBeVisible()

    for (const destination of ['home', 'building', 'written', 'about'] as const) {
      const link = mobileNav.locator(`[data-mobile-destination="${destination}"]`)
      await expect(link).toHaveText(destination)
      await expect(link).toHaveCSS('text-transform', 'none')
    }
  })
})
