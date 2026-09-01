/**
 * Sidebars for The AI Engineering Handbook
 * Organized into 9 parts with 30 chapters
 */

import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: 'doc',
      id: 'intro',
      label: '📖 Introduction',
    },
    {
      type: 'category',
      label: '📚 Part I: Foundations of Artificial Intelligence',
      link: { type: 'doc', id: 'foundations/index' },
      items: [
        'foundations/chapter-1-what-is-ai',
        'foundations/chapter-2-types-of-ai',
        'foundations/chapter-3-machine-learning',
        'foundations/chapter-4-deep-learning-neural-networks',
      ],
    },
    {
      type: 'category',
      label: '🧠 Part II: Modern Generative AI',
      link: { type: 'doc', id: 'generative-ai/index' },
      items: [
        'generative-ai/chapter-5-generative-ai',
        'generative-ai/chapter-6-large-language-models',
        'generative-ai/chapter-7-transformers',
        'generative-ai/chapter-8-prompt-engineering',
      ],
    },
    {
      type: 'category',
      label: '⚙️ Part III: AI Application Engineering',
      link: { type: 'doc', id: 'ai-engineering/index' },
      items: [
        'ai-engineering/chapter-9-embeddings',
        'ai-engineering/chapter-10-vector-databases',
        'ai-engineering/chapter-11-rag',
        'ai-engineering/chapter-12-advanced-rag',
      ],
    },
    {
      type: 'category',
      label: '🤖 Part IV: AI Agents',
      link: { type: 'doc', id: 'agents/index' },
      items: [
        'agents/chapter-13-ai-agents',
        'agents/chapter-14-agentic-ai',
        'agents/chapter-15-tool-calling',
        'agents/chapter-16-ai-memory',
      ],
    },
    {
      type: 'category',
      label: '🔗 Part V: MCP & Multi-Agent Systems',
      link: { type: 'doc', id: 'mcp-multi-agent/index' },
      items: [
        'mcp-multi-agent/chapter-17-model-context-protocol',
        'mcp-multi-agent/chapter-18-multi-agent-systems',
        'mcp-multi-agent/chapter-19-ai-workflow-patterns',
      ],
    },
    {
      type: 'category',
      label: '🚀 Part VI: Production AI',
      link: { type: 'doc', id: 'production-ai/index' },
      items: [
        'production-ai/chapter-20-ai-evaluation',
        'production-ai/chapter-21-ai-observability',
        'production-ai/chapter-22-ai-security',
        'production-ai/chapter-23-building-production-ai-apps',
        'production-ai/chapter-24-deploying-ai-applications',
      ],
    },
    {
      type: 'category',
      label: '💻 Part VII: Local AI & AI Development',
      link: { type: 'doc', id: 'local-ai/index' },
      items: [
        'local-ai/chapter-25-local-ai',
        'local-ai/chapter-26-ai-coding-agents',
      ],
    },
    {
      type: 'category',
      label: '🦾 Part VIII: Physical AI',
      link: { type: 'doc', id: 'physical-ai/index' },
      items: [
        'physical-ai/chapter-27-computer-vision',
        'physical-ai/chapter-28-robotics-physical-ai',
        'physical-ai/chapter-29-humanoid-robotics',
      ],
    },
    {
      type: 'category',
      label: '🏁 Part IX: Capstone',
      link: { type: 'doc', id: 'capstone/index' },
      items: [
        'capstone/chapter-30-build-complete-agentic-ai-application',
      ],
    },
    {
      type: 'doc',
      id: 'appendix/glossary',
      label: '📖 Glossary',
    },
    {
      type: 'doc',
      id: 'appendix/further-reading',
      label: '📚 Further Reading',
    },
    {
      type: 'doc',
      id: 'appendix/contributing',
      label: '🤝 Contributing',
    },
  ],
};

export default sidebars;