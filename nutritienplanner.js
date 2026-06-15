// Nutrition Planner JavaScript

class NutritionPlanner {
    constructor() {
        this.form = document.getElementById('nutrition-form');
        this.resultContainer = document.getElementById('nutrition-result');
        this.outputDiv = document.getElementById('nutrition-output');
        this.resetBtn = document.getElementById('reset-planner');
        
        this.init();
    }

    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this.resetForm());
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        // Collect form data
        const formData = {
            name: document.getElementById('name').value,
            age: parseInt(document.getElementById('age').value),
            gender: document.getElementById('gender').value,
            height: parseFloat(document.getElementById('height').value),
            weight: parseFloat(document.getElementById('weight').value),
            activityLevel: document.getElementById('activity-level').value,
            goal: document.getElementById('goal').value,
            dietaryRestrictions: document.getElementById('dietary-restrictions').value,
            medicalConditions: document.getElementById('medical-conditions').value
        };

        // Show loading state
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loading"></span> Generating Plan...';

        try {
            // Simulate API call (replace with actual AI API integration)
            await this.delay(2000);
            
            // Generate nutrition plan
            const nutritionPlan = this.generateNutritionPlan(formData);
            
            // Display results
            this.displayResults(nutritionPlan);
            
            // Hide form, show results
            this.form.style.display = 'none';
            this.resultContainer.style.display = 'block';
            
        } catch (error) {
            console.error('Error generating nutrition plan:', error);
            alert('An error occurred while generating your nutrition plan. Please try again.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    }

    generateNutritionPlan(data) {
        // Calculate BMI
        const heightInMeters = data.height / 100;
        const bmi = (data.weight / (heightInMeters * heightInMeters)).toFixed(1);
        
        // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
        let bmr;
        if (data.gender === 'male') {
            bmr = (10 * data.weight) + (6.25 * data.height) - (5 * data.age) + 5;
        } else {
            bmr = (10 * data.weight) + (6.25 * data.height) - (5 * data.age) - 161;
        }

        // Calculate TDEE (Total Daily Energy Expenditure)
        const activityMultipliers = {
            'sedentary': 1.2,
            'light': 1.375,
            'moderate': 1.55,
            'active': 1.725,
            'very-active': 1.9
        };
        const tdee = Math.round(bmr * activityMultipliers[data.activityLevel]);

        // Adjust calories based on goal
        let targetCalories;
        let goalDescription;
        switch (data.goal) {
            case 'lose-weight':
                targetCalories = Math.round(tdee - 500);
                goalDescription = 'Weight Loss (0.5 kg/week)';
                break;
            case 'gain-weight':
                targetCalories = Math.round(tdee + 500);
                goalDescription = 'Weight Gain (0.5 kg/week)';
                break;
            case 'muscle-gain':
                targetCalories = Math.round(tdee + 300);
                goalDescription = 'Muscle Building';
                break;
            default:
                targetCalories = tdee;
                goalDescription = 'Weight Maintenance';
        }

        // Calculate macronutrients
        const proteinGrams = Math.round(data.weight * 2); // 2g per kg body weight
        const fatGrams = Math.round((targetCalories * 0.25) / 9); // 25% of calories from fat
        const carbGrams = Math.round((targetCalories - (proteinGrams * 4) - (fatGrams * 9)) / 4);

        // Generate meal suggestions
        const mealSuggestions = this.generateMealSuggestions(data.dietaryRestrictions, data.goal);

        return {
            personalInfo: {
                name: data.name,
                bmi: bmi,
                bmiCategory: this.getBMICategory(bmi)
            },
            calorieGoals: {
                bmr: Math.round(bmr),
                tdee: tdee,
                target: targetCalories,
                goal: goalDescription
            },
            macronutrients: {
                protein: proteinGrams,
                carbs: carbGrams,
                fats: fatGrams
            },
            mealPlan: mealSuggestions,
            recommendations: this.generateRecommendations(data),
            micronutrients: this.getMicronutrientRecommendations(data.age, data.gender)
        };
    }

    getBMICategory(bmi) {
        if (bmi < 18.5) return 'Underweight';
        if (bmi < 25) return 'Normal weight';
        if (bmi < 30) return 'Overweight';
        return 'Obese';
    }

    generateMealSuggestions(restrictions, goal) {
        const baseRestrictions = restrictions.toLowerCase();
        const isVegetarian = baseRestrictions.includes('vegetarian');
        const isVegan = baseRestrictions.includes('vegan');
        const isGlutenFree = baseRestrictions.includes('gluten');

        return {
            breakfast: [
                isVegan ? 'Oatmeal with berries and almond butter' : 'Greek yogurt with granola and fruit',
                'Smoothie bowl with protein powder',
                isGlutenFree ? 'Scrambled eggs with vegetables' : 'Whole grain toast with avocado'
            ],
            lunch: [
                isVegan ? 'Quinoa Buddha bowl with chickpeas' : 'Grilled chicken salad',
                'Lentil soup with vegetables',
                isVegetarian ? 'Veggie wrap with hummus' : 'Turkey and avocado sandwich'
            ],
            dinner: [
                isVegan ? 'Tofu stir-fry with brown rice' : 'Baked salmon with sweet potato',
                'Vegetable curry with quinoa',
                isVegetarian ? 'Eggplant parmesan' : 'Lean beef with roasted vegetables'
            ],
            snacks: [
                'Mixed nuts and seeds',
                'Fresh fruit',
                'Vegetable sticks with hummus',
                'Protein shake'
            ]
        };
    }

    generateRecommendations(data) {
        const recommendations = [];

        // Hydration
        const waterIntake = Math.round(data.weight * 0.033);
        recommendations.push(`Drink at least ${waterIntake} liters of water daily`);

        // Exercise
        if (data.activityLevel === 'sedentary') {
            recommendations.push('Aim for at least 30 minutes of moderate exercise daily');
        }

        // Sleep
        recommendations.push('Get 7-9 hours of quality sleep each night');

        // Meal timing
        recommendations.push('Eat 4-5 smaller meals throughout the day to maintain energy levels');

        // Specific to goal
        if (data.goal === 'muscle-gain') {
            recommendations.push('Consume protein within 30 minutes after workouts');
            recommendations.push('Focus on progressive overload in strength training');
        } else if (data.goal === 'lose-weight') {
            recommendations.push('Create a consistent meal schedule to avoid overeating');
            recommendations.push('Include high-fiber foods to increase satiety');
        }

        // Medical conditions
        if (data.medicalConditions) {
            recommendations.push('⚠️ Consult with your healthcare provider about your specific medical conditions');
        }

        return recommendations;
    }

    getMicronutrientRecommendations(age, gender) {
        return [
            { name: 'Vitamin D', amount: '600-800 IU', source: 'Sunlight, fatty fish, fortified dairy' },
            { name: 'Vitamin B12', amount: '2.4 mcg', source: 'Meat, fish, dairy, fortified cereals' },
            { name: 'Iron', amount: gender === 'female' ? '18 mg' : '8 mg', source: 'Red meat, beans, spinach' },
            { name: 'Calcium', amount: '1000-1200 mg', source: 'Dairy, leafy greens, fortified foods' },
            { name: 'Omega-3', amount: '250-500 mg', source: 'Fatty fish, walnuts, flaxseeds' },
            { name: 'Magnesium', amount: '310-420 mg', source: 'Nuts, seeds, whole grains, leafy greens' }
        ];
    }

    displayResults(plan) {
        this.outputDiv.innerHTML = `
            <div class="plan-section">
                <h4>👤 Personal Assessment</h4>
                <p><strong>BMI:</strong> ${plan.personalInfo.bmi} (${plan.personalInfo.bmiCategory})</p>
            </div>

            <div class="plan-section">
                <h4>🎯 Daily Calorie Goals</h4>
                <p><strong>Basal Metabolic Rate (BMR):</strong> ${plan.calorieGoals.bmr} calories</p>
                <p><strong>Total Daily Energy Expenditure (TDEE):</strong> ${plan.calorieGoals.tdee} calories</p>
                <p><strong>Target Calories:</strong> ${plan.calorieGoals.target} calories</p>
                <p><strong>Goal:</strong> ${plan.calorieGoals.goal}</p>
            </div>

            <div class="plan-section">
                <h4>🥗 Macronutrient Distribution</h4>
                <div class="nutrient-grid">
                    <div class="nutrient-card">
                        <h5>Protein</h5>
                        <p><strong>${plan.macronutrients.protein}g</strong> per day</p>
                        <p>${Math.round((plan.macronutrients.protein * 4 / plan.calorieGoals.target) * 100)}% of calories</p>
                    </div>
                    <div class="nutrient-card">
                        <h5>Carbohydrates</h5>
                        <p><strong>${plan.macronutrients.carbs}g</strong> per day</p>
                        <p>${Math.round((plan.macronutrients.carbs * 4 / plan.calorieGoals.target) * 100)}% of calories</p>
                    </div>
                    <div class="nutrient-card">
                        <h5>Fats</h5>
                        <p><strong>${plan.macronutrients.fats}g</strong> per day</p>
                        <p>${Math.round((plan.macronutrients.fats * 9 / plan.calorieGoals.target) * 100)}% of calories</p>
                    </div>
                </div>
            </div>

            <div class="plan-section">
                <h4>🍽️ Sample Meal Plan</h4>
                <p><strong>Breakfast Options:</strong></p>
                <ul>
                    ${plan.mealPlan.breakfast.map(meal => `<li>${meal}</li>`).join('')}
                </ul>
                <p><strong>Lunch Options:</strong></p>
                <ul>
                    ${plan.mealPlan.lunch.map(meal => `<li>${meal}</li>`).join('')}
                </ul>
                <p><strong>Dinner Options:</strong></p>
                <ul>
                    ${plan.mealPlan.dinner.map(meal => `<li>${meal}</li>`).join('')}
                </ul>
                <p><strong>Snack Options:</strong></p>
                <ul>
                    ${plan.mealPlan.snacks.map(snack => `<li>${snack}</li>`).join('')}
                </ul>
            </div>

            <div class="plan-section">
                <h4>💊 Key Micronutrients</h4>
                <div class="nutrient-grid">
                    ${plan.micronutrients.map(nutrient => `
                        <div class="nutrient-card">
                            <h5>${nutrient.name}</h5>
                            <p><strong>${nutrient.amount}</strong></p>
                            <p style="font-size: 0.85rem;">${nutrient.source}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="plan-section">
                <h4>💡 Personalized Recommendations</h4>
                <ul>
                    ${plan.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                </ul>
            </div>

            <div class="plan-section" style="background-color: #fff3cd; padding: 1rem; border-radius: 5px; margin-top: 1rem;">
                <p style="margin: 0;"><strong>⚠️ Important:</strong> This is a general nutrition plan. For personalized medical advice, please consult with a registered dietitian or healthcare professional.</p>
            </div>
        `;
    }

    resetForm() {
        this.form.reset();
        this.form.style.display = 'block';
        this.resultContainer.style.display = 'none';
        this.form.scrollIntoView({ behavior: 'smooth' });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NutritionPlanner();
});

// Made with Bob
