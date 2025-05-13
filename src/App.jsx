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
  const [screen, setScreen] = useState('login')
  // const { loading, error, data } = useQuery(GET_MENU_ITEMS);
  const [isAddItemFormOpen, setAddItemFormOpen] = useState(false)
  // Add these new state variables for menu management
  const [menuItems, setMenuItems] = useState(menuItemsData);
  const [tempMenuItems, setTempMenuItems] = useState(menuItemsData);
  const [itemToEdit, setItemToEdit] = useState(null)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showSignUpPassword, setShowSignUpPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [signUpFormData, setSignUpFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showForgotPwPopup, setShowForgotPwPopup] = useState(false);
  const [passwordError, setPasswordError] = useState('');

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
        {screen === 'login' ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
              <form action="" className="space-y-6">
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-800">Restaurant POS</h1>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Login</label>
                  <input 
                    type="text" 
                    placeholder='Email or phone number'
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2 relative">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input 
                    type={showLoginPassword ? "text" : "password"}
                    placeholder='Enter password'
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-8 text-gray-500"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                  >
                    {showLoginPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      id='remember'
                      className="h-4 w-4 text-blue-600 rounded border-gray-300"
                    />
                    <label htmlFor="remember" className="ml-2 text-sm text-gray-600">Remember me</label>
                  </div>
                  <p 
                    className="text-sm text-blue-600 hover:text-blue-500 cursor-pointer"
                    onClick={() => setScreen('forgot pw')}
                  >
                    Forgot Password?
                  </p>
                </div>

                <div>
                  <button 
                    type="button"
                    onClick={() => setScreen('menu')}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Log in
                  </button>
                </div>

                <div className="text-center text-sm text-gray-600">
                  <p>Don't have an account? <span 
                    className="text-blue-600 hover:text-blue-500 cursor-pointer" 
                    onClick={() => setScreen('sign up')}
                  >
                    Sign up
                  </span> now</p>
                </div>
              </form>
            </div>
          </div>

        ) : screen === 'sign up' ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-[500px]">
              <form action="" className="space-y-6" onSubmit={(e) => {
                e.preventDefault();
                
                // Check if passwords match
                if (signUpFormData.password !== signUpFormData.confirmPassword) {
                  setPasswordError('Passwords do not match');
                  return;
                }
                
                // Clear any existing error
                setPasswordError('');
                
                // Log the form data to console
                console.log('New Account Created:', {
                  ...signUpFormData,
                  password: '***hidden***',
                  confirmPassword: '***hidden***'
                });
                
                // Reset form
                setSignUpFormData({
                  firstName: '',
                  lastName: '',
                  email: '',
                  phone: '',
                  password: '',
                  confirmPassword: ''
                });
                
                // Show success message and redirect to login
                setScreen('login');
                setShowSuccessPopup(true);
                
                // Hide success message after 3 seconds
                setTimeout(() => {
                  setShowSuccessPopup(false);
                }, 3000);
              }}>
                <div className="text-center">
                  <h1 className="text-2xl font-bold text-gray-800">Get Started</h1>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter your first name"
                      required
                      value={signUpFormData.firstName}
                      onChange={(e) => setSignUpFormData({...signUpFormData, firstName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter your last name"
                      required
                      value={signUpFormData.lastName}
                      onChange={(e) => setSignUpFormData({...signUpFormData, lastName: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input 
                      type="email" 
                      placeholder="example@email.com"
                      required
                      value={signUpFormData.email}
                      onChange={(e) => setSignUpFormData({...signUpFormData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="(123) 456-7890"
                      value={signUpFormData.phone}
                      onChange={(e) => setSignUpFormData({...signUpFormData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2 relative">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input 
                    type={showSignUpPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    required
                    value={signUpFormData.password}
                    onChange={(e) => setSignUpFormData({...signUpFormData, password: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-8 text-gray-500"
                    onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                  >
                    {showSignUpPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>

                <div className="space-y-2 relative">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input 
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    required
                    value={signUpFormData.confirmPassword}
                    onChange={(e) => setSignUpFormData({...signUpFormData, confirmPassword: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button 
                    type="button"
                    className="absolute right-3 top-8 text-gray-500"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>

                {passwordError && (
                  <div className="text-red-500 text-sm mt-1">
                    {passwordError}
                  </div>
                )}

                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="terms"
                    required
                    className="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600">
                    I agree to the <span className="text-blue-600 hover:text-blue-500 cursor-pointer">terms & policy</span>
                  </label>
                </div>

                <div>
                  <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    Create Account
                  </button>
                </div>

                <div className="text-center text-sm text-gray-600">
                  <p>Already have an account? 
                    <span 
                      className="text-blue-600 hover:text-blue-500 cursor-pointer ml-1"
                      onClick={() => setScreen('login')}
                    >
                      Login
                    </span>
                  </p>
                </div>
              </form>
            </div>
          </div>
          
        ) : screen == 'forgot pw' ? (
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
              <form action="" className="space-y-6">
                <div className="mb-6">
                  <p 
                    className="text-blue-600 hover:text-blue-500 cursor-pointer flex items-center"
                    onClick={() => setScreen('login')}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                    Back to login
                  </p>
                </div>

                <div className="text-center mb-6">
                  <h1 className="text-2xl font-bold text-gray-800">Forgot your password?</h1>
                  <p className="text-gray-600 mt-2">
                    Don't worry, enter either your email or phone number associated with your account below
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="text-center text-gray-600">
                  <p>- OR -</p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="Enter your phone number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgotPwPopup(true);
                      setTimeout(() => {
                        setShowForgotPwPopup(false);
                        setScreen('login');
                      }, 3000);
                    }}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
          
        ) : screen === 'menu' ? (
          <div>
            {/* Add logout button container */}
            <div className="flex justify-end mb-4">
              <button 
                onClick={() => setScreen('login')} 
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Log out
              </button>
            </div>
            
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
        ) : screen === 'edit' ? (
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
        ) : null}
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

      {screen === 'login' && showSuccessPopup && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50">
          Account created successfully!
        </div>
      )}

      {screen === 'forgot pw' && showForgotPwPopup && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded shadow-lg z-50">
          Recovery link has been sent to your email/phone!
        </div>
      )}
    </div>
  )
}