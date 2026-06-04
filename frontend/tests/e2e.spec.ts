import { test, expect } from '@playwright/test'
import axios from 'axios'

const buyerEmail = `e2e_buyer_${Date.now()}@test.com`
const buyerPassword = 'Test1234!'
const adminEmail = 'admin@cartly.com'
const adminPassword = 'Admin123!'

function getFieldByLabel(page: any, labelText: string) {
  return page.locator('label', { hasText: labelText }).locator('..').locator('input,textarea').first()
}

async function fillField(page: any, labelText: string, value: string) {
  const field = getFieldByLabel(page, labelText)
  await field.fill(value)
}

async function login(page: any, email: string, password: string) {
  await page.goto('/login')
  await fillField(page, 'Email', email)
  await fillField(page, 'Password', password)
  await page.getByRole('button', { name: /sign in/i }).click()
  await expect(page).toHaveURL(/dashboard/)
}

async function registerBuyer(page: any) {
  await page.goto('/register')
  await fillField(page, 'Name', 'E2E Buyer')
  await fillField(page, 'Email', buyerEmail)
  await fillField(page, 'Password', buyerPassword)
  await fillField(page, 'Confirm Password', buyerPassword)
  await page.getByRole('button', { name: /create account/i }).click()
  await expect(page).toHaveURL(/dashboard/)
}

async function openFirstAvailableProductDetails(page: any) {
  await page.goto('/products')

  const productCard = page.locator('article', {
    has: page.getByRole('button', { name: /add to cart/i })
  }).first()

  await expect(productCard).toBeVisible()
  await productCard.locator('a[href^="/products/"]').first().click()
  await page.waitForURL(/\/products\/\d+/)

  const addButton = page.getByRole('button', { name: /add to cart/i }).first()
  await expect(addButton).toBeVisible()
  return addButton
}

async function addFirstProductToCart(page: any) {
  await login(page, buyerEmail, buyerPassword)
  const addButton = await openFirstAvailableProductDetails(page)
  await addButton.click()
  await page.goto('/cart')
}

async function ensureBuyerCreated(page: any) {
  await page.goto('/login')
  await fillField(page, 'Email', buyerEmail)
  await fillField(page, 'Password', buyerPassword)
  await page.getByRole('button', { name: /sign in/i }).click()

  if (page.url().includes('/login')) {
    await registerBuyer(page)
  }
}

