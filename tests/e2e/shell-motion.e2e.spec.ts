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
          pressableActiveScale =
            rule.style.transform.includes('scale(0.97)') &&
            rule.selectorText.includes(':disabled')
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

  test('keeps the Faux Prompt menu mounted and origin-aware', async ({ page }) => {
    await page.goto('/')

    const menu = page.locator('[data-prompt-menu]')
    const chevron = page.locator('[data-prompt-chevron]')

    await expect(menu).toHaveCount(1)
    await expect(menu).toHaveAttribute('hidden', '')
    await expect(menu).toHaveAttribute('inert')
    await expect(menu.getByRole('link')).toHaveCount(0)

    const closed = await auditPromptMenu(page)
    expect(closed.originTopCenter).toBe(true)
    expect(closed.enterMs).toBe(180)
    expect(closed.exitMs).toBe(120)
    expect(closed.usesScaleZero).toBe(false)
    expect(closed.closedScale).toContain('0.97')
    expect(closed.chevronMs).toBe(180)
    expect(closed.promptReducedMotionInstant).toBe(true)

    await page.locator('[data-faux-input]').click()
    await expect(menu).not.toHaveAttribute('hidden')
    await expect(menu).not.toHaveAttribute('inert')
    await expect(menu.getByRole('link')).toHaveCount(3)
    await expect(chevron).toHaveClass(/rotate-180/)

    await page.locator('[data-faux-input]').click()
    await expect(menu).toHaveAttribute('hidden', '')
    await expect(menu).toHaveAttribute('inert')
    await expect(page.locator('[data-prompt-menu]')).toHaveCount(1)
  })

  test('does not keyframe Thread swaps', async ({ page }) => {
    await page.goto('/')

    const swap = await page.evaluate(() => {
      const child = document.querySelector('[data-message-column] > *')
      const animationName = child ? getComputedStyle(child).animationName : 'missing'

      let hasMessageEnterKeyframes = false
      let messageColumnAnimates = false

      const visit = (rules: CSSRuleList | CSSRule[]) => {
        for (const rule of Array.from(rules)) {
          if (rule instanceof CSSKeyframesRule && rule.name === 'shell-message-enter') {
            hasMessageEnterKeyframes = true
          }

          if (rule instanceof CSSStyleRule && rule.selectorText.includes('[data-message-column]')) {
            const text = `${rule.style.animation} ${rule.style.animationName} ${rule.cssText}`
            if (text.includes('shell-message-enter') || /\banimation\b/.test(rule.cssText)) {
              messageColumnAnimates = true
            }
          }

          if ('cssRules' in rule) {
            try {
              visit((rule as CSSGroupingRule).cssRules)
            } catch {
              // Cross-origin or empty grouping rule.
            }
          }
        }
      }

      for (const sheet of Array.from(document.styleSheets)) {
        try {
          visit(sheet.cssRules)
        } catch {
          continue
        }
      }

      return { animationName, hasMessageEnterKeyframes, messageColumnAnimates }
    })

    expect(swap.hasMessageEnterKeyframes).toBe(false)
    expect(swap.messageColumnAnimates).toBe(false)
    expect(swap.animationName === 'none' || swap.animationName === '').toBe(true)
  })

  test('Show More cards enter with starting-style stagger and no height', async ({ page }) => {
    await page.goto('/building')

    const firstCards = page.locator('[data-building-messages] [data-project-cards]').first()
    await expect(firstCards).not.toHaveClass(/shell-show-more-cards/)

    const spec = await auditShowMoreCards(page)
    expect(spec.startingOpacityZero).toBe(true)
    expect(spec.startingTranslateY).toBe(true)
    expect(spec.staggerMs).toEqual([40, 80, 120])
    expect(spec.capsAtFour).toBe(true)
    expect(spec.animatesHeight).toBe(false)
    expect(spec.reducedMotionOpacityOnly).toBe(true)

    await page.locator('[data-show-more="true"]').click()
    await expect(page.locator('[data-assistant-only-bundle] [data-project-cards]')).toHaveClass(
      /shell-show-more-cards/,
    )

    await page.goto('/written')
    await page.locator('[data-show-more="true"]').click()
    await expect(page.locator('[data-assistant-only-bundle] [data-thought-cards]')).toHaveClass(
      /shell-show-more-cards/,
    )
  })

  test('sidebar search panel stays instant', async ({ page }) => {
    await page.goto('/')
    await page.locator('[data-sidebar-search-toggle]').click()

    const panel = page.locator('#sidebar-search-panel')
    await expect(panel).toBeVisible()

    const motion = await panel.evaluate((el) => {
      const styles = getComputedStyle(el)
      return {
        animationName: styles.animationName,
        transitionDuration: styles.transitionDuration,
        transitionProperty: styles.transitionProperty,
      }
    })

    expect(motion.animationName === 'none' || motion.animationName === '').toBe(true)
    expect(motion.transitionProperty === 'none' || motion.transitionProperty === 'all').toBe(true)
    const durations = motion.transitionDuration.split(',').map((value) => value.trim())
    expect(durations.every((value) => value === '0s' || value === '0ms')).toBe(true)
  })
})

type PromptMenuAudit = {
  chevronMs: number | null
  closedScale: string
  enterMs: number | null
  exitMs: number | null
  originTopCenter: boolean
  promptReducedMotionInstant: boolean
  usesScaleZero: boolean
}

type ShowMoreCardAudit = {
  animatesHeight: boolean
  capsAtFour: boolean
  reducedMotionOpacityOnly: boolean
  staggerMs: number[]
  startingOpacityZero: boolean
  startingTranslateY: boolean
}

