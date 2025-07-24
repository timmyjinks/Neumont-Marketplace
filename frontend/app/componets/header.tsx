export default function Header() {
    return (
      <header className="bg-zinc-900 text-white px-6 py-4 shadow-md border-b border-zinc-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-[#fedc04]">
            Neumont Marketplace
          </h1>
          <p className="text-sm text-zinc-400 hidden md:block">
            Buy, sell, and thrive with your campus crew
          </p>
        </div>
      </header>
    );
  }
  