import { render, screen, fireEvent } from '@testing-library/react'
import { expect, it, vi } from 'vitest'
import App from './App'
import { useQuery, gql } from '@apollo/client'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'

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

  it('makes sure that the clear button is disabled when the cart is empty', () => {
    render(<App />)

    // Navigate to the cart screen
    const cartButton = screen.getByRole('button', { name: /Cart \(\d+\)/i })
    fireEvent.click(cartButton)

    // Find and confirm that the clear button is diabled when the cart is empty
    const clear = screen.getByText('Clear')
    expect(clear).toBeDisabled();
  })

  it('empties the cart only when clear button is clicked and ok is clicked on the prompt', () => {
    // Returns true for when 'OK' is selected on the confimation prompt
    window.confirm = vi.fn(() => true)
    
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

    // Find and click the clear button
    const clear = screen.getByText('Clear')
    fireEvent.click(clear)

    // Confirms that the confirmation prompt appears
    expect(window.confirm).toHaveBeenCalledWith(
      expect.stringContaining('Are you sure you want to clear your cart?')
    )

    // Confirms that the cart is empty
    expect(screen.queryByText('Burger')).not.toBeInTheDocument()
    expect(screen.queryByText('Pizza')).not.toBeInTheDocument()
  })

  it('does not empty the cart when cancel is clicked on the confirmation prompt', () => {
    // Returns false for when 'cancel' is selected on the confimation prompt
    window.confirm = vi.fn(() => false)
    
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

    // Find and click the clear button
    const clear = screen.getByText('Clear')
    fireEvent.click(clear)

    // Confirms that the confirmation prompt appears
    expect(window.confirm).toHaveBeenCalledWith(
      expect.stringContaining('Are you sure you want to clear your cart?')
    )

    // Confirms that the cart is not empty
    expect(screen.queryByText('Burger')).toBeInTheDocument()
    expect(screen.queryByText('Pizza')).toBeInTheDocument()
  })

  // it('displays a loading message when data is loading', () => {
  //   useQuery.mockReturnValue({
  //     loading: true,
  //     error: null,
  //     data: null
  //   })

  //   render(<App />)

  //   expect(screen.getByText('Loading menu...')).toBeInTheDocument()
  // })

  // it('displays an error message when there is an error fetching data', () => {
  //   useQuery.mockReturnValue({
  //     loading: false,
  //     error: true,
  //     data: null
  //   })

  //   render(<App />)

  //   expect(screen.getByText('Error :(')).toBeInTheDocument()
  // })
})

