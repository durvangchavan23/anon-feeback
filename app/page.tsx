import Image from "next/image";
import {Navbar, Footer} from "./comp/index"

export default function Home() {
  return (
    <div>
      <div className="min-h-screen">
        <Navbar />
        <div className="w-full max-w-7xl h-full border mx-auto">
          <h1 className="text-center font-bold">This is Home component</h1>
        </div>
      </div>
      <Footer />
    </div>
  );
}
