"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import LoginButton from "./LoginButton";

const Navbar = () => {
  const { data: session } = useSession();
  const [showProfile, setShowProfile] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Toggle profile dropdown visibility
  const toggleProfile = () => setShowProfile((prev) => !prev);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setShowProfile(false);
      }
    }

    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfile]);

  return (
    <div className="w-[98%] mx-auto flex items-center justify-between bg-white border-b py-4">
      {/* Left Section */}
    <div className="flex items-center">
  <Link
    href="/"
    className="ml-4 text-3xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-600 to-pink-500 hover:from-pink-500 hover:to-indigo-500 transition-all duration-500"
    aria-label="InkMind Home"
  >
    InkMind
  </Link>
</div>


      {/* Center Menu */}
      <div className="hidden lg:flex">
        <ul className="flex space-x-6 text-gray-800">
          <li className="hover:text-gray-600">
            <Link href="/">Home</Link>
          </li>
          <li className="hover:text-gray-600">
            <Link href="/writeBlog">Write Blog</Link>
          </li>
          <li className="hover:text-gray-600">
            <Link href="/posts">My Blogs</Link>
          </li>
        </ul>
      </div>

      {/* Right Section: Auth */}
      <div className="flex items-center space-x-4 relative" ref={profileRef}>
        {session?.user ? (
          <div onClick={toggleProfile} className="relative cursor-pointer">
            {session.user.image ? (
              <Image
                src={session.user.image}
                alt="Profile"
                className="w-8 h-8 rounded-full"
                width={32}
                height={32}
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-semibold text-lg select-none"
                title={session.user.name ?? undefined}
              >
                {session.user.name?.charAt(0).toUpperCase()}
              </div>
            )}

            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-300 rounded-md shadow-lg p-4 z-20">
                <p className="font-medium">{session.user.name}</p>
                <p className="text-xs text-gray-500 mb-4">{session.user.email}</p>
                <button
                  onClick={() => signOut()}
                  className="w-full border border-red-500 text-red-500 py-1 rounded-md hover:bg-red-500 hover:text-white transition duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <LoginButton />
        )}
      </div>
    </div>
  );
};

export default Navbar;
