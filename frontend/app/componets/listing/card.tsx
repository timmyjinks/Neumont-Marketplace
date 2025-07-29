type CardProps = {
  image_url: string;
  category: string;
  payment_methods: string[];
  description: string;
  price: Number;
  onDelete?: ((id: string) => void | null )| null;
  onMessage?: (id: string) => void;
  id: string;
};

export default function Card({
  image_url,
  category,
  description,
  payment_methods,
  price,
  onDelete,
  onMessage,
  id,
}: CardProps) {
  return (
    <div className="flex flex-col w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 shadow-md transition hover:shadow-yellow-500/20">
      {/* Top Label */}
      <div className="flex justify-between items-center px-4 py-2 bg-zinc-800 border-b border-zinc-700">
        <h2 className="text-sm font-semibold text-white">Category</h2>
        <span className="text-xs text-[#fedc04] font-medium">{category}</span>
      </div>

      {/* Image */}
      <div className="w-full h-48 sm:h-56 md:h-64 overflow-hidden">
        <img
          src={image_url}
          alt={`Image for ${category}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Payment Method */}
      <div className="flex justify-between items-center px-4 py-2 bg-zinc-800 border-b border-zinc-700">
        <h2 className="text-sm font-semibold text-white">Payment Methods</h2>
        <div className="flex gap-2">
          {payment_methods?.map((method, i) => (
            <span key={i} className="text-xs text-[#fedc04] font-medium">
              {method}
            </span>
          ))}
        </div>
      </div>

      {/* Price */}
      <div className="flex justify-between items-center px-4 py-2 bg-zinc-800 border-b border-zinc-700">
        <h2 className="text-sm font-semibold text-white">Price</h2>
        <span className="text-xs text-[#fedc04] font-medium">{price}</span>
      </div>

      {/* Description */}
      <div className="p-4 bg-zinc-800 border-t border-zinc-700 text-sm text-zinc-300">
        {description}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 p-4 bg-zinc-900">
        {onDelete && (
          <button
            onClick={() => onDelete(id)}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Delete
          </button>
        )}
        {onMessage && (
          <button
            onClick={() => onMessage(id)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
          >
            Message User
          </button>
        )}
      </div>
    </div>
  );
}
