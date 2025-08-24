// AI Prompt Generator Application
class AIPromptGenerator {
    constructor() {
        this.data = {
            art_styles: ["Portrait", "Surrealism", "Cyberpunk", "Baroque", "Minimalism", "Pop Art", "Impressionism", "Abstract Expressionism", "Steampunk", "Fantasy", "Sci-Fi", "Realism", "Cartoon", "Watercolor", "Oil Painting", "Digital Art", "Pixel Art", "Graffiti", "Renaissance", "Gothic"],
            emotions: ["None", "Joyful", "Melancholic", "Angry", "Serene", "Excited", "Fearful", "Romantic", "Mysterious", "Playful", "Somber"],
            atmospheres: ["None", "Mysterious", "Serene", "Chaotic", "Ethereal", "Gloomy", "Vibrant", "Oppressive", "Tranquil", "Dramatic", "Whimsical", "Foreboding", "Uplifting", "Surreal", "Intimate", "Expansive", "Nostalgic", "Intense", "Calm", "Energetic", "Dreamy"],
            backgrounds: ["None", "Forest", "Urban Cityscape", "Ocean", "Desert", "Mountain Range", "Castle", "Library", "Studio", "Beach", "Snowy Mountains", "Tropical Island", "Ancient Ruins", "Underwater", "Space", "Countryside", "Laboratory", "Marketplace", "Garden", "Skyscraper", "Cave"],
            lighting: ["None", "Natural Daylight", "Golden Hour", "Neon Glow", "Moonlight", "Studio Lighting", "Candlelit", "Backlight", "Diffused", "Harsh Shadows", "Warm Ambient", "Cool Blue", "Spotlight", "Dramatic", "Soft Focus", "Flash"],
            camera_angles: ["None", "Low Angle", "High Angle", "Eye Level", "Dutch Tilt", "Overhead", "Worm's Eye", "Bird's Eye", "Close-Up", "Wide Shot", "Medium Shot", "Panning", "Tracking", "Zoom In", "Profile View", "Frontal View"],
            color_palettes: ["None", "Monochrome", "Vibrant", "Pastel", "Warm Colors", "Cool Colors", "Earth Tones", "Neon Accents", "Soft Gradients", "High Contrast", "Low Contrast", "Complementary", "Analogous", "Triadic", "Split Complementary", "Tetradic"],
            compositions: ["None", "Rule of Thirds", "Centered", "Symmetrical", "Asymmetrical", "Diagonal", "Framing", "Leading Lines", "Golden Ratio", "Negative Space", "Depth of Field", "Foreground Focus", "Background Blur", "High Contrast", "Low Contrast", "Dynamic Angle"],
            quality_tags: ["Masterpiece", "High Resolution", "Photo Realistic", "Best Quality", "8K", "Ultra High Res"],
            emphasis_tags: ["Red Eyes", "Black Hair", "Long Hair", "Detailed Face", "Natural Lighting", "Cinematic"],
            cameras: ["Nikon D850", "Canon 5D Mark IV", "Sony A7R IV", "Hasselblad X1D II", "Fujifilm GFX 100S", "Leica Q2"],
            lenses: ["50mm", "85mm", "24mm", "35mm", "90mm", "135mm"],
            apertures: ["f/1.4", "f/1.8", "f/2.0", "f/2.8", "f/4.0", "f/5.6"]
        };
        
        this.promptTemplates = {
            technical: "Technical Photography Style",
            descriptive: "Detailed Descriptive Style", 
            creative: "Creative Artistic Style",
            professional: "Professional Studio Style",
            cinematic: "Cinematic Film Style"
        };

        this.init();
    }

    init() {
        this.populateDropdowns();
        this.createCheckboxes();
        this.bindEvents();
        this.loadPreferences();
    }

    populateDropdowns() {
        const dropdownMappings = {
            'artStyle': this.data.art_styles,
            'emotion': this.data.emotions,
            'atmosphere': this.data.atmospheres,
            'background': this.data.backgrounds,
            'lighting': this.data.lighting,
            'cameraAngle': this.data.camera_angles,
            'colorPalette': this.data.color_palettes,
            'composition': this.data.compositions
        };

        Object.entries(dropdownMappings).forEach(([id, options]) => {
            const select = document.getElementById(id);
            if (select) {
                options.forEach(option => {
                    const optionElement = document.createElement('option');
                    optionElement.value = option;
                    optionElement.textContent = option;
                    select.appendChild(optionElement);
                });
            }
        });
    }

