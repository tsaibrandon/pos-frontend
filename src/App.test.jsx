import { render, screen, fireEvent } from '@testing-library/react'
import { vi } from 'vitest'
import App from './App'
import { useQuery, gql } from '@apollo/client'

vi.mock('@apollo/client', () => ({
  useQuery: vi.fn(),
  gql: vi.fn(),
}))

describe('App Component', () => {
  beforeEach(() => {
    // Mock window.alert
    window.alert = vi.fn()

    // Mock the default response of `useQuery`
    useQuery.mockReturnValue({
      loading: false,
      error: null,
      data: {
        defaultMenu: [
          { id: 1, title: 'Burger', price: 5.99, image: '' },
          { id: 2, title: 'Pizza', price: 7.99, image: '' },
        ]
      }
    })

    gql.mockReturnValue('mocked gql query')
  })

  it('shows a pop-up and clears the cart when checkout is clicked', () => {
    render(<App />)

    // Simulate adding items to the cart
    const addToCartButtons = screen.getAllByText('Add to Cart')
    fireEvent.click(addToCartButtons[0]) // Add Burger
    fireEvent.click(addToCartButtons[1]) // Add Pizza

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
    fireEvent.click(addToCartButtons[0]) // Add Burger
    fireEvent.click(addToCartButtons[1]) // Add Pizza

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

    // Find and click the second "Remove" button
    const secondRemove = screen.getAllByText('Remove')[0]
    fireEvent.click(secondRemove)
    // Verify that 'Pizza' was removed
    expect(screen.queryByText('Pizza')).not.toBeInTheDocument()
  })

  it('displays a loading message when data is loading', () => {
    useQuery.mockReturnValue({
      loading: true,
      error: null,
      data: null
    })

    render(<App />)

    expect(screen.getByText('Loading menu...')).toBeInTheDocument()
  })

  it('displays an error message when there is an error fetching data', () => {
    useQuery.mockReturnValue({
      loading: false,
      error: true,
      data: null
    })

    render(<App />)

    expect(screen.getByText('Error :(')).toBeInTheDocument()
  })
})
