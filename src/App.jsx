import { useState } from 'react'
import MenuItem from './components/MenuItem'
import CartItem from './components/CartItem'
import { gql, useQuery } from '@apollo/client';

const GET_MENU_ITEMS = gql`
query {
  defaultMenu {
    id
    image
    price
    title
  }
}
`;

export default function App() {
  const [cart, setCart] = useState([])
  const [screen, setScreen] = useState('menu')

  const { loading, error, data } = useQuery(GET_MENU_ITEMS);

  // Cart Handlers
  function addToCart(item) {
    const updatedCart = [...cart, item];
    setCart(updatedCart);
  }
  
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
    const orderDetails = cart
      .map((item) => `${item.title} - $${item.price}`)
      .join('\n')

    window.alert(`Your Order:\n\n${orderDetails}\n\nTotal: $${total}\n\nORDER IS COMPLETE`)

    setCart([])
  }

  // Conditional Rendering (Dependent on Backend Data)
  if (loading) return <p>Loading menu...</p>;
  if (error) return <p>Error :(</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-4">
        {screen === 'menu' ? (
          <div className="grid grid-cols-4 gap-4">
            {data.defaultMenu.map((item) => (
              <MenuItem key={item.id} item={item} addToCart={addToCart} />
            ))}
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-bold mb-2">Cart</h2>
            {cart.map((item, i) => (
              <CartItem 
                key={i} 
                item={item} 
                removeFromCart = {() => removeFromCart(i)}
              />
            ))}
            <div className="mt-4 font-bold">Total: ${total}</div>
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