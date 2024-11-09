export default function Footer() {
  return (
    <footer className="bg-white shadow-sm mt-auto">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Silentberry Noise. All rights reserved.
        </p>
        <div className="flex justify-center mt-4">
          <a
            href="https://t.me/SilentberryNoise"
            className="text-blue-600 hover:text-blue-800 mx-2 flex items-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/telegram-icon.svg"
              alt="Telegram"
              className="h-5 w-5 mr-2"
            />
            Telegram
          </a>
          <a
            href="https://discord.gg/xaRPsgwefA"
            className="text-blue-600 hover:text-blue-800 mx-2 flex items-center"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="/discord-icon.svg"
              alt="Discord"
              className="h-5 w-5 mr-2"
            />
            Discord
          </a>
        </div>
      </div>
    </footer>
  );
}
