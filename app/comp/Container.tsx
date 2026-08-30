import React from "react";

function Container({ children }: { children: React.ReactNode }) {
  return <div className="w-full h-full max-w-7xl px-3 py-4 mx-auto">{children}</div>;
}

export default Container;
