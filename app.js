// Data
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

// Populate selects and checkboxes
function fillSelect(id, options) {
  const select = document.getElementById(id);
  select.innerHTML = '<option value="">Select...</option>';
  options.forEach(opt => {
    const option = document.createElement('option');
    option.textContent = opt;
    option.value = opt;
    select.appendChild(option);
  });
}

function fillCheckboxes(id, options) {
  const container = document.getElementById(id);
  container.innerHTML = '';
  options.forEach(opt => {
    const label = document.createElement('label');
    label.className = 'checkbox-label';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = opt;
    label.appendChild(checkbox);
    const span = document.createElement('span');
    span.textContent = opt;
    label.appendChild(span);
    container.appendChild(label);
  });
}

// Get selected checkboxes
function getChecked(id) {
  const container = document.getElementById(id);
  return Array.from(container.querySelectorAll('input[type="checkbox"]:checked')).map(el => el.value);
}

// Build prompt based on selections
function buildPrompt(sel, template) {
  let parts = [];
  if(sel.qualityTags.length) parts.push(`(${sel.qualityTags.join(', ')})`);
  if(sel.subjectDesc) parts.push(sel.subjectDesc);
  if(sel.emotion && sel.emotion !== 'None') parts.push(sel.emotion + ' emotion');
  if(sel.atmosphere && sel.atmosphere !== 'None') parts.push(sel.atmosphere + ' atmosphere');
  if(sel.background && sel.background !== 'None') parts.push(sel.background + ' background');
  if(sel.lighting && sel.lighting !== 'None') parts.push(sel.lighting + ' lighting');
  if(sel.cameraAngle && sel.cameraAngle !== 'None') parts.push(sel.cameraAngle + ' camera angle');
  if(sel.colorPalette && sel.colorPalette !== 'None') parts.push(sel.colorPalette + ' color palette');
  if(sel.composition && sel.composition !== 'None') parts.push(sel.composition + ' composition');
  if(sel.styleInfluences) parts.push(`style inspired by ${sel.styleInfluences}`);
  if(sel.emphasisTags.length) parts = parts.concat(sel.emphasisTags);
  if(sel.additionalParams) parts.push(sel.additionalParams);
  if(sel.poseAction) parts.push(sel.poseAction);

  switch(template) {
    case 'technical': return `${parts.join(', ' )} shot with a Nikon D850, 50mm lens at f/2.8`;
    case 'descriptive': return `A stunning detailed portrait featuring ${parts.join(', ')}.`;
    case 'creative': return `An extraordinary artistic vision of the subject captured in ${parts.join(', ')}, evoking deep emotion.`;
    case 'professional': return `Professional photography of subject with ${parts.join(', ')}.`;
    case 'cinematic': return `(cinematic) ${parts.join(', ')}, vibrant and evocative.`;
    default: return parts.join(', ');
  }
}

// Generate prompts
function generatePrompts() {
  let selections = {
    artStyle: document.getElementById('artStyle').value,
    emotion: document.getElementById('emotion').value,
    atmosphere: document.getElementById('atmosphere').value,
    background: document.getElementById('background').value,
    lighting: document.getElementById('lighting').value,
    qualityTags: getChecked('qualityTags'),
    emphasisTags: getChecked('emphasisTags'),
    cameraAngle: document.getElementById('cameraAngle').value,
    colorPalette: document.getElementById('colorPalette').value,
    composition: document.getElementById('composition').value,
    subjectDesc: document.getElementById('subjectDesc').value,
    styleInfluences: document.getElementById('styleInfluences').value,
    additionalParams: document.getElementById('additionalParams').value,
    poseAction: document.getElementById('poseAction').value
  };
  const templates = ['technical', 'descriptive', 'creative', 'professional', 'cinematic'];
  const prompts = templates.map(t => buildPrompt(selections, t));
  displayPrompts(prompts);
}

// Display prompts
function displayPrompts(prompts){
  const container = document.getElementById('promptsContainer');
  container.innerHTML = '';
  prompts.forEach(p => {
    const box = document.createElement('div');
    box.className = 'prompt-box';
    const pText = document.createElement('pre');
    pText.className = 'prompt-text';
    pText.textContent = p;

    const actions = document.createElement('div');
    actions.className = 'prompt-actions';

    const copyBtn = document.createElement('button');
    copyBtn.textContent = 'Copy';
    copyBtn.onclick = () => copyToClipboard(p);

    const enhanceBtn = document.createElement('button');
    enhanceBtn.textContent = 'Enhance';
    enhanceBtn.onclick = () => {
      pText.textContent = enhancePrompt(pText.textContent);
    };

    const varyBtn = document.createElement('button');
    varyBtn.textContent = 'Variation';
    varyBtn.onclick = () => {
      pText.textContent = createVariation(pText.textContent);
    };

    actions.appendChild(copyBtn);
    actions.appendChild(enhanceBtn);
    actions.appendChild(varyBtn);

    box.appendChild(pText);
    box.appendChild(actions);

    container.appendChild(box);
  });
}

// Copy text
function copyToClipboard(text){
  navigator.clipboard.writeText(text).then(() => alert('Copied!'), ()=> alert('Copy failed'));
}

// Enhance prompt
function enhancePrompt(text){
  if(text.includes('(enhanced)')) return text+' (more intricate details added)';
  return '(enhanced) '+text + ', ultra high-res, cinematic lighting';
}

// Variation
function createVariation(text){
  // Simple implementation, real logic can be expanded
  let variations = [
    text.replace(/joyful/gi,'serene'),
    text.replace(/detailed/gi,'minimalistic'),
    text.replace(/cinematic/gi, 'dreamy'),
    text.replace(/vibrant/gi, 'muted'),
  ];
  return variations[Math.floor(Math.random()*variations.length)];
}

