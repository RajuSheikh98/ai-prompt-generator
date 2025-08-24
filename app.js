const data = {
    artStyles: ["Portrait", "Surrealism", "Cyberpunk", "Baroque", "Minimalism", "Pop Art", "Impressionism", "Abstract Expressionism", "Steampunk", "Fantasy", "Sci-Fi", "Realism", "Cartoon", "Watercolor", "Oil Painting", "Digital Art", "Pixel Art", "Graffiti", "Renaissance", "Gothic"],
    emotions: ["None", "Joyful", "Melancholic", "Angry", "Serene", "Excited", "Fearful", "Romantic", "Mysterious", "Playful", "Somber"],
    atmospheres: ["None", "Mysterious", "Serene", "Chaotic", "Ethereal", "Gloomy", "Vibrant", "Oppressive", "Tranquil", "Dramatic", "Whimsical", "Foreboding", "Uplifting", "Surreal", "Intimate", "Expansive", "Nostalgic", "Intense", "Calm", "Energetic", "Dreamy"],
    backgrounds: ["None", "Forest", "Urban Cityscape", "Ocean", "Desert", "Mountain Range", "Castle", "Library", "Studio", "Beach", "Snowy Mountains", "Tropical Island", "Ancient Ruins", "Underwater", "Space", "Countryside", "Laboratory", "Marketplace", "Garden", "Skyscraper", "Cave"],
    lighting: ["None", "Natural Daylight", "Golden Hour", "Neon Glow", "Moonlight", "Studio Lighting", "Candlelit", "Backlight", "Diffused", "Harsh Shadows", "Warm Ambient", "Cool Blue", "Spotlight", "Dramatic", "Soft Focus", "Flash"],
    qualityTags: ["Masterpiece", "High Resolution", "Photo Realistic", "Best Quality", "8K", "Ultra High Res"],
    emphasisTags: ["Red Eyes", "Black Hair", "Long Hair", "Detailed Face", "Natural Lighting", "Cinematic"],
    cameraAngles: ["None", "Low Angle", "High Angle", "Eye Level", "Dutch Tilt", "Overhead", "Worm's Eye", "Bird's Eye", "Close-Up", "Wide Shot", "Medium Shot", "Panning", "Tracking", "Zoom In", "Profile View", "Frontal View"],
    colorPalettes: ["None", "Monochrome", "Vibrant", "Pastel", "Warm Colors", "Cool Colors", "Earth Tones", "Neon Accents", "Soft Gradients", "High Contrast", "Low Contrast", "Complementary", "Analogous", "Triadic", "Split Complementary", "Tetradic"],
    compositions: ["None", "Rule of Thirds", "Centered", "Symmetrical", "Asymmetrical", "Diagonal", "Framing", "Leading Lines", "Golden Ratio", "Negative Space", "Depth of Field", "Foreground Focus", "Background Blur", "High Contrast", "Low Contrast", "Dynamic Angle"]
};

let model;
let enhancementLevel = 0;

async function init() {
    model = await mobilenet.load();
    populateDropdowns();
    populateTags('quality-tags', data.qualityTags);
    populateTags('emphasis-tags', data.emphasisTags);
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
    document.getElementById('generate-btn').addEventListener('click', generatePrompts);
    document.getElementById('random-btn').addEventListener('click', generateRandomPrompt);
    document.getElementById('erase-btn').addEventListener('click', eraseAll);
    document.getElementById('image-upload').addEventListener('change', analyzeImage);
}

function populateDropdowns() {
    populateDropdown('art-style', data.artStyles);
    populateDropdown('emotion', data.emotions);
    populateDropdown('atmosphere', data.atmospheres);
    populateDropdown('background', data.backgrounds);
    populateDropdown('lighting', data.lighting);
    populateDropdown('camera-angle', data.cameraAngles);
    populateDropdown('color-palette', data.colorPalettes);
    populateDropdown('composition', data.compositions);
}

function populateDropdown(id, options) {
    const select = document.getElementById(id);
    select.innerHTML = '';
    options.forEach(opt => {
        const option = document.createElement('option');
        option.value = opt;
        option.textContent = opt;
        select.appendChild(option);
    });
}

