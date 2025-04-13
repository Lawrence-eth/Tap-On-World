"use client";

import { VerificationLevel, IDKitWidget, useIDKit } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";
import { verify } from "./actions/verify";

export default function Home() {
  const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`;
  const action = process.env.NEXT_PUBLIC_WLD_ACTION;

  if (!app_id) {
    throw new Error("app_id is not set in environment variables!");
  }
  if (!action) {
    throw new Error("action is not set in environment variables!");
  }

  const { setOpen } = useIDKit();

  const onSuccess = (result: ISuccessResult) => {
    window.location.href = "https://learn-chainlink-on-world.vercel.app/";
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
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-16">
            <h1 className="text-5xl md:text-7xl font-light tracking-tight mb-6">
              Verify Your Humanity
            </h1>
            <div className="w-24 h-1 bg-black mx-auto mb-8"></div>
            <p className="text-xl text-gray-600 font-light">
              Access the Chainlink Learning Course
            </p>
          </div>
          
          <div className="mb-16">
            <p className="text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
              To ensure a fair learning environment and prevent abuse, we require human verification.
              This helps us maintain the quality of our educational resources.
            </p>
            
            <button
              onClick={() => setOpen(true)}
              className="px-12 py-4 bg-black text-white font-light tracking-wide hover:bg-gray-900 transition-all duration-300 border border-black"
            >
              Verify with World ID
            </button>
          </div>

          <div className="text-gray-400 text-sm tracking-wide">
            <p>Powered by World ID • Secure and Privacy-Preserving</p>
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
