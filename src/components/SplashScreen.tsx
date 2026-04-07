import { useEffect, useState, useRef } from "react";

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const [fadeOut, setFadeOut] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const offsetRef = useRef(0);
  const pulseRef = useRef(0); // 0..1 intensity of current beat flash
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const outTimer = setTimeout(() => setFadeOut(true), 2200);
    const doneTimer = setTimeout(() => onFinish(), 3200);
    return () => {
      clearTimeout(outTimer);
      clearTimeout(doneTimer);
    };
  }, [onFinish]);

  // Audio + bg pulse trigger
  useEffect(() => {
    const AudioCtx = window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const actx = new AudioCtx();

    const triggerBgPulse = () => {
      pulseRef.current = 1;
    };

    const playBeat = (time: number) => {
      const lub = actx.createOscillator();
      const lubGain = actx.createGain();
      lub.type = "sine";
      lub.frequency.setValueAtTime(80, time);
      lub.frequency.exponentialRampToValueAtTime(40, time + 0.08);
      lubGain.gain.setValueAtTime(0.6, time);
      lubGain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
      lub.connect(lubGain);
      lubGain.connect(actx.destination);
      lub.start(time);
      lub.stop(time + 0.15);

      const dub = actx.createOscillator();
      const dubGain = actx.createGain();
      dub.type = "sine";
      dub.frequency.setValueAtTime(70, time + 0.18);
      dub.frequency.exponentialRampToValueAtTime(35, time + 0.26);
      dubGain.gain.setValueAtTime(0.4, time + 0.18);
      dubGain.gain.exponentialRampToValueAtTime(0.001, time + 0.30);
      dub.connect(dubGain);
      dubGain.connect(actx.destination);
      dub.start(time + 0.18);
      dub.stop(time + 0.32);
    };

    const beat1 = actx.currentTime + 0.3;
    const beat2 = actx.currentTime + 1.25;
    playBeat(beat1);
    playBeat(beat2);

    const t1 = setTimeout(triggerBgPulse, 300);
    const t2 = setTimeout(triggerBgPulse, 1250);

    return () => {
      actx.close();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Canvas ECG — only bottom strip
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = 100;
    };
    resize();
    window.addEventListener("resize", resize);

    // ECG beat points: x 0..1, y in px (0 = baseline)
    const beatPoints = [
      [0, 0], [0.12, 0], [0.18, 0],
      [0.21, -38], [0.25, 55], [0.29, -22], [0.33, 0],
      [0.42, 0], [1.0, 0],
    ];
    const BEAT_W = 280;
    const SPEED = 2.2;

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const cy = H / 2;

      // Decay pulse brightness
      pulseRef.current *= 0.94;
      const neon = Math.min(1, pulseRef.current);

      // Neon glow layers
      const glowLayers = [
        { blur: 18, alpha: 0.18 + neon * 0.3, width: 8 },
        { blur: 8,  alpha: 0.35 + neon * 0.4, width: 4 },
        { blur: 2,  alpha: 0.85 + neon * 0.15, width: 1.5 },
      ];

      glowLayers.forEach(({ blur, alpha, width }) => {
        ctx.save();
        ctx.shadowBlur = blur;
        ctx.shadowColor = `rgba(255,255,255,${alpha})`;
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.lineWidth = width;
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.beginPath();

        const totalBeats = Math.ceil(W / BEAT_W) + 2;
        let first = true;
        for (let b = -1; b < totalBeats; b++) {
          for (let i = 0; i < beatPoints.length; i++) {
            const [tx, ty] = beatPoints[i];
            const x = b * BEAT_W + tx * BEAT_W - (offsetRef.current % BEAT_W);
            const y = cy + ty;
            if (first) { ctx.moveTo(x, y); first = false; }
            else ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
        ctx.restore();
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
      `}</style>

      <div
        ref={bgRef}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
        style={{
          backgroundColor: "#7f1d1d",
          animation: fadeOut
            ? "splashFadeOut 1s ease-out forwards"
            : "splashFadeIn 0.9s ease-out forwards",
        }}
      >
        {/* BG pulse overlay — flashes on beat */}
        <BgPulse pulseRef={pulseRef} />

        <img
          src="https://cdn.poehali.dev/projects/e2f7351e-e666-4647-88af-b4a6ed42363d/bucket/60314116-cc27-4f93-a0fa-5f807475ed8c.png"
          alt="ЦГБ Невский"
          className="relative z-10 w-full max-w-2xl object-contain px-8"
        />

        {/* ECG strip below logo */}
        <div className="relative z-10 w-full" style={{ height: 100, marginTop: 8 }}>
          <canvas ref={canvasRef} style={{ width: "100%", height: 100 }} />
        </div>
      </div>
    </>
  );
}

// Separate component to animate bg flash via rAF without re-rendering parent
function BgPulse({ pulseRef }: { pulseRef: React.MutableRefObject<number> }) {
  const divRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const tick = () => {
      if (divRef.current) {
        const v = Math.round(pulseRef.current * 30);
        divRef.current.style.opacity = String(pulseRef.current * 0.55);
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [pulseRef]);

  return (
    <div
      ref={divRef}
      className="absolute inset-0 pointer-events-none"
      style={{ backgroundColor: "#ef4444", opacity: 0 }}
    />
  );
}
