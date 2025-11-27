import React, { useState } from 'react';

const DEFAULT_TO = 'info@bakusoq.co.jp';

const Contact: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [topic, setTopic] = useState('general');
  const [message, setMessage] = useState('');

  const handleMailto = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`[お問い合わせ] ${topic} - ${name || ''}`);
    const body = encodeURIComponent(
      `お名前: ${name}\nメール: ${email}\n電話番号: ${phone}\n件名: ${topic}\n\n${message}`
    );
    window.location.href = `mailto:${DEFAULT_TO}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-[#050B14] text-white">
      <header className="border-b border-white/10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/" className="text-xl font-black">BAKUSOQ</a>
          <a href="/" className="text-sm text-slate-400 hover:text-white">戻る</a>
        </div>
      </header>

      <main className="container mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-black mb-6">お問い合わせ</h1>
        <p className="text-slate-400 mb-8">
          ご質問・デモ依頼・お見積りのご相談など、以下フォームからお気軽にご連絡ください。
        </p>

        <form onSubmit={handleMailto} className="grid md:grid-cols-2 gap-6 max-w-3xl">
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">お名前</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
              required
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
              required
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">電話番号（任意）</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
              placeholder="090-xxxx-xxxx"
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">件名</label>
            <select
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
            >
              <option value="general" className="bg-slate-900">一般的なお問い合わせ</option>
              <option value="demo" className="bg-slate-900">デモの依頼</option>
              <option value="estimate" className="bg-slate-900">お見積りの相談</option>
              <option value="support" className="bg-slate-900">サポート</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-300 mb-2 uppercase tracking-wide">内容</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full p-3 bg-black/20 border border-white/10 rounded-lg text-sm text-white focus:border-secondary focus:ring-1 focus:ring-secondary outline-none"
              required
            />
          </div>
          <div className="md:col-span-2 flex gap-4">
            <button
              type="submit"
              className="bg-neon-gradient text-background font-black px-8 py-3 rounded-none skew-x-[-10deg] shadow-neon hover:shadow-neon-strong transition-all"
            >
              <span className="skew-x-[10deg]">メールで送信（デフォルト）</span>
            </button>
            <a
              href="/"
              className="border border-white/20 hover:border-white/40 px-8 py-3 rounded-none skew-x-[-10deg] text-white"
            >
              <span className="skew-x-[10deg]">トップへ戻る</span>
            </a>
          </div>
          <div className="md:col-span-2 text-xs text-slate-500">
            自動送信・履歴保存が必要な場合は、Formspree / EmailJS / Resend などの外部ツールと連携可能です（要アカウント作成）。
          </div>
        </form>
      </main>
    </div>
  );
};

export default Contact;

