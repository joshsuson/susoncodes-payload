import { expect, test } from '@playwright/test'

type TypeMetrics = {
  letterSpacingEm: number
  lineHeight: number
}

async function typeMetrics(
  page: import('@playwright/test').Page,
  selector: string,
): Promise<TypeMetrics> {
  return page.evaluate((target) => {
    const el = document.querySelector(target)
    if (!el) {
      throw new Error(`missing ${target}`)
    }

    const styles = getComputedStyle(el)
    const fontSize = parseFloat(styles.fontSize)
    const letterSpacing =
      styles.letterSpacing === 'normal' ? 0 : parseFloat(styles.letterSpacing)
    const lineHeight =
      styles.lineHeight === 'normal' ? 1 : parseFloat(styles.lineHeight) / fontSize

    return {
      letterSpacingEm: letterSpacing / fontSize,
      lineHeight,
    }
  }, selector)
}

test.describe('Size-specific tracking and display leading', () => {
  test('body/UI tracking is slightly positive, not a global negative', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[data-chat-shell]')).toBeVisible()

    const body = await typeMetrics(page, 'body')
    expect(body.letterSpacingEm).toBeCloseTo(0.01, 3)
  })

  test('keeps tracking-tight on Home and Archive titles', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('[data-home-greeting]')).toHaveClass(/tracking-tight/)

    const homeTitle = await typeMetrics(page, '[data-home-greeting]')
    expect(homeTitle.letterSpacingEm).toBeCloseTo(-0.025, 3)

    await page.goto('/projects')
    const archiveTitle = page.locator('[data-content-library="projects"] h1')
    await expect(archiveTitle).toHaveClass(/tracking-tight/)

    const archive = await typeMetrics(page, '[data-content-library="projects"] h1')
    expect(archive.letterSpacingEm).toBeCloseTo(-0.025, 3)
  })

  test('Artifact display titles tighten tracking and leading at md:text-5xl', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/building/definitely-fake-seed-project-1')

    const projectTitle = page.locator('[data-project-artifact] h1')
    await expect(projectTitle).toHaveClass(/shell-artifact-title/)
    await expect(projectTitle).toHaveClass(/md:text-5xl/)

    const project = await typeMetrics(page, '[data-project-artifact] h1')
    expect(project.letterSpacingEm).toBeCloseTo(-0.03, 3)
    expect(project.lineHeight).toBeGreaterThanOrEqual(1.05)
    expect(project.lineHeight).toBeLessThanOrEqual(1.1)

    await page.goto('/written/definitely-fake-seed-thought-1')
    const thoughtTitle = page.locator('[data-thought-artifact] h1')
    await expect(thoughtTitle).toHaveClass(/shell-artifact-title/)

    const thought = await typeMetrics(page, '[data-thought-artifact] h1')
    expect(thought.letterSpacingEm).toBeCloseTo(-0.03, 3)
    expect(thought.lineHeight).toBeGreaterThanOrEqual(1.05)
    expect(thought.lineHeight).toBeLessThanOrEqual(1.1)
  })
})
