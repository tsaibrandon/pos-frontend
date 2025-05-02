import { render, screen, fireEvent } from '@testing-library/react'
import MenuItem from './MenuItem'

describe('MenuItem Component', () => {
  const mockItem = {
    id: 1,
    title: 'Burger',
    price: 8.99,
    image: 'https://via.placeholder.com/100',
  }

  const mockAddToCart = vi.fn() // Mock function for addToCart

  it('renders the menu item with title, price, and image', () => {
    render(<MenuItem item={mockItem} addToCart={mockAddToCart} />)

    // Check if the title is rendered
    expect(screen.getByText('Burger')).toBeInTheDocument()

    // Check if the price is rendered
    expect(screen.getByText('$8.99')).toBeInTheDocument()

    // Check if the image is rendered
    const image = screen.getByAltText('Burger')
    expect(image).toBeInTheDocument()
    expect(image).toHaveAttribute('src', 'https://via.placeholder.com/100')
  })

  it('calls addToCart when the "Add to Cart" button is clicked', () => {
    render(<MenuItem item={mockItem} addToCart={mockAddToCart} />)

    // Find the button and click it
    const button = screen.getByText('Add to Cart')
    fireEvent.click(button)

    // Check if the mockAddToCart function was called with the correct item
    expect(mockAddToCart).toHaveBeenCalledTimes(1)
    expect(mockAddToCart).toHaveBeenCalledWith(mockItem)
  })
})