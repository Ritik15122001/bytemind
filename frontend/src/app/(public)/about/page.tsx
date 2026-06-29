import { Metadata } from "next";
import Link from "next/link";
import { FiZap, FiBookOpen, FiShield, FiTrendingUp, FiArrowRight, FiUsers } from "react-icons/fi";

export const metadata: Metadata = {
  title: "About ByteMind — Tech & Programming Blog",
  description:
    "ByteMind is a technology blog delivering in-depth articles on programming, cybersecurity, gadgets, and the latest tech trends — written for curious minds.",
};

export default function AboutPage() {
  const features = [
    {
      icon: FiBookOpen,
      title: "In-Depth Coverage",
      desc: "Every article goes beyond the surface. We break down complex topics into clear, practical insights that you can actually use.",
    },
    {
      icon: FiTrendingUp,
      title: "SEO-Optimised Articles",
      desc: "Each piece targets high-value keywords and follows Google's content guidelines — so you always find us when you need us.",
    },
    {
      icon: FiShield,
      title: "Accuracy First",
      desc: "We research every topic thoroughly before publishing. No clickbait, no filler — just reliable information you can trust.",
    },
    {
      icon: FiUsers,
      title: "Written for Everyone",
      desc: "Whether you're a senior engineer or just starting out, our content is structured to be accessible and genuinely helpful.",
    },
  ];

  return (
    <div className="min-h-screen px-4 py-20">
      <div className="max-w-4xl mx-auto">
        {/* Hero */}
        <div className="text-center mb-20">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-cyan flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
            <FiZap className="text-white text-2xl" />
          </div>
          <h1 className="text-5xl font-black mb-6">
            About <span className="gradient-text">ByteMind</span>
          </h1>
          <p className="text-xl text-text-secondary leading-relaxed max-w-2xl mx-auto">
            ByteMind is a technology publication for developers, enthusiasts, and curious minds who want to stay ahead in a fast-moving industry.
          </p>
        </div>

        {/* Mission */}
        <div className="glass-card p-8 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-accent-purple/5 rounded-full blur-2xl" />
          <h2 className="text-2xl font-bold text-text-primary mb-4">Our Mission</h2>
          <p className="text-text-secondary leading-relaxed mb-4">
            The tech world moves fast — and keeping up shouldn't feel like a second job. ByteMind brings together the most important developments in AI, machine learning, programming, cybersecurity, and hardware into one clear, well-researched publication.
          </p>
          <p className="text-text-secondary leading-relaxed">
            We cover what actually matters: real tutorials, honest gadget takes, security advice you can act on, and tech news without the noise. New articles are published every day, across eight topic areas, so there's always something worth reading.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="glass-card p-6 hover:border-accent-purple/30 transition-all duration-300">
              <div className="w-10 h-10 rounded-xl bg-accent-purple/10 flex items-center justify-center mb-4">
                <Icon className="text-accent-purple w-5 h-5" />
              </div>
              <h3 className="font-bold text-text-primary mb-2">{title}</h3>
              <p className="text-text-muted text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        {/* What we cover */}
        <div className="glass-card p-8 mb-12">
          <h2 className="text-2xl font-bold text-text-primary mb-6">What We Cover</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { icon: "🤖", name: "Artificial Intelligence" },
              { icon: "🧠", name: "Machine Learning" },
              { icon: "💻", name: "Programming" },
              { icon: "🔒", name: "Cybersecurity" },
              { icon: "📱", name: "Gadgets & Reviews" },
              { icon: "☁️", name: "Cloud & DevOps" },
              { icon: "📰", name: "Tech News" },
              { icon: "⚡", name: "AI Tools" },
            ].map((cat) => (
              <div
                key={cat.name}
                className="flex flex-col items-center p-4 rounded-xl bg-bg-secondary border border-bg-border text-center"
              >
                <span className="text-3xl mb-2">{cat.icon}</span>
                <span className="text-xs font-medium text-text-secondary">{cat.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Contact / CTA */}
        <div className="glass-card p-8 mb-12">
          <h2 className="text-2xl font-bold text-text-primary mb-3">Get in Touch</h2>
          <p className="text-text-secondary mb-4">
            Have a topic suggestion, a correction, or just want to say hello? We read every message.
          </p>
          <a
            href="mailto:hello@bytemind.io"
            className="text-accent-cyan hover:underline text-sm font-medium"
          >
            hello@bytemind.io
          </a>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/blog" className="btn-primary inline-flex items-center gap-2">
            Start Reading <FiArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
