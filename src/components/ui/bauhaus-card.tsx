"use client";
import React, { useEffect, useRef } from "react";
import { ChronicleButton } from "./chronicle-button";

const BAUHAUS_CARD_STYLES = `
.bauhaus-card {
  position: relative;
  width: 100%;
  min-height: 480px;
  display: flex;
  flex-direction: column;
  text-align: left;
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
  border-radius: var(--card-radius, 32px);
  border: var(--card-border-width, 1px) solid transparent;
  --rotation: 4.2rad;
  background-image:
    linear-gradient(var(--card-bg, #ffffff), var(--card-bg, #ffffff)),
    linear-gradient(calc(var(--rotation,4.2rad)), var(--card-accent, #15b5a2) 0, var(--card-bg, #ffffff) 30%, transparent 80%);
  background-origin: border-box;
  background-clip: padding-box, border-box;
  color: var(--card-text-main, #111014);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  overflow: hidden;
}
.bauhaus-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px -15px rgba(0,0,0,0.15);
}
.bauhaus-card-image-container {
  width: 100%;
  height: 260px;
  overflow: hidden;
  position: relative;
  background: #f1f1f1;
}
.bauhaus-product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.bauhaus-card:hover .bauhaus-product-image {
  transform: scale(1.05);
}
.bauhaus-card-header {
  padding: 1.5rem 2rem 0.5rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.bauhaus-date {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--card-text-top, #15b5a2);
}
.bauhaus-card-body {
  padding: 0.5rem 2rem 1.5rem 2rem;
  flex-grow: 1;
}
.bauhaus-card-body h3 {
  font-size: 1.5rem;
  margin-bottom: 0.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  font-family: var(--font-headline);
  color: var(--card-text-main, #111014);
  /* Fix vertical rhythm */
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 3.6rem; /* Fixed height for 2 lines */
  line-height: 1.2;
}
.bauhaus-card-body p {
  color: var(--card-text-sub, #71717a);
  font-size: 0.875rem;
  font-weight: 500;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 2.5rem; /* Fixed height for 2 lines */
}
.bauhaus-progress {
  margin-top: 1.5rem;
}
.bauhaus-progress-bar {
  position: relative;
  width: 100%;
  background: var(--card-progress-bar-bg, #f1f1f1);
  height: 0.25rem;
  display: block;
  border-radius: 1rem;
}
.bauhaus-progress-bar > div {
  height: 100%;
  border-radius: 1rem;
  transition: width 1s ease-out;
}
.bauhaus-progress span:first-of-type {
  font-weight: 700;
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: 0.5rem;
  color: var(--card-text-progress-label, #111014);
}
.bauhaus-progress span:last-of-type {
  margin-top: 0.5rem;
  text-align: right;
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--card-text-progress-value, #15b5a2);
}
.bauhaus-card-footer {
  padding: 1.5rem 2rem;
  border-top: 1px solid var(--card-separator, #f1f1f1);
}
.bauhaus-button-container {
  display: flex;
  gap: 12px;
}
`;

function injectBauhausCardStyles() {
  if (typeof window === "undefined") return;
  if (!document.getElementById("bauhaus-card-styles")) {
    const style = document.createElement("style");
    style.id = "bauhaus-card-styles";
    style.innerHTML = BAUHAUS_CARD_STYLES;
    document.head.appendChild(style);
  }
}

export interface BauhausCardProps {
  id: string;
  image: string;
  gallery?: string[];
  borderRadius?: string;
  backgroundColor?: string;
  separatorColor?: string;
  accentColor: string;
  borderWidth?: string;
  topInscription: string;
  mainText: string;
  subMainText: string;
  progressBarInscription: string;
  progress: number;
  progressValue: string;
  filledButtonInscription?: string;
  outlinedButtonInscription?: string;
  onFilledButtonClick: (id: string) => void;
  onOutlinedButtonClick: (id: string) => void;
  onCardClick?: (id: string) => void;
  textColorTop?: string;
  textColorMain?: string;
  textColorSub?: string;
  textColorProgressLabel?: string;
  textColorProgressValue?: string;
  progressBarBackground?: string;
}

