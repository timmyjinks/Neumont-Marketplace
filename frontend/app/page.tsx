import Image from "next/image";
import bgImg from "@/public/Neumontt.jpg";
import microsoft from "@/public/Microsoft.svg";
import discord from "@/public/discord.png";

export default function Home() {
  return (
    <div className="flex h-screen w-full bg-zinc-900 text-white">
      
      {/* Left Panel */}
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center px-6">
        
        {/* Title */}
        <div className="text-4xl font-bold mb-2 text-center text-[#fedc04]">
          Neumont Marketplace
        </div>

        {/* Description */}
        <div className="text-lg text-zinc-400 mb-8 text-center max-w-md">
          Buy, sell, and trade with other Neumont students — quick, easy, and trusted.
        </div>

        {/* Sign In Form */}
        <form className="bg-zinc-800 p-8 rounded-xl shadow-lg space-y-6 w-full max-w-md border border-zinc-700">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Username
            </label>
            <input
              type="text"
              name="username"
              className="block w-full rounded-md bg-zinc-900 border border-zinc-600 px-3 py-2 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#fedc04]"
              placeholder="Your username"
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

          <button
            type="submit"
            className="w-full bg-[#fedc04] text-black font-semibold py-2 px-4 rounded-md hover:bg-yellow-400 transition"
          >
            Sign In
          </button>
        </form>

        {/* OAuth Buttons */}
        <div className="flex flex-col md:flex-row items-center gap-4 mt-6 w-full max-w-md">
          <button className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md shadow hover:bg-zinc-600 transition flex items-center justify-center gap-2">
            <Image alt="Discord Logo" src={discord} width={24} height={24} />
            Sign in with Discord
          </button>
          <button className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md shadow hover:bg-zinc-600 transition flex items-center justify-center gap-2">
            <Image alt="Microsoft Logo" src={microsoft} width={22} height={22} />
            Sign in with Microsoft
          </button>
        </div>

        {/* Register */}
        <div className="mt-4 text-sm text-zinc-400">
          Don’t have an account?{" "}
          <a href="/register" className="text-[#fedc04] hover:underline">
            Register
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
=======

export default function Home() {
  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <ol className="font-mono list-inside list-decimal text-sm/6 text-center sm:text-left">
          <li className="mb-2 tracking-[-.01em]">
            Get started by editing{" "}
            <code className="bg-black/[.05] dark:bg-white/[.06] font-mono font-semibold px-1 py-0.5 rounded">
              app/page.tsx
            </code>
            .
          </li>
          <li className="tracking-[-.01em]">
            Save and see your changes instantly.
          </li>
        </ol>

        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={20}
              height={20}
            />
            Deploy now
          </a>
          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 w-full sm:w-auto md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
