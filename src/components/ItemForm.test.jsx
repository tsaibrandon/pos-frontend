import { render, screen, fireEvent } from '@testing-library/react'
import { expect, vi } from 'vitest'
import AddItemForm from './ItemForm'

describe('ItemForm Component', () => {
  const mockOnClose = vi.fn()
  const mockOnSave = vi.fn()

  const mockItem = {
    id: 1,
    title: 'Burger',
    price: 8.99,
    description: 'Delicious burger',
    image: 'https://example.com/burger.jpg'
  }

  beforeEach(() => {
    // Clear mock function calls before each test
    vi.clearAllMocks()
  })

  it('should not render when isOpen is false', () => {
    render(
      <AddItemForm
        isOpen={false}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    )

    expect(screen.queryByText('Add New Menu Item')).not.toBeInTheDocument()
  })

  it('renders the form with empty fields for new item', () => {
    render(
      <AddItemForm
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    )

    expect(screen.getByText('Add New Menu Item')).toBeInTheDocument()
    
    // Get all form inputs
    const nameInput = screen.getByPlaceholderText('Enter item name')
    const priceInput = screen.getByPlaceholderText('Enter price')
    const descriptionInput = screen.getByPlaceholderText('Enter description')
    const imageInput = screen.getByPlaceholderText('Enter image URL')

    // Check that all inputs are empty
    expect(nameInput).toHaveValue('')
    expect(priceInput).toHaveValue(null)  // number inputs have null value when empty
    expect(descriptionInput).toHaveValue('')
    expect(imageInput).toHaveValue('')
  })

  it('renders the form with populated fields when editing an item', () => {
    render(
      <AddItemForm
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        itemToEdit={mockItem}
      />
    )

    expect(screen.getByText('Edit Menu Item')).toBeInTheDocument()
    
    const nameInput = screen.getByPlaceholderText('Enter item name')
    const priceInput = screen.getByPlaceholderText('Enter price')
    const descriptionInput = screen.getByPlaceholderText('Enter description')
    const imageInput = screen.getByPlaceholderText('Enter image URL')

    expect(nameInput).toHaveValue('Burger')
    expect(priceInput).toHaveValue(8.99)
    expect(descriptionInput).toHaveValue('Delicious burger')
    expect(imageInput).toHaveValue('https://example.com/burger.jpg')
  })

  it('calls onClose when Cancel button is clicked', () => {
    render(
      <AddItemForm
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    )

    fireEvent.click(screen.getByText('Cancel'))
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('submits the form with new item data', () => {
    render(
      <AddItemForm
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
      />
    )

    // Fill out the form
    const nameInput = screen.getByPlaceholderText('Enter item name')
    const priceInput = screen.getByPlaceholderText('Enter price')
    const descriptionInput = screen.getByPlaceholderText('Enter description')
    const imageInput = screen.getByPlaceholderText('Enter image URL')

    fireEvent.change(nameInput, { target: { value: 'Pizza' } })
    fireEvent.change(priceInput, { target: { value: '12.99' } })
    fireEvent.change(descriptionInput, { target: { value: 'Tasty pizza' } })
    fireEvent.change(imageInput, { target: { value: 'https://example.com/pizza.jpg' } })

    // Submit the form
    fireEvent.click(screen.getByText('Save'))

    // Check if onSave was called with the correct data
    expect(mockOnSave).toHaveBeenCalledWith({
      id: undefined,
      title: 'Pizza',
      price: 12.99,
      description: 'Tasty pizza',
      image: 'https://example.com/pizza.jpg'
    })

    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('submits the form with edited item data', () => {
    render(
      <AddItemForm
        isOpen={true}
        onClose={mockOnClose}
        onSave={mockOnSave}
        itemToEdit={mockItem}
      />
    )

    // Modify the form
    const priceInput = screen.getByPlaceholderText('Enter price')
    fireEvent.change(priceInput, { target: { value: '9.99' } })

    // Submit the form
    fireEvent.click(screen.getByText('Save'))

    // Check if onSave was called with the correct data
    expect(mockOnSave).toHaveBeenCalledWith({
      id: 1,
      title: 'Burger',
      price: 9.99,
      description: 'Delicious burger',
      image: 'https://example.com/burger.jpg'
    })

    // Check if onClose was called
    expect(mockOnClose).toHaveBeenCalled()
  })
})
