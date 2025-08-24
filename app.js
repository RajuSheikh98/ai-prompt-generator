// Enhanced AI Prompt Generator Application
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
            emphasis_tags: ["Red Eyes", "Black Hair", "Long Hair", "Detailed Face", "Natural Lighting", "Cinematic"]
        };
        
        this.promptTemplates = {
            photography: "Professional photography style",
            "digital-art": "Digital art masterpiece",
            painting: "Traditional painting style",
            anime: "Anime/manga illustration",
            "3d-render": "3D rendered artwork",
            logo: "Professional logo design",
            character: "Character design concept"
        };
        
        this.synonyms = {
            'beautiful': ['stunning', 'gorgeous', 'breathtaking', 'magnificent', 'striking'],
            'detailed': ['intricate', 'elaborate', 'comprehensive', 'thorough', 'meticulous'],
            'high quality': ['premium', 'professional', 'exceptional', 'superior', 'top-tier'],
            'amazing': ['incredible', 'fantastic', 'extraordinary', 'remarkable', 'outstanding']
        };
        
        this.usedCombinations = new Set();
        this.history = JSON.parse(localStorage.getItem('promptHistory') || '[]');
        this.currentTheme = localStorage.getItem('theme') || 'auto';
        
        this.init();
    }

    init() {
        this.populateDropdowns();
        this.createCheckboxes();
        this.bindEvents();
        this.loadPreferences();
        this.setupTheme();
        this.setupTabs();
        this.setupImageUpload();
        this.updateHistoryDisplay();
    }

    setupTheme() {
        this.applyTheme();
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });
    }

    applyTheme() {
        const themeIcon = document.getElementById('themeIcon');
        
        if (this.currentTheme === 'auto') {
            document.documentElement.removeAttribute('data-color-scheme');
            themeIcon.textContent = '🌓';
        } else if (this.currentTheme === 'dark') {
            document.documentElement.setAttribute('data-color-scheme', 'dark');
            themeIcon.textContent = '☀️';
        } else {
            document.documentElement.setAttribute('data-color-scheme', 'light');
            themeIcon.textContent = '🌙';
        }
    }

    toggleTheme() {
        const themes = ['auto', 'light', 'dark'];
        const currentIndex = themes.indexOf(this.currentTheme);
        this.currentTheme = themes[(currentIndex + 1) % themes.length];
        localStorage.setItem('theme', this.currentTheme);
        this.applyTheme();
    }

    setupTabs() {
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');

        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetTab = btn.getAttribute('data-tab');
                
                // Remove active class from all tabs and contents
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked tab and corresponding content
                btn.classList.add('active');
                document.getElementById(targetTab).classList.add('active');
            });
        });
    }

    setupImageUpload() {
        const uploadArea = document.getElementById('imageUpload');
        const fileInput = document.getElementById('imageInput');

        uploadArea.addEventListener('click', () => fileInput.click());
        
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                this.handleImageUpload(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.handleImageUpload(e.target.files[0]);
            }
        });
    }

    async handleImageUpload(file) {
        if (!file.type.startsWith('image/')) {
            this.showToast('Please upload an image file', 'error');
            return;
        }

        try {
            const prompt = await this.analyzeImage(file);
            const resultContainer = document.getElementById('imageAnalysisResult');
            
            resultContainer.innerHTML = `
                <div class="prompt-result">
                    <div class="prompt-header">
                        <span class="prompt-type">Image Analysis Result</span>
                        <button class="btn btn--outline btn--sm copy-btn" onclick="navigator.clipboard.writeText('${prompt}')">
                            📋 Copy
                        </button>
                    </div>
                    <div class="prompt-text">${prompt}</div>
                </div>
            `;
            
            resultContainer.classList.remove('hidden');
            this.addToHistory(prompt, { type: 'image-analysis', filename: file.name });
            
        } catch (error) {
            this.showToast('Error analyzing image', 'error');
            console.error(error);
        }
    }

    async analyzeImage(file) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();
            
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                
                const analysis = this.performImageAnalysis(canvas, ctx);
                const prompt = this.generatePromptFromAnalysis(analysis);
                resolve(prompt);
            };
            
            img.src = URL.createObjectURL(file);
        });
    }

    performImageAnalysis(canvas, ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixels = imageData.data;
        
        // Analyze brightness
        let totalBrightness = 0;
        let colorCounts = {};
        
        for (let i = 0; i < pixels.length; i += 16) { // Sample every 4th pixel
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];
            
            // Calculate brightness
            const brightness = (r + g + b) / 3;
            totalBrightness += brightness;
            
            // Categorize colors
            const colorCategory = this.categorizeColor(r, g, b);
            colorCounts[colorCategory] = (colorCounts[colorCategory] || 0) + 1;
        }
        
        const avgBrightness = totalBrightness / (pixels.length / 4);
        const aspectRatio = canvas.width / canvas.height;
        
        // Get dominant colors
        const dominantColors = Object.entries(colorCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3)
            .map(([color]) => color);
        
        return {
            brightness: avgBrightness / 255,
            aspectRatio,
            dominantColors,
            width: canvas.width,
            height: canvas.height
        };
    }

    categorizeColor(r, g, b) {
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const diff = max - min;
        
        if (diff < 30) return 'grayscale';
        if (r > g && r > b) return 'red';
        if (g > r && g > b) return 'green';
        if (b > r && b > g) return 'blue';
        if (r > 200 && g > 200 && b < 100) return 'yellow';
        if (r > 200 && b > 200 && g < 100) return 'magenta';
        if (g > 200 && b > 200 && r < 100) return 'cyan';
        return 'mixed';
    }

    generatePromptFromAnalysis(analysis) {
        let prompt = "";
        
        // Add dominant color information
        if (analysis.dominantColors.length > 0) {
            const colorDescriptions = {
                'red': 'warm red tones',
                'blue': 'cool blue palette',
                'green': 'natural green hues',
                'yellow': 'bright golden colors',
                'grayscale': 'monochromatic palette',
                'mixed': 'diverse color scheme'
            };
            
            const colorDescs = analysis.dominantColors.map(color => 
                colorDescriptions[color] || color
            ).join(', ');
            
            prompt += `${colorDescs}, `;
        }
        
        // Add lighting based on brightness
        if (analysis.brightness > 0.7) {
            prompt += "bright lighting, high key, well-lit, ";
        } else if (analysis.brightness < 0.3) {
            prompt += "dark mood, low key lighting, dramatic shadows, ";
        } else {
            prompt += "balanced lighting, natural illumination, ";
        }
        
        // Add composition based on aspect ratio
        if (analysis.aspectRatio > 1.5) {
            prompt += "wide composition, landscape orientation, ";
        } else if (analysis.aspectRatio < 0.7) {
            prompt += "portrait composition, vertical format, ";
        } else {
            prompt += "balanced composition, ";
        }
        
        // Add technical specs
        prompt += `${analysis.width}x${analysis.height} resolution, detailed, professional quality`;
        
        return prompt;
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

        // History events
        document.getElementById('historySearch').addEventListener('input', (e) => this.searchHistory(e.target.value));
        document.getElementById('exportHistoryBtn').addEventListener('click', () => this.exportHistory());
        document.getElementById('clearHistoryBtn').addEventListener('click', () => this.clearHistory());

        // Auto-save preferences
        document.querySelectorAll('select, input[type="text"], textarea').forEach(element => {
            element.addEventListener('change', () => this.savePreferences());
        });

        document.querySelectorAll('input[type="checkbox"]').forEach(element => {
            element.addEventListener('change', () => this.savePreferences());
        });
    }

    getSelectedValues() {
        return {
            promptType: document.getElementById('promptType').value,
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
        generateBtn.textContent = '✨ Generating...';
        resultsContainer.innerHTML = `
            <div class="loading-state">
                <div class="loading-spinner"></div>
                Generating unique prompts...
            </div>
        `;

        // Simulate generation delay for better UX
        setTimeout(() => {
            const prompts = this.createPromptVariations(values, 5);
            this.displayResults(prompts, values);
            
            generateBtn.disabled = false;
            generateBtn.textContent = '✨ Generate Enhanced Prompts';
            copyAllBtn.disabled = false;
            
            // Add to history
            prompts.forEach((prompt, index) => {
                this.addToHistory(prompt, {
                    ...values,
                    variation: index + 1,
                    type: 'generated'
                });
            });
            
            this.showToast('✨ Prompts generated successfully!', 'success');
        }, 1000);
    }

    createPromptVariations(values, count) {
        const prompts = [];
        
        for (let i = 0; i < count; i++) {
            let prompt = this.buildBasePrompt(values, i);
            prompt = this.enhancePrompt(prompt, values.promptType, i);
            prompt = this.applySynonymVariation(prompt, i);
            prompts.push(prompt);
        }
        
        return prompts;
    }

    buildBasePrompt(values, variationIndex) {
        let parts = [];
        
        // Start with custom prompt or inspiration
        if (values.customPrompt) {
            parts.push(values.customPrompt);
        } else if (values.inspiration) {
            parts.push(values.inspiration);
        }
        
        // Add location/setting
        if (values.location) {
            parts.push(`in ${values.location}`);
        } else if (values.background && values.background !== 'None') {
            parts.push(`in a ${values.background.toLowerCase()}`);
        }
        
        // Add pose/action
        if (values.pose) {
            parts.push(values.pose);
        }
        
        // Add style elements
        const styleElements = [
            values.artStyle,
            values.emotion,
            values.atmosphere,
            values.lighting,
            values.colorPalette,
            values.composition,
            values.cameraAngle
        ].filter(item => item && item !== 'None');
        
        if (styleElements.length > 0) {
            // Rotate style elements for variation
            const rotatedElements = this.rotateArray(styleElements, variationIndex);
            parts.push(rotatedElements.slice(0, 3).join(', '));
        }
        
        // Add additional options
        if (values.additionalOptions) {
            parts.push(values.additionalOptions);
        }
        
        return parts.filter(p => p).join(', ');
    }

    enhancePrompt(prompt, promptType, variationIndex) {
        const enhancements = {
            photography: [
                'professional photography',
                'shot with DSLR camera',
                'studio lighting',
                'high resolution',
                'sharp focus'
            ],
           
