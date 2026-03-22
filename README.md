# 🚀 Rocket.Chat AI CLI

AI-powered CLI tool to generate, test, and scaffold Rocket.Chat Apps using LLMs.

---

## ✨ Features

* ⚡ Generate Rocket.Chat app structure instantly
* 🧠 Interactive CLI prompts
* 🤖 AI-powered app generation (`--ai`)
* 📦 Dynamic template generation
* ⚙️ Automatic command file creation

---

## 📦 Installation

git clone https://github.com/sarim-aliii/rocket-chat-ai-cli.git
cd rocket-chat-ai-cli
npm install
npm run build
npm link

---

## 🚀 Usage

### 1. Interactive Mode

create-rc-app my-app

👉 Prompts user for:

* Description
* Author

---

### 2. AI Mode 🤖

create-rc-app task-manager --ai

👉 Automatically generates:

* App description
* Command structure

---

## 📁 Example Output

task-manager/
├── manifest.json
├── App.ts
├── commands/
│   ├── create-task.ts
│   ├── list-task.ts

---

## 🎥 Demo

create-rc-app task-manager --ai

✔ Generating Rocket.Chat app...
✔ AI generating structure...
✔ App 'task-manager' created successfully!


---

## 🧠 How It Works

* Uses LLM (Gemini API) to generate structured JSON
* Parses AI output into:

  * Description
  * Commands
* Dynamically creates files based on AI response

---

## 🎯 GSoC 2026

This project is being developed as part of a Google Summer of Code proposal for Rocket.Chat.

---

## 🔮 Future Scope

* AI-generated API handlers
* Full test suite generation
* Incremental updates (`update app with feature`)
* Multi-model support (OpenAI, Claude)

---

## 👨‍💻 Author

Sarim Ali