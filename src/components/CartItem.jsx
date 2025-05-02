export default function CartItem({ item }) {
    return (
      <div className="flex justify-between border-b py-1">
        <span>{item.title}</span>
        <span>${item.price}</span>
      </div>
    )
  }