# **App Name**: AI Code Review & Rewrite Agent

## Core Features:

- Code Submission Interface: A modern web interface allowing users to paste code into a syntax-highlighted editor, upload files, and select programming languages (Python, JavaScript, Java, C++), and focus areas (bug detection, performance, security, best practices).
- AI Code Review Generation: Upon submission, a backend tool leverages the Groq API (Llama 3.3 70B model) to analyze code, detect bugs, security vulnerabilities, performance issues, and best practice violations. Issues are classified into Critical, High, Medium, or Low severity.
- AI Code Rewrite: A dedicated button triggers an AI-powered tool via the Groq API to refactor the submitted code, producing optimized, production-ready code with improved readability, performance, and added comments explaining improvements.
- Dynamic Output Display: Results are presented in a clean UI featuring the AI review feedback with line-by-line suggestions. Includes a side-by-side comparison panel for 'Original Code' vs. 'Improved Code', both with syntax highlighting.
- Backend API Services: Robust Node.js or Python FastAPI backend providing APIs to receive user code input, manage interactions with the Groq API, process AI responses, and return structured JSON for code review and rewrite features, including comprehensive error handling.
- Code Utility Actions: Enhance user experience with a 'Copy to Clipboard' button for the optimized code and an option to download the rewritten code file, ensuring easy integration into development workflows.

## Style Guidelines:

- Primary interactive color: A vibrant blue-purple (#5447D2) for buttons and highlighted elements, signaling technological sophistication on a dark background. (HSL: 245, 60%, 55%)
- Background color: A very dark, subtle blue-grey (#15161D) providing a deep developer-style theme that enhances readability and reduces eye strain. (HSL: 245, 15%, 10%)
- Accent color: A bright, clear blue (#7BC9FC) used for subtle accents, critical information, or dynamic UI feedback to provide strong contrast. (HSL: 215, 80%, 70%)
- Headlines: 'Space Grotesk' (sans-serif) for a modern, techy, and precise feel that aligns with code analysis. Body text: 'Inter' (sans-serif) for high readability in a neutral and professional manner.
- Code display font: 'Source Code Pro' (monospace) for consistent and clear presentation of code snippets and editor input.
- A distinctive robot icon placed near the application title to reinforce the AI-driven nature of the tool, complemented by modern, minimalist icons for copy and download actions.
- A responsive layout ensuring optimal viewing across devices. The primary interface will feature a prominent code editor input panel and a clear side-by-side display area for code comparison and review output.