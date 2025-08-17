# SmartSetu

**Your Bridge to a Better Future**

SmartSetu is a modern web application designed to streamline user onboarding and document verification, leveraging AI and Firebase for a seamless, secure, and user-friendly experience.

---

## ✨ Core Features

- **Elegant Landing Page**: Includes a visible logo, intuitive navigation (FAQs, Login, Sign Up), and a modern hero section with call-to-action buttons ("Get Started", "About Us").
- **Smooth Navigation**: Page scrolling to specific sections (FAQs, About Us) via navigation links.
- **AI-Powered Document Verification**: Users can upload documents (e.g., Aadhar card, PAN card, shop photo). The system employs AI to verify authenticity.
- **User Authentication & Profiles**: Secure login, registration, and profile management powered by Firebase Authentication and Firestore.
- **Eligibility & Risk Assessment**: AI flows assess loan eligibility, alternative credit scores, and risk based on uploaded data.
- **Chatbot Support**: Integrated chatbot for user assistance and queries.
- **Responsive UI**: Built with Next.js and Radix UI for accessibility and modern aesthetics.

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Firebase account (for backend services)
- Google Gemini API key (for AI features)
- Nix (optional, for reproducible dev environments)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mrashis06/SmartSetu.git
   cd SmartSetu
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment setup:**
   - Copy `.env.example` to `.env` and fill in the required Firebase and Gemini API keys.

4. **Run locally:**
   ```bash
   npm run dev
   ```

---

## 🧩 Project Structure

- `src/app/` – Next.js application pages and layouts
- `src/components/` – Reusable UI and form components
- `src/ai/flows/` – AI-driven business logic for document verification, scoring, and eligibility
- `src/lib/` – Firebase configuration and utilities
- `docs/blueprint.md` – Style guide and UI/UX blueprint

---

## ⚙️ Key Technologies

- **TypeScript** (99%), **Next.js**, **Firebase** (Auth, Firestore)
- **AI**: Google Gemini via Genkit
- **UI**: Radix UI, PT Sans font
- **DevOps**: Nix for reproducible environments

---

## 🎨 Style Guidelines

- **Primary Color:** Light Green `#C2F0C2`
- **Background:** Off-white `#F5FFFA`
- **Accent:** Dark Gray `#4A4A4A`
- **Font:** PT Sans, sans-serif
- **Layout:** Clean, spacious, highly readable

---

## 📄 Document Verification

SmartSetu uses AI to verify:
- **Aadhar Card** (photo upload)
- **PAN Card** (optional, photo upload)
- **Shop Photo** (photo upload)

The AI checks for authenticity, format, and required attributes, ensuring a secure onboarding process.

---

## 🤖 AI Flows

- **verify-documents-flow**: Validates uploaded images (Aadhar, PAN, Shop)
- **alt-score-flow**: Alternative credit scoring
- **chatbot-flow**: User support chatbot
- **risk-score-flow**: Risk assessment for applications
- **loan-eligibility-flow**: Determines eligibility for financial products

---

## 🙋‍♂️ Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

---

## 📜 License

[MIT](LICENSE)

---

## 🏗️ Acknowledgements

- [Next.js](https://nextjs.org/)
- [Firebase](https://firebase.google.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Google Gemini](https://ai.google.dev/)