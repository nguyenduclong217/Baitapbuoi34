import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";
import { Toaster, toast } from "sonner";

const OTP_LENGTH = 6;
const CORRECT_OTP = "123456";

export default function App() {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const inputsRef = useRef([]);

  const focusInput = (index) => {
    inputsRef.current[index]?.focus();
  };

  const resetOtp = () => {
    setOtp(Array(OTP_LENGTH).fill(""));
    setTimeout(() => focusInput(0), 0);
  };

  const shootConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
    });
  };

  const handleChange = (e, index) => {
    const value = e.target.value;

    if (value && !/^\d$/.test(value)) return;

    setOtp((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });

    if (value && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").trim().split("");

    if (pasted.length !== OTP_LENGTH) {
      toast.error("Mã OTP không hợp lệ");
      resetOtp();
      return;
    }

    setOtp(pasted);
  };

  useEffect(() => {
    focusInput(0);
  }, []);

  useEffect(() => {
    if (otp.includes("")) return;

    const enteredOtp = otp.join("");

    if (enteredOtp === CORRECT_OTP) {
      shootConfetti();
      toast.success("OTP chính xác");
    } else {
      toast.error("OTP chưa chính xác");
    }

    setTimeout(resetOtp, 1000);
  }, [otp]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-black">
      <Toaster position="top-right" />

      <div className="flex items-center gap-5">
        <div className="flex gap-2">
          {otp.slice(0, 3).map((value, index) => (
            <input
              key={index}
              type="text"
              maxLength={1}
              value={value}
              ref={(el) => (inputsRef.current[index] = el)}
              onChange={(e) => handleChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="border border-gray-500 w-20 h-40 text-center text-3xl text-white font-bold"
            />
          ))}
        </div>

        <div className="w-10 h-2 bg-gray-500 rounded-full"></div>

        <div className="flex gap-2">
          {otp.slice(3).map((value, index) => (
            <input
              key={index + 3}
              type="text"
              maxLength={1}
              value={value}
              ref={(el) => (inputsRef.current[index + 3] = el)}
              onChange={(e) => handleChange(e, index + 3)}
              onKeyDown={(e) => handleKeyDown(e, index + 3)}
              onPaste={handlePaste}
              className="border border-gray-500 w-20 h-40 text-center text-3xl text-white font-bold"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
