

// ✅ Create Right-Click Context Menu for Images
chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: "checkImage",
        title: "Check Image with Vigilant-AI",
        contexts: ["image"]
    });
});


// ✅ Handle Click on Context Menu
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "checkImage") {
        let imageUrl = info.srcUrl; // Get right-clicked image URL
        analyzeImageFromUrl(imageUrl);
    }
});

function isValidImageUrl(url) {
    return /\.(jpeg|jpg|png|gif|webp)$/i.test(url);
}

async function analyzeImageFromUrl(imageUrl) {
    if (!isValidImageUrl(imageUrl)) {
        alert(" Error: The selected URL is not an image.");
        return;
    }
}
// ✅ Send Image URL to API for Analysis
async function analyzeImageFromUrl(imageUrl) {
    let apiEndpoint = "http://127.0.0.1:5001/analyze-image-url"; // API for URL-based image checking
    try {
        let response = await fetch(apiEndpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ imageUrl })
        });

        let data = await response.json();

        if (data.error) {
            alert(` Error: ${data.error}`);
        } else {
            alert(` Result: ${data.result}\nConfidence: ${data.confidence}%`);
        }
    } catch (error) {
        alert(" Error: Unable to connect to server.");
    }
}
