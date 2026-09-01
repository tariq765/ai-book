import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

interface PartCardData {
  number: string;
  badge: string;
  icon: string;
  title: string;
  desc: string;
  link: string;
  chapters: string[];
}

const PARTS: PartCardData[] = [
  {
    number: 'Part I',
    badge: 'Chapters 1-4',
    icon: '📚',
    title: 'Foundations of AI',
    desc: 'Core fundamentals of AI, Machine Learning paradigms, Deep Learning architectures, and Neural Networks.',
    link: '/docs/foundations',
    chapters: ['What is AI & History', 'Types of AI Systems', 'Machine Learning Essentials', 'Deep Learning & Neural Networks'],
  },
  {
    number: 'Part II',
    badge: 'Chapters 5-8',
    icon: '🧠',
    title: 'Modern Generative AI',
    desc: 'Transformers, Large Language Models (LLMs), self-attention mechanics, and advanced Prompt Engineering techniques.',
    link: '/docs/generative-ai',
    chapters: ['Generative AI Landscape', 'Large Language Models', 'Transformer Architecture', 'Prompt Engineering Mastery'],
  },
  {
    number: 'Part III',
    badge: 'Chapters 9-12',
    icon: '⚙️',
    title: 'AI Application Engineering',
    desc: 'Vector embeddings, semantic search, Vector Databases, and production Retrieval-Augmented Generation (RAG).',
    link: '/docs/ai-engineering',
    chapters: ['Embeddings & Similarity', 'Vector Databases & Indexing', 'RAG Fundamentals', 'Advanced RAG & Re-ranking'],
  },
  {
    number: 'Part IV',
    badge: 'Chapters 13-16',
    icon: '🤖',
    title: 'Autonomous AI Agents',
    desc: 'Agent architectures, autonomous loops, tool calling, function execution, and persistent AI memory systems.',
    link: '/docs/agents',
    chapters: ['AI Agents Overview', 'Agentic AI Architecture', 'Tool Calling & Execution', 'Short & Long-Term Memory'],
  },
  {
    number: 'Part V',
    badge: 'Chapters 17-19',
    icon: '🔗',
    title: 'MCP & Multi-Agent Systems',
    desc: 'Anthropic Model Context Protocol (MCP), multi-agent coordination, orchestration patterns, and decentralized workflows.',
    link: '/docs/mcp-multi-agent',
    chapters: ['Model Context Protocol (MCP)', 'Multi-Agent Collaboration', 'Workflow & Routing Patterns'],
  },
  {
    number: 'Part VI',
    badge: 'Chapters 20-24',
    icon: '🚀',
    title: 'Production AI',
    desc: 'Evaluation benchmarks, tracing, observability, LLM security, prompt injection defenses, and cloud deployment.',
    link: '/docs/production-ai',
    chapters: ['AI Evaluation & Evals', 'Observability & Tracing', 'AI Security & Guardrails', 'Deploying AI Applications'],
  },
  {
    number: 'Part VII',
    badge: 'Chapters 25-26',
    icon: '💻',
    title: 'Local AI & AI Development',
    desc: 'Running open-weights models locally via Ollama / vLLM, quantizations, and AI coding agents workflows.',
    link: '/docs/local-ai',
    chapters: ['Local AI & Open Weights', 'AI Coding Agents & IDEs'],
  },
  {
    number: 'Part VIII',
    badge: 'Chapters 27-29',
    icon: '🦾',
    title: 'Physical AI & Robotics',
    desc: 'Bridging digital AI with the physical world: Computer Vision, robotic control policies, and Humanoid Robotics.',
    link: '/docs/physical-ai',
    chapters: ['Computer Vision Foundations', 'Robotics & Embodied AI', 'Humanoid Robotics & Control'],
  },
  {
    number: 'Part IX',
    badge: 'Chapter 30',
    icon: '🏁',
    title: 'Capstone Project',
    desc: 'Build and deploy a complete, production-grade end-to-end Agentic AI application from scratch.',
    link: '/docs/capstone',
    chapters: ['Full-Stack Agentic AI App', 'Deployment & Verification'],
  },
];

