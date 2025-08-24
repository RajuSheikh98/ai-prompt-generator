<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Raju's Image Prompts Generator</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        /* Your existing CSS remains the same */
        /* ... (all your existing CSS) ... */
    </style>
</head>
<body>
    <!-- Your existing HTML structure -->
    <div class="container">
        <header>
            <h1><i class="fas fa-magic"></i> Raju's Image Prompts Generator</h1>
            <p class="subtitle">Create professional, detailed prompts for AI image generation with advanced customization and tagging system</p>
        </header>
        <div class="main-content">
            <div class="panel">
                <!-- Your existing form elements -->
                <div class="input-group">
                    <label for="artStyle"><i class="fas fa-paint-brush"></i> Art Style</label>
                    <select id="artStyle" aria-label="Select an art style" onchange="updateSubcategories()">
                        <option value="">Select Art Style</option>
                        <option value="Portrait">Portrait</option>
                        <option value="Surrealism">Surrealism</option>
                        <option value="Cyberpunk">Cyberpunk</option>
                        <option value="Baroque">Baroque</option>
                        <option value="Minimalism">Minimalism</option>
                        <option value="Pop Art">Pop Art</option>
                        <option value="Impressionism">Impressionism</option>
                        <option value="Abstract Expressionism">Abstract Expressionism</option>
                        <option value="Steampunk">Steampunk</option>
                        <option value="Fantasy">Fantasy</option>
                        <option value="Sci-Fi">Sci-Fi</option>
                        <option value="Realism">Realism</option>
                        <option value="Cartoon">Cartoon</option>
                        <option value="Watercolor">Watercolor</option>
                        <option value="Oil Painting">Oil Painting</option>
                        <option value="Digital Art">Digital Art</option>
                        <option value="Pixel Art">Pixel Art</option>
                        <option value="Graffiti">Graffiti</option>
                        <option value="Renaissance">Renaissance</option>
                        <option value="Gothic">Gothic</option>
                    </select>
                </div>
                <!-- ... rest of your form ... -->
            </div>
            <div class="panel">
                <!-- AI Enhancement Section -->
                <div class="ai-enhancement-section">
                    <h3><i class="fas fa-robot"></i> AI Enhancement</h3>
                    <div class="input-group">
                        <label for="ai-prompt"><i class="fas fa-comment-dots"></i> AI Prompt</label>
                        <textarea id="ai-prompt" rows="4" placeholder="Describe what kind of prompt you want enhanced..."></textarea>
                    </div>
                    <div class="input-group">
                        <label><i class="fas fa-bolt"></i> Enhanced Prompts</label>
                        <div id="ai-prompts-container" class="ai-prompts-container">
                            <!-- AI-generated prompts will appear here -->
                        </div>
                    </div>
                    <button class="ai-btn" id="ai-generate-btn">
                        <i class="fas fa-robot"></i> Generate with AI
                    </button>
                </div>
            </div>
        </div>
        <!-- ... rest of your structure ... -->
    </div>
    
    <!-- TensorFlow.js Library -->
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js"></script>
    <script>
        // Replace your AI functions with these client-side implementations
        
        // Enhanced prompt generation using local logic
        function generateEnhancedPrompt(originalPrompt) {
            // This is a local enhancement function that doesn't require API
            const enhancements = [
                "Create a stunning",
                "Design an exquisite",
                "Craft a magnificent",
                "Develop a breathtaking",
                "Compose a spectacular",
                "Build a magnificent",
                "Formulate a captivating",
                "Construct a compelling",
                "Generate a remarkable",
                "Produce an extraordinary"
            ];
            
            const styles = [
                "photorealistic",
                "cinematic",
                "digital art",
                "oil painting",
                "watercolor",
                "abstract",
                "surreal",
                "minimalist",
                "pop art",
                "steampunk"
            ];
            
            const lightingEffects = [
                "dramatic lighting",
                "soft natural lighting",
                "neon glow",
                "golden hour",
                "moonlight",
                "studio lighting",
                "diffused lighting",
                "backlighting",
                "spotlight",
                "ambient lighting"
            ];
            
            const compositionTypes = [
                "rule of thirds composition",
                "symmetrical framing",
                "leading lines",
                "depth of field",
                "dynamic angle",
                "framing",
                "negative space",
                "centered composition",
                "diagonal composition",
                "golden ratio"
            ];
            
            const adjectives = [
                "ultra-detailed",
                "highly realistic",
                "masterpiece quality",
                "8k resolution",
                "sharp focus",
                "vibrant colors",
                "rich textures",
                "exceptional quality",
                "professional grade",
                "studio quality"
            ];
            
            // Simple enhancement logic
            const enhancedPrompt = `${enhancements[Math.floor(Math.random() * enhancements.length)]} ${styles[Math.floor(Math.random() * styles.length)]} ${originalPrompt} with ${lightingEffects[Math.floor(Math.random() * lightingEffects.length)]}, ${compositionTypes[Math.floor(Math.random() * compositionTypes.length)]}, and ${adjectives[Math.floor(Math.random() * adjectives.length)]}.`;
            
            return enhancedPrompt;
        }
        
        // Updated AI prompt generation function
        async function generateAIPrompts() {
            const prompt = aiPromptInput.value.trim();
            if (!prompt) {
                alert("Please enter a prompt description");
                return;
            }
            
            // Show loading state
            aiGenerateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating...';
            aiGenerateBtn.disabled = true;
            
            try {
                // Simulate processing delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // Generate enhanced prompts locally
                const enhancedPrompts = [];
                for (let i = 0; i < 3; i++) {
                    const enhancedPrompt = generateEnhancedPrompt(prompt);
                    enhancedPrompts.push(enhancedPrompt);
                }
                
                // Display the generated prompts
                displayAIPrompts(enhancedPrompts);
                
                // Show success message
                showApiStatus("AI prompts generated successfully!", true);
            } catch (error) {
                console.error('Error generating AI prompts:', error);
                alert('Error generating AI prompts.');
                showApiStatus("Error generating AI prompts", false);
            } finally {
                // Reset button state
                aiGenerateBtn.innerHTML = '<i class="fas fa-robot"></i> Generate with AI';
                aiGenerateBtn.disabled = false;
            }
        }
        
        // Simplified enhance prompt function
        async function enhancePrompt(prompt) {
            try {
                // Generate enhanced version locally
                const enhancedPrompt = generateEnhancedPrompt(prompt);
                
                // Find the prompt card and update its content
                const promptCards = document.querySelectorAll('.ai-prompt-card');
                for (let card of promptCards) {
                    const content = card.querySelector('.ai-prompt-content');
                    if (content.textContent.includes(prompt)) {
                        content.textContent = enhancedPrompt;
                        break;
                    }
                }
                
                showApiStatus("Prompt enhanced successfully!", true);
            } catch (error) {
                console.error('Error enhancing prompt:', error);
                showApiStatus("Error enhancing prompt", false);
            }
        }
        
        // Your existing functions remain mostly the same
        // ... (rest of your existing functions)
        
        // Show API status (you can keep this for UI feedback)
        function showApiStatus(message, isSuccess = true) {
            // This is kept for UI consistency
            console.log(message);
        }
    </script>
</body>
</html>