function populateTags(id, tags) {
    const container = document.getElementById(id);
    tags.forEach(tag => {
        const div = document.createElement('div');
        div.className = 'tag';
        div.textContent = tag;
        div.onclick = () => div.classList.toggle('selected');
        container.appendChild(div);
    });
}

function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    document.body.classList.toggle('light-theme');
}

function getSelections() {
    return {
        artStyle: document.getElementById('art-style').value,
        emotion: document.getElementById('emotion').value,
        atmosphere: document.getElementById('atmosphere').value,
        background: document.getElementById('background').value,
        lighting: document.getElementById('lighting').value,
        qualityTags: Array.from(document.querySelectorAll('#quality-tags .selected')).map(div => div.textContent),
        emphasisTags: Array.from(document.querySelectorAll('#emphasis-tags .selected')).map(div => div.textContent),
        cameraAngle: document.getElementById('camera-angle').value,
        colorPalette: document.getElementById('color-palette').value,
        composition: document.getElementById('composition').value,
        subjectDesc: document.getElementById('subject-desc').value,
        styleInfluences: document.getElementById('style-influences').value,
        additionalParams: document.getElementById('additional-params').value,
        poseAction: document.getElementById('pose-action').value
    };
}

function generatePrompts() {
    const selections = getSelections();
    const prompts = [];
    for (let i = 0; i < 5; i++) {
        let prompt = [selections.artStyle, selections.subjectDesc, selections.emotion, selections.atmosphere, selections.background, selections.lighting, selections.cameraAngle, selections.colorPalette, selections.composition, selections.qualityTags.join(', '), selections.emphasisTags.join(', '), selections.styleInfluences, selections.poseAction, selections.additionalParams].filter(Boolean).join(', ');
        prompts.push(prompt);
    }
    displayPrompts(prompts);
}

function displayPrompts(prompts) {
    const container = document.getElementById('prompts-list');
    container.innerHTML = '';
    prompts.forEach(prompt => {
        const box = document.createElement('div');
        box.className = 'prompt-box';
        const text = document.createElement('p');
        text.textContent = prompt;
        const enhanceBtn = document.createElement('button');
        enhanceBtn.textContent = 'Enhance';
        enhanceBtn.onclick = () => {
            text.textContent = enhancePrompt(text.textContent);
        };
        const variationBtn = document.createElement('button');
        variationBtn.textContent = 'Variation';
        variationBtn.onclick = () => {
            text.textContent = varyPrompt(text.textContent);
        };
        const copyBtn = document.createElement('button');
        copyBtn.textContent = 'Copy';
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(text.textContent).then(() => alert('Copied!'));
        };
        box.appendChild(text);
        box.appendChild(enhanceBtn);
        box.appendChild(variationBtn);
        box.appendChild(copyBtn);
        container.appendChild(box);
    });
}

function enhancePrompt(prompt) {
    enhancementLevel++;
    return prompt + ` (enhanced level ${enhancementLevel}: more details, better quality, sharp focus)`;
}

function varyPrompt(prompt) {
    // Simple variation logic (expand for smarter unlimited changes)
    return prompt.replace('Joyful', 'Excited').replace('Vibrant', 'Serene') + ' (variation)';
}

function generateRandomPrompt() {
    // Randomly set selections and generate
    generatePrompts(); // Placeholder - add random logic
}

function eraseAll() {
    // Clear all fields and prompts
    document.querySelectorAll('select, input').forEach(el => el.value = '');
    document.querySelectorAll('.selected').forEach(el => el.classList.remove('selected'));
    document.getElementById('prompts-list').innerHTML = '';
    document.getElementById('analysis-result').textContent = '';
}

async function analyzeImage(event) {
    const file = event.target.files[0];
    const img = await createImageBitmap(file);
    const predictions = await model.classify(img);
    const topPrediction = predictions[0].className;
    document.getElementById('analysis-result').textContent = `Detected: ${topPrediction}. Generating prompt...`;
    document.getElementById('subject-desc').value = topPrediction;
    generatePrompts();
}

init();