async function auditPromptMenu(page: import('@playwright/test').Page): Promise<PromptMenuAudit> {
  return page.evaluate(() => {
    const durationMs = (value: string) => {
      const match = value.match(/(\d+(?:\.\d+)?)m?s/)
      if (!match) return null
      const amount = Number(match[1])
      return value.includes('ms') ? amount : amount * 1000
    }

    let chevronMs: number | null = null
    let closedScale = ''
    let enterMs: number | null = null
    let exitMs: number | null = null
    let originTopCenter = false
    let promptReducedMotionInstant = false
    let usesScaleZero = false

    const visit = (rules: CSSRuleList | CSSRule[]) => {
      for (const rule of Array.from(rules)) {
        if (rule instanceof CSSStyleRule) {
          const { selectorText, cssText, style } = rule
          if (selectorText.includes('[data-prompt-menu]')) {
            if (style.transformOrigin.includes('top')) originTopCenter = true
            if (cssText.includes('scale(0)') && !cssText.includes('scale(0.97)')) {
              usesScaleZero = true
            }
            if (selectorText === '[data-prompt-menu][hidden]') {
              closedScale = style.transform || closedScale
              const parsed = durationMs(style.transitionDuration || cssText)
              if (parsed) exitMs = parsed
            } else if (selectorText === '[data-prompt-menu]') {
              const parsed = durationMs(style.transitionDuration || cssText)
              if (parsed) enterMs = parsed
            }
          }
          if (selectorText.includes('[data-prompt-chevron]')) {
            const parsed = durationMs(style.transitionDuration || cssText)
            if (parsed) chevronMs = parsed
          }
        }

        if (rule instanceof CSSMediaRule && rule.conditionText.includes('prefers-reduced-motion')) {
          for (const inner of Array.from(rule.cssRules)) {
            if (!(inner instanceof CSSStyleRule)) continue
            if (
              inner.selectorText.includes('[data-prompt-menu]') &&
              inner.cssText.includes('transition: none')
            ) {
              promptReducedMotionInstant = true
            }
          }
        }

        if ('cssRules' in rule) {
          try {
            visit((rule as CSSGroupingRule).cssRules)
          } catch {
            // Ignore unreadable grouping rules.
          }
        }
      }
    }

    for (const sheet of Array.from(document.styleSheets)) {
      try {
        visit(sheet.cssRules)
      } catch {
        continue
      }
    }

    return {
      chevronMs,
      closedScale,
      enterMs,
      exitMs,
      originTopCenter,
      promptReducedMotionInstant,
      usesScaleZero,
    }
  })
}

async function auditShowMoreCards(page: import('@playwright/test').Page): Promise<ShowMoreCardAudit> {
  return page.evaluate(() => {
    const durationMs = (value: string) => {
      const match = value.match(/(\d+(?:\.\d+)?)m?s/)
      if (!match) return null
      const amount = Number(match[1])
      return value.includes('ms') ? amount : amount * 1000
    }

    let animatesHeight = false
    let capsAtFour = false
    let reducedMotionOpacityOnly = false
    const staggerMs: number[] = []
    let startingOpacityZero = false
    let startingTranslateY = false

    const visit = (rules: CSSRuleList | CSSRule[]) => {
      for (const rule of Array.from(rules)) {
        if (rule instanceof CSSStyleRule && rule.selectorText.includes('.shell-show-more-cards')) {
          const text = rule.cssText
          if (/\b(height|min-height|max-height)\b/.test(text)) animatesHeight = true

          if (rule.selectorText.includes('nth-child(2)')) {
            const delay = durationMs(rule.style.transitionDelay)
            if (delay !== null) staggerMs.push(delay)
          }
          if (rule.selectorText.includes('nth-child(3)')) {
            const delay = durationMs(rule.style.transitionDelay)
            if (delay !== null) staggerMs.push(delay)
          }
          if (rule.selectorText.includes('nth-child(4)')) {
            const delay = durationMs(rule.style.transitionDelay)
            if (delay !== null) staggerMs.push(delay)
          }
          if (rule.selectorText.includes('n + 5') || rule.selectorText.includes('n+5')) {
            capsAtFour = true
          }
        }

        if (rule instanceof CSSMediaRule && rule.conditionText.includes('prefers-reduced-motion')) {
          for (const inner of Array.from(rule.cssRules)) {
            if (!(inner instanceof CSSStyleRule)) continue
            if (!inner.selectorText.includes('.shell-show-more-cards')) continue
            const text = inner.cssText
            const keepsOpacity = text.includes('opacity')
            const dropsMove = !text.includes('translate') || text.includes('translate: 0')
            if (keepsOpacity && dropsMove && !text.includes('6px')) {
              reducedMotionOpacityOnly = true
            }
          }
        }

        if (rule.constructor.name === 'CSSStartingStyleRule' || rule instanceof CSSGroupingRule) {
          const group = rule as CSSGroupingRule
          if ('cssRules' in group) {
            try {
              for (const inner of Array.from(group.cssRules)) {
                if (!(inner instanceof CSSStyleRule)) continue
                if (!inner.selectorText.includes('.shell-show-more-cards')) continue
                if (inner.style.opacity === '0') startingOpacityZero = true
                if (inner.style.translate.includes('6px') || inner.cssText.includes('6px')) {
                  startingTranslateY = true
                }
              }
            } catch {
              // Ignore.
            }
          }
        }

        if ('cssRules' in rule) {
          try {
            visit((rule as CSSGroupingRule).cssRules)
          } catch {
            // Ignore.
          }
        }
      }
    }

    for (const sheet of Array.from(document.styleSheets)) {
      try {
        visit(sheet.cssRules)
      } catch {
        continue
      }
    }

    return {
      animatesHeight,
      capsAtFour,
      reducedMotionOpacityOnly,
      staggerMs,
      startingOpacityZero,
      startingTranslateY,
    }
  })
}
