const { themes } = require('prism-react-renderer');
const lightCodeTheme = themes.github;
const darkCodeTheme = themes.dracula;

const remarkMath = require('remark-math').default || require('remark-math');
const rehypeKatex = require('rehype-katex').default || require('rehype-katex');


/** @type {import('@docusaurus/types').Config} */

const config = {
  title: 'The AI Engineering Handbook',
  tagline: 'From Artificial Intelligence to Agentic AI, RAG, MCP and Physical AI',
  favicon: 'img/favicon.ico',

  // Production URL
  url: 'https://ai-engineering-handbook.com',
  baseUrl: '/',

  // GitHub pages deployment config
  organizationName: 'ai-engineering-handbook',
  projectName: 'ai-engineering-handbook',

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',


  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.ts'),
          editUrl: 'https://github.com/ai-engineering-handbook/ai-engineering-handbook/edit/main/',
          showLastUpdateAuthor: false,
          showLastUpdateTime: false,
          routeBasePath: 'docs',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },





        blog: {
          showReadingTime: true,
          feedOptions: {
            type: 'all',
            copyright: `Copyright © ${new Date().getFullYear()} AI Engineering Handbook.`,
          },
          editUrl: 'https://github.com/ai-engineering-handbook/ai-engineering-handbook/edit/main/',
          blogSidebarTitle: 'All posts',
          blogSidebarCount: 'ALL',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
        sitemap: {
          changefreq: 'weekly',
          priority: 0.5,
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      // Announcement bar for version info
      announcementBar: {
        id: 'version',
        content: '📚 The AI Engineering Handbook — Learn AI from fundamentals to Agentic AI, RAG, MCP & Physical AI',
        backgroundColor: '#1e293b',
        textColor: '#f8fafc',
        isCloseable: true,
      },

      // Color mode
      colorMode: {
        defaultMode: 'light',
        disableSwitch: false,
        respectPrefersColorScheme: true,
      },

      // Navbar
      navbar: {
        title: 'AI Engineering Handbook',
        logo: {
          alt: 'AI Engineering Handbook Logo',
          src: 'img/logo.svg',
          srcDark: 'img/logo.svg',
          href: '/',
          width: 32,
          height: 32,
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'tutorialSidebar',
            position: 'left',
            label: 'Book',
          },
          {
            to: '/blog',
            label: 'Blog',
            position: 'left',
          },
          {
            type: 'dropdown',
            label: 'Parts',
            position: 'left',
            items: [
              { label: 'Part I: Foundations', to: '/docs/foundations' },
              { label: 'Part II: Generative AI', to: '/docs/generative-ai' },
              { label: 'Part III: AI Engineering', to: '/docs/ai-engineering' },
              { label: 'Part IV: AI Agents', to: '/docs/agents' },
              { label: 'Part V: MCP & Multi-Agent', to: '/docs/mcp-multi-agent' },
              { label: 'Part VI: Production AI', to: '/docs/production-ai' },
              { label: 'Part VII: Local AI', to: '/docs/local-ai' },
              { label: 'Part VIII: Physical AI', to: '/docs/physical-ai' },
              { label: 'Part IX: Capstone', to: '/docs/capstone' },
            ],
          },
          {
            href: 'https://github.com/ai-engineering-handbook/ai-engineering-handbook',
            label: 'GitHub',
            position: 'right',
            className: 'navbar-github-link',
          },
        ],
        hideOnScroll: true,
        style: 'primary',
      },

      // Footer
      footer: {
        style: 'dark',
        links: [
          {
            title: 'The Book',
            items: [
              { label: 'Start Reading', to: '/docs/intro' },
              { label: 'Part I: Foundations', to: '/docs/foundations' },
              { label: 'Part II: Generative AI', to: '/docs/generative-ai' },
              { label: 'Part III: AI Engineering', to: '/docs/ai-engineering' },
              { label: 'Part IV: AI Agents', to: '/docs/agents' },
              { label: 'Part V: MCP & Multi-Agent', to: '/docs/mcp-multi-agent' },
              { label: 'Part VI: Production AI', to: '/docs/production-ai' },
              { label: 'Part VII: Local AI', to: '/docs/local-ai' },
              { label: 'Part VIII: Physical AI', to: '/docs/physical-ai' },
              { label: 'Part IX: Capstone', to: '/docs/capstone' },
            ],
          },
          {
            title: 'Resources',
            items: [
              { label: 'GitHub Repository', href: 'https://github.com/ai-engineering-handbook/ai-engineering-handbook' },
              { label: 'Report an Issue', href: 'https://github.com/ai-engineering-handbook/ai-engineering-handbook/issues' },
              { label: 'Discussions', href: 'https://github.com/ai-engineering-handbook/ai-engineering-handbook/discussions' },
              { label: 'Contributing', href: 'https://github.com/ai-engineering-handbook/ai-engineering-handbook/blob/main/CONTRIBUTING.md' },
            ],
          },
          {
            title: 'Community',
            items: [
              { label: 'Discord', href: 'https://discord.gg/ai-engineering-handbook' },
              { label: 'Twitter/X', href: 'https://twitter.com/ai_eng_handbook' },
              { label: 'LinkedIn', href: 'https://linkedin.com/company/ai-engineering-handbook' },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} The AI Engineering Handbook. Built with Docusaurus.`,
      },

      // Prism syntax highlighting
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['python', 'bash', 'yaml', 'json', 'docker', 'toml', 'rust', 'go', 'typescript', 'javascript'],
        magicComments: [
          {
            className: 'theme-code-block-highlighted-line',
            line: 'highlight-next-line',
            block: { start: 'highlight-start', end: 'highlight-end' },
          },
        ],
      },

      // Algolia DocSearch (configure when ready)
      // algolia: {
      //   appId: 'YOUR_APP_ID',
      //   apiKey: 'YOUR_API_KEY',
      //   indexName: 'ai-engineering-handbook',
      // },

      // Table of contents
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 4,
      },

      // Metadata
      metadata: [
        { name: 'keywords', content: 'AI, Machine Learning, Deep Learning, LLMs, RAG, Agents, MCP, Physical AI, AI Engineering' },
        { name: 'description', content: 'The AI Engineering Handbook - A comprehensive guide from AI fundamentals to Agentic AI, RAG, MCP and Physical AI' },
        { name: 'author', content: 'AI Engineering Handbook Contributors' },
        { property: 'og:title', content: 'The AI Engineering Handbook' },
        { property: 'og:description', content: 'From Artificial Intelligence to Agentic AI, RAG, MCP and Physical AI' },
        { property: 'og:type', content: 'website' },
        { property: 'og:image', content: '/img/og-image.png' },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'The AI Engineering Handbook' },
        { name: 'twitter:description', content: 'From Artificial Intelligence to Agentic AI, RAG, MCP and Physical AI' },
        { name: 'twitter:image', content: '/img/og-image.png' },
      ],
    }),

  // Plugins
  plugins: [],


  // Custom fields
  customFields: {
    bookTitle: 'The AI Engineering Handbook',
    bookSubtitle: 'From Artificial Intelligence to Agentic AI, RAG, MCP and Physical AI',
    backendUrl: process.env.REACT_APP_BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'https://tariq761-ai-book.hf.space',
  },


  // Head tags
  headTags: [
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.googleapis.com',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossorigin: 'anonymous',
      },
    },
    {
      tagName: 'link',
      attributes: {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap',
      },
    },
  ],

  // Scripts
  scripts: [
    {
      src: 'https://plausible.io/js/script.js',
      defer: true,
      'data-domain': 'ai-engineering-handbook.com',
    },
  ],

  // Stylesheets
  stylesheets: [
    {
      href: 'https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css',
      type: 'text/css',
      integrity: 'sha384-n8MVd4RsNIU0tAv4ct0nTaAbDJwPJzDEaqSD1odI+WdtXRGWt2kTvGFasHpSy3SV',
      crossorigin: 'anonymous',
    },
  ],
};

module.exports = config;