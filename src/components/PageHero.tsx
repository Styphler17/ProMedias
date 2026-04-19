import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PageHeroProps {
  label: string;
  title: string;
  accent?: string;
  subtitle?: string;
  /** Optional background image URL (from ACF). Overlaid with dark gradient. */
  bgImage?: string;
  /** Optional extra content rendered to the right on desktop */
  aside?: React.ReactNode;
  /** Key to re-trigger animations (e.g. when title changes dynamically) */
  animKey?: string;
}

export function PageHero({ label, title, accent, subtitle, bgImage, aside, animKey }: PageHeroProps) {
  return (
    <section className="relative bg-zinc-950 text-white overflow-hidden pt-36 md:pt-44 pb-20 md:pb-28">
      {/* Background layers */}
      {bgImage ? (
        <>
          <img src={bgImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950/80 to-zinc-900/60 pointer-events-none" />
        </>
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-950 to-zinc-900 pointer-events-none" />
      )}
      <div className="absolute top-0 right-0 w-1/2 h-full pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 100% at 100% 0%, rgba(209,44,44,0.06) 0%, transparent 70%)" }}
      />

      <div className="container relative z-10">
        <div className={cn(
          "flex flex-col gap-10",
          aside ? "lg:flex-row lg:items-end lg:justify-between" : "items-center text-center"
        )}>
          <div className={cn("max-w-4xl", !aside && "mx-auto")}>
            <motion.span
              key={`label-${animKey}`}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-primary font-bold tracking-[0.25em] text-xs uppercase font-headline mb-5 block"
            >
              {label}
            </motion.span>

            <motion.h1
              key={`title-${animKey}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-headline font-black tracking-tighter text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.9] text-white/90"
            >
              {title}
              {accent && (
                <>
                  <br />
                  <span className="text-primary italic">{accent}</span>
                </>
              )}
            </motion.h1>

            {subtitle && (
              <motion.p
                key={`sub-${animKey}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.25 }}
                className={cn(
                  "mt-6 text-lg md:text-xl text-white/50 max-w-2xl font-light leading-relaxed",
                  !aside && "mx-auto"
                )}
              >
                {subtitle}
              </motion.p>
            )}
          </div>

          {aside && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="shrink-0"
            >
              {aside}
            </motion.div>
          )}
        </div>
      </div>

      {/* Fade into page */}
      <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </section>
  );
}