const FEATURES = [
  {
    icon: '⚡',
    title: 'Code-First & Practical',
    desc: 'Real-world Python code, vector search setups, tool calling patterns, and runnable implementations for every chapter.',
  },
  {
    icon: '🧭',
    title: 'Zero to Mastery Curriculum',
    desc: 'Structured logical progression taking you from standard machine learning all the way to agentic orchestrations and Physical AI.',
  },
  {
    icon: '💬',
    title: 'Integrated RAG Assistant',
    desc: 'Instant Q&A powered by fast vector embeddings and LLMs to answer any query as you read through the handbook.',
  },
  {
    icon: '🌐',
    title: '100% Free & Open Source',
    desc: 'Open knowledge for developers, engineers, and researchers worldwide. Continuously updated with the latest AI breakthroughs.',
  },
];

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`${siteConfig.title} — Home`}
      description="The definitive guide for AI Engineering - From fundamentals to agentic systems, MCP, and Physical AI.">
      
      {/* Hero Section */}
      <header className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span>🚀 30 Chapters · 9 Comprehensive Parts · 2026 Ready</span>
          </div>

          <h1 className={styles.heroTitle}>
            Master Modern <span className={styles.gradientText}>AI Engineering</span>
          </h1>

          <p className={styles.heroSubtitle}>
            The open-source definitive handbook covering everything from Machine Learning foundations,
            LLMs, and Advanced RAG to <strong>Model Context Protocol (MCP)</strong>, Autonomous Multi-Agent Systems, and <strong>Physical AI</strong>.
          </p>

          <div className={styles.heroCtaGroup}>
            <Link className={styles.primaryBtn} to="/docs/intro">
              📖 Start Reading Free
            </Link>
            <a className={styles.secondaryBtn} href="#curriculum">
              📑 Explore 9 Parts
            </a>
            <a
              className={styles.secondaryBtn}
              href="https://github.com/ai-engineering-handbook/ai-engineering-handbook"
              target="_blank"
              rel="noreferrer">
              ⭐ Star on GitHub
            </a>
          </div>

          {/* Quick Stats */}
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>30</div>
              <div className={styles.statLabel}>In-Depth Chapters</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>9</div>
              <div className={styles.statLabel}>Major Modules</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>100%</div>
              <div className={styles.statLabel}>Free & Open Source</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>24/7</div>
              <div className={styles.statLabel}>AI Book Assistant</div>
            </div>
          </div>
        </div>
      </header>

      <main>
        {/* Features / Why this Book */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTag}>Why This Handbook</div>
            <h2 className={styles.sectionTitle}>Built for Engineers Building Real AI</h2>
            <p className={styles.sectionDesc}>
              Move beyond basic prompts to engineering scalable, secure, and production-ready intelligent systems.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {FEATURES.map((item, idx) => (
              <div key={idx} className={styles.featureCard}>
                <div className={styles.featureIconWrap}>{item.icon}</div>
                <h3 className={styles.featureTitle}>{item.title}</h3>
                <p className={styles.featureDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 9 Parts Curriculum Grid */}
        <section id="curriculum" className={`${styles.section} ${styles.sectionAlt}`}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionTag}>Curriculum Roadmap</div>
            <h2 className={styles.sectionTitle}>Explore the 9 Core Parts</h2>
            <p className={styles.sectionDesc}>
              A comprehensive roadmap designed to guide you step-by-step from core math to cutting-edge autonomous robotics.
            </p>
          </div>

          <div className={styles.partsGrid}>
            {PARTS.map((part, idx) => (
              <Link key={idx} to={part.link} className={styles.partCard}>
                <div className={styles.partCardTop}>
                  <span className={styles.partIcon}>{part.icon}</span>
                  <span className={styles.partBadge}>{part.badge}</span>
                </div>
                <h3 className={styles.partCardTitle}>
                  {part.number}: {part.title}
                </h3>
                <p className={styles.partCardDesc}>{part.desc}</p>
                <ul className={styles.chapterList}>
                  {part.chapters.map((ch, cIdx) => (
                    <li key={cIdx}>{ch}</li>
                  ))}
                </ul>
                <div className={styles.cardFooterLink}>
                  Read Part {idx + 1} <span>→</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Chatbot Highlight Banner */}
          <div className={styles.chatbotBanner}>
            <h3 className={styles.chatbotTitle}>🤖 Interactive AI Companion Included</h3>
            <p className={styles.chatbotDesc}>
              Have questions about embeddings, MCP servers, or humanoid control?
              Use the built-in AI chatbot at the bottom right corner for instant explanations and guidance!
            </p>
            <div className={styles.techPills}>
              <span className={styles.techPill}>FastAPI Backend</span>
              <span className={styles.techPill}>FastEmbed Vectors</span>
              <span className={styles.techPill}>Qdrant Vector DB</span>
              <span className={styles.techPill}>Groq High-Speed LLM</span>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Ready to Master AI Engineering?</h2>
          <p className={styles.ctaSubtitle}>
            Dive into Chapter 1 today and learn the essential foundations of modern AI systems.
          </p>
          <div className={styles.heroCtaGroup}>
            <Link className={styles.primaryBtn} to="/docs/intro">
              🚀 Start Reading Chapter 1
            </Link>
          </div>
        </section>
      </main>
    </Layout>
  );
}

