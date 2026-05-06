import { ReactNode } from 'react';
import { BookOpen, Code, Terminal, Cpu, Zap, Timer, Globe, Lock } from 'lucide-react';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  readTime: string;
  category: 'Engineering' | 'Product' | 'Tutorial' | 'Update';
  icon: any;
}

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'how-to-contribute',
    title: 'How to write for the DevToolKit Journal',
    excerpt: 'Want to share your knowledge? Here is the guide on how to add new posts to this technical blog.',
    date: 'May 6, 2026',
    author: 'Editor',
    readTime: '3 min',
    category: 'Tutorial',
    icon: BookOpen,
    content: `
# Contributing to the Journal

We love sharing technical insights! Adding a new post is as simple as editing a single TypeScript file.

## Step-by-Step Guide

1. **Locate the data file**: Open \`src/data/blogPosts.ts\`.
2. **Define your content**: Write your article in standard Markdown.
3. **Add to the array**: Create a new object in the \`BLOG_POSTS\` list.

### Required Fields:
- \`id\`: A unique string (kebab-case).
- \`title\`: The heading of your post.
- \`excerpt\`: A teaser for the list view.
- \`content\`: Your full article in Markdown.
- \`icon\`: A Lucide icon component.

Everything is rendered using \`markdown-it\`, so you can use code blocks, tables, and images!
`
  },
  {
    id: 'intro-to-toolkit',
    title: 'Why we built DevToolKit: A story of productivity',
    excerpt: 'Tired of searching for online tools that leak data or have terrible UX? Here is how we unified the dev experience.',
    date: 'May 5, 2026',
    author: 'DevTeam',
    readTime: '5 min',
    category: 'Engineering',
    icon: Zap,
    content: `
# Why we built DevToolKit

In the fast-paced world of software development, context switching is a productivity killer. Whether you're debugging a complex API response, verifying a hash, or simply trying to make sense of a minified JSON blob, you often find yourself jumping between browser tabs, sketchy online tools, and local terminal utilities.

## The Problem with Current Solutions

Most online developer tools suffer from three main issues:
1. **Security**: You're often pasting sensitive data into websites you don't fully trust.
2. **User Experience**: Many tools are cluttered with ads and have clunky interfaces.
3. **Consistency**: Different tools have different behaviors, keyboard shortcuts, and visual styles.

## Our Mission

We built DevToolKit to solve these problems by providing a **unified, high-performance workstation** that runs entirely in your browser.

- **Privacy First**: Everything is processed locally. We never see your data.
- **Crafted UX**: We believe developer tools should be beautiful and intuitive.
- **Speed**: Built with React and optimized for performance.

## What's Next?

We're constantly expanding our library of tools. From image processing to networking utilities, our goal is to be the only tab you need open alongside your IDE.

Stay tuned for more updates!
`
  },
  {
    id: 'mastering-json-formatting',
    title: 'Mastering JSON Formatting and Validation',
    excerpt: 'Beyond just making it pretty—learn how to debug complex JSON structures effectively.',
    date: 'May 3, 2026',
    category: 'Tutorial',
    author: 'CodeArchitect',
    readTime: '8 min',
    icon: Code,
    content: `
# Mastering JSON in Your Workflow

JSON is the lingua franca of the modern web. However, working with deeply nested objects or massive payloads can be challenging.

## The Power of Prettification

Our **JSON Formatter** doesn't just add spaces; it validates the structure. If your JSON is broken, our system identifies the exact character where the syntax error occurs.

### Best Practices for JSON Debugging:
1. **Always Validate First**: Don't waste time looking for logic errors if the syntax is broken.
2. **Use Consistent Indentation**: We provide 2-space and 4-space options to match your project's coding standards.
3. **Minify for Production**: When you're ready to deploy, use our minifier to reduce payload size.

## Did you know?
JSON (JavaScript Object Notation) was originally popularized by Douglas Crockford in the early 2000s as a lightweight alternative to XML.
`
  },
  {
    id: 'security-best-practices-2026',
    title: 'Security Best Practices for Web Utilities',
    excerpt: 'How to handle sensitive data like API keys and passwords without leaving your browser.',
    date: 'April 28, 2026',
    category: 'Update',
    author: 'SecurityLead',
    readTime: '10 min',
    icon: Lock,
    content: `
# Security First: Handling Sensitive Data

As developers, we often handle cryptographic keys, hashes, and authentication tokens. Using web-based tools for these tasks requires extreme caution.

## Browser-Side Processing

DevToolKit leverages the **Web Crypto API** and local processing to ensure that your secrets never leave the client. When you generate a SHA-256 hash or an HMAC, the computation happens in your browser's memory, protected by the Same-Origin Policy.

## Red Flags to Watch For
When using *other* online tools, watch out for:
- Network requests being sent when you click "Generate".
- Lack of HTTPS.
- Excessive tracking cookies.

## Our Commitment
We will never add server-side processing for tools that can be handled locally. Your privacy is our core architectural principle.
`
  }
];
