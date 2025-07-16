import Image from "next/image";
import bgImg from "@/public/Neumontt.jpg";
import microsoft from "@/public/Microsoft.svg";
import discord from "@/public/discord.png";

export default function Register() {
  return (
    <div className="flex h-screen w-full bg-zinc-900 text-white">
      {/* Left Panel */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6">
        
        {/* Title */}
        <div className="text-4xl font-bold mb-2 text-center text-[#fedc04]">
          Join the Marketplace
        </div>

        {/* Description */}
        <div className="text-lg text-zinc-400 mb-8 text-center max-w-md">
          Register to buy, sell, and connect with Neumont students—secure and simple.
        </div>

        {/* Register Form */}
        <form className="bg-zinc-800 p-8 rounded-xl shadow-lg space-y-6 w-full max-w-md border border-zinc-700">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="block w-full rounded-md bg-zinc-900 border border-zinc-600 px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#fedc04]"
              placeholder="you@neumont.edu"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              className="block w-full rounded-md bg-zinc-900 border border-zinc-600 px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#fedc04]"
              placeholder="your_username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="block w-full rounded-md bg-zinc-900 border border-zinc-600 px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#fedc04]"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              className="block w-full rounded-md bg-zinc-900 border border-zinc-600 px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#fedc04]"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#fedc04] text-black font-semibold py-2 px-4 rounded-md hover:bg-yellow-400 transition"
          >
            Create Account
          </button>
        </form>

        {/* OAuth Buttons */}
        <div className="flex flex-col md:flex-row items-center gap-4 mt-6 w-full max-w-md">
          <button className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md shadow hover:bg-zinc-600 transition flex items-center justify-center gap-2">
            <Image alt="Discord Logo" src={discord} width={24} height={24} />
            Register with Discord
          </button>
          <button className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md shadow hover:bg-zinc-600 transition flex items-center justify-center gap-2">
            <Image alt="Microsoft Logo" src={microsoft} width={22} height={22} />
            Register with Microsoft
          </button>
        </div>

        {/* Login Link */}
        <div className="mt-4 text-sm text-zinc-400">
          Already got an account?{" "}
          <a href="/" className="text-[#fedc04] hover:underline">
            Sign In
          </a>
        </div>
      </div>

      {/* Right Panel */}
      <div className="relative w-1/2 hidden md:block grayscale contrast-125 brightness-90">
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
