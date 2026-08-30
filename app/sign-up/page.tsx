import React from "react";
import { Navbar, Container } from "../comp";
import Register from "../comp/Register";

function SignUp() {
  return (
    <div className="bg-slate-700">
      <div className="w-full min-h-screen">
        <Navbar />
        <Container>
          <Register />
        </Container>
      </div>
    </div>
  );
}

export default SignUp;