export const BauhausCard: React.FC<BauhausCardProps> = ({
  id,
  image,
  gallery = [],
  borderRadius = "2rem",
  backgroundColor = "#ffffff",
  separatorColor = "#f1f1f1",
  accentColor = "#d12c2c",
  borderWidth = "1px",
  topInscription = "PROMEDIAS",
  mainText = "Produit",
  subMainText = "Catégorie",
  progressBarInscription = "Condition",
  progress = 0,
  progressValue = "N/A",
  filledButtonInscription = "Détails",
  outlinedButtonInscription = "WhatsApp",
  onFilledButtonClick,
  onOutlinedButtonClick,
  onCardClick,
  textColorTop = "#d12c2c",
  textColorMain = "#111014",
  textColorSub = "#71717a",
  textColorProgressLabel = "#111014",
  textColorProgressValue = "#d12c2c",
  progressBarBackground = "#f1f1f1",
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);
  const [isHovering, setIsHovering] = React.useState(false);
  const cycleIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const images = gallery.length > 0 ? gallery : [image];

  useEffect(() => {
    injectBauhausCardStyles();
    const card = cardRef.current;
    const handleMouseMove = (e: MouseEvent) => {
      if (card) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const angle = Math.atan2(-x, y);
        card.style.setProperty("--rotation", angle + "rad");
      }
    };
    if (card) {
      card.addEventListener("mousemove", handleMouseMove);
    }
    return () => {
      if (card) {
        card.removeEventListener("mousemove", handleMouseMove);
      }
    };
  }, []);

  useEffect(() => {
    if (isHovering && images.length > 1) {
      cycleIntervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 1500);
    } else {
      if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
    }
    return () => {
      if (cycleIntervalRef.current) clearInterval(cycleIntervalRef.current);
    };
  }, [isHovering, images.length]);

  return (
    <div
      className="bauhaus-card"
      ref={cardRef}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
        setCurrentImageIndex(0);
      }}
      onClick={() => onCardClick?.(id)}
      style={{
        '--card-bg': backgroundColor,
        '--card-accent': accentColor,
        '--card-radius': borderRadius,
        '--card-border-width': borderWidth,
        '--card-text-top': textColorTop,
        '--card-text-main': textColorMain,
        '--card-text-sub': textColorSub,
        '--card-text-progress-label': textColorProgressLabel,
        '--card-text-progress-value': textColorProgressValue,
        '--card-separator': separatorColor,
        '--card-progress-bar-bg': progressBarBackground,
        cursor: onCardClick ? 'pointer' : 'default'
      } as React.CSSProperties}
    >
      <div className="bauhaus-card-image-container">
        {images.map((img, idx) => (
          <img 
            key={idx}
            src={img} 
            alt={`${mainText} view ${idx + 1}`} 
            className="bauhaus-product-image" 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              opacity: currentImageIndex === idx ? 1 : 0,
              transition: 'opacity 0.6s ease-in-out, transform 0.5s ease'
            }}
          />
        ))}
        {/* Gallery Indicator Bar */}
        {images.length > 1 && (
          <div style={{
            position: 'absolute',
            bottom: '12px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '4px',
            zIndex: 10
          }}>
            {images.map((_, idx) => (
              <div 
                key={idx}
                style={{
                  width: '12px',
                  height: '2px',
                  borderRadius: '1px',
                  backgroundColor: currentImageIndex === idx ? accentColor : 'rgba(0,0,0,0.2)',
                  transition: 'background-color 0.3s ease'
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      <div className="bauhaus-card-header">
        <div className="bauhaus-date">{topInscription}</div>
      </div>
      
      <div className="bauhaus-card-body">
        <h3>{mainText}</h3>
        <p>{subMainText}</p>
        <div className="bauhaus-progress">
          <span>{progressBarInscription}</span>
          <div className="bauhaus-progress-bar">
            <div
              style={{
                width: `${progress}%`,
                backgroundColor: accentColor
              }}
            />
          </div>
          <span>{progressValue}</span>
        </div>
      </div>
      
      <div className="bauhaus-card-footer">
        <div className="bauhaus-button-container">
          <ChronicleButton
            text={filledButtonInscription}
            onClick={() => onFilledButtonClick(id)}
            hoverColor={accentColor}
            customBackground="#111014"
            customForeground="#fff"
            hoverForeground="#fff"
          />
          <ChronicleButton
            text={outlinedButtonInscription}
            outlined={true}
            onClick={() => onOutlinedButtonClick(id)}
            hoverColor={accentColor}
            customBackground="#111014"
            customForeground="#111014"
            hoverForeground="#fff"
          />
        </div>
      </div>
    </div>
  );
};
