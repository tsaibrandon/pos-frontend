import { render, screen } from '@testing-library/react'
import CartItem from './CartItem'

describe('CartItem Component', () => {
  const mockItem = {
    id: 1,
    title: 'Burger',
    price: 8.99,
  }

  it('renders the cart item with title and price', () => {
    render(<CartItem item={mockItem} />)

    // Check if the title is rendered
    expect(screen.getByText('Burger')).toBeInTheDocument()

    // Check if the price is rendered
    expect(screen.getByText('$8.99')).toBeInTheDocument()
  })
})
