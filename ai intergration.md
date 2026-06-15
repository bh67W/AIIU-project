# API Integration Guide for AI Nutrition Assistant

This guide provides detailed instructions for integrating various AI services into your nutrition website.

## Table of Contents
1. [OpenAI Integration](#openai-integration)
2. [Google Cloud Vision API](#google-cloud-vision-api)
3. [Custom AI Model Integration](#custom-ai-model-integration)
4. [Nutritionix API](#nutritionix-api)
5. [Security Best Practices](#security-best-practices)

---

## OpenAI Integration

### For Nutrition Plan Generation

**Step 1: Get API Key**
```bash
# Sign up at https://platform.openai.com/
# Navigate to API Keys section
# Create new secret key
```

**Step 2: Update `js/nutrition-planner.js`**

Replace the `generateNutritionPlan` method with:

```javascript
async generateNutritionPlan(data) {
    const prompt = `Create a personalized nutrition plan for:
    - Age: ${data.age}, Gender: ${data.gender}
    - Height: ${data.height}cm, Weight: ${data.weight}kg
    - Activity Level: ${data.activityLevel}
    - Goal: ${data.goal}
    - Dietary Restrictions: ${data.dietaryRestrictions}
    - Medical Conditions: ${data.medicalConditions}
    
    Provide: BMI, BMR, TDEE, target calories, macronutrient breakdown, 
    meal suggestions, and micronutrient recommendations in JSON format.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${window.aiAPI.apiKey}`
        },
        body: JSON.stringify({
            model: 'gpt-4',
            messages: [
                {
                    role: 'system',
                    content: 'You are a professional nutritionist and dietitian.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 2000
        })
    });

    const result = await response.json();
    return JSON.parse(result.choices[0].message.content);
}
```

---

## Google Cloud Vision API

### For Meal Image Analysis

**Step 1: Setup**
```bash
# 1. Go to Google Cloud Console
# 2. Create new project
# 3. Enable Cloud Vision API
# 4. Create credentials (API Key)
```

**Step 2: Update `js/meal-scanner.js`**

```javascript
async analyzeMeal() {
    // Convert image to base64
    const base64Image = await this.imageToBase64(this.currentImage);
    
    // Call Google Vision API
    const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${window.aiAPI.apiKey}`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                requests: [{
                    image: { content: base64Image },
                    features: [
                        { type: 'LABEL_DETECTION', maxResults: 10 },
                        { type: 'WEB_DETECTION', maxResults: 5 }
                    ]
                }]
            })
        }
    );

    const result = await response.json();
    const labels = result.responses[0].labelAnnotations;
    
    // Use labels to determine meal type and get nutrition data
    const mealType = this.determineMealType(labels);
    const nutritionData = await this.getNutritionData(mealType);
    
    return nutritionData;
}

imageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}
```

---

## Custom AI Model Integration

### Using TensorFlow.js for Client-Side Analysis

**Step 1: Install TensorFlow.js**

Add to `index.html`:
```html
<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest"></script>
<script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/mobilenet@latest"></script>
```

**Step 2: Implement Model Loading**

```javascript
class MealScanner {
    constructor() {
        this.model = null;
        this.loadModel();
        // ... rest of constructor
    }

    async loadModel() {
        try {
            this.model = await mobilenet.load();
            console.log('Model loaded successfully');
        } catch (error) {
            console.error('Error loading model:', error);
        }
    }

    async analyzeMeal() {
        if (!this.model) {
            alert('Model is still loading, please wait...');
            return;
        }

        const img = document.getElementById('preview-img');
        const predictions = await this.model.classify(img);
        
        // Map predictions to nutrition data
        const nutritionData = await this.mapPredictionsToNutrition(predictions);
        this.displayAnalysis(nutritionData);
    }

    async mapPredictionsToNutrition(predictions) {
        // Use predictions to query nutrition database
        const topPrediction = predictions[0].className;
        return await this.getNutritionFromDatabase(topPrediction);
    }
}
```

---

## Nutritionix API

### For Accurate Nutrition Data

**Step 1: Get API Credentials**
```bash
# Sign up at https://www.nutritionix.com/business/api
# Get App ID and API Key
```

**Step 2: Create Nutrition Database Helper**

Create `js/nutrition-database.js`:

```javascript
class NutritionDatabase {
    constructor() {
        this.appId = 'YOUR_NUTRITIONIX_APP_ID';
        this.apiKey = 'YOUR_NUTRITIONIX_API_KEY';
        this.endpoint = 'https://trackapi.nutritionix.com/v2';
    }

    async searchFood(query) {
        const response = await fetch(`${this.endpoint}/search/instant`, {
            method: 'GET',
            headers: {
                'x-app-id': this.appId,
                'x-app-key': this.apiKey,
                'Content-Type': 'application/json'
            },
            params: { query }
        });

        return await response.json();
    }

