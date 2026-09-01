---
sidebar_position: 3
slug: /appendix/contributing
---

# Contributing to The AI Engineering Handbook

---

Thank you for your interest in contributing! This handbook is a community-driven project, and we welcome contributions of all kinds.

## Ways to Contribute

### 📝 Content Improvements
- Fix typos, grammar, or unclear explanations
- Add missing details or clarify complex topics
- Improve analogies and examples
- Add code examples or improve existing ones

### 🎨 Visual Improvements
- Create or improve architecture diagrams
- Add flowcharts for complex processes
- Improve existing visual assets
- Create interactive visualizations

### 🔧 Technical Improvements
- Fix broken links
- Update outdated API references
- Improve code examples (make them runnable)
- Add missing dependencies or setup instructions

### 🌍 Translation
- Translate chapters to other languages
- Improve existing translations
- Help with localization

### 📚 New Content
- Propose new chapters or sections
- Write case studies
- Add real-world examples
- Create exercises and projects

## Getting Started

### 1. Fork the Repository
```bash
git clone https://github.com/ai-engineering-handbook/ai-engineering-handbook.git
cd ai-engineering-handbook
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run start
```
Visit `http://localhost:3000` to see your changes live.

### 4. Make Your Changes
- Edit files in `docs/` for content
- Edit files in `src/` for components/styles
- Add images to `static/img/`

### 5. Test Your Changes
```bash
npm run build
```
Ensure the build passes without errors.

### 6. Submit a Pull Request
- Push to your fork
- Open a PR against `main`
- Describe your changes clearly

## Writing Guidelines

### Style
- **Clear over clever** — Simple language wins
- **Progressive disclosure** — Start simple, add depth
- **Show, don't just tell** — Use examples, diagrams, code
- **Active voice** — "The model processes..." not "Processing is done by..."

### Structure
Each chapter follows this template:
```markdown
# Chapter Title

## Introduction
## Learning Objectives
## 1. Core Concept
## 2. Why It Matters
## 3. How It Works
## 4. Real-World Example
## 5. Architecture / Diagram
## 6. Practical Example
## 7. Common Mistakes
## 8. Best Practices
## 9. Security / Limitations
## Summary
## Frequently Asked Questions
## Further Reading
```

### Code Examples
- Use Python unless demonstrating something else
- Include comments explaining key steps
- Mark illustrative (non-runnable) code clearly
- Provide requirements/imports

### Diagrams
- Use Mermaid.js for diagrams in Markdown
- Export as SVG for complex diagrams
- Keep consistent style (colors, shapes)
- Include alt text for accessibility

### Links
- Use relative links for internal docs: `/foundations/chapter-1`
- Use absolute URLs for external resources
- Check links work before submitting

## Content Standards

### Accuracy
- Verify technical claims against official documentation
- Distinguish established concepts from emerging features
- Cite sources for research findings
- Mark speculative content clearly

### Completeness
- Target 2,000–3,000 words for major chapters
- Cover: what, why, how, example, diagram, pitfalls
- Include FAQ section
- Link to further reading

### Consistency
- Follow existing terminology (see Glossary)
- Use consistent heading levels
- Match code style across chapters
- Follow diagram conventions

## Review Process

1. **Automated checks** — Build, lint, link check
2. **Maintainer review** — Technical accuracy, style, structure
3. **Community feedback** — Optional discussion period
4. **Merge** — Squash and merge to main

## Code of Conduct

We follow the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). Be respectful, inclusive, and constructive.

## Recognition

Contributors are recognized in:
- `CONTRIBUTORS.md` file
- Release notes
- Contributors page (planned)

## Questions?

- Open a [Discussion](https://github.com/ai-engineering-handbook/ai-engineering-handbook/discussions)
- Join our [Discord](https://discord.gg/ai-engineering-handbook)
- Email: contributors@ai-engineering-handbook.com

---

**Thank you for making this handbook better!** 🙏