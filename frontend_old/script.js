const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const modeText = document.getElementById('mode-text');
const tabs = document.querySelectorAll('.tab-btn');

const stateUpload = document.getElementById('drop-zone');
const stateAnalyze = document.getElementById('analyze-state');
const stateResult = document.getElementById('results-panel');
const progressFill = document.getElementById('progress-fill');
const previewContainer = document.getElementById('preview-container');

// Result elements
const verdictLabel = document.getElementById('verdict-label');
const verdictIcon = document.getElementById('verdict-icon');
const confidenceText = document.getElementById('confidence-text');
const confidenceValueDisplay = document.getElementById('confidence-value-display');
const confidenceRing = document.getElementById('confidence-ring');
const confidenceBar = document.getElementById('confidence-bar');
const scannerLine = document.querySelector('.scanner-line');

let currentMode = 'image';
let currentFile = null;
let currentReason = ''; // Store the reason

// Tab Switching
function switchTab(mode) {
    currentMode = mode;
    tabs.forEach(tab => tab.classList.remove('active'));
    document.querySelector(`[data-type="${mode}"]`).classList.add('active');
    modeText.innerText = mode.charAt(0).toUpperCase() + mode.slice(1);

    // Update acccepted file types
    fileInput.accept = `${mode}/*`;
    if (mode === 'video') fileInput.accept = 'video/mp4,video/x-m4v,video/*';
}

// Initialization
switchTab('image');

// Event Listeners for Drag & Drop
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
        handleFile(e.dataTransfer.files[0]);
    }
});

dropZone.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
        handleFile(e.target.files[0]);
    }
});

function handleFile(file) {
    // Validate file type
    if (!file.type.startsWith(currentMode)) {
        alert(`Please upload a valid ${currentMode} file.`);
        return;
    }
    currentFile = file;
    startAnalysisSequence();
}

function generatePreview(file) {
    previewContainer.innerHTML = '';
    const url = URL.createObjectURL(file);
    let el;
    if (currentMode === 'image') {
        el = document.createElement('img');
        el.src = url;
    } else if (currentMode === 'video') {
        el = document.createElement('video');
        el.src = url;
        el.muted = true;
        el.play();
    } else {
        el = document.createElement('img');
        el.src = 'https://via.placeholder.com/200x200/111/fff?text=Audio+Waveform'; // placeholder
    }
    previewContainer.appendChild(el);
}

function startAnalysisSequence() {
    stateUpload.classList.add('hidden');
    stateAnalyze.classList.remove('hidden');
    generatePreview(currentFile);

    // Reset scanner color
    scannerLine.style.background = 'var(--success)';
    scannerLine.style.boxShadow = '0 0 15px var(--success), 0 0 30px var(--success)';

    // Simulate initial Progress and setup formData
    progressFill.style.width = '10%';

    const formData = new FormData();
    formData.append('file', currentFile);

    // Call API (FastAPI backend)
    fetch(`/api/detect/${currentMode}`, {
        method: 'POST',
        body: formData,
    })
        .then(response => {
            progressFill.style.width = '50%';
            if (!response.ok) throw new Error("API Error");
            return response.json();
        })
        .then(data => {
            console.log("API Response:", data);   // ADD THIS
            progressFill.style.width = '100%';
            setTimeout(() => showResults(data), 800);
})
        .catch(err => {
            console.error(err);
            alert("Server error. Make sure the backend API is running.");
            resetApp();
        });
}

function showResults(data) {
    stateAnalyze.classList.add('hidden');
    stateResult.classList.remove('hidden');

    const isFake = data.prediction === 'Fake' || data.prediction === 'Deepfake';

    let confValue = Number(data.confidence);

    // Backend now sends percentage (0-100), but handle (0-1) for backward compatibility
    if (confValue > 0 && confValue <= 1) {
        confValue = confValue * 100;
    }

    confValue = Math.min(confValue, 100);

    verdictLabel.innerText = data.prediction.toUpperCase();
    
    // Inject Icon
    if (verdictIcon) {
        verdictIcon.innerHTML = isFake 
            ? `<svg viewBox="0 0 24 24" fill="none" stroke="var(--danger)" stroke-width="2" style="width: 48px; height: 48px;"><path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" stroke-linecap="round" stroke-linejoin="round"/></svg>`
            : `<svg viewBox="0 0 24 24" fill="none" stroke="var(--success)" stroke-width="2" style="width: 48px; height: 48px;"><path d="M5 13l4 4L19 7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    }

    const formattedConfidence = `${confValue.toFixed(2)}%`;
    
    // Update SVG Text (Use textContent for SVG)
    if (confidenceText) confidenceText.textContent = formattedConfidence;
    
    // Update Linear Text Display
    if (confidenceValueDisplay) confidenceValueDisplay.innerText = formattedConfidence;

    currentReason = data.reason || "No technical details provided by model.";

    const colorClass = isFake ? 'fake' : 'real';
    const colorValue = isFake ? '#FF3366' : '#00F260'; // Using direct hex for reliability

    verdictLabel.className = `verdict-label ${colorClass}`;

    // Update Linear Bar
    if (confidenceBar) {
        confidenceBar.style.width = `${confValue}%`;
        confidenceBar.style.backgroundColor = colorValue;
    }

    confidenceRing.classList.remove('fake', 'real');
    void confidenceRing.offsetWidth;
    confidenceRing.classList.add(colorClass);

    confidenceRing.setAttribute('stroke-dasharray', `${confValue}, 100`);
}

function resetApp() {
    currentFile = null;
    currentReason = '';
    fileInput.value = '';
    progressFill.style.width = '0%';
    if (verdictIcon) verdictIcon.innerHTML = '';
    if (confidenceBar) confidenceBar.style.width = '0%';
    if (confidenceValueDisplay) confidenceValueDisplay.innerText = '0%';
    if (confidenceText) confidenceText.textContent = '0%';
    stateResult.classList.add('hidden');
    stateAnalyze.classList.add('hidden');
    stateUpload.classList.remove('hidden');
}

function viewDetails() {
    document.getElementById('tech-reason-text').innerText = currentReason;
    document.getElementById('tech-modal').classList.remove('hidden');
}

function closeDetails() {
    document.getElementById('tech-modal').classList.add('hidden');
}
