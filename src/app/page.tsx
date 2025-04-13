"use client";

import { VerificationLevel, IDKitWidget, useIDKit } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";
import { verify } from "./actions/verify";
import { useState } from "react";

export default function Home() {
  const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`;
  const action = process.env.NEXT_PUBLIC_WLD_ACTION;
  const [score, setScore] = useState(0);

  if (!app_id) {
    throw new Error("app_id is not set in environment variables!");
  }
  if (!action) {
    throw new Error("action is not set in environment variables!");
  }

  const { setOpen } = useIDKit();

  const onSuccess = (result: ISuccessResult) => {
    window.alert(
      "Successfully verified with World ID! Your nullifier hash is: " +
        result.nullifier_hash
    );
  };

  const handleProof = async (result: ISuccessResult) => {
    console.log("Proof received from IDKit, sending to backend:\n", JSON.stringify(result));
    const data = await verify(result);
    if (data.success) {
      console.log("Successful response from backend:\n", JSON.stringify(data));
    } else {
      throw new Error(`Verification failed: ${data.detail}`);
    }
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="text-4xl font-light tracking-tight mb-8">
            Score: {score}
          </div>
          
          <div 
            className="w-64 h-64 bg-black rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200"
            onClick={() => setScore(prev => prev + 1)}
          >
            <span className="text-white text-2xl">Tap Me</span>
          </div>

          <div className="mt-12">
            <button
              onClick={() => setOpen(true)}
              className="px-8 py-3 bg-black text-white font-light tracking-wide hover:bg-gray-900 transition-all duration-300 border border-black"
            >
              Verify with World ID
            </button>
          </div>
        </div>
      </div>

      <IDKitWidget
        action={action}
        app_id={app_id}
        onSuccess={onSuccess}
        handleVerify={handleProof}
        verification_level={VerificationLevel.Orb}
      />
    </div>
  );
}
