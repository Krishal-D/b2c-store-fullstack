/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  timeout: 120000,
  expect: {
    timeout: 10000
  },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  use: {
    actionTimeout: 20000,
    navigationTimeout: 30000,
    viewport: { width: 1280, height: 800 },
    baseURL: 'http://localhost:5173',
    ignoreHTTPSErrors: true,
    video: process.env.CI ? 'retain-on-failure' : 'off'
  },
  webServer: {
    command: 'npm run dev -- --host 0.0.0.0',
    port: 5173,
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome']
      }
    }
  ]
})
