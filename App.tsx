import React, { useEffect, useState } from 'react';
import { DemoWidget } from './components/DemoWidget';
import { Features } from './components/Features';
import { Zap, Menu, ChevronRight, X, Mail, Phone, Globe } from 'lucide-react';
import LightningStreak from './components/LightningStreak';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const centeredHero = true;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col font-sans selection:bg-secondary selection:text-background overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full blur-[120px] mix-blend-screen opacity-40 animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 rounded-full blur-[120px] mix-blend-screen opacity-30"></div>
        {/* Background Lightning (global, fixed) */}
        <LightningStreak
          intervalMs={10000}
          durationMs={320}
          areaHeight={160}
          offsetVh={45}     // さらに約2cm分上へ（目安）
          coreWidth={0.6}   // より細く
          glowWidth={3}
          smooth={false}    // 雷っぽいジグザグ
          boltAmp={10}
          branches={2}
        />
      </div>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        scrolled ? 'bg-[#050B14]/80 backdrop-blur-md border-white/10 h-16' : 'bg-transparent border-transparent h-20'
      }`}>
        <div className="container mx-auto px-4 h-full flex items-center justify-between">
          <div className="flex items-center gap-2 group cursor-pointer">
            <div className="relative">
                <div className="absolute inset-0 bg-secondary blur-md opacity-0 group-hover:opacity-60 transition-opacity"></div>
                <Zap size={24} className="text-secondary relative z-10" fill="currentColor" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white italic">BAKUSOQ</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-8 ml-auto mr-4">
            {['料金プラン'].map((item) => (
              <a key={item} href={`#${item}`} className="text-sm font-bold text-slate-400 hover:text-white hover:text-glow transition-all">
                {item}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <a href="/contact.html" className="hidden md:flex bg-white text-background hover:bg-secondary hover:text-background text-sm font-black px-6 py-2.5 rounded-none skew-x-[-10deg] transition-all duration-300 shadow-[0_0_15px_rgba(255,255,255,0.3)] hover:shadow-[0_0_20px_rgba(0,240,255,0.6)] items-center gap-2 group">
              <span className="skew-x-[10deg] inline-block">お問い合わせ</span>
              <ChevronRight size={16} className="skew-x-[10deg] group-hover:translate-x-1 transition-transform" />
            </a>
            <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(true)}>
                <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#050B14] flex flex-col items-center justify-center p-8 space-y-8">
          <button className="absolute top-6 right-6 text-white" onClick={() => setMobileMenuOpen(false)}>
            <X size={32} />
          </button>
          {['料金プラン'].map((item) => (
            <a key={item} href="#" onClick={() => setMobileMenuOpen(false)} className="text-2xl font-bold text-white hover:text-secondary">
              {item}
            </a>
          ))}
              <a href="/contact.html" onClick={() => setMobileMenuOpen(false)} className="w-full bg-secondary text-background font-black py-4 text-lg text-center">
                お問い合わせ
              </a>
        </div>
      )}

      <main className="flex-grow relative z-10">
        {/* Hero Section */}
        <section className="relative min-h-[90vh] flex items-center pt-20 overflow-visible">
            {/* Diagonal Grid Line Decoration */}
            <div className="absolute inset-0 z-0 opacity-20" 
                 style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>
            
            
            <div className="container mx-auto px-4 relative z-10">
                {centeredHero ? (
                  <div className="max-w-5xl mx-auto flex flex-col items-center">
                    <div className="text-sm md:text-base font-bold text-secondary tracking-widest uppercase mb-2">BAKUSOQ</div>
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-8 tracking-tight text-center">
                      <span className="text-transparent bg-clip-text bg-neon-gradient text-glow">一瞬で見積もりに。</span>
                    </h1>
                    <div className="relative w-full max-w-2xl">
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 blur-[40px] opacity-60 animate-pulse-slow"></div>
                      <DemoWidget />
                    </div>
                  </div>
                ) : (
                  <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                    <div className="lg:col-span-6 lg:col-start-2 relative">
                      <div className="absolute -left-20 -top-20 w-[400px] h-[400px] bg-secondary/20 blur-[100px] rounded-full pointer-events-none"></div>
                      <div className="text-xs md:text-sm font-bold text-secondary tracking-widest uppercase mb-3">BAKUSOQ</div>
                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-[1.1] mb-8 tracking-tight">
                        <span className="text-transparent bg-clip-text bg-neon-gradient text-glow">一瞬で見積もりに。</span>
                      </h1>
                      <div className="flex flex-col sm:flex-row items-center gap-6">
                        <button className="w-full sm:w-auto bg-neon-gradient hover:opacity-90 text-background font-black px-10 py-5 rounded-none skew-x-[-10deg] shadow-neon hover:shadow-neon-strong transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 group">
                          <span className="skew-x-[10deg] text-lg">トライアルを開始</span>
                          <Zap size={20} className="skew-x-[10deg] fill-current" />
                        </button>
                      </div>
                    </div>
                    <div className="lg:col-span-5 relative perspective-1000">
                      <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-secondary/30 blur-[40px] transform rotate-6 scale-95 opacity-60 animate-pulse-slow"></div>
                      <div className="absolute -top-20 -right-20 text-secondary/10 hidden xl:block pointer-events-none">
                        <Zap size={400} fill="currentColor" />
                      </div>
                      <DemoWidget />
                    </div>
                  </div>
                )}
            </div>
            
            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50 animate-bounce">
                <div className="w-[1px] h-12 bg-gradient-to-b from-transparent to-white"></div>
                <span className="text-[10px] tracking-[0.2em] text-white uppercase">Scroll</span>
            </div>
        </section>

        {/* Stats Section */}
        <section className="py-10 border-y border-white/5 bg-[#0A1120]">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 justify-items-center max-w-4xl mx-auto">
                    {[
                        { label: '見積作成時間', value: '90', unit: '%短縮', icon: <Zap size={20}/> },
                        { label: '手戻り削減率', value: '80', unit: '%減', icon: <ChevronRight size={20} className="rotate-90"/> },
                        { label: '見積精度', value: '+90', unit: '%向上', icon: <Zap size={20}/> },

                    ].map((stat, i) => (
                        <div key={i} className="text-center group">
                            <div className="text-4xl md:text-5xl font-black text-white mb-2 group-hover:text-secondary transition-colors duration-300 flex items-center justify-center gap-1">
                                {stat.value}<span className="text-lg md:text-xl text-secondary">{stat.unit}</span>
                            </div>
                            <div className="text-xs md:text-sm text-slate-500 font-bold tracking-widest uppercase">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

        {/* Features & Value Prop */}
        <Features />

        {/* Pricing Section */}
        <section id="料金プラン" className="py-24 bg-[#050B14] relative overflow-hidden">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-2">価格・プラン</h2>
              <p className="text-slate-400">シンプルな料金体系で、すぐにご利用いただけます</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Card 1: 初期費用 */}
              <div className="glass-card rounded-2xl border border-white/10 p-6 md:p-8">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl md:text-2xl font-black text-white">初期マスタ設定費用</h3>
                </div>
                <p className="text-slate-400 text-sm mb-6">お客様の業務規模や必要なカスタマイズ内容により変動する場合があります。</p>
                <div className="flex items-end gap-2">
                  <span className="text-3xl md:text-4xl font-black text-white">¥200,000</span>
                </div>
              </div>

              {/* Card 2: 月額費用 */}
              <div className="glass-card rounded-2xl border border-white/10 p-6 md:p-8 relative">
                <div className="absolute top-4 right-4 bg-secondary text-background text-xs font-black px-3 py-1 rounded-full">ベータ版提供中</div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl md:text-2xl font-black text-white">月額利用料</h3>
                  <div className="text-xs bg-pink-600 text-white font-black px-2 py-1 rounded">40% OFF</div>
                </div>
                <div className="mt-2 rounded-xl bg-black/30 border border-white/10 p-5">
                  {/* 通常価格（定価） */}
                  <div className="flex items-center justify-between text-slate-400 text-xs md:text-sm mb-3">
                    <span>通常料金（定価）</span>
                    <span className="line-through font-black text-slate-500 text-2xl md:text-3xl">¥50,000<span className="text-xs md:text-sm">/月</span></span>
                  </div>
                  <div className="flex items-end gap-2">
                    <div className="text-4xl md:text-5xl font-black text-secondary text-glow">¥30,000</div>
                    <div className="text-white font-bold mb-1">/月</div>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2">ユーザー数無制限・ベータ期間中は特別価格が継続</div>
                </div>
              </div>
            </div>

            <div className="mt-6 text-xs text-slate-500 leading-relaxed">
              ベータ版では一部機能が開発中であり、予期せぬバグが発生する可能性があります。発見されたバグは迅速に対応いたします。詳細条件はお問い合わせください。
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 relative overflow-hidden">
            <div className="absolute inset-0 bg-secondary/5 z-0"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background z-0"></div>
            
            <div className="container mx-auto px-4 text-center relative z-10">
                <h2 className="text-4xl md:text-5xl font-black text-white mb-8 tracking-tight">
                    <span className="inline-block border-b-4 border-secondary pb-2">バクソク</span>の向こう側へ。
                </h2>
                <p className="text-slate-300 mb-12 max-w-2xl mx-auto text-lg leading-relaxed">
                    BAKUSOQなら、マスタ移行から運用開始まで最短3日。<br/>
                    今すぐ、あなたの会社も「一閃」のスピードを手に入れましょう。
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-6">
                    <a href="/contact.html" className="bg-white hover:bg-slate-200 text-background font-black px-10 py-5 rounded-none skew-x-[-10deg] shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all">
                        <span className="skew-x-[10deg]">トライアル (7日間)</span>
                    </a>
                    <a href="/contact.html" className="bg-transparent border border-white/30 hover:border-white text-white font-bold px-10 py-5 rounded-none skew-x-[-10deg] hover:bg-white/5 transition-all">
                        <span className="skew-x-[10deg]">資料をダウンロード</span>
                    </a>
                </div>
                {/* Embedded demo video */}
                <div className="mt-10 max-w-3xl w-full mx-auto aspect-video">
                  <iframe
                    className="w-full h-full rounded-xl border border-white/10"
                    src="https://www.youtube.com/embed/pCJR4O2XfxA"
                    title="BAKUSOQ Demo"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  ></iframe>
                </div>
            </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-[#02050a] border-t border-white/10 py-16 relative overflow-hidden">
        {/* Footer Glow */}
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-secondary/50 to-transparent"></div>
        
        <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 mb-12">
                <div className="md:col-span-1">
                    <div className="flex items-center gap-2 mb-6">
                        <Zap size={24} className="text-secondary" fill="currentColor" />
                        <span className="text-2xl font-black text-white italic">BAKUSOQ</span>
                    </div>
                    <p className="text-slate-500 text-sm leading-relaxed">
                        解体業界に特化した、<br/>次世代のバクソク見積もりクラウド。<br/>
                        積算の常識を覆します。
                    </p>
                </div>
                <div>
                    <h4 className="text-white font-bold mb-6">Contact</h4>
                    <div className="space-y-4 text-sm text-slate-500">
                        <div className="flex items-center gap-3">
                            <Mail size={16} className="text-secondary"/>
                            <span>support@genbaboxx.co.jp</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Phone size={16} className="text-secondary"/>
                            <span>050-5784-5762</span>
                        </div>
                         <div className="text-xs text-slate-600 mt-4">
                            平日 9:00〜18:00
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="text-xs text-slate-600">
                    &copy; 2025 BAKUSOQ Inc. All rights reserved.
                </div>
                <div className="flex gap-6 text-xs text-slate-600">
                    <a href="#" className="hover:text-white">プライバシーポリシー</a>
                    <a href="#" className="hover:text-white">特定商取引法に基づく表記</a>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default App;