"use client";

import { VerificationLevel, IDKitWidget, useIDKit } from "@worldcoin/idkit";
import type { ISuccessResult } from "@worldcoin/idkit";
import { verify } from "./actions/verify";
import { useState, useEffect } from "react";

export default function Home() {
  const app_id = process.env.NEXT_PUBLIC_WLD_APP_ID as `app_${string}`;
  const action = process.env.NEXT_PUBLIC_WLD_ACTION;
  const [taps, setTaps] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);

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

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setGameOver(true);
      if (taps > highScore) {
        setHighScore(taps);
      }
    }
    return () => clearInterval(timer);
  }, [gameStarted, timeLeft, taps, highScore]);

  const handleTap = () => {
    if (!gameStarted) {
      setGameStarted(true);
    }
    if (!gameOver) {
      setTaps((prev) => prev + 1);
    }
  };

  const resetGame = () => {
    setTaps(0);
    setTimeLeft(10);
    setGameStarted(false);
    setGameOver(false);
  };

  return (
    <div className="min-h-screen bg-white text-black">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-4xl font-light tracking-tight mb-8">
            Tap Challenge
          </h1>
          
          <div className="mb-8">
            <div className="text-6xl font-light mb-4">{taps}</div>
            <div className="text-gray-600 mb-4">
              {gameOver ? "Time's up!" : `Time left: ${timeLeft}s`}
            </div>
            <div className="text-gray-400 text-sm mb-4">
              High Score: {highScore}
            </div>
          </div>

          <div 
            className="w-64 h-64 mx-auto bg-black rounded-full flex items-center justify-center cursor-pointer mb-8"
            onClick={handleTap}
          >
            <span className="text-white text-2xl">
              {gameOver ? "Play Again" : "Tap!"}
            </span>
          </div>

          {gameOver && (
            <button
              onClick={resetGame}
              className="px-8 py-3 bg-black text-white font-light tracking-wide hover:bg-gray-900 transition-all duration-300 border border-black mb-8"
            >
              Reset Game
            </button>
          )}

          <div className="mt-12">
            <p className="text-gray-600 mb-4">
              Verify your humanity to save your score
            </p>
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
