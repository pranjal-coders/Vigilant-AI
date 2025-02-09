# 🦇 Vigilant-AI - The Ultimate Misinformation & Deepfake Detector

Vigilant-AI is an advanced **fact-checking** and **AI-powered image verification** tool designed to combat misinformation. It includes:

- A **web app** for checking facts and detecting AI-generated images
- A **Chrome extension** for right-click verification on any webpage

## **✨ Features Overview**

### ✅ **Fact Checking with Reliable Sources**

- **What it does:** Uses **Falcon-7B** (Hugging Face) to analyze textual claims for credibility.
- **Why we chose this:** To fight misinformation and provide users with quick verification.
- **How to use:**
  1. Enter a claim in the text box.
  2. Click **"Check Fact"**.
  3. View AI-generated analysis + **Wikipedia & Google News** references.

---

### ✅ **AI Image Fake Detection (Upload & URL-based)**

- **What it does:** Uses **EfficientNetB0** to analyze images and determine whether they are AI-generated or real.
- **Why we chose this:** Deepfake images and AI-generated visuals are increasing rapidly, making verification crucial.
- **How to use:**
  1. Upload an image (or drag & drop).
  2. Click **"Analyze Image"**.
  3. Alternatively, **right-click any image on a website** and choose **"Check Image with Vigilant-AI"**.
  4. The tool provides a **confidence score** on authenticity.

---

### ✅ **History Tracking for Fact & Image Checks**

- **What it does:** Stores **up to 10 previous verifications** for easy reference.
- **Why we chose this:** Users may want to revisit past verifications.
- **How to use:**
  - View past verifications in the **History** section.
  - Click **"Clear History"** to reset.

---

### ✅ **Drag & Drop Image Upload for Faster Analysis**

- **What it does:** Allows users to **drag & drop images** for analysis.
- **Why we chose this:** Enhances **usability & accessibility**.
- **How to use:**
  - Drag an image into the **drop zone**.
  - It auto-uploads and **previews the image** before analysis.

---

### ✅ **Right-Click Image URL Checking (Chrome Extension)**

- **What it does:** Enables users to verify images **directly from webpages**.
- **Why we chose this:** Many fake images spread online, and this allows instant verification.
- **How to use:**
  - **Right-click an image** on any webpage.
  - Select **"Check Image with Vigilant-AI"**.
  - The extension will **analyze and display results** in a pop-up.

---

## **🛠 How It Works (Tech Stack & Architecture)**

### **Frontend**

- Built with **HTML, CSS, JavaScript**
- Includes a **Chrome extension**

### **Backend**

- **Python + Flask** API for processing requests
- AI models:
  - **Falcon-7B (Hugging Face API)** for **fact verification**
  - **EfficientNetB0** for **image analysis**

### **Storage & History**

- Uses **LocalStorage** to store recent fact-checks & analyses

---

## **💻 How to Run the Project Locally**

### 1️⃣ **Clone the Repository**

```sh
$ git clone https://github.com/pranjal-coders/Vigilant-AI.git
$ cd Vigilant-AI
```

### 2️⃣ **Install Dependencies**

```sh
$ pip install -r requirements.txt
```

📌 **Ensure Python 3.8+ is installed** before running the setup.

### 3️⃣ **Set Up API Keys**

1. **Hugging Face API Key** (for fact-checking):
   - Go to [Hugging Face](https://huggingface.co/settings/tokens).
   - Generate an API key with **read & write access**.
   - Create a `.env` file in the project folder and add:
     ```sh
     HUGGINGFACE_API_KEY=your_api_key_here
     ```

### 4️⃣ **Start the Backend Servers**

```sh
$ python main.py  # Starts fact-checker (Port 5000)
$ python app.py   # Starts image analyzer (Port 5001)
```

### 5️⃣ **Open the Web App**

Visit **[http://127.0.0.1:5000/](http://127.0.0.1:5000/)** in your browser.

### 6️⃣ **Install the Chrome Extension**

1. Open **chrome://extensions/**
2. Enable **Developer Mode** (top right corner).
3. Click **"Load unpacked"** and select the `/extension` folder.
4. The extension is now **installed & ready to use!**

---

## **📈 Contribution Guidelines**

We welcome **pull requests** and contributions!

### How to Contribute:

1. **Fork the repository**
2. **Create a new branch** for your feature
3. **Make changes & commit**
4. **Submit a pull request** with a clear description

### Ideas for Contributions:

✔ Improve **fact-checking model accuracy** 

✔ Add **real-time news sources** (e.g., Google Fact Check API)

✔ Expand **image verification to detect deepfakes**

✔ Optimize **performance & UI**

---

## **✨ Future Improvements**

- Enhance **AI model accuracy** for fact verification.
- Deploy backend to a **public cloud server** (so users don’t need to run Flask locally).
- Support **multiple languages** for global accessibility.
- Add **deepfake video detection** in future versions.

---

## **🔒 License**

This project is licensed under the **MIT License**.

---

### **💙 Made with Love by the Vigilant-AI Team!**

For any questions, feel free to **open an issue** on GitHub! 🚀

