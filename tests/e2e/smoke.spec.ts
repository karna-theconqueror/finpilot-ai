import { test, expect } from '@playwright/test'

test('landing page loads and shows core CTA', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /Your Financial Journey, Made Simpler with AI\./i })).toBeVisible()
  await expect(page.getByRole('link', { name: /Get Started/i })).toBeVisible()
  await expect(page.getByRole('link', { name: /Explore FinPilot AI/i })).toBeVisible()
})

test('public navigation works', async ({ page }) => {
  await page.goto('/about')
  await expect(page.getByRole('heading', { name: /About FinPilot AI/i })).toBeVisible()
  await page.goto('/how-it-works')
  await expect(page.getByRole('heading', { name: /How FinPilot AI Works/i })).toBeVisible()
})
