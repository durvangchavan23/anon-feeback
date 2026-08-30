"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";

function Provider({ children }: { children: React.ReactNode }) {
  return <SessionProvider refetchInterval={5 * 60}>{children}</SessionProvider>;
}

export default Provider;
