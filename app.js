// RS Advanced Image Prompting Tool JavaScript

// Data for dropdowns and checkboxes
const data = {
  art_styles: ["Portrait", "Surrealism", "Cyberpunk", "Baroque", "Minimalism", "Pop Art", "Impressionism", "Abstract Expressionism", "Steampunk", "Fantasy", "Sci-Fi", "Realism", "Cartoon", "Watercolor", "Oil Painting", "Digital Art", "Pixel Art", "Graffiti", "Renaissance", "Gothic"],
  emotions: ["None", "Joyful", "Melancholic", "Angry", "Serene", "Excited", "Fearful", "Romantic", "Mysterious", "Playful", "Somber"],
  atmospheres: ["None", "Mysterious", "Serene", "Chaotic", "Ethereal", "Gloomy", "Vibrant", "Oppressive", "Tranquil", "Dramatic", "Whimsical", "Foreboding", "Uplifting", "Surreal", "Intimate", "Expansive", "Nostalgic", "Intense", "Calm", "Energetic", "Dreamy"],
  backgrounds: ["None", "Forest", "Urban Cityscape", "Ocean", "Desert", "Mountain Range", "Castle", "Library", "Studio", "Beach", "Snowy Mountains", "Tropical Island", "Ancient Ruins", "Underwater", "Space", "Countryside", "Laboratory", "Marketplace", "Garden", "Skyscraper", "Cave"],
  lighting: ["None", "Natural Daylight", "Golden Hour", "Neon Glow", "Moonlight", "Studio Lighting", "Candlelit", "Backlight", "Diffused", "Harsh Shadows", "Warm Ambient", "Cool Blue", "Spotlight", "Dramatic", "Soft Focus", "Flash"],
  quality_tags: ["Masterpiece", "High Resolution", "Photo Realistic", "Best Quality", "8K", "Ultra High Res"],
  emphasis_tags: ["Red Eyes", "Black Hair", "Long Hair", "Detailed Face", "Natural Lighting", "Cinematic"],
  camera_angles: ["None", "Low Angle", "High Angle", "Eye Level", "Dutch Tilt", "Overhead", "Worm's Eye", "Bird's Eye", "Close-Up", "Wide Shot", "Medium Shot", "Panning", "Tracking", "Zoom In", "Profile View", "Frontal View"],
  color_palettes: ["None", "Monochrome", "Vibrant", "Pastel", "Warm Colors", "Cool Colors", "Earth Tones", "Neon Accents", "Soft Gradients", "High Contrast", "Low Contrast", "Complementary", "Analogous", "Triadic", "Split Complementary", "Tetradic"],
  compositions: ["None", "Rule of Thirds", "Centered", "Symmetrical", "Asymmetrical", "Diagonal", "Framing", "Leading Lines", "Golden Ratio", "Negative Space", "Depth of Field", "Foreground Focus", "Background Blur", "High Contrast", "Low Contrast", "Dynamic Angle"]
};

// Utility functions
function createDropdownOptions(selectEl, options) {
  selectEl.innerHTML = "<option value=\"\">Select...</option>";
  options.forEach(opt => {
    const option = document.createElement("option");
    option.value = opt;
    option.textContent = opt;
    selectEl.appendChild(option);
  });
}

function createCheckboxes(containerEl, options) {
  containerEl.innerHTML = "";
  options.forEach(opt => {
    const id = `chk_${opt.replace(/\s/g, '')}`;
    const label = document.createElement("label");
    label.htmlFor = id;
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = id;
    checkbox.value = opt;
    const span = document.createElement("span");
    span.textContent = opt;
    label.appendChild(checkbox);
    label.appendChild(span);
    containerEl.appendChild(label);
  });
}

// Initialize form fields
function initializeFields() {
  createDropdownOptions(document.getElementById("artStyle"), data.art_styles);
  createDropdownOptions(document.getElementById("emotion"), data.emotions);
  createDropdownOptions(document.getElementById("atmosphere"), data.atmospheres);
  createDropdownOptions(document.getElementById("background"), data.backgrounds);
  createDropdownOptions(document.getElementById("lighting"), data.lighting);
  createDropdownOptions(document.getElementById("cameraAngle"), data.camera_angles);
  createDropdownOptions(document.getElementById("colorPalette"), data.color_palettes);
  createDropdownOptions(document.getElementById("composition"), data.compositions);
  createCheckboxes(document.getElementById("qualityTags"), data.quality_tags);
  createCheckboxes(document.getElementById("emphasisTags"), data.emphasis_tags);
}

// Get selected checkboxes from container
function getCheckedValues(containerId) {
  const container = document.getElementById(containerId);
  const checkboxes = container.querySelectorAll("input[type=checkbox]:checked");
  return Array.from(checkboxes).map(cb => cb.value);
}

