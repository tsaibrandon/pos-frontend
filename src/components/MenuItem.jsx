export default function MenuItem({ item, addToCart }) {
    return (
      <div className="border p-2 flex flex-col h-full">
        {/* Image Section */}
        <div className="flex-grow">
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover"
          />
        </div>
  
        {/* Bottom Section */}
        <div className="flex justify-between items-center mt-2">
          {/* Title and Price */}
          <div>
            <h2 className="text-base font-medium">{item.title}</h2>
            <p className="text-sm">${item.price}</p>
          </div>
  
          {/* Add to Cart Button */}
          <button
            onClick={() => addToCart(item)}
            className="px-2 py-1 bg-blue-500 text-white rounded"
          >
            Add to Cart
          </button>
        </div>
      </div>
    )
  }