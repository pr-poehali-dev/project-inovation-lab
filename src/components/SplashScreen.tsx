import { useEffect, useState, useRef } from "react";

interface SplashScreenProps {
  onFinish: () => void;
}

// ECG path: flat line → spike → flat
// Repeating pattern for animation
const ECG_SEGMENT = "M0,50 L60,50 L70,50 L80,10 L90,90 L100,30 L110,50 L120,50 L180,50";
const ECG_WIDTH = 180;

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const offsetRef = useRef(0);

  useEffect(() => {
    const outTimer = setTimeout(() => setFadeOut(true), 2200);
    const doneTimer = setTimeout(() => onFinish(), 3200);
    return () => {
      clearTimeout(outTimer);
      clearTimeout(doneTimer);
    };
  }, [onFinish]);

  useEffect(() => {
    const AudioCtx = window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    const playBeat = (time: number) => {
      // "lub" — первый удар
      const lub = ctx.createOscillator();
      const lubGain = ctx.createGain();
      lub.type = "sine";
      lub.frequency.setValueAtTime(80, time);
      lub.frequency.exponentialRampToValueAtTime(40, time + 0.08);
      lubGain.gain.setValueAtTime(0.6, time);
      lubGain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
      lub.connect(lubGain);
      lubGain.connect(ctx.destination);
      lub.start(time);
      lub.stop(time + 0.15);

      // "dub" — второй удар (чуть тише, через 0.18 сек)
      const dub = ctx.createOscillator();
      const dubGain = ctx.createGain();
      dub.type = "sine";
      dub.frequency.setValueAtTime(70, time + 0.18);
      dub.frequency.exponentialRampToValueAtTime(35, time + 0.26);
      dubGain.gain.setValueAtTime(0.4, time + 0.18);
      dubGain.gain.exponentialRampToValueAtTime(0.001, time + 0.30);
      dub.connect(dubGain);
      dubGain.connect(ctx.destination);
      dub.start(time + 0.18);
      dub.stop(time + 0.32);
    };

    // Два удара за время сплеша (~2.2 сек)
    playBeat(ctx.currentTime + 0.3);
    playBeat(ctx.currentTime + 1.25);

    return () => { ctx.close(); };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // ECG points per one beat cycle (relative, 0–1 x, y in px from center)
    const beatPoints = [
      [0, 0], [0.15, 0], [0.2, 0], [0.22, -60], [0.25, 80],
      [0.28, -30], [0.32, 0], [0.38, 0], [1.0, 0],
    ];

    const BEAT_W = 300; // px per beat
    const LINE_Y_OFFSET = 0; // center vertically
    const SPEED = 2.5;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const cy = H / 2 + LINE_Y_OFFSET;

      // Draw two ECG lines (top and bottom of logo)
      [-130, 130].forEach((yShift) => {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(255,255,255,0.25)";
        ctx.lineWidth = 2;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";

        // Render enough beats to fill screen
        const totalBeats = Math.ceil(W / BEAT_W) + 2;
        let first = true;

        for (let b = -1; b < totalBeats; b++) {
          for (let i = 0; i < beatPoints.length; i++) {
            const [tx, ty] = beatPoints[i];
            const x = b * BEAT_W + tx * BEAT_W - (offsetRef.current % BEAT_W);
            const y = cy + yShift + ty;
            if (first) { ctx.moveTo(x, y); first = false; }
            else ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        // Bright "active" head — glowing dot moving along
        const headX = (W * 0.62) - (offsetRef.current % BEAT_W) + BEAT_W;
        // Find y at headX position within beat
        const posInBeat = ((headX + offsetRef.current) % BEAT_W) / BEAT_W;
        let headY = cy + yShift;
        for (let i = 0; i < beatPoints.length - 1; i++) {
          const [x0, y0] = beatPoints[i];
          const [x1, y1] = beatPoints[i + 1];
          if (posInBeat >= x0 && posInBeat <= x1) {
            const t = (posInBeat - x0) / (x1 - x0);
            headY = cy + yShift + y0 + (y1 - y0) * t;
            break;
          }
        }

        // Glow trail
        const grad = ctx.createRadialGradient(headX, headY, 0, headX, headY, 18);
        grad.addColorStop(0, "rgba(255,255,255,0.9)");
        grad.addColorStop(1, "rgba(255,255,255,0)");
        ctx.beginPath();
        ctx.arc(headX, headY, 18, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();
      });

      offsetRef.current += SPEED;
      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

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
      `}</style>

      <div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
        style={{
          animation: fadeOut
            ? "splashFadeOut 1s ease-out forwards"
            : "splashFadeIn 0.9s ease-out forwards, bgPulse 1.8s ease-in-out infinite",
        }}
      >
        <canvas ref={canvasRef} className="absolute inset-0" />

        <img
          src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/60314116-cc27-4f93-a0fa-5f807475ed8c.png"
          alt="ЦГБ Невский"
          className="relative z-10 w-full max-w-2xl object-contain px-8"
        />
      </div>
    </>
  );
}