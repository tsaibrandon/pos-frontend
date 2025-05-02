import { useState } from 'react'
import MenuItem from './components/MenuItem'
import CartItem from './components/CartItem'
import menuItems from './data/menuItemsExample.json'

export default function App() {
  const [cart, setCart] = useState([])
  const [screen, setScreen] = useState('menu')

  const addToCart = (item) => setCart([...cart, item])

  const total = cart.reduce((sum, item) => sum + item.price, 0).toFixed(2)

  const checkout = () => {
    // Create a string representation of the order
    const orderDetails = cart
      .map((item) => `${item.title} - $${item.price}`)
      .join('\n')

    // Show the pop-up with the order details and a completion message
    window.alert(`Your Order:\n\n${orderDetails}\n\nTotal: $${total}\n\nORDER IS COMPLETE`)

    // Clear the cart
    setCart([])
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-4">
        {screen === 'menu' ? (
          <div className="grid grid-cols-4 gap-4">
            {menuItems.map((item) => (
              <MenuItem key={item.id} item={item} addToCart={addToCart} />
            ))}
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-bold mb-2">Cart</h2>
            {cart.map((item, i) => (
              <CartItem key={i} item={item} />
            ))}
            <div className="mt-4 font-bold">Total: ${total}</div>
            <button
              onClick={checkout} // Call the checkout function
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
            >
              Checkout
            </button>
          </div>
        )}
      </div>
      <div className="flex justify-around border-t p-2">
        <button onClick={() => setScreen('menu')} className="text-blue-600">
          Menu
        </button>
        <button onClick={() => setScreen('cart')} className="text-blue-600">
          Cart ({cart.length})
        </button>
      </div>
    </div>
  )
}