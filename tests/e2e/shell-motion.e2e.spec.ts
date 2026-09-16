import { expect, test } from '@playwright/test'

const EASE_OUT = 'cubic-bezier(0.23, 1, 0.32, 1)'

type MotionAudit = {
  easeOut: string
  hoverMedia: boolean
  pressableActiveScale: boolean
  pressableTransition: string
  reducedMotionDropsTransform: boolean
}

async function auditMotion(page: import('@playwright/test').Page): Promise<MotionAudit> {
  return page.evaluate(() => {
    const easeOut = getComputedStyle(document.documentElement).getPropertyValue('--ease-out').trim()
    const pressable = document.querySelector('.shell-pressable')
    const pressableTransition = pressable ? getComputedStyle(pressable).transition : ''

    let hoverMedia = false
    let pressableActiveScale = false
    let reducedMotionDropsTransform = false

    for (const sheet of Array.from(document.styleSheets)) {
      let rules: CSSRule[]
      try {
        rules = Array.from(sheet.cssRules)
      } catch {
        continue
      }

      for (const rule of rules) {
        if (!(rule instanceof CSSMediaRule)) continue

        const condition = rule.conditionText

        if (condition.includes('(hover: hover)') && condition.includes('(pointer: fine)')) {
          hoverMedia = hoverMedia || rule.cssRules.length > 0
        }

        if (condition.includes('prefers-reduced-motion')) {
          for (const inner of Array.from(rule.cssRules)) {
            if (!(inner instanceof CSSStyleRule)) continue
            if (!inner.selectorText.includes('.shell-pressable')) continue
            const text = inner.cssText
            if (text.includes('transform') && (text.includes('none') || !text.includes('scale'))) {
              reducedMotionDropsTransform = true
            }
            if (inner.selectorText.includes(':active') && text.includes('transform: none')) {
              reducedMotionDropsTransform = true
            }
          }
        }

        if (rule instanceof CSSStyleRule) {
          continue
        }
      }

      for (const rule of rules) {
        if (!(rule instanceof CSSStyleRule)) continue
        if (rule.selectorText.includes('.shell-pressable:active')) {
          pressableActiveScale = rule.style.transform.includes('scale(0.97)')
        }
      }
    }

    return {
      easeOut,
      hoverMedia,
      pressableActiveScale,
      pressableTransition,
      reducedMotionDropsTransform,
    }
  })
}

test.describe('Chat Shell motion tokens', () => {
  test('exposes easing, press scale, gated hover, and reduced-motion paint-only', async ({
    page,
  }) => {
    await page.goto('/')
    await expect(page.locator('[data-chat-shell]')).toBeVisible()

    await expect(page.locator('[data-faux-input]')).toHaveClass(/shell-pressable/)
    await expect(page.locator('[data-sidebar-search-toggle]')).toHaveClass(/shell-pressable/)
    await expect(page.locator('[data-sidebar] [data-nav="home"]')).toHaveClass(/shell-pressable/)

    const audit = await auditMotion(page)

    expect(audit.easeOut).toBe(EASE_OUT)
    expect(audit.pressableActiveScale).toBe(true)
    expect(audit.hoverMedia).toBe(true)
    expect(audit.reducedMotionDropsTransform).toBe(true)
    expect(audit.pressableTransition).toContain('transform')
    expect(audit.pressableTransition).toContain('border-color')
    expect(audit.pressableTransition).toContain('background-color')
    expect(audit.pressableTransition).toContain('color')
    expect(audit.pressableTransition.toLowerCase()).not.toContain('all')
  })

  test('applies press to Show More, Visit Project, and Archive rows', async ({ page }) => {
    await page.goto('/building')
    await expect(page.locator('[data-show-more="true"]')).toHaveClass(/shell-pressable/)

    await page.goto('/building/definitely-fake-seed-project-1')
    await expect(page.locator('[data-external-link]')).toHaveClass(/shell-pressable/)

    await page.goto('/projects')
    await expect(page.locator('[data-archive-row]').first()).toHaveClass(/shell-pressable/)
  })
})