    createCheckboxes() {
        this.createCheckboxGroup('qualityTags', this.data.quality_tags);
        this.createCheckboxGroup('emphasisTags', this.data.emphasis_tags);
    }

    createCheckboxGroup(containerId, options) {
        const container = document.getElementById(containerId);
        if (!container) return;

        options.forEach(option => {
            const checkboxItem = document.createElement('div');
            checkboxItem.className = 'checkbox-item';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = `${containerId}_${option.replace(/\s+/g, '_').toLowerCase()}`;
            checkbox.value = option;
            checkbox.name = containerId;

            const label = document.createElement('label');
            label.htmlFor = checkbox.id;
            label.textContent = option;

            checkboxItem.appendChild(checkbox);
            checkboxItem.appendChild(label);
            container.appendChild(checkboxItem);
        });
    }

    bindEvents() {
        document.getElementById('generateBtn').addEventListener('click', () => this.generatePrompts());
        document.getElementById('resetBtn').addEventListener('click', () => this.resetForm());
        document.getElementById('copyAllBtn').addEventListener('click', () => this.copyAllPrompts());
        
        // Auto-save preferences on change
        document.querySelectorAll('select, input[type="text"], textarea').forEach(element => {
            element.addEventListener('change', () => this.savePreferences());
        });
        
        document.querySNeil('input[type="checkbox"]').forEach(element => {
            element.addEventListener('change', () => this.savePreferences());
        });
    }

    getSelectedValues() {
        const values = {
            artStyle: document.getElementById('artStyle').value,
            emotion: document.getElementById('emotion').value,
            atmosphere: document.getElementById('atmosphere').value,
            background: document.getElementById('background').value,
            lighting: document.getElementById('lighting').value,
            cameraAngle: document.getElementById('cameraAngle').value,
            colorPalette: document.getElementById('colorPalette').value,
            composition: document.getElementById('composition').value,
            inspiration: document.getElementById('inspiration').value.trim(),
            location: document.getElementById('location').value.trim(),
            pose: document.getElementById('pose').value.trim(),
            additionalOptions: document.getElementById('additionalOptions').value.trim(),
            customPrompt: document.getElementById('customPrompt').value.trim(),
            qualityTags: this.getCheckedValues('qualityTags'),
            emphasisTags: this.getCheckedValues('emphasisTags')
        };

        return values;
    }

    getCheckedValues(groupName) {
        const checkboxes = document.querySelectorAll(`input[name="${groupName}"]:checked`);
        return Array.from(checkboxes).map(cb => cb.value);
    }

    generatePrompts() {
        const values = this.getSelectedValues();
        const generateBtn = document.getElementById('generateBtn');
        const resultsContainer = document.getElementById('resultsContainer');
        const copyAllBtn = document.getElementById('copyAllBtn');

        // Show loading state
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
        
        resultsContainer.innerHTML = `
            <div class="loading-state">
                <span class="loading-spinner"></span>
                Generating enhanced prompts...
            </div>
        `;

        // Simulate processing time for better UX
        setTimeout(() => {
            const prompts = this.createPromptVariations(values);
            this.displayResults(prompts, values);
            
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Enhanced Prompts';
            copyAllBtn.style.display = 'block';
            
            this.saveToHistory(values, prompts);
        }, 1200);
    }

    createPromptVariations(values) {
        const prompts = [];
        
        // Technical Photography Style
        prompts.push({
            type: 'technical',
            title: 'Technical Photography Style',
            text: this.generateTechnicalPrompt(values)
        });

        // Detailed Descriptive Style
        prompts.push({
            type: 'descriptive', 
            title: 'Detailed Descriptive Style',
            text: this.generateDescriptivePrompt(values)
        });

        // Creative Artistic Style
        prompts.push({
            type: 'creative',
            title: 'Creative Artistic Style', 
            text: this.generateCreativePrompt(values)
        });

        // Professional Studio Style
        prompts.push({
            type: 'professional',
            title: 'Professional Studio Style',
            text: this.generateProfessionalPrompt(values)
        });

        // Cinematic Film Style
        prompts.push({
            type: 'cinematic',
            title: 'Cinematic Film Style',
            text: this.generateCinematicPrompt(values)
        });

        return prompts;
    }

