import React from 'react'
import { Container, Navbar } from '../comp'
import VerifyCode from '../comp/VerifyCode'

function Verify() {
  return (
   <div className="bg-slate-700">
      <div className="w-full min-h-screen">
        <Navbar />
        <Container>
            <VerifyCode />
        </Container>
      </div>
    </div>
  )
}

export default Verify