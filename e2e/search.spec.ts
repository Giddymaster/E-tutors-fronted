import { test, expect } from '@playwright/test'

test('search and open tutor profile', async ({ page }) => {
  await page.goto('/')
  const input = await page.locator('input[placeholder="Subject or skill (e.g. Calculus)"]')
  await input.fill('Math')
  await page.locator('text=Search tutor').click()
  // wait for results
  await page.waitForSelector('text=Search results')
  // click first View button on a TutorCard
  await page.locator('a:has-text("View")').first().click()
  await expect(page).toHaveURL(/\/tutors\//)
  await expect(page.locator('h4')).toBeVisible()
})
