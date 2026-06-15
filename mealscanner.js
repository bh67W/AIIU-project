// Meal Scanner JavaScript

class MealScanner {
    constructor() {
        this.uploadArea = document.getElementById('upload-area');
        this.fileInput = document.getElementById('meal-image');
        this.uploadBtn = document.getElementById('upload-btn');
        this.cameraBtn = document.getElementById('camera-btn');
        this.imagePreview = document.getElementById('image-preview');
        this.previewImg = document.getElementById('preview-img');
        this.analyzeBtn = document.getElementById('analyze-btn');
        this.clearBtn = document.getElementById('clear-image');
        this.resultContainer = document.getElementById('scanner-result');
        this.outputDiv = document.getElementById('scanner-output');
        this.resetBtn = document.getElementById('reset-scanner');
        
        this.currentImage = null;
        
        this.init();
    }

    init() {
        // Upload button click
        if (this.uploadBtn) {
            this.uploadBtn.addEventListener('click', () => this.fileInput.click());
        }

        // Camera button click
        if (this.cameraBtn) {
            this.cameraBtn.addEventListener('click', () => this.openCamera());
        }

        // File input change
        if (this.fileInput) {
            this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        }

        // Drag and drop
        if (this.uploadArea) {
            this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
            this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
        }

        // Analyze button
        if (this.analyzeBtn) {
            this.analyzeBtn.addEventListener('click', () => this.analyzeMeal());
        }

        // Clear button
        if (this.clearBtn) {
            this.clearBtn.addEventListener('click', () => this.clearImage());
        }

        // Reset button
        if (this.resetBtn) {
            this.resetBtn.addEventListener('click', () => this.resetScanner());
        }
    }

    handleDragOver(e) {
        e.preventDefault();
        this.uploadArea.style.borderColor = 'var(--primary-color)';
    }

