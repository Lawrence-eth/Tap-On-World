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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
            Verify Your Humanity
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8">
            Access the Chainlink Learning Course
          </p>
          
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-8 mb-8">
            <p className="text-gray-300 mb-6">
              To ensure a fair learning environment and prevent abuse, we require human verification.
              This helps us maintain the quality of our educational resources.
            </p>
            
            <div className="flex justify-center">
              <button
                onClick={() => setOpen(true)}
                className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Verify with World ID
              </button>
            </div>
          </div>

          <div className="text-gray-400 text-sm">
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
