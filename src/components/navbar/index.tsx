import Image from "next/image";
import Link from "next/link";

export const Navbar = () => {
  const links = [{ link: "/submeter-faturas", text: "Submeter Faturas" }];
  return (
    <nav className="flex items-center justify-between w-full p-4 shadow-sm">
      {/* Mock Logo */}
      <Link href="/">
        <Image
          alt="gesbook-logo"
          src="/gestbook-logo.png"
          width={50}
          height={50}
        />
      </Link>

      {/* Links */}
      <div className="flex space-x-4">
        {links.map((link, index) => {
          return (
            <Link
              key={index}
              href={link.link}
              className="text-gray-700 hover:text-gray-900 transition hover:cursor-pointer"
            >
              {link.text}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
