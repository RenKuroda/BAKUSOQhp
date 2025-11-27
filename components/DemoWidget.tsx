import React, { useRef, useState } from 'react';
import { BuildingStructure, EstimateResult, MachineSpec, ExtendedInputState } from '../types';
import { generateAiEstimate } from '../services/geminiService';
import { Loader2, Calculator, ArrowRight, CheckCircle2, FileText, RefreshCw, Zap } from 'lucide-react';

export const DemoWidget: React.FC = () => {
  const [step, setStep] = useState<'input' | 'processing' | 'result'>('input');
  const [area, setArea] = useState<number>(30);
  const [structure, setStructure] = useState<BuildingStructure>(BuildingStructure.WOOD);
  const [roadWidth, setRoadWidth] = useState<string>('normal');
  const [result, setResult] = useState<EstimateResult | null>(null);

  // 追加フィールド（1枚目・2枚目の情報）
  const [ext, setExt] = useState<ExtendedInputState>({
    usage: '',
    floors: 2,
    heightM: 0,
    buildingAreaM2: 0,
    totalFloorAreaM2: 0,
    areaUnit: 'm2',
    machines: [
      { machineType: '0.25', attachment: 'バケット', configuration: 'スタンダード', units: 1, operators: 1 }
    ],
    numAssistWorkers: 2,
    numGasWorkers: 0
  });

  const handleCalculate = async () => {
    setStep('processing');
    await new Promise(r => setTimeout(r, 1500)); // 少し長めに演出
    
    // ゲージの値（坪）で計算
    const estimate = await generateAiEstimate(area, structure, roadWidth);
    setResult(estimate);
    setStep('result');
  };

  const handleReset = () => {
    setStep('input');
    setResult(null);
  };

  const containerClasses = "glass-card rounded-2xl p-5 sm:p-8 w-full max-w-2xl mx-auto relative overflow-hidden group shadow-2xl shadow-black/50 transition-all duration-500";

  // Slider drag helpers
  const trackRef = useRef<HTMLDivElement | null>(null);
  const MIN_AREA = 10;
  const MAX_AREA = 100;

  const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
  const posPercent = ((area - MIN_AREA) / (MAX_AREA - MIN_AREA)) * 100;
  const valueFromClientX = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect();
    if (!rect) return area;
    const ratio = clamp((clientX - rect.left) / rect.width, 0, 1);
    return Math.round(MIN_AREA + ratio * (MAX_AREA - MIN_AREA));
  };

  const beginDrag = (clientX: number) => {
    setArea(valueFromClientX(clientX));
    const onMove = (e: MouseEvent) => setArea(valueFromClientX(e.clientX));
    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const beginTouchDrag = (touch: Touch) => {
    setArea(valueFromClientX(touch.clientX));
    const onMove = (e: TouchEvent) => {
      if (e.touches[0]) setArea(valueFromClientX(e.touches[0].clientX));
    };
    const onUp = () => {
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onUp);
      window.removeEventListener('touchcancel', onUp);
    };
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onUp);
    window.addEventListener('touchcancel', onUp);
  };

  const updateMachine = (idx: number, patch: Partial<MachineSpec>) => {
    setExt((prev) => {
      const machines = prev.machines.map((m, i) => i === idx ? { ...m, ...patch } : m);
      return { ...prev, machines };
    });
  };

  const addMachine = () => {
    setExt((prev) => ({
      ...prev,
      machines: [...prev.machines, { machineType: '0.25', attachment: 'バケット', configuration: 'スタンダード', units: 1, operators: 1 }]
    }));
  };

  const STRUCTURE_OPTIONS = [
    { label: '木造', code: 'WOOD' },
    { label: 'S造', code: 'S' },
    { label: 'RC造', code: 'RC' },
    { label: 'SRC造', code: 'SRC' },
    { label: 'その他', code: 'OTHER' },
  ];
  const USAGE_OPTIONS = [
    { label: '住宅', code: 'RESIDENTIAL' },
    { label: '共同住宅', code: 'APARTMENT' },
    { label: '事務所', code: 'OFFICE' },
    { label: '店舗', code: 'RETAIL' },
    { label: '倉庫', code: 'WAREHOUSE' },
    { label: '工場', code: 'FACTORY' },
    { label: '学校', code: 'SCHOOL' },
    { label: '病院', code: 'HOSPITAL' },
    { label: '駐車場', code: 'PARKING' },
    { label: 'その他', code: 'OTHER' },
  ];

  const codeToStructure = (code: string): BuildingStructure => {
    switch (code) {
      case 'WOOD': return BuildingStructure.WOOD;
      case 'S': return BuildingStructure.S;
      case 'RC': return BuildingStructure.RC;
      case 'SRC': return BuildingStructure.SRC;
      case 'OTHER': return BuildingStructure.OTHER;
      default: return BuildingStructure.WOOD;
    }
  };
  const structureToCode = (b: BuildingStructure): string => {
    if (b === BuildingStructure.WOOD) return 'WOOD';
    if (b === BuildingStructure.S) return 'S';
    if (b === BuildingStructure.RC) return 'RC';
    if (b === BuildingStructure.SRC) return 'SRC';
    if (b === BuildingStructure.OTHER) return 'OTHER';
    if (b === BuildingStructure.STEEL) return 'S';
    return 'WOOD';
  };

  if (step === 'input') {
    return (
      <div className={containerClasses}>
        {/* Top Glow Accent */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-secondary to-transparent opacity-80"></div>
        <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 blur-[40px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
        
        <div className="mb-8 relative z-10">
          <div className="flex items-center gap-2 mb-2 text-secondary font-bold text-xs uppercase tracking-widest">
            <Zap size={14} className="animate-pulse" />
            <span>AI Estimation Demo</span>
          </div>
          <h3 className="text-2xl font-black text-white">
            <span className="text-secondary text-glow">バクソク</span> 見積もり体験
          </h3>
          <p className="text-slate-400 text-xs mt-2 leading-relaxed">
            現場条件を入力するだけで、瞬時にマスタ・積算ロジックが走り、正確な見積もりを生成します。
          </p>
        </div>

        <div className="space-y-4 relative z-10">
          {/* 構造 | 用途 | 階数 | 高さ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">構造種別</label>
              <select
                value={structureToCode(structure)}
                onChange={(e) => setStructure(codeToStructure(e.target.value))}
                className="w-full p-3 sm:p-3 bg-black/20 border border-white/10 rounded-lg text-base sm:text-sm text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
              >
                {STRUCTURE_OPTIONS.map(opt => (
                  <option key={opt.code} value={opt.code} className="bg-slate-900">{opt.label}</option>
                ))}
              </select>
            </div>
          <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">用途</label>
              <select
                value={ext.usage}
                onChange={(e) => setExt({ ...ext, usage: e.target.value })}
                className="w-full p-3 sm:p-3 bg-black/20 border border-white/10 rounded-lg text-base sm:text-sm text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
              >
                {USAGE_OPTIONS.map(opt => (
                  <option key={opt.code} value={opt.code} className="bg-slate-900">{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">階数 (階)</label>
              <input
                type="number"
                value={ext.floors}
                onChange={(e) => setExt({ ...ext, floors: Number(e.target.value) })}
                className="w-full p-3 sm:p-3 bg-black/20 border border-white/10 rounded-lg text-base sm:text-sm text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">高さ (m)</label>
              <input
                type="number"
                value={ext.heightM}
                onChange={(e) => setExt({ ...ext, heightM: Number(e.target.value) })}
                className="w-full p-3 sm:p-3 bg-black/20 border border-white/10 rounded-lg text-base sm:text-sm text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wide">延床面積</label>
              <div className="flex items-baseline gap-2">
              <span className="text-secondary font-mono font-bold text-lg">{area} <span className="text-xs">坪</span></span>
                <span className="text-slate-400 text-sm">({Math.round(area * 3.3)} m²)</span>
              </div>
            </div>
            <div
              className="relative"
              ref={trackRef}
              onMouseDown={(e) => beginDrag(e.clientX)}
              onTouchStart={(e) => e.touches[0] && beginTouchDrag(e.touches[0])}
            >
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-secondary shadow-[0_0_10px_#00F0FF]" style={{ width: `${posPercent}%` }}></div>
              </div>
              {/* knob (outside the overflow) */}
              <div
                role="slider"
                aria-valuemin={MIN_AREA}
                aria-valuemax={MAX_AREA}
                aria-valuenow={area}
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-white border-2 border-secondary shadow-[0_0_10px_rgba(0,240,255,0.6)] cursor-pointer z-20"
                style={{ left: `${posPercent}%` }}
                onMouseDown={(e) => { e.preventDefault(); beginDrag(e.clientX); }}
                onTouchStart={(e) => { if (e.touches[0]) beginTouchDrag(e.touches[0]); }}
              ></div>
            </div>
            <input
              type="range"
              min={MIN_AREA}
              max={MAX_AREA}
              step="1"
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              className="absolute inset-x-0 -mt-3 w-full h-6 opacity-0 cursor-pointer pointer-events-none z-0"
            />
          </div>

          {/* 重機選択（2枚目） */}
          <div className="rounded-lg border border-white/10 bg-black/10 p-3 space-y-3">
            <div className="flex items-center gap-2 text-slate-300 text-xs font-bold tracking-wider">
              <span className="w-1.5 h-1.5 bg-secondary rounded-full"></span>
              重機選択（1日あたり）
            </div>

            {ext.machines.map((m, idx) => (
              <div key={idx} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">重機種別</label>
                  <select
                    value={m.machineType}
                    onChange={(e) => updateMachine(idx, { machineType: e.target.value })}
                    className="w-full p-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white"
                  >
                    {['0.25','0.45','0.7'].map(o => <option key={o} value={o} className="bg-slate-900">{o}</option>)}
                  </select>
                </div>
          <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">アタッチメント</label>
                <select
                    value={m.attachment}
                    onChange={(e) => updateMachine(idx, { attachment: e.target.value })}
                    className="w-full p-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white"
                  >
                    {['バケット','ブレーカー','カッター'].map(o => <option key={o} value={o} className="bg-slate-900">{o}</option>)}
                </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">台数</label>
                  <input
                    type="number"
                    value={m.units}
                    onChange={(e) => updateMachine(idx, { units: Number(e.target.value) })}
                    className="w-full p-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wide">オペレーター数</label>
                  <input
                    type="number"
                    value={m.operators}
                    onChange={(e) => updateMachine(idx, { operators: Number(e.target.value) })}
                    className="w-full p-2.5 bg-black/20 border border-white/10 rounded-lg text-sm text-white"
                  />
                </div>
              </div>
            ))}

            <button
              onClick={addMachine}
              className="text-[12px] px-3 py-1.5 bg-white/5 hover:bg-white/10 text-slate-300 rounded-md border border-white/10 transition-colors"
            >
              ＋ 重機情報を追加
            </button>
          </div>

          {/* 作業員数 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">手元作業員人数 (1日あたり)</label>
              <input
                type="number"
                value={ext.numAssistWorkers}
                onChange={(e) => setExt({ ...ext, numAssistWorkers: Number(e.target.value) })}
                className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">ガス工人数 (1日あたり)</label>
              <input
                type="number"
                value={ext.numGasWorkers}
                onChange={(e) => setExt({ ...ext, numGasWorkers: Number(e.target.value) })}
                className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
              />
            </div>
          </div>

          

          <button
            onClick={handleCalculate}
            className="w-full mt-6 bg-gradient-to-r from-primary to-secondary text-background py-5 sm:py-4 rounded-xl font-black text-base sm:text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] hover:shadow-cyan-500/40 active:scale-[0.98] group"
          >
            <span>見積もりを生成</span>
            <Zap size={18} className="fill-current group-hover:rotate-12 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  if (step === 'processing') {
    return (
      <div className={`${containerClasses} flex flex-col items-center justify-center text-center min-h-[460px]`}>
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-secondary rounded-full animate-ping opacity-20"></div>
          <div className="relative bg-[#050B14] p-5 rounded-full border border-secondary/50 shadow-[0_0_20px_rgba(0,240,255,0.3)]">
            <Loader2 className="w-10 h-10 text-secondary animate-spin" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-white mb-2 tracking-wider">見積もり生成中...</h3>
        <div className="space-y-4 w-full max-w-xs text-left mt-6">
          <div className="flex items-center gap-4 text-sm text-slate-400 animate-[slideUp_0.3s_forwards] opacity-0" style={{ animationDelay: '0.1s' }}>
            <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
            </div>
            <span>現場条件の正規化</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400 animate-[slideUp_0.3s_forwards] opacity-0" style={{ animationDelay: '0.6s' }}>
            <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
            </div>
            <span>マスタ単価の適用</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-slate-400 animate-[slideUp_0.3s_forwards] opacity-0" style={{ animationDelay: '1.1s' }}>
            <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
            </div>
            <span>端数処理・丸め計算</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${containerClasses} p-0 !bg-[#0F172A] !border-slate-700 animate-slide-up`}>
      <div className="bg-black/40 text-white p-4 flex justify-between items-center border-b border-white/10">
        <div className="flex items-center gap-2">
          <FileText size={16} className="text-secondary" />
          <span className="font-bold text-sm tracking-wide">お見積書 (AI試算)</span>
        </div>
      </div>
      
      <div className="p-4 max-h-[360px] overflow-y-auto custom-scrollbar bg-[#0B1221]">
        {(() => {
          const grouped: Record<string, typeof result.items> = {} as any;
          result?.items.forEach((it) => {
            if (!grouped[it.category]) grouped[it.category] = [] as any;
            grouped[it.category].push(it);
          });
          return Object.entries(grouped).map(([cat, items]) => (
            <div key={cat} className="mb-6">
              <div className="text-xs md:text-sm font-black text-white/80 bg-white/5 px-3 py-2 rounded border border-white/10 mb-2">
                {cat}
              </div>
        <table className="w-full text-xs md:text-sm">
          <thead className="text-[10px] text-slate-500 border-b border-white/5 uppercase tracking-wider">
            <tr>
                    <th className="text-left py-2 font-medium">名称</th>
              <th className="text-right py-2 font-medium">数量</th>
                    <th className="text-right py-2 font-medium">単価</th>
              <th className="text-right py-2 font-medium">金額</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
                  {items.map((item, idx) => (
              <tr key={idx} className="group hover:bg-white/5 transition-colors">
                      <td className="py-2 pr-2 text-slate-200">{item.name}</td>
                      <td className="py-2 text-right text-slate-400 whitespace-nowrap">
                  {item.quantity} <span className="text-[10px] opacity-70">{item.unit}</span>
                </td>
                      <td className="py-2 text-right text-slate-300 font-mono whitespace-nowrap">¥{item.unitPrice.toLocaleString()}</td>
                      <td className="py-2 text-right font-medium text-slate-200 font-mono whitespace-nowrap">¥{item.total.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
            </div>
          ));
        })()}
      </div>

      <div className="p-5 bg-[#0F172A] border-t border-white/10 relative z-10">
        <div className="flex justify-between items-end mb-2">
          <span className="text-xs font-medium text-slate-500">小計</span>
          <span className="font-medium text-slate-300 font-mono">¥{result?.subTotal.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-end mb-4 pb-4 border-b border-dashed border-white/10">
          <span className="text-xs font-medium text-slate-500">消費税 (10%)</span>
          <span className="font-medium text-slate-300 font-mono">¥{result?.tax.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-sm font-bold text-white">合計金額</span>
          <span className="text-2xl font-black text-secondary text-glow font-mono">¥{result?.total.toLocaleString()}</span>
        </div>
        <div className="mt-5 pt-4 border-t border-white/10 text-center">
            <p className="text-white text-lg md:text-2xl font-black tracking-wide mb-4 text-glow">こんな体験したくない？</p>
            <a href="/contact.html" className="inline-flex items-center gap-2 px-6 py-2 bg-secondary/10 text-secondary border border-secondary/30 text-xs md:text-sm font-black rounded-full tracking-widest shadow-[0_0_12px_rgba(0,240,255,0.25)] hover:shadow-[0_0_18px_rgba(0,240,255,0.45)] transition-shadow">
                <CheckCircle2 size={12}/>
                BAKUSOQに相談
            </a>
        </div>
      </div>
    </div>
  );
};