    generateTechnicalPrompt(values) {
        let prompt = '';
        
        // Quality tags with weights
        if (values.qualityTags.length > 0) {
            const weightedTags = values.qualityTags.map(tag => {
                const weight = this.getRandomFloat(1.2, 1.5);
                return `(${tag.toLowerCase()}:${weight})`;
            });
            prompt += weightedTags.join(', ') + ', ';
        }

        // Main subject
        const subject = this.buildSubject(values);
        if (subject) prompt += subject + ', ';

        // Technical camera settings
        const camera = this.getRandomElement(this.data.cameras);
        const lens = this.getRandomElement(this.data.lenses);
        const aperture = this.getRandomElement(this.data.apertures);
        
        if (values.lighting && values.lighting !== 'None') {
            prompt += `${values.lighting.toLowerCase()} lighting, `;
        }
        
        if (values.cameraAngle && values.cameraAngle !== 'None') {
            prompt += `${values.cameraAngle.toLowerCase()} shot, `;
        }
        
        prompt += `shot with ${camera}, ${lens} lens at ${aperture}`;
        
        // Emphasis tags
        if (values.emphasisTags.length > 0) {
            prompt += ', ' + values.emphasisTags.map(tag => tag.toLowerCase()).join(', ');
        }

        return this.cleanPrompt(prompt);
    }

    generateDescriptivePrompt(values) {
        let prompt = 'A stunning and meticulously detailed ';
        
        const subject = this.buildSubject(values);
        prompt += subject || 'artwork';
        
        if (values.emotion && values.emotion !== 'None') {
            prompt += ` with ${values.emotion.toLowerCase()} expression`;
        }
        
        if (values.atmosphere && values.atmosphere !== 'None') {
            prompt += `. The scene is filled with ${values.atmosphere.toLowerCase()} atmosphere`;
        }
        
        if (values.background && values.background !== 'None') {
            prompt += `. The background features ${values.background.toLowerCase()}`;
        }
        
        if (values.lighting && values.lighting !== 'None') {
            prompt += `. The ${values.lighting.toLowerCase()} creates dramatic visual effects`;
        }
        
        if (values.colorPalette && values.colorPalette !== 'None') {
            prompt += ` with ${values.colorPalette.toLowerCase()} color scheme`;
        }
        
        if (values.composition && values.composition !== 'None') {
            prompt += `. Composed using ${values.composition.toLowerCase()}`;
        }
        
        // Add quality descriptors
        if (values.qualityTags.length > 0) {
            prompt += `. ` + values.qualityTags.join(', ').toLowerCase() + ' quality';
        }
        
        return this.cleanPrompt(prompt);
    }

    generateCreativePrompt(values) {
        let prompt = 'An extraordinary and imaginative ';
        
        if (values.artStyle && values.artStyle !== 'None') {
            prompt += `${values.artStyle.toLowerCase()} style `;
        }
        
        const subject = this.buildSubject(values);
        prompt += subject || 'creation';
        
        if (values.inspiration) {
            prompt += ` inspired by ${values.inspiration}`;
        }
        
        if (values.lighting && values.lighting !== 'None') {
            prompt += `. The scene is illuminated by ${values.lighting.toLowerCase()}`;
        }
        
        if (values.atmosphere && values.atmosphere !== 'None') {
            prompt += `, creating ${values.atmosphere.toLowerCase()} ambiance`;
        }
        
        if (values.emotion && values.emotion !== 'None') {
            prompt += ` that evokes ${values.emotion.toLowerCase()} emotions`;
        }
        
        // Add artistic flourishes
        const artisticElements = [
            'with intricate details and masterful technique',
            'showcasing exceptional artistic vision', 
            'rendered with sublime beauty and precision',
            'displaying remarkable depth and character'
        ];
        
        prompt += '. ' + this.getRandomElement(artisticElements);
        
        return this.cleanPrompt(prompt);
    }

    generateProfessionalPrompt(values) {
        let prompt = 'Professional ';
        
        if (values.artStyle && values.artStyle !== 'None') {
            prompt += `${values.artStyle.toLowerCase()} `;
        }
        
        prompt += 'photography of ';
        
        const subject = this.buildSubject(values);
        prompt += subject || 'subject';
        
        if (values.emotion && values.emotion !== 'None') {
            prompt += ` with ${values.emotion.toLowerCase()} expression`;
        }
        
        if (values.lighting && values.lighting !== 'None') {
            prompt += `, ${values.lighting.toLowerCase()} lighting`;
        }
        
        if (values.background && values.background !== 'None') {
            prompt += `, ${values.background.toLowerCase()} setting`;
        }
        
        if (values.cameraAngle && values.cameraAngle !== 'None') {
            prompt += `, ${values.cameraAngle.toLowerCase()} perspective`;
        }
        
        if (values.colorPalette && values.colorPalette !== 'None') {
            prompt += `, ${values.colorPalette.toLowerCase()} colors`;
        }
        
        // Technical specs
        const camera = this.getRandomElement(this.data.cameras);
        const lens = this.getRandomElement(this.data.lenses);
        const aperture = this.getRandomElement(this.data.apertures);
        
        prompt += `, shot with ${camera}, ${lens} lens at ${aperture}`;
        
        if (values.qualityTags.length > 0) {
            prompt += ', ' + values.qualityTags.join(', ').toLowerCase();
        }
        
        return this.cleanPrompt(prompt);
    }