    handleDrop(e) {
        e.preventDefault();
        this.uploadArea.style.borderColor = 'var(--border-color)';
        
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            this.displayImage(files[0]);
        }
    }

    handleFileSelect(e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            this.displayImage(file);
        }
    }

    async openCamera() {
        try {
            // Check if camera is available
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            
            // Create video element for camera preview
            const video = document.createElement('video');
            video.srcObject = stream;
            video.autoplay = true;
            video.style.maxWidth = '100%';
            video.style.borderRadius = '10px';
            
            // Create capture button
            const captureBtn = document.createElement('button');
            captureBtn.textContent = 'Capture Photo';
            captureBtn.className = 'btn btn-primary';
            captureBtn.style.marginTop = '1rem';
            
            // Clear upload area and show camera
            const uploadContent = this.uploadArea.querySelector('.upload-content');
            uploadContent.style.display = 'none';
            this.uploadArea.appendChild(video);
            this.uploadArea.appendChild(captureBtn);
            
            // Capture photo
            captureBtn.addEventListener('click', () => {
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                canvas.getContext('2d').drawImage(video, 0, 0);
                
                // Convert to blob
                canvas.toBlob((blob) => {
                    const file = new File([blob], 'camera-capture.jpg', { type: 'image/jpeg' });
                    this.displayImage(file);
                    
                    // Stop camera
                    stream.getTracks().forEach(track => track.stop());
                    video.remove();
                    captureBtn.remove();
                    uploadContent.style.display = 'flex';
                });
            });
            
        } catch (error) {
            console.error('Camera access error:', error);
            alert('Unable to access camera. Please check permissions or use the upload option.');
        }
    }

    displayImage(file) {
        this.currentImage = file;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            this.previewImg.src = e.target.result;
            this.uploadArea.querySelector('.upload-content').style.display = 'none';
            this.imagePreview.style.display = 'flex';
        };
        reader.readAsDataURL(file);
    }

    clearImage() {
        this.currentImage = null;
        this.previewImg.src = '';
        this.fileInput.value = '';
        this.uploadArea.querySelector('.upload-content').style.display = 'flex';
        this.imagePreview.style.display = 'none';
    }

    async analyzeMeal() {
        if (!this.currentImage) {
            alert('Please select an image first');
            return;
        }

        // Show loading state
        const originalText = this.analyzeBtn.textContent;
        this.analyzeBtn.disabled = true;
        this.analyzeBtn.innerHTML = '<span class="loading"></span> Analyzing...';

        try {
            // Simulate API call to AI service (replace with actual AI API integration)
            await this.delay(2500);
            
            // Generate mock analysis (in production, this would come from AI)
            const analysis = this.generateMockAnalysis();
            
            // Display results
            this.displayAnalysis(analysis);
            
            // Hide upload area, show results
            this.uploadArea.style.display = 'none';
            this.resultContainer.style.display = 'block';
            
        } catch (error) {
            console.error('Error analyzing meal:', error);
            alert('An error occurred while analyzing the meal. Please try again.');
        } finally {
            this.analyzeBtn.disabled = false;
            this.analyzeBtn.textContent = originalText;
        }
    }

    generateMockAnalysis() {
        // This is mock data - in production, replace with actual AI analysis
        const mealTypes = [
            {
                name: 'Grilled Chicken Salad',
                calories: 350,
                protein: 35,
                carbs: 25,
                fats: 12,
                fiber: 8,
                micronutrients: [
                    { name: 'Vitamin A', amount: '120%', dv: 'Daily Value' },
                    { name: 'Vitamin C', amount: '85%', dv: 'Daily Value' },
                    { name: 'Iron', amount: '15%', dv: 'Daily Value' },
                    { name: 'Calcium', amount: '20%', dv: 'Daily Value' },
                    { name: 'Potassium', amount: '25%', dv: 'Daily Value' },
                    { name: 'Vitamin K', amount: '150%', dv: 'Daily Value' }
                ],
                ingredients: ['Grilled chicken breast', 'Mixed greens', 'Cherry tomatoes', 'Cucumber', 'Olive oil dressing'],
                healthScore: 85
            },
            {
                name: 'Salmon with Vegetables',
                calories: 420,
                protein: 38,
                carbs: 18,
                fats: 22,
                fiber: 6,
                micronutrients: [
                    { name: 'Omega-3 Fatty Acids', amount: '2.5g', dv: 'Excellent source' },
                    { name: 'Vitamin D', amount: '90%', dv: 'Daily Value' },
                    { name: 'Vitamin B12', amount: '150%', dv: 'Daily Value' },
                    { name: 'Selenium', amount: '80%', dv: 'Daily Value' },
                    { name: 'Potassium', amount: '30%', dv: 'Daily Value' },
                    { name: 'Vitamin A', amount: '45%', dv: 'Daily Value' }
                ],
                ingredients: ['Baked salmon fillet', 'Broccoli', 'Carrots', 'Bell peppers', 'Lemon'],
                healthScore: 92
            },
            {
                name: 'Pasta with Tomato Sauce',
                calories: 480,
                protein: 18,
                carbs: 72,
                fats: 14,
                fiber: 8,
                micronutrients: [
                    { name: 'Vitamin C', amount: '35%', dv: 'Daily Value' },
                    { name: 'Iron', amount: '25%', dv: 'Daily Value' },
                    { name: 'Vitamin B6', amount: '20%', dv: 'Daily Value' },
                    { name: 'Folate', amount: '30%', dv: 'Daily Value' },
                    { name: 'Manganese', amount: '40%', dv: 'Daily Value' },
                    { name: 'Copper', amount: '25%', dv: 'Daily Value' }
                ],
                ingredients: ['Whole wheat pasta', 'Tomato sauce', 'Garlic', 'Basil', 'Parmesan cheese'],
                healthScore: 72
            }
        ];

        // Randomly select a meal type for demo purposes
        return mealTypes[Math.floor(Math.random() * mealTypes.length)];
    }

    displayAnalysis(analysis) {
        const totalMacros = analysis.protein + analysis.carbs + analysis.fats;
        const proteinPercent = Math.round((analysis.protein / totalMacros) * 100);
        const carbsPercent = Math.round((analysis.carbs / totalMacros) * 100);
        const fatsPercent = Math.round((analysis.fats / totalMacros) * 100);

        this.outputDiv.innerHTML = `
            <div class="analysis-section">
                <h4>🍽️ Detected Meal: ${analysis.name}</h4>
                <div style="background-color: ${this.getHealthScoreColor(analysis.healthScore)}; padding: 0.5rem 1rem; border-radius: 5px; display: inline-block; margin-top: 0.5rem;">
                    <strong>Health Score: ${analysis.healthScore}/100</strong>
                </div>
            </div>

            <div class="analysis-section">
                <h4>📊 Nutritional Information</h4>
                <div style="background-color: var(--bg-white); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
                    <p style="font-size: 1.2rem; margin-bottom: 0.5rem;"><strong>Total Calories: ${analysis.calories} kcal</strong></p>
                    <p style="color: var(--text-light);">Fiber: ${analysis.fiber}g</p>
                </div>
            </div>

            <div class="analysis-section">
                <h4>🥗 Macronutrient Breakdown</h4>
                <div class="nutrient-grid">
                    <div class="nutrient-card">
                        <h5>Protein</h5>
                        <p><strong>${analysis.protein}g</strong></p>
                        <p>${proteinPercent}% of macros</p>
                        <p style="font-size: 0.85rem; color: var(--text-light);">${analysis.protein * 4} calories</p>
                    </div>
                    <div class="nutrient-card">
                        <h5>Carbohydrates</h5>
                        <p><strong>${analysis.carbs}g</strong></p>
                        <p>${carbsPercent}% of macros</p>
                        <p style="font-size: 0.85rem; color: var(--text-light);">${analysis.carbs * 4} calories</p>
                    </div>
                    <div class="nutrient-card">
                        <h5>Fats</h5>
                        <p><strong>${analysis.fats}g</strong></p>
                        <p>${fatsPercent}% of macros</p>
                        <p style="font-size: 0.85rem; color: var(--text-light);">${analysis.fats * 9} calories</p>
                    </div>
                </div>
            </div>

            <div class="analysis-section">
                <h4>💊 Key Micronutrients</h4>
                <div class="nutrient-grid">
                    ${analysis.micronutrients.map(nutrient => `
                        <div class="nutrient-card">
                            <h5>${nutrient.name}</h5>
                            <p><strong>${nutrient.amount}</strong></p>
                            <p style="font-size: 0.85rem; color: var(--text-light);">${nutrient.dv}</p>
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="analysis-section">
                <h4>🔍 Detected Ingredients</h4>
                <ul>
                    ${analysis.ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
                </ul>
            </div>

            <div class="analysis-section">
                <h4>💡 Nutritional Insights</h4>
                <ul>
                    ${this.generateInsights(analysis).map(insight => `<li>${insight}</li>`).join('')}
                </ul>
            </div>

            <div class="analysis-section" style="background-color: #d1ecf1; padding: 1rem; border-radius: 5px; margin-top: 1rem;">
                <p style="margin: 0;"><strong>ℹ️ Note:</strong> This analysis is AI-generated and provides estimates. Actual nutritional values may vary based on portion sizes and preparation methods.</p>
            </div>
        `;
    }

    getHealthScoreColor(score) {
        if (score >= 80) return '#d4edda';
        if (score >= 60) return '#fff3cd';
        return '#f8d7da';
    }

    generateInsights(analysis) {
        const insights = [];

        // Protein insights
        if (analysis.protein >= 30) {
            insights.push('✅ Excellent protein content - great for muscle maintenance and satiety');
        } else if (analysis.protein < 15) {
            insights.push('⚠️ Low protein content - consider adding a protein source');
        }

        // Fiber insights
        if (analysis.fiber >= 8) {
            insights.push('✅ High fiber content - supports digestive health');
        } else if (analysis.fiber < 3) {
            insights.push('⚠️ Low fiber - consider adding vegetables or whole grains');
        }

        // Calorie insights
        if (analysis.calories < 400) {
            insights.push('💡 Light meal - suitable for snacks or weight management');
        } else if (analysis.calories > 600) {
            insights.push('💡 Substantial meal - ensure it fits your daily calorie goals');
        }

        // Fat insights
        if (analysis.fats > 20) {
            insights.push('💡 Higher fat content - ensure these are healthy fats (omega-3, monounsaturated)');
        }

        // Carb insights
        if (analysis.carbs > 60) {
            insights.push('💡 Carb-rich meal - best consumed around workout times or for energy needs');
        }

        // Health score insights
        if (analysis.healthScore >= 85) {
            insights.push('🌟 Excellent nutritional balance - this is a very healthy meal choice!');
        } else if (analysis.healthScore < 70) {
            insights.push('💡 Consider adding more vegetables or whole foods to improve nutritional value');
        }

        return insights;
    }

    resetScanner() {
        this.clearImage();
        this.uploadArea.style.display = 'block';
        this.resultContainer.style.display = 'none';
        this.uploadArea.scrollIntoView({ behavior: 'smooth' });
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MealScanner();
});

// Made with Bob
