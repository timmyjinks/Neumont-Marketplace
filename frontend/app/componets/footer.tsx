export default function Footer() {
    return (
      <footer className="bg-zinc-900 border-t border-zinc-800 text-center py-4">
        <p className="text-sm text-zinc-500">
          &copy; {new Date().getFullYear()} Neumont Marketplace. All rights reserved.
        </p>
      </footer>
    );
  }
  