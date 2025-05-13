export default function CartItem({ item, removeFromCart }) {
    const formatPrice = (price) => {
      return Number(price).toFixed(2)
    }

    return (
      <div className="flex justify-between border-b py-1">
        {/* Item in Cart */}
        <span>{item.title}</span>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          {/* Price */}
          <span>${formatPrice(item.price)}</span> 
          
          {/* Remove From Cart Button */}
          <button 
            onClick={removeFromCart} 
            className = "px-2 py-1 bg-red-500 text-white rounded text-sm"
          >
            Remove
          </button>
        </div>
      </div>
    )
  }