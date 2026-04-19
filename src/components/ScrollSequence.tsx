import { useEffect, useRef, useState } from "react";
import { useScroll, motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const FRAME_COUNT = 240;
const FRAMES = Array.from(
  { length: FRAME_COUNT },
  (_, i) => `/sequence/frame_${i}_delay-0.04s.webp`
);

const BG = "#000000";

const STEPS = [
  {
    label: "ProMedias · Liège",
    title: "Votre appareil.",
    accent: "Réinventé.",
    body: "Une expertise forgée sur 10 ans de réparations, du smartphone haut de gamme à la carte mère complexe.",
    frameRange: [0, 59] as [number, number],
  },
  {
    label: "Expertise Technique",
    title: "Chaque composant.",
    accent: "Parfaitement maîtrisé.",
    body: "Démontage méthodique, diagnostic circuit par circuit. Rien n'est laissé au hasard.",
    frameRange: [60, 119] as [number, number],
  },
  {
    label: "Micro-Soudure BGA",
    title: "Là où d'autres",
    accent: "renoncent.",
    body: "Carte mère, connecteurs, puces — nous intervenons au niveau du composant avec du matériel de précision.",
    frameRange: [120, 179] as [number, number],
  },
  {
    label: "Diagnostic Gratuit",
    title: "Prêt à redonner vie",
    accent: "à votre appareil ?",
    body: "Passez sans rendez-vous au 141 Rue St-Léonard, Liège. Devis transparent sous 24h.",
    frameRange: [180, 239] as [number, number],
    cta: true,
  },
];

export function ScrollSequence() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const loadedCountRef = useRef(0);

  const [loadProgress, setLoadProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // --- Canvas draw ---
  const drawFrame = (index: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const cw = canvas.width;
    const ch = canvas.height;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.min(cw / iw, ch / ih) * 1.2;
    const x = (cw - iw * scale) / 2;
    const y = (ch - ih * scale) / 2;
    ctx.clearRect(0, 0, cw, ch);
    ctx.drawImage(img, x, y, iw * scale, ih * scale);
  };

  const scheduleFrame = (index: number) => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      drawFrame(index);
      rafRef.current = null;
    });
  };

  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    drawFrame(currentFrameRef.current);
  };

  // Preload
  useEffect(() => {
    const images: (HTMLImageElement | null)[] = new Array(FRAME_COUNT).fill(null);
    imagesRef.current = images;

    FRAMES.forEach((src, i) => {
      const img = new Image();
      img.onload = () => {
        images[i] = img;
        loadedCountRef.current++;
        setLoadProgress(loadedCountRef.current / FRAME_COUNT);
        if (i === 0) { currentFrameRef.current = 0; scheduleFrame(0); }
        if (loadedCountRef.current === FRAME_COUNT) setIsReady(true);
      };
      img.onerror = () => {
        loadedCountRef.current++;
        if (loadedCountRef.current === FRAME_COUNT) setIsReady(true);
      };
      img.src = src;
    });

    return () => { if (rafRef.current !== null) cancelAnimationFrame(rafRef.current); };
  }, []);

  // Resize
  useEffect(() => {
    const id = requestAnimationFrame(resizeCanvas);
    window.addEventListener("resize", resizeCanvas);
    return () => { cancelAnimationFrame(id); window.removeEventListener("resize", resizeCanvas); };
  }, []);

  // Drive frames + active step from scroll
  useEffect(() => {
    return scrollYProgress.on("change", (v) => {
      const index = Math.min(FRAME_COUNT - 1, Math.max(0, Math.floor(v * FRAME_COUNT)));
      if (index !== currentFrameRef.current) {
        currentFrameRef.current = index;
        scheduleFrame(index);
      }
      // Determine which step is active
      const stepIndex = STEPS.findIndex(
        (s) => index >= s.frameRange[0] && index <= s.frameRange[1]
      );
      if (stepIndex !== -1) setActiveStep(stepIndex);
    });
  }, [scrollYProgress]);

  return (
    <section
      ref={sectionRef}
      style={{ height: "400vh", backgroundColor: BG }}
      className="relative"
    >
      {/* Loading overlay */}
      <AnimatePresence>
        {!isReady && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6"
            style={{ backgroundColor: BG }}
          >
            <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-primary animate-spin" />
            <div className="w-48 h-px bg-white/10 overflow-hidden rounded-full">
              <motion.div
                className="h-full bg-primary origin-left"
                style={{ scaleX: loadProgress }}
              />
            </div>
            <span className="text-white/30 text-[10px] uppercase tracking-[0.25em] font-bold">
              {Math.round(loadProgress * 100)}%
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky split layout */}
      <div className="sticky top-0 h-screen w-full flex flex-col md:flex-row" style={{ willChange: "transform" }}>

        {/* ── Text panel (left on desktop, top on mobile) ── */}
        <div
          className="relative w-full md:w-1/2 h-full flex items-center px-8 md:px-14 lg:px-20 py-10 md:py-0"
          style={{ backgroundColor: BG }}
        >
          {STEPS.map((step, i) => (
            <AnimatePresence key={i} mode="wait">
              {activeStep === i && (
                <motion.div
                  key={`step-${i}`}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex flex-col justify-center px-8 md:px-14 lg:px-20"
                >
                  {/* Step indicator */}
                  <div className="flex items-center gap-3 mb-6">
                    {STEPS.map((_, dot) => (
                      <div
                        key={dot}
                        className={`h-px transition-all duration-500 ${dot === i ? "w-8 bg-primary" : "w-4 bg-white/20"}`}
                      />
                    ))}
                  </div>

                  <span
                    className="text-primary font-bold tracking-[0.25em] text-[10px] md:text-xs uppercase font-headline mb-4"
                    style={{ textShadow: "0 0 20px rgba(209,44,44,0.5)" }}
                  >
                    {step.label}
                  </span>

                  <h2
                    className="text-white/90 font-headline font-black text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tighter leading-[0.9] mb-4"
                    style={{ textShadow: "0 0 40px rgba(255,255,255,0.1)" }}
                  >
                    {step.title}<br />
                    <span className="text-primary italic">{step.accent}</span>
                  </h2>

                  <p className="text-white/50 text-sm md:text-base font-light leading-relaxed max-w-sm">
                    {step.body}
                  </p>

                  {step.cta && (
                    <motion.div
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                      className="mt-8"
                    >
                      <Link
                        to="/diagnostic"
                        className="inline-flex items-center gap-3 bg-primary text-white font-bold text-sm px-7 py-4 rounded-2xl hover:bg-primary/90 transition-all group"
                        style={{ boxShadow: "0 0 40px rgba(209,44,44,0.3)" }}
                      >
                        Commencer le Diagnostic
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          ))}
        </div>

        {/* ── Canvas panel (right on desktop, bottom on mobile) ── */}
        <div className="relative w-full md:w-1/2 h-[55vw] md:h-full flex-shrink-0" style={{ backgroundColor: BG }}>
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>
    </section>
  );
}
