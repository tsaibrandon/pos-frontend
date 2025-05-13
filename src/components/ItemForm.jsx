import { useState, useEffect } from 'react'

function AddItemForm({ isOpen, onClose, onSave, itemToEdit = null }) {
  const [itemName, setItemName] = useState('')
  const [itemPrice, setItemPrice] = useState('')
  const [itemDescription, setItemDescription] = useState('')
  const [itemImage, setItemImage] = useState('')

  // Populate form when editing an existing item
  useEffect(() => {
    if (itemToEdit) {
      setItemName(itemToEdit.title || '')
      setItemPrice(itemToEdit.price?.toString() || '')
      setItemDescription(itemToEdit.description || '')
      setItemImage(itemToEdit.image || '')
    }
  }, [itemToEdit])

  const handleSubmit = (e) => {
    e.preventDefault() 
    
    const updatedItem = {
        id: itemToEdit?.id, // Keep the original ID if editing
        title: itemName,
        price: parseFloat(itemPrice), 
        description: itemDescription,
        image: itemImage
    }

    onSave(updatedItem)
    clearForm()
    onClose()
  }

  const clearForm = () => {
    setItemName('')
    setItemPrice('')
    setItemDescription('')
    setItemImage('')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {itemToEdit ? 'Edit Menu Item' : 'Add New Menu Item'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-2">Menu Item:</label>
            <input
              type="text"
              placeholder="Enter item name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Price:</label>
            <input
              type="number"
              step="0.01"
              placeholder="Enter price"
              value={itemPrice}
              onChange={(e) => setItemPrice(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Description:</label>
            <textarea
              placeholder="Enter description"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              className="w-full p-2 border rounded"
              rows="3"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Image URL:</label>
            <input
              type="text"
              placeholder="Enter image URL"
              value={itemImage}
              onChange={(e) => setItemImage(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                onClose()
                clearForm()
              }}
              className="px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddItemForm
