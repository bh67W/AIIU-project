# AI Nutrition Assistant Website

A comprehensive web application featuring two AI-powered tools:
1. **Personalized Nutrition Planner** - Collects user information and generates customized nutrition plans
2. **Meal Scanner** - Analyzes meal images to provide detailed nutritional information and micronutrient breakdown

## 🚀 Features

### Nutrition Planner
- Collects comprehensive user data (age, gender, height, weight, activity level, goals)
- Calculates BMI, BMR, and TDEE
- Generates personalized calorie and macronutrient targets
- Provides meal suggestions based on dietary restrictions
- Offers micronutrient recommendations
- Includes personalized health recommendations

### Meal Scanner
- Upload meal images or capture with camera
- Drag-and-drop image upload support
- AI-powered meal recognition
- Detailed nutritional breakdown (calories, macros, micros)
- Health score calculation
- Nutritional insights and recommendations

## 📁 Project Structure

```
nutrition-ai-website/
├── index.html              # Main HTML file
├── css/
│   └── styles.css         # All styling
├── js/
│   ├── main.js            # Main app logic and API integration
│   ├── nutrition-planner.js  # Nutrition planner functionality
│   └── meal-scanner.js    # Meal scanner functionality
├── images/                # Image assets (add your images here)
└── README.md             # This file
```

## 🛠️ Setup Instructions

### 1. Basic Setup
Simply open `index.html` in a web browser to run the application locally.

### 2. Using a Local Server (Recommended)
For better performance and to avoid CORS issues:

**Using Python:**
```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

**Using Node.js:**
```bash
npx http-server -p 8000
```

**Using VS Code:**
Install the "Live Server" extension and click "Go Live"

Then navigate to `http://localhost:8000`

## 🤖 AI Integration

The application currently uses **mock data** for demonstration. To integrate with actual AI services:

### Option 1: OpenAI API Integration

1. **Get API Key:**
   - Sign up at https://platform.openai.com/
   - Generate an API key

2. **Update `js/main.js`:**
```javascript
class AIServiceAPI {
    constructor() {
        this.apiEndpoint = 'https://api.openai.com/v1';
        this.apiKey = 'YOUR_OPENAI_API_KEY';
    }
}
```

3. **Modify Nutrition Planner (`js/nutrition-planner.js`):**
```javascript
async handleSubmit(e) {
    // Replace generateNutritionPlan with API call
    const response = await window.aiAPI.generateNutritionPlan(formData);
    this.displayResults(response);
}
```

### Option 2: Google Cloud Vision API (for Meal Scanner)

1. **Setup:**
   - Enable Cloud Vision API in Google Cloud Console
   - Create credentials and get API key

2. **Update `js/meal-scanner.js`:**
```javascript
async analyzeMeal() {
    const response = await window.aiAPI.analyzeMealImage(this.currentImage);
    this.displayAnalysis(response);
}
```

### Option 3: Custom Backend API

Create your own backend service:

**Example Node.js/Express Backend:**
```javascript
// server.js
const express = require('express');
const app = express();

app.post('/api/nutrition-plan', async (req, res) => {
    const userData = req.body;
    // Process with your AI model
    const plan = await generatePlan(userData);
    res.json(plan);
});

app.post('/api/meal-analysis', async (req, res) => {
    const image = req.file;
    // Process with your AI model
    const analysis = await analyzeImage(image);
    res.json(analysis);
});
```

**Update frontend:**
```javascript
// js/main.js
class AIServiceAPI {
    constructor() {
        this.apiEndpoint = 'http://localhost:3000/api';
    }
}
```

## 🔧 Customization

### Styling
Edit `css/styles.css` to customize:
- Colors (CSS variables in `:root`)
- Fonts
- Layout
- Animations

### Functionality
- `js/nutrition-planner.js` - Modify calculation formulas, meal suggestions
- `js/meal-scanner.js` - Adjust analysis display, insights generation
- `js/main.js` - Update API integration, utility functions

## 📊 Data Flow

### Nutrition Planner Flow:
```
User Input → Form Validation → Calculate Metrics (BMI, BMR, TDEE) 
→ Generate Macros → Create Meal Plan → Display Results
```

### Meal Scanner Flow:
```
Image Upload → Preview → AI Analysis → Parse Nutritional Data 
→ Calculate Health Score → Generate Insights → Display Results
```

## 🔐 Security Considerations

**Important:** Never expose API keys in frontend code for production!

**Best Practices:**
1. Use environment variables
2. Implement backend proxy for API calls
3. Add authentication/authorization
4. Validate and sanitize all user inputs
5. Implement rate limiting

**Example Backend Proxy:**
```javascript
// Backend handles API calls
app.post('/api/analyze', authenticate, async (req, res) => {
    const result = await callAIService(req.body, process.env.AI_API_KEY);
    res.json(result);
});
```

## 📱 Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design

**Camera feature requires HTTPS in production**

## 🚀 Deployment

### GitHub Pages
1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select branch and folder
4. Access at `https://username.github.io/repo-name`

### Netlify
1. Connect GitHub repository
2. Configure build settings (none needed for static site)
3. Deploy

### Vercel
```bash
npm i -g vercel
vercel
```

## 🔄 Future Enhancements

- [ ] User authentication and profile storage
- [ ] Meal history tracking
- [ ] Progress tracking and charts
- [ ] Export nutrition plans as PDF
- [ ] Integration with fitness trackers
- [ ] Recipe database with nutritional info
- [ ] Barcode scanner for packaged foods
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Social sharing features

## 📝 API Response Examples

### Nutrition Plan API Response:
```json
{
    "personalInfo": {
        "bmi": 22.5,
        "bmiCategory": "Normal weight"
    },
    "calorieGoals": {
        "bmr": 1650,
        "tdee": 2280,
        "target": 1780
    },
    "macronutrients": {
        "protein": 140,
        "carbs": 178,
        "fats": 50
    }
}
```

### Meal Analysis API Response:
```json
{
    "name": "Grilled Chicken Salad",
    "calories": 350,
    "protein": 35,
    "carbs": 25,
    "fats": 12,
    "micronutrients": [
        {"name": "Vitamin A", "amount": "120%", "dv": "Daily Value"}
    ],
    "healthScore": 85
}
```

## 🐛 Troubleshooting

**Issue: Camera not working**
- Ensure HTTPS connection (required for camera access)
- Check browser permissions
- Try different browser

**Issue: Images not uploading**
- Check file size (max recommended: 5MB)
- Verify image format (JPG, PNG supported)
- Check browser console for errors

**Issue: Calculations seem incorrect**
- Verify input values are reasonable
- Check formula implementations in code
- Consult with nutrition professionals for accuracy

## 📄 License

This project is open source and available for educational purposes.

## 👥 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For questions or issues:
- Open an issue on GitHub
- Contact: [your-email@example.com]

## ⚠️ Disclaimer

This application provides general nutritional information and should not be considered medical advice. Always consult with healthcare professionals, registered dietitians, or nutritionists for personalized medical and dietary advice.

---

**Built with ❤️ for better health and nutrition**