    generateCinematicPrompt(values) {
        let prompt = 'Cinematic shot of ';
        
        const subject = this.buildSubject(values);
        prompt += subject || 'scene';
        
        if (values.emotion && values.emotion !== 'None') {
            prompt += ` conveying ${values.emotion.toLowerCase()} mood`;
        }
        
        if (values.cameraAngle && values.cameraAngle !== 'None') {
            prompt += `, ${values.cameraAngle.toLowerCase()} camera movement`;
        }
        
        if (values.lighting && values.lighting !== 'None') {
            prompt += `, dramatic ${values.lighting.toLowerCase()}`;
        }
        
        if (values.atmosphere && values.atmosphere !== 'None') {
            prompt += `, ${values.atmosphere.toLowerCase()} atmosphere`;
        }
        
        if (values.background && values.background !== 'None') {
            prompt += ` in ${values.background.toLowerCase()}`;
        }
        
        if (values.colorPalette && values.colorPalette !== 'None') {
            prompt += `. ${values.colorPalette.toLowerCase()} color grading`;
        }
        
        // Cinematic technical terms
        const cinematicTerms = [
            'depth of field', 'film grain', 'anamorphic', 'bokeh effects',
            '35mm film', 'color correction', 'dramatic shadows', 'lens flares'
        ];
        
        prompt += ', ' + this.getRandomElements(cinematicTerms, 2).join(', ');
        
        if (values.qualityTags.length > 0) {
            prompt += ', ' + values.qualityTags.join(', ').toLowerCase();
        }
        
        return this.cleanPrompt(prompt);
    }

    buildSubject(values) {
        let subject = '';
        
        if (values.customPrompt) {
            subject = values.customPrompt;
        } else {
            const parts = [];
            
            if (values.pose) parts.push(values.pose);
            if (values.additionalOptions) parts.push(values.additionalOptions);
            if (values.location) parts.push(`in ${values.location}`);
            
            subject = parts.join(', ') || 'portrait';
        }
        
        return subject;
    }

    displayResults(prompts, values) {
        const resultsContainer = document.getElementById('resultsContainer');
        
        let html = '';
        
        // Generation info
        const selectedOptions = this.getSelectedOptionsDisplay(values);
        if (selectedOptions.length > 0) {
            html += `
                <div class="generation-info">
                    <h3>Generated with selected options:</h3>
                    <div class="selected-options">
                        ${selectedOptions.map(option => `<span class="option-tag">${option}</span>`).join('')}
                    </div>
                </div>
            `;
        }

        // Results summary
        html += `
            <div class="results-summary">
                <span class="summary-text">Generated ${prompts.length} unique prompt variations</span>
                <div class="summary-actions">
                    <span class="feature-item">
                        <span class="feature-icon">📋</span>
                        <span>Ready to copy</span>
                    </span>
                </div>
            </div>
        `;
        
        // Individual prompts
        prompts.forEach((prompt, index) => {
            const wordCount = prompt.text.split(' ').length;
            const charCount = prompt.text.length;
            
            html += `
                <div class="prompt-result" data-index="${index}">
                    <div class="prompt-header">
                        <span class="prompt-type">${prompt.title}</span>
                        <button class="btn btn--secondary copy-btn" onclick="app.copyPrompt(${index})">
                            Copy
                        </button>
                    </div>
                    <div class="prompt-text">${prompt.text}</div>
                    <div class="prompt-stats">
                        <div class="stat-item">
                            <span>📝</span>
                            <span>${wordCount} words</span>
                        </div>
                        <div class="stat-item">
                            <span>🔤</span>
                            <span>${charCount} characters</span>
                        </div>
                    </div>
                </div>
            `;
        });
        
        resultsContainer.innerHTML = html;
        this.currentPrompts = prompts;
    }

