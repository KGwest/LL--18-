# 🍽️ WD: LL18 – Chef's Twist API Mashup Project

This project is part of **LiveLab 18**, where you'll build a creative recipe app that combines the **MealDB API** with the **OpenAI Chat Completions API**.

## 🚀 Features

- 🔀 Fetch random recipes from the MealDB API
- 🎭 Remix them using OpenAI with fun themes (dessert, pizza, microwave-only, etc.)
- ⭐ Save favorite recipes locally and reload them later
- 🔊 Plays the Law & Order sound when a "food crime" is detected (e.g., fish in a dessert)
- 🎨 Coming soon: AI-generated food images & food mood selector

## 🔑 API Keys & Hosting

### OpenAI API Key Required

This app requires access to the OpenAI API (e.g., `gpt-3.5-turbo`). Because GitHub Pages is static and public:

- ⚠️ **Do NOT include your API key directly in the frontend JavaScript** if deploying publicly.
- 🛡️ For secure deployment, use a **Netlify serverless function** to proxy requests.

### Hosting Options

- ✅ Best: [Netlify](https://netlify.com) with environment variables and serverless support
- ❌ Not Secure: GitHub Pages with API key exposed in client code

## 🧪 Local Setup (Dev Use Only)

```bash
# Clone this repo
git clone https://github.com/YOUR_USERNAME/chefs-twist.git
cd chefs-twist

# Add your OpenAI key (for local dev only)
echo "const OPENAI_API_KEY = 'sk-xxxx...';" > js/api-key.js

Be sure to .gitignore the file or keep it out of your public repo.

📦 APIs Used
🥘 TheMealDB API – for random base recipes

🤖 OpenAI Chat Completions API – for remixed recipe logic

🔊 Optional: law_and_order_dun_dun.mp3 audio file for food crime alert


✨ Remix Themes Supported
Turn it into a dessert

Turn it into a pizza

Remix for breakfast

Make it microwave-friendly

Make it using only gas station ingredients

Make it vegan

🎨 Future Ideas
AI-generated food photos (DALL·E)

Mood-based remixing ("Comfort food", "Midnight snack", etc.)

Shareable recipe cards

yaml
Copy
Edit