describe('Menu Editing Features', () => {
  beforeEach(() => {
    render(<App />);
  });

  it('switches to edit mode when "Edit Menu" button is clicked', () => {
    // Click the Edit Menu button
    const editButton = screen.getByText('Edit Menu');
    fireEvent.click(editButton);

    // Verify edit mode buttons are visible
    expect(screen.getByText('Add Item')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save Changes')).toBeInTheDocument();
  });

  it('opens AddItemForm when "Add Item" button is clicked in edit mode', () => {
    // Find and click the Edit Menu button
    const editButton = screen.getByText('Edit Menu');
    fireEvent.click(editButton);
    
    // Find and click Add Item button
    const addItem = screen.getByText('Add Item')
    fireEvent.click(addItem);
    
    // Verify form is open (assuming AddItemForm has a title or specific element)
    expect(screen.getByText('Add New Menu Item')).toBeInTheDocument();
  });

  it('cancels changes and returns to menu view', () => {
    // Find and click the Edit Menu button
    const editButton = screen.getByText('Edit Menu');
    fireEvent.click(editButton);
    
    // Find and click Cancel button
    const cancelButton = screen.getByText('Cancel')
    fireEvent.click(cancelButton);
    
    // Verify we're back in menu view
    expect(screen.getByText('Edit Menu')).toBeInTheDocument();
  });

  it('displays Edit and Delete when hovering over a menu item', async () => {
    // Find and click the Edit Menu button
    const editButton = screen.getByText('Edit Menu');
    fireEvent.click(editButton);

    // Find and hover over a menu item
    const hoverElement = screen.getAllByRole('img');
    const firstMenuItem = hoverElement[0]
    await fireEvent.mouseEnter(firstMenuItem.closest('div'));

    // Check to see if the Edit and Delete buttons render
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();

    // Unhover the menu item
    await fireEvent.mouseLeave(firstMenuItem.closest('div'));

    // Check to see if the Edit and Delete buttons disappear
    expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    expect(screen.queryByText('Delete')).not.toBeInTheDocument();
  })

  it('deletes menu item in edit mode', async () => {
    // Find and click the Edit Menu button
    const editButton = screen.getByText('Edit Menu');
    fireEvent.click(editButton);

    // Get the name of the first menu item 
    const firstMenuItemName = screen.getAllByRole('heading', { level: 2 })[0].textContent

    // Get the total number of menu items
    const totalMenuItems = screen.getAllByRole('heading', { level: 2 }).length;
    
    // Find and hover over a menu item
    const hoverElement = screen.getAllByRole('heading', { level: 2 });
    const firstMenuItem = hoverElement[0]
    await fireEvent.mouseEnter(firstMenuItem.closest('div'));
    
    // Find and click Delete on the first item
    const firstDeleteButton = screen.getByText('Delete');
    fireEvent.click(firstDeleteButton);
    
    // Unhover
    await fireEvent.mouseLeave(firstMenuItem.closest('div'));

    // Verify specifally the first item was deleted
    expect(screen.queryByText(firstMenuItemName)).not.toBeInTheDocument();

    // Verify an item was deleted
    const newMenuItems = screen.getAllByRole('heading', { level: 2 }).length;
    expect(newMenuItems).toBe(totalMenuItems - 1);
  });

  it('edits existing menu item', async () => {
    // Find and click the Edit Menu button
    const editButton = screen.getByText('Edit Menu');
    fireEvent.click(editButton);
    
    // Find and hover over a menu item
    const hoverElement = screen.getAllByRole('heading', { level: 2 });
    const firstMenuItem = hoverElement[0]
    await fireEvent.mouseEnter(firstMenuItem.closest('div'));

    // Find and click Edit on the first item
    const firstEditButton = screen.getByText('Edit');
    await fireEvent.click(firstEditButton);

    // Verify edit form is open
    const dialog = screen.getByText('Edit Menu Item');
    expect(dialog).toBeInTheDocument();
    
    // Fill in new values 
    const inputs = screen.getAllByRole('textbox');  
    const titleInput = inputs[0];  
    const priceInput = screen.getByRole('spinbutton');
    
    await userEvent.clear(titleInput);
    await userEvent.type(titleInput, 'Updated Item');
    await userEvent.clear(priceInput);
    await userEvent.type(priceInput, '9.99');
    
    // Find and click Save button
    const saveButton = screen.getByText('Save')
    await fireEvent.click(saveButton);
    
    // Verify form is closed
    expect(dialog).not.toBeInTheDocument();
    
    // Verify updated item appears in the menu
    expect(screen.getByText('Updated Item')).toBeInTheDocument();
    expect(screen.getByText('$9.99')).toBeInTheDocument();
  });

  it('saves all changes and returns to menu view', async () => {
    // Find and click the Edit Menu button
    const editButton = screen.getByText('Edit Menu');
    fireEvent.click(editButton);

    // Get the name of the first menu item 
    const firstMenuItemName = screen.getAllByRole('heading', { level: 2 })[0].textContent

    // Get the total number of menu items
    const totalMenuItems = screen.getAllByRole('heading', { level: 2 }).length;
    
    // Find and hover over a menu item
    const hoverElement = screen.getAllByRole('heading', { level: 2 });
    const firstMenuItem = hoverElement[0]
    await fireEvent.mouseEnter(firstMenuItem.closest('div'));
    
    // Find and click Delete on the first item
    const firstDeleteButton = screen.getByText('Delete');
    fireEvent.click(firstDeleteButton);
    
    // Unhover
    await fireEvent.mouseLeave(firstMenuItem.closest('div'));
    
    // Find and click Save
    const saveChangesButton = screen.getByText('Save Changes')
    await fireEvent.click(saveChangesButton);
    
    // Verify we're back in menu view
    expect(screen.getByText('Edit Menu')).toBeInTheDocument();

    // Verify specifally the first item was deleted
    expect(screen.queryByText(firstMenuItemName)).not.toBeInTheDocument();

    // Verify an item was deleted
    const newMenuItems = screen.getAllByRole('heading', { level: 2 }).length;
    expect(newMenuItems).toBe(totalMenuItems - 1);
  });
});