    getSelectedOptionsDisplay(values) {
        const options = [];
        
        Object.entries(values).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                if (value.length > 0) {
                    options.push(...value);
                }
            } else if (value && value !== 'None' && value.trim() !== '') {
                if (key === 'customPrompt' && value.length > 30) {
                    options.push('Custom Prompt');
                } else if (key !== 'customPrompt') {
                    options.push(value);
                }
            }
        });
        
        return options;
    }

    copyPrompt(index) {
        if (!this.currentPrompts || !this.currentPrompts[index]) return;
        
        const promptText = this.currentPrompts[index].text;
        this.copyToClipboard(promptText);
    }

    copyAllPrompts() {
        if (!this.currentPrompts) return;
        
        const allPrompts = this.currentPrompts
            .map((prompt, index) => `${index + 1}. ${prompt.title}:\n${prompt.text}`)
            .join('\n\n');
        
        this.copyToClipboard(allPrompts);
    }

    copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            this.showToast('Copied to clipboard!');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast('Copied to clipboard!');
        });
    }

    showToast(message) {
        const toast = document.getElementById('toast');
        const toastMessage = document.getElementById('toastMessage');
        
        toastMessage.textContent = message;
        toast.classList.remove('hidden');
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.classList.add('hidden');
            }, 300);
        }, 3000);
    }

    resetForm() {
        // Reset all dropdowns
        document.querySelectorAll('select').forEach(select => {
            select.selectedIndex = 0;
        });
        
        // Reset all text inputs and textareas
        document.querySelectorAll('input[type="text"], textarea').forEach(input => {
            input.value = '';
        });
        
        // Reset all checkboxes
        document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Clear results
        const resultsContainer = document.getElementById('resultsContainer');
        resultsContainer.innerHTML = `
            <div class="empty-state">
                <p>Configure your settings and click "Generate Enhanced Prompts" to create professional AI prompts.</p>
                <div class="empty-state__features">
                    <div class="feature-item">
                        <span class="feature-icon">✨</span>
                        <span>Generate 5 unique variations</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">🎨</span>
                        <span>Professional formatting</span>
                    </div>
                    <div class="feature-item">
                        <span class="feature-icon">📋</span>
                        <span>One-click copy to clipboard</span>
                    </div>
                </div>
            </div>
        `;
        
        document.getElementById('copyAllBtn').style.display = 'none';
        this.currentPrompts = null;
        
        this.showToast('Form reset successfully!');
        this.clearPreferences();
    }

    savePreferences() {
        const values = this.getSelectedValues();
        localStorage.setItem('aiPromptGeneratorPrefs', JSON.stringify(values));
    }

    loadPreferences() {
        try {
            const saved = localStorage.getItem('aiPromptGeneratorPrefs');
            if (!saved) return;
            
            const values = JSON.parse(saved);
            
            // Load dropdown values
            Object.entries(values).forEach(([key, value]) => {
                const element = document.getElementById(key);
                if (element && typeof value === 'string') {
                    element.value = value;
                }
            });
            
            // Load checkboxes
            ['qualityTags', 'emphasisTags'].forEach(groupName => {
                if (values[groupName] && Array.isArray(values[groupName])) {
                    values[groupName].forEach(value => {
                        const checkbox = document.querySelector(`input[name="${groupName}"][value="${value}"]`);
                        if (checkbox) checkbox.checked = true;
                    });
                }
            });
        } catch (error) {
            console.error('Error loading preferences:', error);
        }
    }

    clearPreferences() {
        localStorage.removeItem('aiPromptGeneratorPrefs');
    }

    saveToHistory(values, prompts) {
        try {
            const history = JSON.parse(localStorage.getItem('aiPromptGeneratorHistory') || '[]');
            const entry = {
                timestamp: new Date().toISOString(),
                values: values,
                prompts: prompts
            };
            
            history.unshift(entry);
            
            // Keep only last 10 entries
            const limitedHistory = history.slice(0, 10);
            localStorage.setItem('aiPromptGeneratorHistory', JSON.stringify(limitedHistory));
        } catch (error) {
            console.error('Error saving to history:', error);
        }
    }

    // Utility functions
    getRandomElement(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    getRandomElements(array, count) {
        const shuffled = [...array].sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }

    getRandomFloat(min, max) {
        return (Math.random() * (max - min) + min).toFixed(1);
    }

    cleanPrompt(prompt) {
        return prompt
            .replace(/,\s*,/g, ',')
            .replace(/,\s*$/, '')
            .replace(/^\s*,/, '')
            .trim();
    }
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new AIPromptGenerator();
});