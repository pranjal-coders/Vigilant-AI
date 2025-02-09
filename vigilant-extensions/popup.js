document.addEventListener("DOMContentLoaded", function () {
    loadFactHistory(); // Load previous fact-check history on startup
    setupDragAndDrop(); // Enable drag-and-drop for image uploads
    
    // ✅ IMAGE PREVIEW FUNCTION
    document.getElementById("imageUpload").addEventListener("change", function (event) {
        let file = event.target.files[0]; // Get selected file
        if (file) {
            let reader = new FileReader();
            reader.onload = function (e) {
                let uploadedImage = document.getElementById("uploadedImage");
                uploadedImage.src = e.target.result; // Set image source
                uploadedImage.style.display = "block"; // Show preview
            };
            reader.readAsDataURL(file); // Convert image to base64
        }
    });
});

// ✅ FACT CHECKING FUNCTION (With Wikipedia & News References)
document.getElementById("checkFactBtn").addEventListener("click", async function () {
    let claim = document.getElementById("claim").value.trim();
    if (!claim) {
        alert("Enter a fact to check!");
        return;
    }

    document.getElementById("factResult").innerHTML = " Checking...";

    try {
        let response = await fetch(`http://127.0.0.1:5000/check_fact?claim=${encodeURIComponent(claim)}`);
        let data = await response.json();

        let factResult = `<strong>Result:</strong> ${data.analysis}`;
        
        // Fetch Wikipedia & Google News sources
        let references = await fetchSources(claim);
        
        document.getElementById("factResult").innerHTML = factResult + references;

        // Save fact check result in history
        saveFactHistory(claim, data.analysis, references);
    } catch (error) {
        document.getElementById("factResult").innerHTML = " Error: Unable to connect to server.";
    }
});

// ✅ IMAGE UPLOAD (Drag & Drop or Click)
document.getElementById("checkImageBtn").addEventListener("click", function () {
    let imageFile = document.getElementById("imageUpload").files[0];
    if (!imageFile) {
        alert("Upload an image!");
        return;
    }
    analyzeImage(imageFile);
});

// ✅ DRAG & DROP IMAGE UPLOAD FUNCTION
function setupDragAndDrop() {
    let dropArea = document.querySelector(".drop-zone"); // Use a specific drop zone

    dropArea.addEventListener("dragover", function (event) {
        event.preventDefault();
        dropArea.classList.add("drag-over"); // Highlight on drag
    });

    dropArea.addEventListener("dragleave", function () {
        dropArea.classList.remove("drag-over"); // Reset on leave
    });

    dropArea.addEventListener("drop", function (event) {
        event.preventDefault();
        dropArea.classList.remove("drag-over");

        let files = event.dataTransfer.files;
        if (files.length > 0) {
            analyzeImage(files[0]); // Process the dropped image
        }
    });
}

// ✅ IMAGE ANALYSIS FUNCTION (FILE UPLOAD)
async function analyzeImage(imageFile) {
    let formData = new FormData();
    formData.append("file", imageFile);

    document.getElementById("imageResult").innerHTML = " Analyzing...";

    try {
        let response = await fetch("http://127.0.0.1:5001/analyze-image", {
            method: "POST",
            body: formData
        });
        let data = await response.json();

        if (data.error) {
            document.getElementById("imageResult").innerHTML = `<strong>Error:</strong> ${data.error}`;
        } else {
            document.getElementById("imageResult").innerHTML = 
                `<strong>Result:</strong> ${data.result} <br> 
                <strong>Confidence:</strong> ${data.confidence}%`;
        }
    } catch (error) {
        document.getElementById("imageResult").innerHTML = " Error: Unable to connect to server.";
    }
}

// ✅ RIGHT-CLICK IMAGE URL CHECKING (Context Menu Feature)
chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
    if (request.action === "analyzeImageURL") {
        document.getElementById("imageResult").innerHTML = "🔍 Analyzing...";

        try {
            let response = await fetch("http://127.0.0.1:5001/analyze-image-url", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ imageUrl: request.imageUrl }) // ✅ FIXED: Use JSON, not FormData
            });

            let data = await response.json();

            if (data.error) {
                document.getElementById("imageResult").innerHTML = `<strong>Error:</strong> ${data.error}`;
            } else {
                document.getElementById("imageResult").innerHTML = 
                    `<strong>Result:</strong> ${data.result} <br> 
                    <strong>Confidence:</strong> ${data.confidence}%`;
            }
        } catch (error) {
            document.getElementById("imageResult").innerHTML = " Error: Unable to connect to server.";
        }
    }
});

// ✅ FETCH SOURCES (Wikipedia & News)
async function fetchSources(query) {
    let sourcesHTML = "<br><strong> Related Sources:</strong><br>";

    try {
        let wikiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
        let wikiResponse = await fetch(wikiUrl);
        let wikiData = await wikiResponse.json();

        if (wikiData.query.search.length > 0) {
            let wikiTitle = wikiData.query.search[0].title;
            let wikiLink = `https://en.wikipedia.org/wiki/${encodeURIComponent(wikiTitle)}`;
            sourcesHTML += `<a href="${wikiLink}" target="_blank"> Wikipedia: ${wikiTitle}</a><br>`;
        }
    } catch (error) {
        console.error("Wikipedia API Error:", error);
    }

    let newsSearchLink = `https://news.google.com/search?q=${encodeURIComponent(query)}`;
    sourcesHTML += `<a href="${newsSearchLink}" target="_blank"> Google News: ${query}</a>`;

    return sourcesHTML;
}

// ✅ SAVE FACT CHECK HISTORY
function saveFactHistory(claim, analysis, references) {
    let history = JSON.parse(localStorage.getItem("factHistory")) || [];
    
    if (history.length >= 10) history.pop(); // Keep only last 10 entries

    history.unshift({ claim, analysis, references, timestamp: new Date().toLocaleString() });

    localStorage.setItem("factHistory", JSON.stringify(history));
    loadFactHistory();
}

// ✅ LOAD FACT HISTORY
function loadFactHistory() {
    let history = JSON.parse(localStorage.getItem("factHistory")) || [];
    let historyContainer = document.getElementById("factHistory");

    if (!historyContainer) return;

    historyContainer.innerHTML = history.length === 0 ? "<p>No history available.</p>" : "";

    history.forEach(entry => {
        let div = document.createElement("div");
        div.classList.add("history-entry");
        div.innerHTML = `
            <strong> ${entry.claim}</strong><br>
            ${entry.analysis}<br>
            ${entry.references}<br>
            <small> ${entry.timestamp}</small>`;
        historyContainer.appendChild(div);
    });
}

// ✅ CLEAR HISTORY FUNCTION
document.getElementById("clearHistoryBtn").addEventListener("click", function () {
    localStorage.removeItem("factHistory");
    loadFactHistory();
});