// Build prompt text based on selections and template
function buildPrompt(selections, template) {
  // Basic implementation with some variation
  let tags = [];
  if (selections.qualityTags.length) tags.push(`(${selections.qualityTags.join(", \ ")})`);
  tags.push(selections.subjectDesc || "Beautiful subject");
  if (selections.emotion && selections.emotion !== "None") tags.push(selections.emotion + " emotion");
  if (selections.atmosphere && selections.atmosphere !== "None") tags.push(selections.atmosphere + " atmosphere");
  if (selections.background && selections.background !== "None") tags.push(selections.background + " background");
  if (selections.lighting && selections.lighting !== "None") tags.push(selections.lighting + " lighting");
  if (selections.cameraAngle && selections.cameraAngle !== "None") tags.push(selections.cameraAngle + " camera angle");
  if (selections.colorPalette && selections.colorPalette !== "None") tags.push(selections.colorPalette + " color palette");
  if (selections.composition && selections.composition !== "None") tags.push(selections.composition + " composition");
  if (selections.styleInfluences) tags.push(`style inspired by ${selections.styleInfluences}`);
  if (selections.emphasisTags.length) tags = tags.concat(selections.emphasisTags);
  if (selections.additionalParams) tags.push(selections.additionalParams);
  if (selections.poseAction) tags.push(selections.poseAction);

  // Different templates
  switch(template) {
    case 'technical':
      return `${tags.join(", \ ")} shot with a Nikon D850, 50mm lens at f/2.8`;
    case 'descriptive':
      return `A stunning detailed portrait featuring ${tags.join(", \ ")}.`;
    case 'creative':
      return `An extraordinary artistic vision of the subject, captured in ${tags.join(", \ ")}, evoking deep emotion.`;
    case 'professional':
      return `Professional photography of subject with ${tags.join(", \ ")}.`;
    case 'cinematic':
      return `(cinematic) ${tags.join(", \ ")}, vibrant and evocative.`;
    default:
      return `${tags.join(", \ ")}`;
  }
}

// Generate 5 prompts based on current selections
function generatePrompts() {
  const selections = {
    artStyle: document.getElementById("artStyle").value,
    emotion: document.getElementById("emotion").value,
    atmosphere: document.getElementById("atmosphere").value,
    background: document.getElementById("background").value,
    lighting: document.getElementById("lighting").value,
    qualityTags: getCheckedValues("qualityTags"),
    emphasisTags: getCheckedValues("emphasisTags"),
    cameraAngle: document.getElementById("cameraAngle").value,
    colorPalette: document.getElementById("colorPalette").value,
    composition: document.getElementById("composition").value,
    subjectDesc: document.getElementById("subjectDesc").value,
    styleInfluences: document.getElementById("styleInfluences").value,
    additionalParams: document.getElementById("additionalParams").value,
    poseAction: document.getElementById("poseAction").value
  };

  const templates = ['technical', 'descriptive', 'creative', 'professional', 'cinematic'];
  const prompts = templates.map(template => buildPrompt(selections, template));
  displayPrompts(prompts);
}

// Display prompts in the promptsContainer div
function displayPrompts(prompts) {
  const container = document.getElementById("promptsContainer");
  container.innerHTML = "";

  prompts.forEach((prompt, idx) => {
    const promptBox = document.createElement("div");
    promptBox.classList.add("prompt-box");

    const promptText = document.createElement("pre");
    promptText.classList.add("prompt-text");
    promptText.textContent = prompt;

    const actionsDiv = document.createElement("div");
    actionsDiv.classList.add("prompt-actions");

    // Copy button
    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy";
    copyBtn.classList.add("action-btn");
    copyBtn.addEventListener("click", () => copyPrompt(prompt));

    // Enhance button
    const enhanceBtn = document.createElement("button");
    enhanceBtn.textContent = "Enhance";
    enhanceBtn.classList.add("action-btn");
    enhanceBtn.addEventListener("click", () => {
      const enhanced = enhancePrompt(promptText.textContent);
      promptText.textContent = enhanced;
    });

    // Variation button
    const variationBtn = document.createElement("button");
    variationBtn.textContent = "Variation";
    variationBtn.classList.add("action-btn");
    variationBtn.addEventListener("click", () => {
      const variation = createVariation(promptText.textContent);
      promptText.textContent = variation;
    });

    actionsDiv.appendChild(copyBtn);
    actionsDiv.appendChild(enhanceBtn);
    actionsDiv.appendChild(variationBtn);

    promptBox.appendChild(promptText);
    promptBox.appendChild(actionsDiv);
    container.appendChild(promptBox);
  });
}

// Copy prompt text to clipboard
function copyPrompt(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => alert("Copied to clipboard!"));
  } else {
    // Fallback
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("Copied to clipboard!");
  }
}

