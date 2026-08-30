"use client";
import React from "react";
import { Container, Footer, Login, Navbar } from "../comp";

function SignIn() {
  return (
    <div className="bg-slate-700">
      <div className="w-full min-h-screen">
        <Navbar />
        <Container>
          <Login />
        </Container>
      </div>
      <Footer />
    </div>
  );
}

export default SignIn;