test.describe('Cartly e2e coverage', () => {
  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    await ensureBuyerCreated(page)
    await context.close()
  })

  test('redirects unauthenticated users to login', async ({ page }) => {
    await page.goto('/cart')
    await expect(page).toHaveURL(/login/)
  })

  test('buyer can register with a new account', async ({ page }) => {
    const uniqueEmail = `e2e_register_${Date.now()}@test.com`
    await page.goto('/register')
    await fillField(page, 'Name', 'Register Buyer')
    await fillField(page, 'Email', uniqueEmail)
    await fillField(page, 'Password', buyerPassword)
    await fillField(page, 'Confirm Password', buyerPassword)
    await page.getByRole('button', { name: /create account/i }).click()
    await expect(page).toHaveURL(/dashboard/)
    await expect(page.getByText(/Welcome back|Hello/i)).toBeVisible()
  })

  test('buyer can login with existing account', async ({ page }) => {
    await login(page, buyerEmail, buyerPassword)
    await expect(page.getByText(/Welcome back|Hello/i)).toBeVisible()
  })

  test('dashboard loads with quick links and metrics', async ({ page }) => {
    await login(page, buyerEmail, buyerPassword)
    await page.goto('/dashboard')
    await expect(page.getByText(/Buyer dashboard/i)).toBeVisible()
    await expect(page.getByText(/Welcome back/i)).toBeVisible()
    await expect(page.getByText(/Shopping insights/i)).toBeVisible()
  })

  test('buyer can browse products and filter by category', async ({ page }) => {
    await login(page, buyerEmail, buyerPassword)
    await page.goto('/products')
    await expect(page.getByRole('heading', { name: 'Products' })).toBeVisible()

    const categorySelect = page.locator('select')
    if ((await categorySelect.count()) > 0) {
      await categorySelect.selectOption({ index: 1 })
      await expect(page.getByRole('button', { name: /add to cart/i }).first()).toBeVisible()
    }
  })

  test('buyer can open a product details page', async ({ page }) => {
    await login(page, buyerEmail, buyerPassword)
    await page.goto('/products')

    const productCard = page.locator('article', {
      has: page.getByRole('button', { name: /add to cart/i })
    }).first()

    await expect(productCard).toBeVisible()
    await productCard.locator('a[href^="/products/"]').first().click()
    await page.waitForURL(/\/products\/\d+/)
    await expect(page.getByRole('button', { name: /add to cart/i }).first()).toBeVisible()
  })

  test('buyer can add a product to the cart from details', async ({ page }) => {
    await login(page, buyerEmail, buyerPassword)
    await addFirstProductToCart(page)
    await page.goto('/cart')
    await expect(page.getByText('Your Cart')).toBeVisible()
    await expect(page.getByText(/Qty \d+/)).toBeVisible()
  })

  test('buyer can update cart quantity', async ({ page }) => {
    await login(page, buyerEmail, buyerPassword)
    await page.goto('/cart')

    if ((await page.getByRole('button', { name: /remove/i }).count()) === 0) {
      await addFirstProductToCart(page)
      await page.goto('/cart')
    }

    const qtyLabel = page.locator('span', {
      hasText: /^Qty \d+/
    }).first()
    await expect(qtyLabel).toBeVisible()

    const text = await qtyLabel.textContent()
    const currentQty = Number(text?.replace('Qty', '').trim() ?? 0)

    const plusButton = page.getByRole('button', { name: '+' }).first()
    if (await plusButton.isEnabled()) {
      await plusButton.click()
      await expect(page.locator('span', {
        hasText: `Qty ${currentQty + 1}`
      })).toBeVisible()
    } else {
      const minusButton = page.getByRole('button', { name: '-' }).first()
      await expect(minusButton).toBeVisible()
      await minusButton.click()

      if (currentQty === 1) {
        await expect(page.getByText(/Your cart is empty/i)).toBeVisible()
      } else {
        await expect(page.locator('span', {
          hasText: `Qty ${currentQty - 1}`
        })).toBeVisible()
      }
    }
  })

  test('buyer can remove an item from cart', async ({ page }) => {
    await login(page, buyerEmail, buyerPassword)
    await page.goto('/cart')

    if ((await page.getByRole('button', { name: /remove/i }).count()) === 0) {
      await addFirstProductToCart(page)
      await page.goto('/cart')
    }

    const removeButton = page.getByRole('button', { name: /remove/i }).first()
    await expect(removeButton).toBeVisible()
    await removeButton.click()
    await expect(page.getByText(/Your cart is empty/i)).toBeVisible()
  })

  test('buyer can complete checkout payment flow', async ({ page }) => {
    await login(page, buyerEmail, buyerPassword)
    await addFirstProductToCart(page)
    await page.goto('/cart')
    await page.getByRole('button', { name: /proceed to checkout/i }).click()

    await expect(page).toHaveURL(/checkout/)
    await fillField(page, 'Cardholder Name', 'E2E Buyer')
    await fillField(page, 'Card Number', '4242 4242 4242 4242')
    await fillField(page, 'Expiry Date', '12/29')
    await fillField(page, 'CVV', '123')
    await page.getByRole('button', { name: /pay now/i }).click()

    await expect(page).toHaveURL(/orders/)
    await expect(page.getByText('Order History')).toBeVisible()
  })

  test('buyer can view order history', async ({ page }) => {
    await login(page, buyerEmail, buyerPassword)
    await page.goto('/orders')
    await expect(page.getByText('Order History')).toBeVisible()
    await expect(page.locator('a:has-text("CT")').first()).toBeVisible()
  })

  test('buyer can view order details', async ({ page }) => {
    await login(page, buyerEmail, buyerPassword)
    await page.goto('/orders')

    const firstOrderLink = page.locator('a[href^="/orders/"]').first()
    await expect(firstOrderLink).toBeVisible()
    await firstOrderLink.click()
    await page.waitForURL(/\/orders\/\d+/)
    await expect(page.getByRole('heading', { name: /Order Details/i })).toBeVisible()
    await expect(page.getByText(/Order Total/i)).toBeVisible()
  })

  test('buyer can logout', async ({ page }) => {
    await login(page, buyerEmail, buyerPassword)
    await page.goto('/profile')
    await expect(page.getByText(/Account details/i)).toBeVisible()
    await page.getByRole('button', { name: /log out/i }).click()
    await expect(page).toHaveURL(/login/)
  })

  test('admin role can view admin dashboard and quick links', async ({ page }) => {
    await login(page, adminEmail, adminPassword)
    await page.goto('/dashboard')
    await expect(page.getByText(/Shopkeeper dashboard/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /Manage products/i })).toBeVisible()
    await expect(page.getByRole('link', { name: /Review orders/i })).toBeVisible()
  })

  test('admin can create, edit, and delete a product', async ({ page }) => {
    await login(page, adminEmail, adminPassword)
    await page.goto('/admin/products')
    await expect(page.getByText(/Product Management/i)).toBeVisible()

    const productName = `E2E Product ${Date.now()}`
    await fillField(page, 'Product Name *', productName)
    await fillField(page, 'Price ($) *', '99.99')
    await fillField(page, 'Stock Quantity *', '10')
    await fillField(page, 'Description *', 'Created by Playwright')
    await page.getByRole('button', { name: /create product/i }).click()

    const createdRow = page.locator('tbody tr', { hasText: productName })
    await expect(createdRow).toBeVisible()

    await createdRow.getByRole('button', { name: /edit/i }).click()
    await fillField(page, 'Product Name *', `${productName} Updated`)
    await page.getByRole('button', { name: /update product/i }).click()

    const updatedRow = page.locator('tbody tr', { hasText: `${productName} Updated` })
    await expect(updatedRow).toBeVisible()

    await updatedRow.getByRole('button', { name: /delete/i }).click()
    const deletedRowLocator = page.locator('tbody tr', { hasText: `${productName} Updated` })
    await expect(deletedRowLocator).toHaveCount(0, { timeout: 10000 })
  })

  test('admin can view admin orders list', async ({ page }) => {
    await login(page, adminEmail, adminPassword)
    await page.goto('/admin/orders')
    await expect(page.getByText(/Order Management/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /view/i }).first()).toBeVisible()
  })

  test('buyer cannot access admin products page', async ({ page }) => {
    await login(page, buyerEmail, buyerPassword)
    await page.goto('/admin/products')
    await expect(page).not.toHaveURL(/admin\/products/)
  })

  test.afterAll(async () => {
    // Cleanup: remove any leftover E2E products from backend
    try {
      const loginResp = await axios.post('http://localhost:5000/api/auth/login', {
        email: adminEmail,
        password: adminPassword
      })

      const token = loginResp.data?.token
      if (!token) return

      const productsResp = await axios.get('http://localhost:5000/api/products')
      const products = productsResp.data?.products || productsResp.data

      for (const p of products) {
        if (p && typeof p.name === 'string' && p.name.startsWith('E2E Product')) {
          await axios.delete(`http://localhost:5000/api/products/${p.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        }
      }
    } catch (err) {
 
      console.error('E2E cleanup failed', err)
    }
  })
})
