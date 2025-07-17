import Image from "next/image";
import bgImg from "@/public/Neumontt.jpg";
import SideBar  from "@/componets/profile-side";

export default function ProfileDashboard() {
  return (
    <div className="flex h-screen w-full bg-zinc-950 text-white font-sans">
      
      {/* Sidebar */}
      <SideBar  />

      {/* Main Content */}
      <main className="justify-center items-center p-6 flex flex-col">
        <div className="flex flex-col items-center">
          <Image
            src={bgImg}
            alt="Profile Pic"
            width={150}
            height={150}
            className="rounded-full border-4 border-yellow-400 shadow-lg mb-4"
          />
          <h1 className="text-3xl font-bold text-yellow-400">John Doe</h1>
          <p className="text-zinc-400 mb-8">@johndoe | johndoe@example.com</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Left Block */}
          <div className="bg-zinc-800 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">📄 Profile Info</h2>
            <ul className="space-y-2 text-zinc-300">
              <li>Username: johndoe</li>
              <li>Email: johndoe@example.com</li>
              <li>Joined: Jan 2024</li>
              <li>Status: Active</li>
            </ul>
          </div>

          {/* Right Block */}
          <div className="bg-blue-600 p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">⚙️ Preferences</h2>
            <ul className="space-y-2 text-white">
              <li>Theme: Dark</li>
              <li>Language: English</li>
              <li>Notifications: Enabled</li>
              <li>Plan: Premium</li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
