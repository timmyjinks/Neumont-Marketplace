type CardProps = {
  image_url: string;
  category: string;
  payment_methods: string[];
  description: string;
  onDelete: (id: string) => void;
  id: string;
};

export default function Card({ image_url, category, description, payment_methods, onDelete, id }: CardProps) {
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
        {payment_methods !== null && (
          payment_methods.map((method, i) => (
            <span key={i} className="text-xs text-[#fedc04] font-medium">{method}</span>
          ))
        )}
      </div>

      {/* Description */}
      <div className="p-4 bg-zinc-800 border-t border-zinc-700 text-sm text-zinc-300">
        {description}
      </div>
      <button onClick={() => onDelete(id)} className="bg-red-500 text-white px-4 py-2 rounded-md">Delete</button>
    </div>
  );
} 