'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Recipe } from '@/types';
import { soundManager } from '@/lib/sound';
import { calculateTargetRotation } from '@/lib/spin';

interface SpinWheelProps {
  recipes: Recipe[];
  isSpinning: boolean;
  onSpinStart: () => void;
  onSpinEnd: (recipe: Recipe) => void;
  targetRecipe: Recipe | null;
}

// Harmonious warm Algerian food palette
const SEGMENT_PALETTE = [
  '#EA580C', // Terracotta orange
  '#D97706', // Warm amber
  '#16A34A', // Olive green
  '#E11D48', // Paprika red
  '#0284C7', // Mediterranean blue
  '#CA8A04', // Saffron gold
  '#9333EA', // Plum
  '#059669', // Mint emerald
  '#DC2626', // Crimson
  '#B45309', // Roasted sesame
  '#0D9488', // Teal
  '#F59E0B', // Honey
];

export function SpinWheel({
  recipes,
  isSpinning,
  onSpinStart,
  onSpinEnd,
  targetRecipe,
}: SpinWheelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [wheelSize, setWheelSize] = useState<number>(340);
  const currentRotationRef = useRef<number>(0);
  const targetRotationRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const lastTickSegmentRef = useRef<number>(-1);

  // Pointer flipper angle for mechanical bounce
  const [pointerKick, setPointerKick] = useState<number>(0);

  // Measure container and adapt canvas size
  const updateSize = useCallback(() => {
    if (!containerRef.current) return;
    const width = containerRef.current.clientWidth;
    // Mobile optimized sizing: 300px min, 390px max
    const newSize = Math.min(Math.max(width - 24, 290), 380);
    setWheelSize(newSize);
  }, []);

  useEffect(() => {
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, [updateSize]);

  // Draw the entire wheel on canvas
  const drawWheel = useCallback(
    (rotation: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 2 : 2;
      const size = wheelSize;
      const center = size / 2;
      const radius = center - 16; // Leaving room for outer pegs

      // Reset transform and clear
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, size, size);

      const count = recipes.length;
      if (count === 0) return;

      const step = (Math.PI * 2) / count;

      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(rotation);

      // 1. Draw Segments
      for (let i = 0; i < count; i++) {
        const item = recipes[i];
        const startAngle = i * step;
        const endAngle = (i + 1) * step;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.closePath();

        // Color picking
        const color = item.color || SEGMENT_PALETTE[i % SEGMENT_PALETTE.length];
        ctx.fillStyle = color;
        ctx.fill();

        // Elegant inner wedge gradient for 3D depth
        const grad = ctx.createRadialGradient(0, 0, radius * 0.2, 0, 0, radius);
        grad.addColorStop(0, 'rgba(255,255,255,0.25)');
        grad.addColorStop(0.7, 'rgba(0,0,0,0)');
        grad.addColorStop(1, 'rgba(0,0,0,0.22)');
        ctx.fillStyle = grad;
        ctx.fill();

        // Segment divider line
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        // Draw Text and Emoji
        ctx.save();
        const midAngle = startAngle + step / 2;
        ctx.rotate(midAngle);

        // Position text along the slice
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillStyle = '#ffffff';

        // Dynamic font sizing depending on segment count
        const fontSize = count > 10 ? 11 : count > 8 ? 12 : 13;
        ctx.font = `bold ${fontSize}px var(--font-cairo), sans-serif`;

        // Text shadow for crisp legibility
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;

        // Label format: Short name + Emoji
        const textDistance = radius - 18;
        const displayLabel = `${item.shortName} ${item.emoji}`;

        // Truncate if too long
        const truncated = displayLabel.length > 15 ? displayLabel.slice(0, 14) + '..' : displayLabel;
        ctx.fillText(truncated, textDistance, 0);

        ctx.restore();
      }

      // 2. Draw Decorative Outer Rim
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, Math.PI * 2);
      ctx.lineWidth = 8;
      ctx.strokeStyle = '#78350F'; // Dark amber border
      ctx.stroke();

      // Outer gold rim
      ctx.beginPath();
      ctx.arc(0, 0, radius + 4, 0, Math.PI * 2);
      ctx.lineWidth = 4;
      ctx.strokeStyle = '#F59E0B'; // Gold accent
      ctx.stroke();

      // 3. Draw Outer Pegs (Rivets)
      for (let i = 0; i < count; i++) {
        const pegAngle = i * step;
        const pegX = Math.cos(pegAngle) * (radius - 2);
        const pegY = Math.sin(pegAngle) * (radius - 2);

        ctx.beginPath();
        ctx.arc(pegX, pegY, 3.5, 0, Math.PI * 2);
        ctx.fillStyle = '#FEF3C7';
        ctx.fill();
        ctx.strokeStyle = '#92400E';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore();

      // 4. Draw Center Hub (Fixed metallic disc)
      ctx.save();
      ctx.translate(center, center);

      // Outer shadow of hub
      ctx.shadowColor = 'rgba(0,0,0,0.35)';
      ctx.shadowBlur = 10;
      ctx.shadowOffsetY = 3;

      // Outer gold ring of hub
      ctx.beginPath();
      ctx.arc(0, 0, 36, 0, Math.PI * 2);
      const hubGoldGrad = ctx.createLinearGradient(-36, -36, 36, 36);
      hubGoldGrad.addColorStop(0, '#FDE68A');
      hubGoldGrad.addColorStop(0.5, '#F59E0B');
      hubGoldGrad.addColorStop(1, '#B45309');
      ctx.fillStyle = hubGoldGrad;
      ctx.fill();

      // Inner disc of hub
      ctx.shadowColor = 'transparent';
      ctx.beginPath();
      ctx.arc(0, 0, 28, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();

      // Mini center icon / text
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#EA580C';
      ctx.font = 'bold 15px sans-serif';
      ctx.fillText('🎡', 0, 0);

      ctx.restore();
    },
    [recipes, wheelSize]
  );

  // Redraw when size, rotation, or recipes change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 2 : 2;
    canvas.width = wheelSize * dpr;
    canvas.height = wheelSize * dpr;
    canvas.style.width = `${wheelSize}px`;
    canvas.style.height = `${wheelSize}px`;
    drawWheel(currentRotationRef.current);
  }, [wheelSize, recipes, drawWheel]);

  // Handle spin execution when targetRecipe arrives
  useEffect(() => {
    if (!isSpinning || !targetRecipe || recipes.length === 0) return;

    soundManager.playSpinStart();

    const targetIdx = recipes.findIndex((r) => r.id === targetRecipe.id);
    const safeIdx = targetIdx >= 0 ? targetIdx : 0;

    const startRot = currentRotationRef.current;
    const targetRot = calculateTargetRotation(startRot, safeIdx, recipes.length, 6);
    targetRotationRef.current = targetRot;

    const duration = 4400; // 4.4 seconds of satisfying deceleration
    const startTime = performance.now();

    // Easing curve: Starts briskly, decelerates realistically
    const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

    const stepAngle = (Math.PI * 2) / recipes.length;

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuart(progress);

      const currentAngle = startRot + (targetRot - startRot) * easedProgress;
      currentRotationRef.current = currentAngle;

      // Track passing segments for tick sound & needle bounce
      // Needle is at top (angle 3π/2)
      const currentMod = currentAngle % (Math.PI * 2);
      const relativeAngle = ((Math.PI * 3) / 2 - currentMod + Math.PI * 4) % (Math.PI * 2);
      const currentSegment = Math.floor(relativeAngle / stepAngle);

      if (currentSegment !== lastTickSegmentRef.current) {
        lastTickSegmentRef.current = currentSegment;
        // Pitch rises with remaining speed
        const speedFactor = 1.0 + (1 - progress) * 0.8;
        soundManager.playTick(speedFactor);

        // Flipper physical recoil
        setPointerKick(1);
        setTimeout(() => setPointerKick(0), 45);
      }

      drawWheel(currentAngle);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Spin finished!
        currentRotationRef.current = targetRot;
        drawWheel(targetRot);
        soundManager.playCelebration();
        onSpinEnd(targetRecipe);
      }
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isSpinning, targetRecipe, recipes, drawWheel, onSpinEnd]);

  // Interactive tap on the wheel to spin
  const handleWheelClick = () => {
    if (isSpinning) return;
    onSpinStart();
  };

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center justify-center w-full my-1 py-1"
    >
      {/* Top Needle / Pointer at 12 o'clock */}
      <div
        className="absolute top-[-4px] z-20 flex flex-col items-center pointer-events-none transition-transform duration-75"
        style={{
          transform: `translateY(0px) rotate(${pointerKick * -14}deg)`,
          transformOrigin: 'top center',
        }}
      >
        {/* Sleek metallic triangular pointer */}
        <div className="relative">
          <svg
            width="34"
            height="42"
            viewBox="0 0 34 42"
            fill="none"
            className="drop-shadow-[0_4px_6px_rgba(0,0,0,0.45)]"
          >
            {/* Outer golden rim */}
            <path
              d="M17 40L3 8C2 6 3 3 5 3H29C31 3 32 6 31 8L17 40Z"
              fill="#D97706"
              stroke="#FFFBEB"
              strokeWidth="2.5"
            />
            {/* Inner vibrant red body */}
            <path
              d="M17 35L6 9H28L17 35Z"
              fill="#DC2626"
            />
            {/* Needle Pivot Rivet */}
            <circle cx="17" cy="9" r="4" fill="#FEF3C7" stroke="#92400E" strokeWidth="1.5" />
          </svg>
        </div>
      </div>

      {/* Outer subtle decorative halo */}
      <div
        className="relative rounded-full p-2 bg-gradient-to-b from-amber-500/20 via-orange-500/10 to-transparent shadow-[0_12px_30px_rgba(0,0,0,0.15)] cursor-pointer active:scale-[0.99] transition-transform"
        onClick={handleWheelClick}
        title={isSpinning ? 'راهي تدور...' : 'اضغطي لدوران العجلة!'}
      >
        <canvas
          ref={canvasRef}
          className="rounded-full select-none touch-manipulation"
          style={{ width: `${wheelSize}px`, height: `${wheelSize}px` }}
        />
      </div>

      {/* Tiny hint beneath the wheel */}
      <div className="text-[11px] font-semibold text-stone-500/80 mt-1 flex items-center gap-1">
        <span>اضغطي على العجلة أو الزر تحتها</span>
        <span>👇</span>
      </div>
    </div>
  );
}