    async getNutrients(foodName) {
        const response = await fetch(`${this.endpoint}/natural/nutrients`, {
            method: 'POST',
            headers: {
                'x-app-id': this.appId,
                'x-app-key': this.apiKey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query: foodName
            })
        });

        const data = await response.json();
        return this.formatNutritionData(data.foods[0]);
    }

    formatNutritionData(food) {
        return {
            name: food.food_name,
            calories: food.nf_calories,
            protein: food.nf_protein,
            carbs: food.nf_total_carbohydrate,
            fats: food.nf_total_fat,
            fiber: food.nf_dietary_fiber,
            micronutrients: [
                { name: 'Sodium', amount: `${food.nf_sodium}mg` },
                { name: 'Potassium', amount: `${food.nf_potassium}mg` },
                { name: 'Cholesterol', amount: `${food.nf_cholesterol}mg` }
            ]
        };
    }
}
```

---

## Backend Proxy Setup (Recommended)

### Node.js/Express Backend

**Step 1: Create Backend**

```javascript
// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Nutrition Plan Endpoint
app.post('/api/nutrition-plan', async (req, res) => {
    try {
        const userData = req.body;
        
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: 'gpt-4',
                messages: [
                    {
                        role: 'system',
                        content: 'You are a professional nutritionist.'
                    },
                    {
                        role: 'user',
                        content: `Create nutrition plan for: ${JSON.stringify(userData)}`
                    }
                ]
            },
            {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate plan' });
    }
});

// Meal Analysis Endpoint
app.post('/api/meal-analysis', async (req, res) => {
    try {
        const { image } = req.body;
        
        // Call your AI service
        const analysis = await analyzeImage(image);
        
        res.json(analysis);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to analyze meal' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```

**Step 2: Environment Variables**

Create `.env` file:
```env
OPENAI_API_KEY=your_openai_key_here
GOOGLE_VISION_API_KEY=your_google_key_here
NUTRITIONIX_APP_ID=your_app_id_here
NUTRITIONIX_API_KEY=your_api_key_here
PORT=3000
```

**Step 3: Update Frontend**

```javascript
// js/main.js
class AIServiceAPI {
    constructor() {
        this.apiEndpoint = 'http://localhost:3000/api';
        // No API keys in frontend!
    }

    async generateNutritionPlan(userData) {
        const response = await fetch(`${this.apiEndpoint}/nutrition-plan`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

        return await response.json();
    }
}
```

---

## Security Best Practices

### 1. Never Expose API Keys in Frontend

❌ **Bad:**
```javascript
const apiKey = 'sk-abc123...'; // Visible in browser
```

✅ **Good:**
```javascript
// Backend handles API calls
// Frontend only calls your backend
```

### 2. Implement Rate Limiting

```javascript
// Backend with rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### 3. Input Validation

```javascript
// Validate user input
function validateNutritionInput(data) {
    if (!data.age || data.age < 1 || data.age > 120) {
        throw new Error('Invalid age');
    }
    if (!data.weight || data.weight < 20 || data.weight > 500) {
        throw new Error('Invalid weight');
    }
    // ... more validations
    return true;
}
```

### 4. HTTPS Only

```javascript
// Redirect HTTP to HTTPS
app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
        res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
        next();
    }
});
```

### 5. CORS Configuration

```javascript
const corsOptions = {
    origin: 'https://yourdomain.com',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
```

---

## Testing Your Integration

### Test Nutrition Planner
```javascript
// Test data
const testUser = {
    name: 'Test User',
    age: 30,
    gender: 'male',
    height: 175,
    weight: 75,
    activityLevel: 'moderate',
    goal: 'maintain',
    dietaryRestrictions: 'none',
    medicalConditions: 'none'
};

// Test API call
window.aiAPI.generateNutritionPlan(testUser)
    .then(result => console.log('Success:', result))
    .catch(error => console.error('Error:', error));
```

### Test Meal Scanner
```javascript
// Create test image
const testImage = new File(['test'], 'test.jpg', { type: 'image/jpeg' });

// Test API call
window.aiAPI.analyzeMealImage(testImage)
    .then(result => console.log('Success:', result))
    .catch(error => console.error('Error:', error));
```

---

## Troubleshooting

### Common Issues

**CORS Errors:**
- Use backend proxy
- Configure CORS properly
- Check API endpoint URLs

**API Key Issues:**
- Verify key is active
- Check billing/quota limits
- Ensure proper authorization headers

**Image Upload Fails:**
- Check file size limits
- Verify image format
- Test with smaller images

**Slow Response Times:**
- Implement caching
- Use CDN for assets
- Optimize image sizes before upload

---

## Additional Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Google Cloud Vision API](https://cloud.google.com/vision/docs)
- [TensorFlow.js Guide](https://www.tensorflow.org/js)
- [Nutritionix API Docs](https://docs.nutritionix.com/)

---

**Need Help?** Open an issue on GitHub or contact support.