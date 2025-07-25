import Image from "next/image";
import bgImg from "@/public/Neumontt.jpg";
import { signOut } from "@/lib/auth-actions";


export default function ProfileSide() {
    return (
        <aside className="w-64 bg-zinc-900 flex flex-col justify-between p-6 shadow-lg">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4 mb-10">
            <Image
              src={bgImg}
              alt="User"
              width={40}
              height={40}
              className="rounded-full border-2 border-yellow-400"
            />
            <div>
              <h2 className="text-lg font-bold">John Doe</h2>
              <p className="text-sm text-zinc-400">@johnd</p>
            </div>
          </div>

          <nav className="space-y-4 text-zinc-300 flex flex-col space-y-5">
            <button className="hover:text-yellow-400">👤 Profile</button>
            <button className="hover:text-yellow-400">💬 Messages</button>
            <button className="hover:text-yellow-400">👥 Users</button>
          </nav>
        </div>

        <div className="space-y-4 text-zinc-400">
          <button onClick={signOut} className="hover:text-red-500">🚪 Logout</button>
          <button className="hover:text-yellow-400">⚙️ Settings</button>
        </div>
      </aside>
    )
}