// Random prompt generator
function generateRandomPrompt(){
  function randChoice(arr){return arr[Math.floor(Math.random()*arr.length)];}
  function randMulti(arr){
    let n=Math.floor(Math.random()*arr.length);
    let a=arr.slice().sort(() => 0.5 - Math.random());
    return a.slice(0,n);
  }
  document.getElementById('artStyle').value = randChoice(data.art_styles);
  document.getElementById('emotion').value = randChoice(data.emotions);
  document.getElementById('atmosphere').value = randChoice(data.atmospheres);
  document.getElementById('background').value = randChoice(data.backgrounds);
  document.getElementById('lighting').value = randChoice(data.lighting);
  document.getElementById('cameraAngle').value = randChoice(data.camera_angles);
  document.getElementById('colorPalette').value = randChoice(data.color_palettes);
  document.getElementById('composition').value = randChoice(data.compositions);
  const qualityCks = document.getElementById('qualityTags').querySelectorAll('input[type=checkbox]');
  const emphasisCks = document.getElementById('emphasisTags').querySelectorAll('input[type=checkbox]');
  qualityCks.forEach(ck => ck.checked = randMulti(data.quality_tags).includes(ck.value));
  emphasisCks.forEach(ck => ck.checked = randMulti(data.emphasis_tags).includes(ck.value));
  const subjects = ['beautiful Latina woman with black hair','mystical forest landscape','futuristic cityscape at night'];
  const styles = ['Van Gogh, cyberpunk','Baroque dramatic lighting', '80s retro wave'];
  document.getElementById('subjectDesc').value = randChoice(subjects);
  document.getElementById('styleInfluences').value = randChoice(styles);
  document.getElementById('additionalParams').value='';
  document.getElementById('poseAction').value='';
  generatePrompts();
}

// Erase all fields and prompts
function eraseAll(){
  ['artStyle','emotion','atmosphere','background','lighting','cameraAngle','colorPalette','composition','subjectDesc','styleInfluences','additionalParams','poseAction'].forEach(id => {
    const el = document.getElementById(id);
    if(el) el.value='';
  });
  document.getElementById('qualityTags').querySelectorAll('input[type=checkbox]').forEach(ck=>ck.checked=false);
  document.getElementById('emphasisTags').querySelectorAll('input[type=checkbox]').forEach(ck=>ck.checked=false);
  document.getElementById('promptsContainer').innerHTML = '';
  document.getElementById('imageAnalysisResult').textContent = '';
}

// Image to prompt analysis
function analyzeImage(file){
  const result = document.getElementById('imageAnalysisResult');
  if(!file) {
    result.textContent = ''; return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img,0,0);
      const imageData = ctx.getImageData(0,0,canvas.width,canvas.height);
      const data = imageData.data;

      let r=0,g=0,b=0;
      let count=0;
      for(let i=0; i<data.length; i+=4){
        r+=data[i]; g+=data[i+1]; b+=data[i+2]; count++;
      }
      r=Math.round(r/count); g=Math.round(g/count); b=Math.round(b/count);
      // Calculate brightness as average
      let brightness = Math.round(((r+g+b)/3)/255*100);
      let brightnessDesc = brightness>60?'bright':brightness>30?'medium brightness':'dim';
      // Fake edge density with variance from average
      let variance=0;
      for(let i=0;i<data.length;i+=4){
        variance += Math.abs(data[i] - r)+Math.abs(data[i+1]-g)+Math.abs(data[i+2]-b);
      }
      variance /= count;
      let detailDesc=variance>100?'high detail':'low detail';

      result.textContent = `Detected: rgb(${r},${g},${b}), ${brightnessDesc}, ${detailDesc}`;

      // Use this info to set color palette and lighting selections
      if(brightness>60) document.getElementById('lighting').value='Natural Daylight';
      else document.getElementById('lighting').value='Soft Focus';
      if(variance>100) document.getElementById('composition').value='High Contrast';
      else document.getElementById('composition').value='Low Contrast';
      document.getElementById('colorPalette').value = (r+g+b)/3>128?'Vibrant':'Muted';
      generatePrompts();
    };
    img.src=e.target.result;
  };
  reader.readAsDataURL(file);
}

// Theme toggle
function toggleTheme(){
  document.body.classList.toggle('dark');
  // Save to localStorage
  localStorage.setItem('theme', document.body.classList.contains('dark')?'dark':'light');
}

// Initialize
window.onload = () => {
  fillSelect('artStyle', data.art_styles);
  fillSelect('emotion', data.emotions);
  fillSelect('atmosphere', data.atmospheres);
  fillSelect('background', data.backgrounds);
  fillSelect('lighting', data.lighting);
  fillSelect('cameraAngle', data.camera_angles);
  fillSelect('colorPalette', data.color_palettes);
  fillSelect('composition', data.compositions);
  fillCheckboxes('qualityTags', data.quality_tags);
  fillCheckboxes('emphasisTags', data.emphasis_tags);

  document.getElementById('generateBtn').onclick = generatePrompts;
  document.getElementById('randomBtn').onclick = generateRandomPrompt;
  document.getElementById('eraseBtn').onclick = eraseAll;
  document.getElementById('imageUpload').onchange = e=> analyzeImage(e.target.files[0]);
  document.getElementById('themeToggle').onclick = toggleTheme;

  // Restore theme
  if(localStorage.getItem('theme')==='dark') document.body.classList.add('dark');

  generatePrompts();
};
