# Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Step 1: Open the Website
The website should already be open in your browser. If not:
- Navigate to `nutrition-ai-website` folder
- Double-click `index.html`

### Step 2: Test the Nutrition Planner
1. Click "Create Nutrition Plan" button or scroll to the Nutrition Planner section
2. Fill out the form with your information:
   - Name, age, gender
   - Height and weight
   - Activity level
   - Health goals
   - Any dietary restrictions
3. Click "Generate My Nutrition Plan"
4. View your personalized nutrition plan with:
   - BMI and metabolic calculations
   - Daily calorie targets
   - Macronutrient breakdown
   - Meal suggestions
   - Micronutrient recommendations

### Step 3: Test the Meal Scanner
1. Scroll to the Meal Scanner section
2. Either:
   - Click "Choose Image" to upload a meal photo
   - Click "Use Camera" to take a photo (requires camera permissions)
   - Drag and drop an image onto the upload area
3. Click "Analyze Meal"
4. View the nutritional analysis including:
   - Detected meal name
   - Calorie count
   - Macro and micronutrient breakdown
   - Health score
   - Nutritional insights

## 📝 Current Status

**The website is fully functional with DEMO DATA:**
- ✅ All forms work
- ✅ Calculations are accurate
- ✅ UI is responsive and polished
- ⚠️ Uses mock AI responses (not connected to real AI yet)

## 🔌 Next Steps: Connect Real AI

To connect actual AI services, follow these guides:

### Option 1: Quick Setup (Recommended for Testing)
Use the mock data as-is for demonstrations and testing.

### Option 2: Add Real AI (For Production)
1. Read `API_INTEGRATION_GUIDE.md` for detailed instructions
2. Choose your AI service:
   - **OpenAI** - For nutrition plan generation
   - **Google Cloud Vision** - For meal image recognition
   - **Nutritionix API** - For accurate nutrition data
3. Update the API endpoints in `js/main.js`
4. Implement backend proxy for security (recommended)

## 🎨 Customization

### Change Colors
Edit `css/styles.css` - look for the `:root` section:
```css
:root {
    --primary-color: #4CAF50;  /* Change this */
    --secondary-color: #2196F3; /* And this */
}
```

### Modify Calculations
Edit `js/nutrition-planner.js` - look for the `generateNutritionPlan` method

### Update Meal Analysis
Edit `js/meal-scanner.js` - look for the `generateMockAnalysis` method

## 🌐 Deployment Options

### GitHub Pages (Free)
1. Create GitHub repository
2. Push your code
3. Enable GitHub Pages in settings
4. Access at `https://yourusername.github.io/repo-name`

### Netlify (Free)
1. Drag and drop the `nutrition-ai-website` folder to Netlify
2. Get instant URL

### Local Server (For Development)
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx http-server -p 8000
```

## 📱 Features Overview

### Nutrition Planner Features:
- ✅ BMI calculation
- ✅ BMR (Basal Metabolic Rate) calculation
- ✅ TDEE (Total Daily Energy Expenditure) calculation
- ✅ Personalized calorie targets based on goals
- ✅ Macronutrient distribution (protein, carbs, fats)
- ✅ Meal suggestions based on dietary restrictions
- ✅ Micronutrient recommendations
- ✅ Personalized health tips

### Meal Scanner Features:
- ✅ Image upload (drag & drop or click)
- ✅ Camera capture support
- ✅ Meal recognition (demo mode)
- ✅ Calorie estimation
- ✅ Macro and micronutrient breakdown
- ✅ Health score calculation
- ✅ Nutritional insights and recommendations

## 🐛 Troubleshooting

**Website doesn't load properly:**
- Clear browser cache
- Try a different browser
- Check browser console for errors (F12)

**Camera doesn't work:**
- Grant camera permissions when prompted
- Use HTTPS (required for camera access)
- Try the upload option instead

**Calculations seem wrong:**
- Verify input values are reasonable
- Check that all required fields are filled
- Consult the formulas in `js/nutrition-planner.js`

## 💡 Tips for Your Internship Project

1. **Demo the Current Version:**
   - The mock data looks professional and realistic
   - Perfect for presentations and proof-of-concept

2. **Document Your Work:**
   - Keep notes on what AI services you plan to integrate
   - Document any customizations you make

3. **Plan Your AI Integration:**
   - Research which AI APIs best fit your needs
   - Consider costs and rate limits
   - Plan for backend implementation

4. **Test Thoroughly:**
   - Try different user inputs
   - Test on mobile devices
   - Check all edge cases

5. **Gather Feedback:**
   - Show to potential users
   - Note what features they want
   - Iterate based on feedback

## 📚 Additional Resources

- `README.md` - Full project documentation
- `API_INTEGRATION_GUIDE.md` - Detailed AI integration instructions
- Browser DevTools (F12) - For debugging

## 🎯 Project Checklist

- [x] Website structure created
- [x] Nutrition planner implemented
- [x] Meal scanner implemented
- [x] Responsive design
- [x] Documentation complete
- [ ] Connect to real AI services
- [ ] Deploy to production
- [ ] User testing
- [ ] Final presentation

## 🤝 Need Help?

- Check the browser console (F12) for errors
- Review the documentation files
- Test with different inputs
- Verify all files are in correct locations

---

**Congratulations! Your AI Nutrition Assistant website is ready to use! 🎉**

Start by testing both features, then move on to integrating real AI services when ready.