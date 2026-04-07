import { useEffect, useState } from "react";

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const outTimer = setTimeout(() => setFadeOut(true), 2200);
    const doneTimer = setTimeout(() => onFinish(), 3200);
    return () => {
      clearTimeout(outTimer);
      clearTimeout(doneTimer);
    };
  }, [onFinish]);

  return (
    <>
      <style>{`
        @keyframes splashFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes splashFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }
        @keyframes bgPulse {
          0%   { background-color: #7f1d1d; }
          50%  { background-color: #991b1b; }
          100% { background-color: #7f1d1d; }
        }
        @keyframes whitePulse {
          0%   { transform: scale(0.5); opacity: 0.6; }
          70%  { transform: scale(2.8); opacity: 0; }
          100% { transform: scale(2.8); opacity: 0; }
        }
        @keyframes whitePulse2 {
          0%   { transform: scale(0.5); opacity: 0.4; }
          70%  { transform: scale(2.8); opacity: 0; }
          100% { transform: scale(2.8); opacity: 0; }
        }
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        style={{
          animation: fadeOut
            ? "splashFadeOut 1s ease-out forwards"
            : "splashFadeIn 0.9s ease-out forwards, bgPulse 1.8s ease-in-out infinite",
        }}
      >
        {/* Белые пульсирующие кольца */}
        <div
          className="absolute rounded-full"
          style={{
            width: 320,
            height: 320,
            border: "3px solid rgba(255,255,255,0.5)",
            animation: "whitePulse 1.8s ease-out infinite",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 320,
            height: 320,
            border: "2px solid rgba(255,255,255,0.3)",
            animation: "whitePulse2 1.8s ease-out 0.6s infinite",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            width: 320,
            height: 320,
            border: "2px solid rgba(255,255,255,0.2)",
            animation: "whitePulse2 1.8s ease-out 1.2s infinite",
          }}
        />

        <img
          src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/60314116-cc27-4f93-a0fa-5f807475ed8c.png"
          alt="ЦГБ Невский"
          className="relative z-10 w-full max-w-2xl object-contain px-8"
        />
      </div>
    </>
  );
}
