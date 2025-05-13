import { useState } from 'react'
import MenuItem from './components/MenuItem'
import CartItem from './components/CartItem'
// import { gql, useQuery } from '@apollo/client';
import AddItemForm from './components/ItemForm'

import menuItemsData from './data/menuItemsExample.json'

// const GET_MENU_ITEMS = gql`
// query {
//   defaultMenu {
//     id
//     image
//     price
//     title
//   }
// }
// `;

export default function App() {
  const [cart, setCart] = useState([])
  const [screen, setScreen] = useState('menu')
  // const { loading, error, data } = useQuery(GET_MENU_ITEMS);
  const [isAddItemFormOpen, setAddItemFormOpen] = useState(false)
  // Add these new state variables for menu management
  const [menuItems, setMenuItems] = useState(menuItemsData);
  const [tempMenuItems, setTempMenuItems] = useState(menuItemsData);
  const [itemToEdit, setItemToEdit] = useState(null)

  // Cart Handlers
  function addToCart(item) {
    const updatedCart = [...cart, item];
    setCart(updatedCart);
  }
  
  // Menu management handlers
  const handleDelete = (itemId) => {
    const updatedMenuItems = tempMenuItems.filter(item => item.id !== itemId);
    setTempMenuItems(updatedMenuItems);
    // Format prices in the console log
    const formattedMenuItems = updatedMenuItems.map(item => ({
      ...item,
      price: Number(item.price).toFixed(2)
    }));
    console.log('Updated Menu Items:', JSON.stringify(formattedMenuItems, null, 2));
  };

  const handleSaveChanges = () => {
    setMenuItems(tempMenuItems);
    // Format prices in the console log
    const formattedMenuItems = tempMenuItems.map(item => ({
      ...item,
      price: Number(item.price).toFixed(2)
    }));
    console.log('Final Menu Items:', JSON.stringify(formattedMenuItems, null, 2));
    setScreen('menu');
  };

  const handleCancelChanges = () => {
    setTempMenuItems(menuItems);
    setScreen('menu');
  };

  const emptyCart = () => {
    // A pop-up that confirms that the user is emptying their cart
    if(window.confirm('Are you sure you want to clear your cart?')) {
      // Clear the cart
      setCart([]);
    }
  }

  function removeFromCart(indexToRemove) {
    const updatedCart = cart.filter((_, currentIndex) => {
      return currentIndex !== indexToRemove;
    });
    setCart(updatedCart);
  }

  // Calculating Cart Total
  let total = 0;

  for (let item of cart) {
    total += item.price;
  }

  total = total.toFixed(2);

  // Checkout Handler
  const checkout = () => {
    const formatPrice = (price) => Number(price).toFixed(2)
    
    const orderDetails = cart
      .map((item) => `${item.title} - $${formatPrice(item.price)}`)
      .join('\n')

    window.alert(`Your Order:\n\n${orderDetails}\n\nTotal: $${formatPrice(total)}\n\nORDER IS COMPLETE`)

    setCart([])
  }

  const handleEdit = (item) => {
    setItemToEdit(item)
    setAddItemFormOpen(true)
  }

  const handleSaveItem = (updatedItem) => {
    // Format the price to always have 2 decimal places
    const formattedItem = {
      ...updatedItem,
      price: Number(parseFloat(updatedItem.price).toFixed(2)) // Convert price to number
    };

    let updatedMenuItems;
    if (itemToEdit) {
      // Editing existing item
      updatedMenuItems = tempMenuItems.map(item => 
        item.id === formattedItem.id ? formattedItem : item
      );
    } else {
      // Adding new item
      const newItem = {
        ...formattedItem,
        id: Date.now(), // Simple way to generate unique IDs
        image: 'https://placehold.co/400x300' // Always set default image for new items
      };
      updatedMenuItems = [...tempMenuItems, newItem];
    }
    setTempMenuItems(updatedMenuItems);
    setMenuItems(updatedMenuItems); // Update menuItems immediately as well
    setItemToEdit(null);
    setAddItemFormOpen(false);
    
    // Console log the complete updated menu
    console.log('Updated Menu Items:', JSON.stringify(updatedMenuItems, null, 2));
  }

  // Conditional Rendering (Dependent on Backend Data)
  // if (loading) return <p>Loading menu...</p>;
  // if (error) return <p>Error :(</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-4">
        {screen === 'menu' ? (
          <div className="grid grid-cols-4 gap-4">
            {menuItems.map(item => (
              <MenuItem
                key={item.id}
                item={item}
                isEditMode={false}
                addToCart={addToCart}
              />
            ))}
          </div>
        ) : screen === 'cart' ? (
          <div>
            <h2 className="text-lg font-bold mb-2">Cart</h2>
            {cart.map((item, i) => (
              <CartItem 
                key={i} 
                item={item} 
                removeFromCart = {() => removeFromCart(i)}
              />
            ))}
            <div className="mt-4 font-bold">Total: ${Number(total).toFixed(2)}</div>
            <button
              onClick={checkout} // Call the checkout function
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded mr-2"
            >
              Checkout
            </button>
            <button
              onClick={emptyCart} // Call the emptyCart function
              disabled={cart.length === 0} // Clear button is disabled when cart is empty
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded ml-2 disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-4">
            {tempMenuItems.map(item => (
              <MenuItem
                key={item.id}
                item={item}
                isEditMode={true}
                onDelete={handleDelete}
                onEdit={handleEdit}
                addToCart={addToCart}
              />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-around border-t p-2">
        {screen === 'menu' ? (
          <>
            <button onClick={() => setScreen('menu')} className="text-blue-600">
              Menu
            </button>
            <button onClick={() => setScreen('cart')} className="text-blue-600">
              Cart ({cart.length})
            </button>
            <button onClick={() => setScreen('edit')} className="text-blue-600">
              Edit Menu
            </button>
          </>
        ) : screen === 'cart' ? (
          <button onClick={() => setScreen('menu')} className="text-blue-600">
            Menu
          </button>
        ) : (
          <>
            <button onClick={() => setAddItemFormOpen(true)} className="text-blue-600">
              Add Item
            </button>
            <button 
              onClick={handleCancelChanges} 
              className="text-blue-600"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveChanges}
              className="text-blue-600"
            >
              Save Changes
            </button>
          </>
        )}
      </div>

      <AddItemForm 
        isOpen={isAddItemFormOpen}
        onClose={() => {
          setAddItemFormOpen(false)
          setItemToEdit(null)
        }}
        onSave={handleSaveItem}
        itemToEdit={itemToEdit}
      />
    </div>
  )
}