# 🛠️ OpenClaw Tool Inventory

This document provides the exact signatures for critical MCP tools to ensure autonomous agents do not fail due to 'Tool Not Found' errors.

## 🌐 Browser Control (chrome-devtools)
- `new_page(url: string)`: Creates a new tab.
- `navigate_page(url: string)`: Navigates the current page.
- `take_snapshot()": Captures the a11y tree.
- `click(uid: string)`: Clicks an element.
- `fill_form(elements: {uid: string, value: string}[])`: Fills multiple fields.
- `evaluate_script(function: string)`: Runs JS in the page.

## 📄 Document Operations (PDF)
- `write_pdf(path: string, content: string | object)`: Generates or modifies PDFs.

## 🧠 Cognitive Frameworks
- `sequentialthinking`: Problem decomposition.
- `advanced-reasoning`: Hypothesis/evidence tracking.
- `actor-critic-thinking`: Self-critique loops.

## 📬 Communication
- `himalaya`: Email via CLI.
- `openclaw message send`: WhatsApp/iMessage/Telegram.
