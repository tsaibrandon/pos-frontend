import { useState } from 'react'

export default function MenuItem({ item, addToCart, isEditMode, onDelete, onEdit }) {
    const [isHovered, setIsHovered] = useState(false)

    const handleMouseEnter = () => {
      setIsHovered(true)
    }

    const handleMouseLeave = () => {
      setIsHovered(false)
    }
  
    // Format price to always show 2 decimal places
    const formatPrice = (price) => {
      return Number(price).toFixed(2)
    }
  
    return (
      <div 
        className="border p-2 flex flex-col h-full relative"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
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
            <p className="text-sm">${formatPrice(item.price)}</p>
          </div>
  
          {/* Add to Cart Button */}
          <button
            onClick={() => addToCart(item)}
            className="px-2 py-1 bg-blue-500 text-white rounded"
          >
            Add to Cart
          </button>
        </div>

        {/* Hover State when editing */}
        {isEditMode && isHovered && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black bg-opacity-50">
            <button 
              onClick={() => onEdit(item)}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg w-24 hover:bg-gray-600 transition-colors"
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete(item.id)}
              className="px-4 py-2 bg-red-500 text-white rounded-lg w-24 hover:bg-red-600 transition-colors"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    )
  }