// Enhance prompt by adding details and weights
function enhancePrompt(prompt) {
  if (prompt.includes('(enhanced)')) return prompt; // already enhanced
  return `(enhanced) ${prompt}, intricate details, vivid colors, sharp focus, 8k resolution`;
}

// Create slight variation of prompt
function createVariation(prompt) {
  // Simple replacement of some keywords to simulate variation
  const variations = [
    prompt.replace(/Joyful/g, 'Serene').replace(/Golden Hour/g, 'Moonlight'),
    prompt.replace(/Cyberpunk/g, 'Futuristic').replace(/Neon Glow/g, 'Soft Focus'),
    prompt.replace(/Dramatic/g, 'Calm').replace(/Backlight/g, 'Diffuse Lighting'),
    prompt.replace(/Photo Realistic/g, 'Painterly').replace(/8K/g, '4K')
  ];
  return variations[Math.floor(Math.random() * variations.length)];
}

// Generate random prompt by randomly selecting options and generating prompts
function generateRandomPrompt() {
  function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }

  function randomMultiple(array) {
    const count = Math.floor(Math.random() * (array.length + 1));
    const shuffled = array.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  document.getElementById("artStyle").value = randomChoice(data.art_styles);
  document.getElementById("emotion").value = randomChoice(data.emotions);
  document.getElementById("atmosphere").value = randomChoice(data.atmospheres);
  document.getElementById("background").value = randomChoice(data.backgrounds);
  document.getElementById("lighting").value = randomChoice(data.lighting);
  document.getElementById("cameraAngle").value = randomChoice(data.camera_angles);
  document.getElementById("colorPalette").value = randomChoice(data.color_palettes);
  document.getElementById("composition").value = randomChoice(data.compositions);
  const randomQualityTags = randomMultiple([...data.quality_tags]);
  const randomEmphasisTags = randomMultiple([...data.emphasis_tags]);

  // Populate checkboxes
  const qualityContainer = document.getElementById("qualityTags");
  qualityContainer.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
    checkbox.checked = randomQualityTags.includes(checkbox.value);
  });
  const emphasisContainer = document.getElementById("emphasisTags");
  emphasisContainer.querySelectorAll("input[type='checkbox']").forEach(checkbox => {
    checkbox.checked = randomEmphasisTags.includes(checkbox.value);
  });

  // Random text inputs
  const randomSubjects = ["beautiful Latina woman with black hair", "mystical forest landscape", "futuristic cityscape at night", "vintage steampunk robot", "dramatic portrait of an old man"];
  const randomStyles = ["Van Gogh, cyberpunk aesthetics", "Baroque dramatic lighting", "80s retro wave", "Japanese ukiyo-e style", "modern abstract art"];

  document.getElementById("subjectDesc").value = randomChoice(randomSubjects);
  document.getElementById("styleInfluences").value = randomChoice(randomStyles);
  document.getElementById("additionalParams").value = "";
  document.getElementById("poseAction").value = "";

  generatePrompts();
}

// Image processing to generate prompt
function analyzeImage(file) {
  const resultDisplay = document.getElementById("imageAnalysisResult");
  const img = new Image();
  const reader = new FileReader();
  reader.onload = function (e) {
    img.src = e.target.result;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const dataPixels = imageData.data;

      let r = 0, g = 0, b = 0;
      let count = 0;

      for (let i = 0; i < dataPixels.length; i += 4) {
        r += dataPixels[i];
        g += dataPixels[i + 1];
        b += dataPixels[i + 2];
        count++;
      }

      r = Math.round(r / count);
      g = Math.round(g / count);
      b = Math.round(b / count);

      let brightness = Math.round(((r + g + b) / 3) / 255 * 100);
      let brightnessDesc = brightness > 60 ? "bright" : brightness > 30 ? "medium brightness" : "dim";

      resultDisplay.textContent = `Dominant color approx: rgb(${r},${g},${b}), ${brightnessDesc}`;

      // Use this data to fill or suggest color palette and lighting
      document.getElementById("colorPalette").value = "Vibrant";
      if (brightness > 60) {
        document.getElementById("lighting").value = "Natural Daylight";
      } else {
        document.getElementById("lighting").value = "Soft Focus";
      }

      generatePrompts();
    };
  };
  reader.readAsDataURL(file);
}

// Event listeners
window.onload = () => {
  initializeFields();

  document.getElementById("randomGenerate").addEventListener("click", generateRandomPrompt);

  document.getElementById("imageUpload").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      analyzeImage(file);
    }
  });

  // All select/input fields trigger generatePrompts on change/input
  const inputs = document.querySelectorAll("select, input[type=text], .checkbox-group input[type=checkbox]");
  inputs.forEach(input => {
    input.addEventListener("change", generatePrompts);
    input.addEventListener("input", generatePrompts);
  });

  // Initial generation
  generatePrompts();
};
