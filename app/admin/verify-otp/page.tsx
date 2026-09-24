"use client";

// import { Auth } from "aws-amplify";

// const confirmOTP = async (email, code) => {
//   await Auth.confirmSignUp(email, code);
// };


import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VerifyEmail() {

  const router = useRouter();

  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");

  // localStorage is only available in the browser; read it in an effect
  useEffect(() => {
    const stored = localStorage.getItem("signupEmail");
    if (stored) setEmail(stored);
  }, []);

  const verify = async () => {

    const res = await fetch("/api/admin/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, code })
    });

    const data = await res.json();

    if(res.ok){
      alert("Email verified");
      router.push("/admin/login");
    }
    else{
      alert(data.error);
    }

  };

  return (
    <div>

      <h2>Enter OTP</h2>

      <input
        value={code}
        onChange={(e)=>setCode(e.target.value)}
        placeholder="Enter OTP"
      />

      <button onClick={verify}>
        Verify
      </button>

    </div>
  );
}