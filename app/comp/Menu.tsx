"use client";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";

function Menu({ setMenu }: any) {
  const { data: session } = useSession();
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
    <div className="bg-white px-2 py-2 w-35 absolute sm:hidden flex flex-col items-center right-5 top-3 rounded-lg space-y-2 border-2 border-gray-200 duration-200">
      <button
        className="px-3 py-1 rounded-lg cursor-pointer hover:bg-gray-300 duration-200 border border-gray-300 text-slate-500 font-bold relative left-8 mb-3"
        onClick={() => setMenu(false)}
      >
        X
      </button>

      {navItems?.map((item) =>
        item.active ? (
          <button
            key={item.name}
            className="w-full px-3 py-1 rounded-lg cursor-pointer bg-gray-300 text-slate-500 font-bold hover:bg-gray-100"
            onClick={() => {
              router.replace(item.slug);
              setMenu(false);
            }}
          >
            {item.name}
          </button>
        ) : null,
      )}
      {session && (
        <button
          className="w-full px-3 py-1 rounded-lg cursor-pointer bg-gray-300 text-slate-500 font-bold hover:bg-gray-100"
          onClick={() => signOut()}
        >
          Logout
        </button>
      )}
    </div>
  );
}

export default Menu;
