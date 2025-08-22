// Function to call DeepSeek API and generate a prompt
async function generateAIPrompt() {
    // Get selected tags (adjust this to match your HTML checkboxes)
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
    const selectedTags = Array.from(checkboxes).map(cb => cb.value);
    
    // Get user input (add an input field in HTML if needed)
    const userInput = document.getElementById('user-input').value || 'Describe a scene'; // Default text
    
    const apiKey = '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'; // Your key - REMOVE BEFORE PUBLISHING!
    const endpoint = 'https://api.deepseek.com/v1/chat/completions';
    
    const promptMessage = `Create a creative AI prompt using these tags: ${selectedTags.join(', ')}. Base it on: ${userInput}. Keep it under 500 characters.`;
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat', // DeepSeek's chat model
                messages: [{ role: 'user', content: promptMessage }],
                max_tokens: 200 // Keeps it short and concise[2]
            })
        });
        
        if (!response.ok) {
            throw new Error('API call failed. Check your key or internet.');
        }
        
        const data = await response.json();
        const generatedPrompt = data.choices.message.content.trim();
        
        // Display the result in the output area
        document.getElementById('output').textContent = generatedPrompt;
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('output').textContent = 'Error generating prompt. Try again.';
    }
}

// Attach the function to a button click
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('generate-btn').addEventListener('click', generateAIPrompt);
});
