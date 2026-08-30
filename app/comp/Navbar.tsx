"use client";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import Menu from "./Menu";
import { useRouter } from "next/navigation";

function Navbar() {
  const { data: session } = useSession();
  const [menu, setMenu] = useState(false);
  const authStatus = !!session;
  const router = useRouter();

  const navItems = [
    {
      name: "Login",
      slug: "/sign-in",
      active: !authStatus,
    },
    {
      name: "Sign Up",
      slug: "/sign-up",
      active: !authStatus,
    },
    {
      name: "Dashboard",
      slug: "/Dashboard",
      active: authStatus,
    },
  ];

  return (
    <div className="w-full bg-slate-800 sticky top-0">
      <div className="w-full max-w-7xl py-3 mx-auto flex justify-around items-center relative">
        <div>
          <h1 className="text-2xl font-bold text-white">Anon Feedback</h1>
        </div>
        <div>
          <button
            className="sm:hidden bg-white text-slate-600 px-3 py-1 rounded-lg cursor-pointer hover:bg-gray-200 duration-200"
            onClick={() => setMenu(true)}
          >
            ☰
          </button>

          {menu && <Menu setMenu={setMenu} />}
          <div className="hidden sm:flex space-x-3 ">
            {navItems?.map((item) =>
              item.active ? (
                <button
                  key={item.name}
                  className="px-3 py-1 rounded-lg cursor-pointer bg-gray-300 text-slate-500 font-bold hover:bg-gray-100"
                  onClick={() => router.replace(item.slug)}
                >
                  {item.name}
                </button>
              ) : null,
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
