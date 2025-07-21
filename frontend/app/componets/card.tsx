type CardProps = {
    src: string;
    category: string;
    description: string;
};

export default function Card({src, category, description}: CardProps) {
    return (
        <div className="flex flex-col items-center">
            <div className="flex flex-row justify-center items-center space-x-3 bg-gray-900 w-56 rounded-t-xl">
                <h2 className="text-lg font-bold">Category:</h2>
                <p className="text-sm text-zinc-400">{category}</p>
            </div>
            <div className="w-64 h-64 bg-zinc-900 flex flex-col justify-between p-3 shadow-lg rounded-2xl">
                <img 
                src={src}
                alt="Item image"
                className="w-full h-full object-cover rounded-lg"
                />
            </div>
            <div className="flex flex-row justify-center items-center space-x-3 bg-gray-900 w-56 rounded-b-xl">
                <p className="text-sm text-zinc-400 p-2">{description}</p>
            </div>
        </div>

      );
}