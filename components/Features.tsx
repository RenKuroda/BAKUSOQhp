import React from 'react';
import { TrendingUp, ShieldCheck, Zap, Layers, FileText, ChevronRight } from 'lucide-react';

export const Features: React.FC = () => {
  return (
    <section className="py-24 bg-[#050B14] relative overflow-hidden" id="features">
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h2 className="text-secondary font-bold tracking-[0.2em] uppercase text-xs mb-4">Value Proposition</h2>
          <h3 className="text-3xl md:text-5xl font-black text-white mb-6">
            「ズレない・早い・揃う」<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-200 to-slate-500">新時代の見積作成フロー</span>
          </h3>
          <p className="text-slate-400 leading-relaxed text-lg">
            現場ごとの手計算やExcel管理から解放されましょう。<br/>
            BAKUSOQは、解体業に特化したマスタ管理と標準化された入力フローで、
            属人化を排除し、利益率の高い経営を支援します。
          </p>
        </div>

        {/* Before / After Comparison */}
        <div className="relative grid md:grid-cols-2 gap-8 mb-24 items-stretch">
          
          {/* Before */}
          <div className="rounded-2xl p-8 border border-white/10 bg-[#0F172A] relative group overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-red-500/10 blur-[80px] rounded-full"></div>
            <div className="absolute top-6 left-6 bg-slate-700/70 text-white text-xs md:text-sm font-black px-4 py-1.5 rounded-full uppercase tracking-wider">
              Before
            </div>
            <div className="mt-12 flex flex-col gap-8">
              <div className="flex items-start gap-5">
                <div className="p-3 bg-white/10 rounded-xl text-slate-200 shrink-0">
                    <FileText size={24}/>
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-1">Excel・紙での積算</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">計算式が壊れたり、担当者ごとにフォーマットがバラバラ。<br/>属人化の温床に。</p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="p-3 bg-white/10 rounded-xl text-slate-200 shrink-0">
                    <TrendingUp size={24}/>
                </div>
                <div>
                  <h4 className="font-bold text-white text-lg mb-1">俗人的になり、見積書に統一性がない</h4>
                  <p className="text-sm text-slate-400 leading-relaxed">手直しが多発し、顧客への提出が遅れる。<br/>結果、失注につながる。</p>
                </div>
              </div>
            </div>
          </div>

          {/* Center Arrow (acts like a transform indicator) */}
          <div className="hidden md:flex absolute inset-y-0 left-1/2 -translate-x-[70%] items-center justify-center pointer-events-none">
            <div className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary shadow-[0_0_30px_rgba(0,240,255,0.35)] flex items-center justify-center">
              <ChevronRight className="text-white" size={28} />
            </div>
          </div>

          {/* After */}
          <div className="rounded-2xl p-1 bg-gradient-to-br from-primary via-secondary to-primary shadow-neon relative group">
             <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-primary blur opacity-20 group-hover:opacity-40 transition-opacity"></div>
             <div className="h-full bg-[#0B1221] rounded-xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/10 blur-[80px] rounded-full pointer-events-none"></div>
                
                <div className="absolute top-6 left-6 bg-secondary text-background text-xs md:text-sm font-black px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Zap size={10} fill="currentColor"/> After (BAKUSOQ)
                </div>

                <div className="mt-12 flex flex-col gap-8">
                  <div className="flex items-start gap-5">
                    <div className="p-3 bg-secondary/10 rounded-xl text-secondary border border-secondary/20 shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                        <Zap size={24}/>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg mb-1 text-glow">Step入力で一気通貫</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">現場条件を入れるだけで、簡単STEPで瞬時に完了。</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <div className="p-3 bg-secondary/10 rounded-xl text-secondary border border-secondary/20 shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                        <Layers size={24}/>
                    </div>
                    <div>
                      <h4 className="font-bold text-white text-lg mb-1 text-glow">マスタで全社統一</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">単価・丸め・特例処理はマスタ基準。誰が作っても同じ高品質な見積もりに。</p>
                    </div>
                  </div>
                </div>
            </div>
          </div>
        </div>

        {/* 3 Key Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
            <FeatureCard 
                icon={<Layers size={24} />}
                step="02"
                title="入力モジュール"
                desc="外構・基礎・産廃など、必要項目のみをON/OFF制御。単位のゆらぎを自動吸収し、現場調査結果をスムーズに入力。"
            />
            <FeatureCard 
                icon={<TrendingUp size={24} />}
                step="03"
                title="積算・提案"
                desc="原価と提案単価を分離管理。自動計算後の微調整も履歴に残り、利益率を意識した戦略的な値決めが可能。"
            />
            <FeatureCard 
                icon={<ShieldCheck size={24} />}
                step="04"
                title="提出用見積"
                desc="PDF/Excel出力に対応し、社内承認から提出までのリードタイムを劇的に短縮。"
            />
        </div>

      </div>
    </section>
  );
};

const FeatureCard: React.FC<{icon: React.ReactNode, title: string, desc: string, step: string}> = ({ icon, title, desc, step }) => (
    <div className="bg-[#0F172A] p-8 rounded-2xl border border-white/5 hover:border-secondary/50 hover:shadow-neon transition-all duration-300 group">
        <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-secondary group-hover:text-background transition-colors duration-300">
                {icon}
            </div>
            <span className="text-4xl font-black text-white/5 group-hover:text-white/10 transition-colors">
                {step}
            </span>
        </div>
        <h4 className="text-lg font-bold text-white mb-3 group-hover:text-secondary transition-colors">{title}</h4>
        <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
    </div>
);