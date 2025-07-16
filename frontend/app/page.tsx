import Image from "next/image";
import bgImg from "@/public/Neumontt.jpg";

export default function Home() {
  return (
    <div className="flex h-screen w-full">
      {/* Left Panel - Form Side */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center bg-black text-white px-6">
        <div className="text-4xl font-bold mb-2 text-center">
          Neumont Marketplace
        </div>
        <div className="text-lg text-gold mb-8 text-center max-w-md">
          Buy, sell, and trade with other Neumont students — quick, easy, and trusted.
        </div>

        <form className="bg-white p-8 rounded-xl shadow-lg space-y-6 w-full max-w-md text-black">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>

        {/* OAuth Buttons */}
        <div className="flex space-x-4 mt-6">
          <button className="bg-white text-black px-4 py-2 rounded-md shadow hover:bg-gray-100 transition">
            Sign in with Google
          </button>
          <button className="bg-white text-black px-4 py-2 rounded-md shadow hover:bg-gray-100 transition">
            Sign in with Microsoft
          </button>
        </div>

        {/* Register Link */}
        <div className="mt-4 text-sm text-gray-400">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-400 hover:underline">
            Register
          </a>
        </div>
      </div>

      {/* Right Panel - Background Image */}
      <div className="relative w-1/2 hidden md:block filter grayscale">
        <Image
          src={bgImg}
          alt="Background"
          layout="fill"
          objectFit="cover"
          quality={100}
          priority
        />
      </div>
    </div>
  );
}
