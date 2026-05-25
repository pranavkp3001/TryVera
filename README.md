# Tryvera — Virtual Try-On & AI Personal Stylist

Tryvera is an interactive web-based Virtual Try-On experience and personal styling dashboard. It allows users to browse an elegant collection of fashion items, strike a pose using their camera, and instantly visualize physical apparel overlays in real-time. 

Additionally, the application performs a complete visual style analysis, suggesting sizing recommendations, complementary color palettes, and professional styling tips catered to the user's appearance.

---

## Key Features

- **Live Media Integration:** Responsive webcam stream integration with high-fidelity canvas frame capture.
- **AI Virtual Try-On:** Powered by the `gemini-2.5-flash-image` model. Dynamically updates targeted clothing layers (tops, bottoms, dresses, or footwear) to fit the user's posture, silhouette, and environment lighting.
- **Aesthetic Analysis:** Uses `gemini-3-flash-preview` to detect skin undertones, output accurate size recommendations, and suggest custom color palettes.
- **Sleek, Modern Interface:** Crafted with React 19, Tailwind CSS, and Lucide icons. Includes interactive category filters, a 3-second animated pose countdown, and active generation states.
- **Client-Side Security:** Built-in credentials handling utilizing local environment files (`.env`) to ensure API key privacy.

---

## Prerequisites

Before running the application locally, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18.x or later recommended)
- [npm](https://www.npmjs.com/) (v9.x or later)
- An active web camera with browser permissions

---

## Local Installation

Follow these steps to clone and launch Tryvera locally:

### 1. Extract and Install Dependencies

```bash
# Navigate to project root directory and install dependencies
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory by copying the example environment file:

```bash
cp .env.example .env
```

Open the newly created `.env` file and insert your Gemini API Key:

```env
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

### 3. Run the Development Server

Start the local Vite dev server:

```bash
npm run dev
```

Your terminal will display the local development address (typically `http://localhost:3000` or `http://localhost:5173`). Open this URL in your web browser to start using Tryvera.

---

## Additional Commands

### Build for Production
To bundle and compile all static assets for a production-ready build:
```bash
npm run build
```
This output is written to the `/dist` directory.

### Preview Production Build
Verify the production build locally before deploy:
```bash
npm run preview
```

### Type Checking
Run TypeScript diagnostics check:
```bash
npm run lint
```

---

## Architecture & Technology Stack

- **Framework:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Build Tool:** [Vite](https://vite.dev/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Iconography:** [Lucide-React](https://lucide.dev/)
- **AI Models:** Google Gemini Multimodal APIs (`@google/genai`)
