type CardProps = {
  src: string;
  category: string;
  description: string;
};

export default function Card({ src, category, description }: CardProps) {
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
          src={src}
          alt={`Image for ${category}`}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 ease-in-out"
        />
      </div>

      {/* Description */}
      <div className="p-4 bg-zinc-800 border-t border-zinc-700 text-sm text-zinc-300">
        {description}
      </div>
    </div>
  );
}
