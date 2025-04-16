"use client";

import { VerificationLevel } from "@worldcoin/idkit-core";
import { verify } from "./actions/verify";
import { useState, useEffect } from "react";
import { ISuccessResult } from "@worldcoin/idkit-core";
import { IDKitWidget } from "@worldcoin/idkit";

export default function Home() {
  const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`;
  const action = process.env.NEXT_PUBLIC_WLD_ACTION;
  const [score, setScore] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [showSurprise, setShowSurprise] = useState(false);
  const [surpriseMessage, setSurpriseMessage] = useState('');
  const [surpriseTitle, setSurpriseTitle] = useState('');

  if (!app_id) {
    throw new Error("app_id is not set in environment variables!");
  }
  if (!action) {
    throw new Error("action is not set in environment variables!");
  }

  const handleSuccess = (result: ISuccessResult) => {
    setIsVerified(true);
  };

  const handleVerify = async (result: ISuccessResult) => {
    try {
      setIsVerifying(true);
      
      // Send to the backend for verification
      const data = await verify({
        nullifier_hash: result.nullifier_hash,
        merkle_root: result.merkle_root,
        proof: result.proof,
        verification_level: result.verification_level
      });
      
      if (data.success) {
        console.log("Verification successful");
      } else {
        console.error("Backend verification failed:", data.detail);
        throw new Error(data.detail);
      }
    } catch (error) {
      console.error("Verification error:", error);
      throw error;
    } finally {
      setIsVerifying(false);
    }
  };

  const showSurpriseMessage = (title: string, message: string) => {
    setSurpriseTitle(title);
    setSurpriseMessage(message);
    setShowSurprise(true);
    setTimeout(() => setShowSurprise(false), 5000);
  };

  const handleTap = () => {
    const newScore = score + 1;
    setScore(newScore);
    if (newScore === 314) {
      showSurpriseMessage(
        "🎉 Surprise! 🎉",
        "Fun fact: March 14 (3.14) is World ID's birthday! Thank you for being part of our community!"
      );
    } else if (newScore === 422) {
      showSurpriseMessage(
        "🌟 Special Achievement! 🌟",
        "Fun fact: April 22 is a very special day for someone who made World ID possible! Keep tapping to discover more!"
      );
    } else if (newScore === 721) {
      showSurpriseMessage(
        "🌍 World ID Milestone! 🌍",
        "Fun fact: July 21, 2023 marked a historic day when World ID 2.0 was launched, introducing privacy-preserving ZK proofs!"
      );
    } else if (newScore === 888) {
      showSurpriseMessage(
        "🎮 Lucky Number! 🎮",
        "888 is considered a super lucky number in many cultures. You're on a lucky streak! Keep tapping!"
      );
    } else if (newScore === 1000) {
      showSurpriseMessage(
        "🏆 Legendary Achievement! 🏆",
        "You've reached 1000 taps! You're now part of an elite group of dedicated tappers. What mysteries await beyond?"
      );
    } else if (newScore === 1024) {
      showSurpriseMessage(
        "🖥️ Binary Milestone! 🖥️",
        "1024 = 2¹⁰! You've reached a perfect binary number. As a coder's favorite, this number represents 1KB of data!"
      );
    } else if (newScore === 1337) {
      showSurpriseMessage(
        "🎯 LEET Achievement! 🎯",
        "1337! You've unlocked the legendary gamer score. Only elite players reach this milestone!"
      );
    } else if (newScore === 1969) {
      showSurpriseMessage(
        "🚀 Space Odyssey! 🚀",
        "1969 - The year humans first landed on the moon. Now you're reaching for the stars with your taps!"
      );
    } else if (newScore === 2048) {
      showSurpriseMessage(
        "🎲 Power Play! 🎲",
        "2048 = 2¹¹! Remember the addictive sliding tile game? You're just as persistent!"
      );
    } else if (newScore === 2140) {
      showSurpriseMessage(
        "₿ Crypto Easter Egg! ₿",
        "2140 is the year when the last Bitcoin will be mined. You've discovered a crypto-history milestone!"
      );
    } else if (newScore === 3000) {
      showSurpriseMessage(
        "👑 Royal Tapper! 👑",
        "3000 taps! You're not just playing anymore - you're making history! What secrets lie in the next thousand?"
      );
    } else if (newScore === 3141) {
      showSurpriseMessage(
        "🥧 Pi Master! 🥧",
        "3.141 - The first digits of π! You've achieved mathematical perfection in your tapping journey!"
      );
    }
  };

  if (!isVerified) {
    return (
      <div className="min-h-screen bg-white text-black">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-light tracking-tight mb-8">
              Verify Your Humanity
            </h1>
            <p className="text-gray-600 mb-8 max-w-md text-center">
              Please verify with World ID to access the tap game
            </p>
            
            <IDKitWidget
              app_id={app_id}
              action={action}
              onSuccess={handleSuccess}
              handleVerify={handleVerify}
              verification_level={VerificationLevel.Orb}
            >
              {({ open }) => (
                <button
                  onClick={open}
                  disabled={isVerifying}
                  className={`px-8 py-3 bg-black text-white font-light tracking-wide hover:bg-gray-900 transition-all duration-300 border border-black ${isVerifying ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isVerifying ? 'Verifying...' : 'Verify with World ID'}
                </button>
              )}
            </IDKitWidget>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center h-screen">
          <div className="text-4xl font-light tracking-tight mb-8">
            Score: {score}
          </div>
          
          <div 
            className={`w-64 h-64 bg-black rounded-full flex items-center justify-center cursor-pointer hover:scale-105 transition-transform duration-200 ${showSurprise ? 'animate-bounce' : ''}`}
            onClick={handleTap}
          >
            <span className="text-white text-2xl">Tap Me</span>
          </div>

          {showSurprise && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-8 rounded-lg max-w-md text-center transform animate-fade-in">
                <h2 className="text-2xl font-light mb-4">{surpriseTitle}</h2>
                <p className="text-gray-600">
                  {surpriseMessage}
                </p>
              </div>
            </div>
          )}

          <p className="text-gray-600 mt-8 text-center">
            Check back everyday, there may be some surprise!
          </p>
        </div>
      </div>
    </div>
  );
}
