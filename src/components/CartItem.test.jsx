import { render, screen, fireEvent } from '@testing-library/react'
import CartItem from './CartItem'
import { expect, vi } from 'vitest'

describe('CartItem Component', () => {
  const mockItem = {
    id: 1,
    title: 'Burger',
    price: 8.99,
  }

  it('renders the cart item with title, price, remove button', () => {
    render(<CartItem item={mockItem} />)

    // Check if the title is rendered
    expect(screen.getByText('Burger')).toBeInTheDocument()

    // Check if the price is rendered
    expect(screen.getByText('$8.99')).toBeInTheDocument()

    // Checks if remove button is rendered
    expect(screen.getByText('Remove')).toBeInTheDocument()
  })

  it('calls removeFromCart when remove button is clicked', () => {
    const mockRemoveFromCart = vi.fn()

    render(<CartItem item = {mockItem} removeFromCart={mockRemoveFromCart} />)

    // Find and click the button
    const button = screen.getByText('Remove')
    fireEvent.click(button)

    // Checks to see that removeFromCart has been called on click
    expect(mockRemoveFromCart).toHaveBeenCalledTimes(1)
  })
})


