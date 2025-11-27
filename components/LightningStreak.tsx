import React, { useEffect, useMemo, useRef, useState } from 'react';

type LightningStreakProps = {
  intervalMs?: number;     // 連続発生の間隔
  durationMs?: number;     // 1回の走り抜け時間
  color?: string;          // メインカラー
  glowColor?: string;      // 外側グロー
  maxTiltDeg?: number;     // 少し角度を付けてスピード感を出す
  areaHeight?: number;     // 表示エリアの高さ (px)
  offsetTop?: number;      // セクション内での上からのオフセット (px)
  coreWidth?: number;      // コア線の太さ
  glowWidth?: number;      // グロー線の太さ
  offsetVh?: number;       // ビューポートに対するオフセット (vh)
  smooth?: boolean;        // 滑らかな一閃
  boltAmp?: number;        // 雷(ジグザグ)時の振幅
  branches?: number;       // 枝分かれ数
};

/**
 * 画面後方に「一閃（稲妻の閃光）」が左→右へ一瞬で走る演出コンポーネント。
 * ヒーローセクションの behind レイヤーに配置して利用します。
 */
export const LightningStreak: React.FC<LightningStreakProps> = ({
  intervalMs = 4500,
  durationMs = 700,
  color = '#7ee9ff',
  glowColor = '#00F0FF',
  maxTiltDeg = 2,
  areaHeight = 240,
  offsetTop = 0,
  coreWidth = 1.2,
  glowWidth = 6,
  offsetVh,
  smooth = true,
  boltAmp = 10,
  branches = 2,
}) => {
  const [y, setY] = useState<number>(areaHeight / 2);
  const [seed, setSeed] = useState<number>(0);
  const runningRef = useRef<boolean>(false);

  useEffect(() => {
    const tick = () => {
      runningRef.current = true;
      // ヒーロー内の任意の高さにランダム出現
      const nextY = Math.floor(40 + Math.random() * (areaHeight - 80));
      setY(nextY);
      // アニメーションを再トリガーするためのシード
      setSeed((s) => s + 1);
      setTimeout(() => {
        runningRef.current = false;
      }, durationMs + 50);
    };
    // 初回は少し待ってから
    const first = setTimeout(tick, 600);
    const id = setInterval(() => {
      if (!runningRef.current) tick();
    }, intervalMs);
    return () => {
      clearTimeout(first);
      clearInterval(id);
    };
  }, [intervalMs, durationMs, areaHeight]);

  // 綺麗な一閃（滑らかなS字カーブ） or 雷らしいジグザグ
  const { mainPath, branchPaths } = useMemo(() => {
    if (smooth) {
      const baseY = 20;
      const amp = 6 + (seed % 3) * 2; // 6,8,10
      return {
        mainPath: `M0 ${baseY} C 80 ${baseY - amp}, 160 ${baseY + amp}, 240 ${baseY} S 400 ${baseY - amp}, 480 ${baseY}`,
        branchPaths: [] as string[],
      };
    }
    // Bolt: ランダムなジグザグポリライン + 短い枝
    const baseY = 20;
    const segs = 10;
    const stepX = 480 / segs;
    const points: Array<[number, number]> = [[0, baseY]];
    for (let i = 1; i <= segs; i++) {
      const x = Math.round(i * stepX);
      const dir = Math.random() > 0.5 ? 1 : -1;
      const amp = boltAmp + (seed % 3); // わずかに変動
      const yv = baseY + Math.round((amp + Math.random() * amp) * dir);
      points.push([x, yv]);
    }
    const main = `M${points[0][0]} ${points[0][1]} ` + points.slice(1).map(p => `L${p[0]} ${p[1]}`).join(' ');
    // 枝を生成（短い斜め線）
    const bps: string[] = [];
    for (let b = 0; b < branches; b++) {
      const idx = 2 + Math.floor(Math.random() * (points.length - 4));
      const [bx, by] = points[idx];
      const len = 30 + Math.random() * 40;
      const up = Math.random() > 0.5 ? 1 : -1;
      bps.push(`M${bx} ${by} L${Math.round(bx + len)} ${Math.round(by + up * (len * 0.6))}`);
    }
    return { mainPath: main, branchPaths: bps };
  }, [seed, smooth, boltAmp, branches]);

  const tiltDeg = useMemo(() => (Math.random() * maxTiltDeg * (Math.random() > 0.5 ? 1 : -1)), [seed, maxTiltDeg]);

  return (
    <div
      className="absolute left-0 right-0 pointer-events-none"
      style={{
        top: offsetVh !== undefined ? `${offsetVh}vh` : offsetTop,
        height: `${areaHeight}px`,
        zIndex: 1, // 背景グリッドの上、テキストの下に来るよう App 側の階層と合わせる
        mixBlendMode: 'screen',
      }}
      aria-hidden
    >
      {/* 縦位置・傾きを外側で保持し、横移動は内側のラッパーで全幅走査 */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          transform: `translateY(${y - areaHeight / 2}px) rotate(${tiltDeg}deg)`,
          filter: 'saturate(140%)',
        }}
      >
        <div
          key={`run-${seed}`}
          style={{
            width: '100%',
            animation: `streak-run-edge ${durationMs}ms cubic-bezier(0.22, 1, 0.36, 1) both`,
            willChange: 'transform, opacity',
          }}
        >
          <svg
            key={seed}
            width="100%"
            height={areaHeight}
            viewBox={`0 0 480 ${areaHeight}`}
          >
        <defs>
          <linearGradient id="lg-streak" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={glowColor} stopOpacity="0.0" />
            <stop offset="10%" stopColor={glowColor} stopOpacity="0.85" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="90%" stopColor={glowColor} stopOpacity="0.85" />
            <stop offset="100%" stopColor={glowColor} stopOpacity="0.0" />
          </linearGradient>
          <filter id="f-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              type="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="glow"
            />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* 外側グロー（太い・ぼかし） */}
        <path
          d={mainPath}
          stroke="url(#lg-streak)"
          strokeWidth={glowWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#f-glow)"
          opacity="0.75"
        />

        {/* コア線（細い・白寄り） */}
        <path
          d={mainPath}
          stroke={color}
          strokeWidth={coreWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={{
            animation: `streak-flash ${Math.max(200, Math.floor(durationMs * 0.6))}ms ease-out both`,
          }}
        />

        {/* 枝（薄め） */}
        {branchPaths.map((bp, i) => (
          <path
            key={i}
            d={bp}
            stroke={glowColor}
            strokeWidth={Math.max(1, coreWidth - 0.2)}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.5"
            style={{
              animation: `streak-flash ${Math.max(180, Math.floor(durationMs * 0.5))}ms ease-out both`,
            }}
          />
        ))}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default LightningStreak;

