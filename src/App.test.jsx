import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import App from './App'

describe('App Component', () => {
  beforeEach(() => {
    // Mock window.alert
    window.alert = vi.fn()
  })

  it('shows a pop-up and clears the cart when checkout is clicked', () => {
    render(<App />)

    // Simulate adding items to the cart
    const addToCartButtons = screen.getAllByText('Add to Cart')
    fireEvent.click(addToCartButtons[0])
    fireEvent.click(addToCartButtons[1])

    // Navigate to the cart screen
    const cartButton = screen.getByRole('button', { name: /Cart \(\d+\)/i })
    fireEvent.click(cartButton)

    // Verify items are in the cart
    expect(screen.getByText('Burger')).toBeInTheDocument()
    expect(screen.getByText('Pizza')).toBeInTheDocument()

    // Click the "Checkout" button
    const checkoutButton = screen.getByText('Checkout')
    fireEvent.click(checkoutButton)

    // Verify the pop-up was shown
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining('Your Order:')
    )
    expect(window.alert).toHaveBeenCalledWith(
      expect.stringContaining('ORDER IS COMPLETE')
    )

    // Verify the cart is emptied
    expect(screen.queryByText('Burger')).not.toBeInTheDocument()
    expect(screen.queryByText('Pizza')).not.toBeInTheDocument()
  })

  it('removes the item from the cart when remove button is clicked', () => {
    render(<App />)

    // Simulate adding items to the cart
    const addToCartButtons = screen.getAllByText('Add to Cart')
    fireEvent.click(addToCartButtons[0])
    fireEvent.click(addToCartButtons[1])

    // Navigate to the cart screen
    const cartButton = screen.getByRole('button', { name: /Cart \(\d+\)/i })
    fireEvent.click(cartButton)

    // Verify items are in the cart
    expect(screen.getByText('Burger')).toBeInTheDocument()
    expect(screen.getByText('Pizza')).toBeInTheDocument()

    // Find and click the first "Remove" button
    const firstRemove = screen.getAllByText('Remove')[0]
    fireEvent.click(firstRemove)
    // Verify that 'Burger' was removed and 'Pizza' is still there
    expect(screen.queryByText('Burger')).not.toBeInTheDocument()
    expect(screen.queryByText('Pizza')).toBeInTheDocument()

    // Find and click the first "Remove" button
    const secondRemove = screen.getByText('Remove')
    fireEvent.click(secondRemove)
    // Verify that 'Burger' was removed and 'Pizza' is still there
    expect(screen.queryByText('Pizza')).not.toBeInTheDocument()
    
  })
})