import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import htm from 'htm';
import { motion, AnimatePresence } from 'framer-motion';

const html = htm.bind(React.createElement);

// --- Reusable Animated Components ---

const Icon = ({ name, className = "w-6 h-6", color = "currentColor" }) => {
    useEffect(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }, [name]);
    return html`<i data-lucide=${name} class=${className} style=${{ color }}></i>`;
};

const SectionReveal = ({ children, delay = 0 }) => html`
    <${motion.div}
        initial=${{ opacity: 0, y: 30 }}
        whileInView=${{ opacity: 1, y: 0 }}
        viewport=${{ once: true }}
        transition=${{ duration: 0.8, delay }}
    >
        ${children}
    </${motion.div}>
`;

const TechIcon = ({ name, label, color = "#00F260" }) => html`
    <div class="tech-icon-container group">
        <${Icon} name=${name} class="w-8 h-8 text-gray-400 group-hover:text-brand-primary" />
        <div class="tech-tooltip">${label}</div>
    </div>
`;

// --- Navbar Component ---
const Navbar = ({ currentPath, setPath }) => {
    const navItems = [
        { label: 'Home', path: 'home', icon: 'home' },
        { label: 'Image', path: 'image-detection', icon: 'image' },
        { label: 'Video', path: 'video-detection', icon: 'video' },
        { label: 'Audio', path: 'audio-detection', icon: 'mic' },
        { label: 'Technology', path: 'about', icon: 'cpu' },
    ];

    return html`
        <nav class="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 px-6 py-4 flex justify-between items-center">
            <div class="flex items-center gap-3 cursor-pointer" onClick=${() => setPath('home')}>
                <div class="w-10 h-10 bg-brand-primary rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(0,242,96,0.4)]">
                    <${Icon} name="shield-check" class="w-6 h-6 text-black" />
                </div>
                <span class="font-tech text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    DEEPSIGHT <span class="text-brand-primary">AI</span>
                </span>
            </div>

            <div class="hidden md:flex gap-8">
                ${navItems.map(item => html`
                    <button
                        key=${item.path}
                        onClick=${() => setPath(item.path)}
                        class="relative group py-2"
                    >
                        <span class="flex items-center gap-2 text-sm font-medium transition-colors ${currentPath === item.path ? 'text-brand-primary' : 'text-gray-400 group-hover:text-white'}">
                            <${Icon} name=${item.icon} class="w-4 h-4" />
                            ${item.label}
                        </span>
                        ${currentPath === item.path && html`
                            <${motion.div}
                                layoutId="nav-underline"
                                class="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-primary shadow-[0_0_10px_rgba(0,242,96,0.6)]"
                            />
                        `}
                    </button>
                `)}
            </div>

            <div class="flex items-center gap-4">
                <button class="hidden lg:flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:border-brand-primary/50 transition-all text-xs font-semibold text-gray-300">
                    <div class="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></div>
                    SYSTEM LIVE
                </button>
                <div class="md:hidden">
                    <${Icon} name="menu" class="w-6 h-6" />
                </div>
            </div>
        </nav>
    `;
};

// --- Hero Section ---
const Hero = ({ onStart }) => {
    return html`
        <div class="min-h-screen flex flex-col items-center justify-center px-4 pt-20 text-center overflow-hidden">
            <${motion.div}
                initial=${{ opacity: 0, y: 30 }}
                animate=${{ opacity: 1, y: 0 }}
                transition=${{ duration: 0.8 }}
                class="relative"
            >
                <div class="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-brand-primary/10 blur-[100px] rounded-full"></div>

                <h2 class="font-tech text-brand-primary text-sm font-bold tracking-[0.3em] mb-6 uppercase">
                    Forensic Artificial Intelligence
                </h2>
                <h1 class="font-tech text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-tight">
                    DETECT THE <br />
                    <span class="text-gradient">UNSEEN TRUTH</span>
                </h1>
                <p class="max-w-2xl text-gray-400 text-lg md:text-xl mb-12 font-light leading-relaxed">
                    The world's most advanced multimodal deepfake detection dashboard.
                    Instantly analyze Images, Videos, and Audio with neural forensic precision.
                </p>

                <div class="flex flex-col sm:flex-row gap-6 justify-center">
                    <button
                        onClick=${() => onStart('model-selection')}
                        class="px-10 py-4 bg-brand-primary text-black font-tech font-bold rounded-full shadow-[0_0_30px_rgba(0,242,96,0.3)] hover:shadow-[0_0_50px_rgba(0,242,96,0.5)] transform hover:scale-105 transition-all flex items-center gap-3 justify-center"
                    >
                        START DETECTION
                        <${Icon} name="arrow-right" class="w-5 h-5" />
                    </button>
                    <button onClick=${() => onStart('about')} class="px-10 py-4 glass text-white font-tech font-bold rounded-full hover:bg-white/10 transform hover:scale-105 transition-all">
                        OUR TECHNOLOGY
                    </button>
                </div>
            </${motion.div}>

            <${motion.div}
                initial=${{ opacity: 0 }}
                animate=${{ opacity: 1 }}
                transition=${{ delay: 1, duration: 1 }}
                class="mt-24 grid grid-cols-1 sm:grid-cols-3 gap-12 text-gray-500"
            >
                <div class="flex flex-col items-center gap-2">
                    <span class="font-tech text-white text-3xl">99.8%</span>
                    <span class="text-xs uppercase tracking-widest">Accuracy Rate</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                    <span class="font-tech text-white text-3xl">30ms</span>
                    <span class="text-xs uppercase tracking-widest">Inference Time</span>
                </div>
                <div class="flex flex-col items-center gap-2">
                    <span class="font-tech text-white text-3xl">Multi</span>
                    <span class="text-xs uppercase tracking-widest">Model Analysis</span>
                </div>
            </${motion.div}>
        </div>
    `;
};

// --- Model Selection ---
const ModelSelection = ({ onSelect }) => {
    const models = [
        {
            id: 'image-detection',
            title: 'Image Detection',
            icon: 'image',
            desc: 'Detect deepfakes in static images using CNN and GAN artifact analysis.'
        },
        {
            id: 'video-detection',
            title: 'Video Detection',
            icon: 'video',
            desc: 'Analyze temporal inconsistencies and frame-by-frame morphs in videos.'
        },
        {
            id: 'audio-detection',
            title: 'Audio Detection',
            icon: 'mic',
            desc: 'Scan spectral phase and voice clones using audio spectrogram analysis.'
        }
    ];

    return html`
        <div class="min-h-screen pt-32 pb-20 px-6 max-w-6xl mx-auto flex flex-col items-center justify-center">
            <${SectionReveal}>
                <div class="text-center mb-16">
                    <h2 class="font-tech text-4xl lg:text-5xl font-black mb-4 tracking-tight">
                        SELECT <span class="text-brand-primary">DETECTION MODEL</span>
                    </h2>
                    <p class="text-gray-400 text-lg">Choose the media type you want to analyze.</p>
                </div>
            </${SectionReveal}>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                ${models.map((model, idx) => html`
                    <${motion.div}
                        key=${model.id}
                        initial=${{ opacity: 0, y: 30 }}
                        animate=${{ opacity: 1, y: 0 }}
                        transition=${{ delay: idx * 0.1 }}
                        onClick=${() => onSelect(model.id)}
                        class="glass p-10 rounded-[32px] cursor-pointer group hover:bg-white/5 transition-all relative overflow-hidden border border-white/10 hover:border-brand-primary/50 flex flex-col items-center text-center shadow-lg"
                    >
                        <div class="w-20 h-20 bg-black/40 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:border-brand-primary/40 group-hover:scale-110 transition-all duration-300 shadow-xl">
                            <${Icon} name=${model.icon} class="w-10 h-10 text-gray-400 group-hover:text-brand-primary transition-colors duration-300" />
                        </div>
                        
                        <h3 class="text-2xl font-tech font-bold mb-4 text-white group-hover:text-brand-primary transition-colors">${model.title}</h3>
                        <p class="text-gray-400 text-sm leading-relaxed">${model.desc}</p>
                    </${motion.div}>
                `)}
            </div>
        </div>
    `;
};

// --- Detection Template ---
const DetectionView = ({ type, setPath }) => {
    const [file, setFile] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const config = {
        'image-detection': { label: 'Image', icon: 'image', accept: 'image/*', color: 'emerald', endpoint: 'image', indicator: 'Pixel Artifact' },
        'video-detection': { label: 'Video', icon: 'video', accept: 'video/*', color: 'blue', endpoint: 'video', indicator: 'Temporal Noise' },
        'audio-detection': { label: 'Audio', icon: 'mic', accept: 'audio/*', color: 'purple', endpoint: 'audio', indicator: 'Spectral Phase' }
    }[type];

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setResult(null);
            setError(null);
        }
    };

    const runAnalysis = async () => {
        if (!file) return;
        setAnalyzing(true);
        setResult(null);
        setError(null);
        setProgress(10);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const interval = setInterval(() => {
                setProgress(p => (p < 90 ? p + Math.random() * 10 : p));
            }, 500);

            const response = await fetch(`/api/detect/${config.endpoint}`, {
                method: 'POST',
                body: formData
            });

            clearInterval(interval);
            setProgress(100);

            if (!response.ok) throw new Error('API request failed');
            const data = await response.json();

            setTimeout(() => {
                setResult(data);
                setAnalyzing(false);
            }, 800);

        } catch (err) {
            console.error(err);
            setError('System error: Unable to process media. Check backend connection.');
            setAnalyzing(false);
        }
    };

    const reset = () => {
        setFile(null);
        setResult(null);
        setAnalyzing(false);
        setProgress(0);
        setError(null);
    };

    return html`
        <div class="min-h-screen pt-32 pb-20 px-6 flex flex-col items-center">
            <${motion.div}
                initial=${{ opacity: 0, y: 20 }}
                animate=${{ opacity: 1, y: 0 }}
                class="w-full max-w-4xl"
            >
                <div class="flex p-1 bg-white/5 backdrop-blur-md border border-white/10 rounded-full mb-12 mx-auto max-w-md w-full relative">
                    ${[
                        { id: 'image-detection', label: 'Image', icon: 'image' },
                        { id: 'video-detection', label: 'Video', icon: 'video' },
                        { id: 'audio-detection', label: 'Audio', icon: 'mic' }
                    ].map(m => html`
                        <button
                            key=${m.id}
                            onClick=${() => setPath && setPath(m.id)}
                            class="flex-1 py-3 px-4 rounded-full flex items-center justify-center gap-2 text-sm font-medium transition-all relative z-10 ${type === m.id ? 'text-black' : 'text-gray-400 hover:text-white'}"
                        >
                            <${Icon} name=${m.icon} class="w-4 h-4" />
                            ${m.label}
                            ${type === m.id && html`
                                <${motion.div}
                                    layoutId="model-switcher-bg-pill"
                                    class="absolute inset-0 bg-brand-primary rounded-full z-[-1] shadow-[0_0_15px_rgba(0,242,96,0.4)]"
                                    transition=${{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            `}
                        </button>
                    `)}
                </div>

                <div class="flex items-center gap-4 mb-8">
                    <div class="p-3 bg-brand-primary/20 rounded-xl border border-brand-primary/30">
                        <${Icon} name=${config.icon} class="w-8 h-8 text-brand-primary" />
                    </div>
                    <div>
                        <h2 class="font-tech text-3xl font-bold uppercase tracking-tight">
                            ${config.label} <span class="text-brand-primary">Detection</span>
                        </h2>
                        <p class="text-gray-400 text-sm">Upload ${config.label.toLowerCase()} for deepfake neural forensic analysis.</p>
                    </div>
                </div>

                ${!result && !analyzing ? html`
                    <div
                        onClick=${() => fileInputRef.current?.click()}
                        onDragOver=${(e) => { e.preventDefault(); e.currentTarget.classList.add('border-brand-primary/50', 'bg-brand-primary/5'); }}
                        onDragLeave=${(e) => { e.preventDefault(); e.currentTarget.classList.remove('border-brand-primary/50', 'bg-brand-primary/5'); }}
                        onDrop=${(e) => { e.preventDefault(); handleFileChange({ target: { files: e.dataTransfer.files } }); }}
                        class="relative group cursor-pointer border-2 border-dashed border-white/10 rounded-3xl p-16 flex flex-col items-center justify-center bg-white/5 transition-all hover:border-brand-primary/30 hover:bg-brand-primary/5 overflow-hidden"
                    >
                        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div class="scan-line"></div>
                        </div>
                        <${Icon} name="upload-cloud" class="w-16 h-16 text-gray-500 mb-6 group-hover:text-brand-primary transition-colors hover-float" />
                        <h3 class="text-xl font-bold text-gray-300 mb-2">Drag and drop files here</h3>
                        <p class="text-gray-500 text-sm mb-8">Limit 50MB per file • ${config.accept}</p>
                        <button class="px-8 py-3 bg-brand-primary/10 border border-brand-primary/20 rounded-xl font-semibold hover:bg-brand-primary/20 transition-all text-brand-primary">
                            Browse Files
                        </button>
                        <input type="file" ref=${fileInputRef} class="hidden" accept=${config.accept} onChange=${handleFileChange} />
                        ${file && html`
                            <div class="mt-8 p-4 glass rounded-2xl w-full max-w-md flex items-center justify-between border-brand-primary/20 animate-pulse">
                                <div class="flex items-center gap-3">
                                    <${Icon} name="file-text" class="text-brand-primary" />
                                    <span class="text-sm font-medium truncate max-w-[200px]">${file.name}</span>
                                </div>
                                <button onClick=${e => { e.stopPropagation(); setFile(null); }} class="text-gray-500 hover:text-red-500">
                                    <${Icon} name="x" class="w-4 h-4" />
                                </button>
                            </div>
                        `}
                    </div>

                    ${file && html`
                        <${motion.div}
                            initial=${{ opacity: 0, scale: 0.9 }}
                            animate=${{ opacity: 1, scale: 1 }}
                            class="mt-12 flex justify-center"
                        >
                            <button
                                onClick=${runAnalysis}
                                class="px-12 py-5 bg-brand-primary text-black font-tech font-bold rounded-full shadow-[0_0_30px_rgba(0,242,96,0.3)] hover:shadow-[0_0_50px_rgba(0,242,96,0.5)] transform hover:scale-105 transition-all flex items-center gap-3"
                            >
                                START ANALYSIS
                                <${Icon} name="zap" class="w-5 h-5" />
                            </button>
                        </${motion.div}>
                    `}
                ` : analyzing ? html`
                    <div class="glass rounded-3xl p-16 flex flex-col items-center">
                        <div class="relative w-48 h-48 mb-12">
                            <div class="absolute inset-0 border-4 border-brand-primary/10 rounded-full"></div>
                            <svg class="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                                <circle cx="50" cy="50" r="46" fill="none" stroke="#00F260" stroke-width="4" stroke-dasharray=${`${progress * 2.89}, 1000`} stroke-linecap="round" class="transition-all duration-300" />
                            </svg>
                            <div class="absolute inset-0 flex flex-col items-center justify-center">
                                <span class="text-4xl font-tech font-bold">${Math.round(progress)}%</span>
                                <span class="text-[10px] text-brand-primary tracking-widest uppercase">Analyzing</span>
                            </div>
                        </div>
                        <h3 class="font-tech text-xl text-brand-primary mb-4">PROCESSING NEURAL FORENSICS</h3>
                        <div class="w-full max-w-sm h-1.5 bg-white/5 rounded-full overflow-hidden relative">
                            <div class="absolute inset-y-0 left-0 bg-brand-primary transition-all duration-300 shadow-[0_0_10px_rgba(0,242,96,0.6)]" style=${{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                ` : result && html`
                    <${motion.div}
                        initial=${{ opacity: 0, scale: 0.95 }}
                        animate=${{ opacity: 1, scale: 1 }}
                        class="glass rounded-3xl p-8 lg:p-12 relative overflow-hidden mb-8"
                    >
                        <div class="absolute top-0 left-0 w-full h-2 ${result.prediction.toLowerCase() === 'real' ? 'bg-status-real' : 'bg-status-fake'}"></div>

                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                            <div>
                                <h3 class="text-xs font-tech text-gray-500 tracking-[0.3em] mb-4 uppercase">Forensic Report</h3>

                                <div class="flex items-end gap-3 mb-6">
                                    <h4 class="text-6xl font-tech font-black ${result.prediction.toLowerCase() === 'real' ? 'text-status-real' : 'text-status-fake'}">
                                        ${result.prediction.toUpperCase()}
                                    </h4>
                                    <div class="mb-2 p-2 ${result.prediction.toLowerCase() === 'real' ? 'bg-status-real/20 text-status-real' : 'bg-status-fake/20 text-status-fake'} rounded-lg">
                                        <${Icon} name=${result.prediction.toLowerCase() === 'real' ? 'check-circle' : 'alert-octagon'} class="w-6 h-6" />
                                    </div>
                                </div>

                                <div class="bg-black/30 rounded-2xl p-6 border border-white/5 mb-6">
                                    <div class="flex justify-between items-center mb-4 text-sm">
                                        <span class="text-gray-500 font-tech">Confidence Score</span>
                                        <span class="text-white font-tech font-bold">${result.confidence}%</span>
                                    </div>
                                    <div class="w-full h-3 bg-white/5 rounded-full overflow-hidden">
                                        <div class="h-full ${result.prediction.toLowerCase() === 'real' ? 'bg-status-real' : 'bg-status-fake'} transition-all duration-1000" style=${{ width: `${result.confidence}%` }}></div>
                                    </div>
                                </div>

                                <div class="space-y-4 mb-8">
                                    <div class="flex items-start gap-3">
                                        <div class="mt-1"><${Icon} name="activity" class="text-brand-primary w-4 h-4" /></div>
                                        <p class="text-gray-300 text-sm leading-relaxed">
                                            <span class="font-bold text-white block mb-1">AI Analysis Summary</span>
                                            ${result.prediction.toLowerCase() === 'real'
                                                ? 'Target shows high consistency with organic capture signatures. No generative AI patterns identified.'
                                                : 'Neural scan detected high-probability synthetic synthesis markers.'}
                                        </p>
                                    </div>
                                    <div class="flex items-start gap-3">
                                        <div class="mt-1"><${Icon} name="search" class="text-brand-primary w-4 h-4" /></div>
                                        <p class="text-gray-300 text-sm leading-relaxed">
                                            <span class="font-bold text-white block mb-1">Reasoning Behind Detection</span>
                                            ${result.reason}
                                        </p>
                                    </div>
                                </div>

                                <button onClick=${reset} class="w-full py-4 bg-brand-primary text-black rounded-2xl text-xs font-bold hover:brightness-110 active:scale-95 transition-all shadow-lg">
                                    DETECT NEW
                                </button>
                            </div>

                            <div class="relative group h-full">
                                <div class="absolute -inset-2 bg-brand-primary/10 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-all"></div>
                                <div class="relative glass rounded-2xl overflow-hidden aspect-square flex items-center justify-center bg-black/60 border border-white/10">
                                    ${config.endpoint === 'image' && file && html`<img src=${URL.createObjectURL(file)} class="w-full h-full object-cover" />`}
                                    ${config.endpoint === 'video' && file && html`<video src=${URL.createObjectURL(file)} class="w-full h-full object-cover" autoPlay muted loop />`}
                                    ${config.endpoint === 'audio' && html`<${Icon} name="music" class="w-16 h-16 text-brand-primary animate-pulse" />`}
                                    <div class="scan-line"></div>
                                </div>
                            </div>
                        </div>
                    </${motion.div}>
                `}
            </${motion.div}>
        </div>
    `;
};

// --- About Page (Revamped) ---
const AboutPage = () => {
    const techStack = [
        { id: 1, name: 'TensorFlow', icon: 'zap', tooltip: 'Deep Learning Engine' },
        { id: 2, name: 'Keras', icon: 'layers', tooltip: 'Neural Network API' },
        { id: 3, name: 'Python', icon: 'code', tooltip: 'Backend Logic' },
        { id: 4, name: 'OpenCV', icon: 'eye', tooltip: 'Computer Vision' },
        { id: 5, name: 'Librosa', icon: 'activity', tooltip: 'Audio Processing' },
        { id: 6, name: 'React', icon: 'component', tooltip: 'UI Framework' },
        { id: 7, name: 'Tailwind', icon: 'palette', tooltip: 'Modern Styling' },
        { id: 8, name: 'FastAPI', icon: 'server', tooltip: 'High-Perf API' }
    ];

    const models = [
        {
            title: "Image Deepfake Detection",
            icon: "image",
            description: "Scans high-resolution static captures for pixel-level GAN and diffusion artifacts.",
            algo: "CNN (EfficientNet-B0 Hybrid)",
            dataset: "Deepfake-TIMIT / FaceForensics++",
            arch: "Maso-Inception Pipeline"
        },
        {
            title: "Video Detection Core",
            icon: "video",
            description: "Temporal analysis engine detecting inconsistencies between video frames and facial morphs.",
            algo: "CNN + RNN (LSTM)",
            dataset: "Celeb-DF / DFDC Dataset",
            arch: "Temporal Feature Extraction"
        },
        {
            title: "Audio Forensic Scanner",
            icon: "mic",
            description: "Spectrogram analysis used to detect voice clones and AI-synthesized robotic phonemes.",
            algo: "Dense NN + MFCC Analysis",
            dataset: "ASVspoof Challenge Data",
            arch: "Frequency Spectral Mapping"
        }
    ];

    return html`
        <div class="min-h-screen pt-32 pb-20 px-6 max-w-6xl mx-auto">
            <${SectionReveal}>
                <h2 class="font-tech text-4xl lg:text-6xl font-black mb-6 tracking-tight">OUR <span class="text-brand-primary text-gradient">AI REPOSITORY</span></h2>
                <p class="text-gray-400 max-w-2xl mb-20 text-lg">Exploring the underlying neural architectures and forensic technologies driving our multimodal detection engine.</p>
            </${SectionReveal}>

            <!-- Model Grid -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
                ${models.map((model, idx) => html`
                    <${motion.div}
                        initial=${{ opacity: 0, scale: 0.9 }}
                        whileInView=${{ opacity: 1, scale: 1 }}
                        transition=${{ delay: idx * 0.1 }}
                        viewport=${{ once: true }}
                        class="tech-card glow-border p-10 rounded-[32px] group"
                    >
                        <div class="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mb-8 border border-brand-primary/20 float-icon">
                            <${Icon} name=${model.icon} class="w-8 h-8 text-brand-primary" />
                        </div>
                        <h3 class="text-2xl font-tech font-bold mb-4 group-hover:text-brand-primary transition-colors">${model.title}</h3>
                        <p class="text-gray-400 text-sm leading-relaxed mb-10">${model.description}</p>

                        <div class="space-y-4 pt-8 border-t border-white/5">
                            <div>
                                <span class="text-[10px] text-gray-600 uppercase block mb-1">Algorithm</span>
                                <span class="text-xs text-white font-mono">${model.algo}</span>
                            </div>
                            <div>
                                <span class="text-[10px] text-gray-600 uppercase block mb-1">Architecture</span>
                                <span class="text-xs text-brand-primary font-mono">${model.arch}</span>
                            </div>
                        </div>
                    </${motion.div}>
                `)}
            </div>

            <!-- Technology Stack -->
            <${SectionReveal} delay=${0.2}>
                <div class="glass p-12 lg:p-20 rounded-[48px] relative overflow-hidden">
                    <div class="absolute inset-0 bg-brand-primary/5 opacity-20 pointer-events-none"></div>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h3 class="text-4xl font-tech font-black mb-6">THE TECH <br/> <span class="text-brand-primary">DASHBOARD</span></h3>
                            <p class="text-gray-400 leading-relaxed mb-10">We utilize the absolute pinnacle of machine learning frameworks and signal processing libraries to ensure 99.8% detection reliability across all media types.</p>

                            <div class="grid grid-cols-4 md:grid-cols-4 gap-6">
                                ${techStack.map(tech => html`<${TechIcon} key=${tech.id} name=${tech.icon} label=${tech.name} />`)}
                            </div>
                        </div>

                        <div class="relative group">
                            <div class="absolute -inset-10 bg-brand-primary/10 blur-[80px] rounded-full animate-pulse"></div>
                            <div class="relative bg-black/40 rounded-3xl border border-white/10 p-10 flex flex-col items-center justify-center aspect-square">
                                <div class="w-32 h-32 bg-brand-primary/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_50px_rgba(0,242,96,0.2)]">
                                    <${Icon} name="cpu" class="w-16 h-16 text-brand-primary animate-pulse" />
                                </div>
                                <span class="text-xs font-tech font-bold text-gray-500 uppercase tracking-[0.5em] mb-2">Neural Engine</span>
                                <span class="text-sm font-tech font-black text-brand-primary mb-8 tracking-widest">ACTIVE_STATE</span>
                                <div class="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                    <${motion.div}
                                        initial=${{ width: 0 }}
                                        whileInView=${{ width: '100%' }}
                                        transition=${{ duration: 2, repeat: Infinity }}
                                        class="h-full bg-brand-primary shadow-[0_0_10px_rgba(0,242,96,0.6)]"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </${SectionReveal}>
        </div>
    `;
};

// --- Background Layer Component ---
const BackgroundLayer = ({ currentPath }) => {
    const [bgSource, setBgSource] = useState({ video: '', image: '' });

    useEffect(() => {
        const backgrounds = {
            'home': { video: '/assets/cloudy.mp4', image: '/assets/hero_bg.png' },
            'model-selection': { video: '/assets/cloudy.mp4', image: '/assets/hero_bg.png' },
            'image-detection': { video: '/assets/cloudy.mp4', image: '/assets/image_bg.png' },
            'video-detection': { video: '/assets/cloudy.mp4', image: '/assets/video_bg.png' },
            'audio-detection': { video: '/assets/cloudy.mp4', image: '/assets/audio_bg.png' },
            'about': { video: '/assets/cloudy.mp4', image: '/assets/hero_bg.png' }
        };
        setBgSource(backgrounds[currentPath] || backgrounds['home']);
    }, [currentPath]);

    return html`
        <div class="fixed inset-0 overflow-hidden -z-20">
            <${AnimatePresence} mode="wait">
                <${motion.div}
                    key=${bgSource.image}
                    initial=${{ opacity: 0 }}
                    animate=${{ opacity: 1 }}
                    exit=${{ opacity: 0 }}
                    transition=${{ duration: 1 }}
                    class="absolute inset-0"
                >
                    <div class="bg-video-container">
                        <video key=${bgSource.video} class="bg-video" autoPlay muted loop playsInline poster=${bgSource.image}>
                            <source src=${bgSource.video} type="video/mp4" />
                        </video>
                    </div>
                    <div class="fixed inset-0 bg-cover bg-center -z-30 opacity-50" style=${{ backgroundImage: `url(${bgSource.image})` }}></div>
                    <div class="bg-overlay"></div>
                </${motion.div}>
            </${AnimatePresence}>
            <div class="neural-grid"></div>
        </div>
    `;
};

// --- Main App Component ---
const App = () => {
    const [path, setPath] = useState('home');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [path]);

    useEffect(() => {
        if (window.tsParticles) {
            window.tsParticles.load("tsparticles", {
                fpsLimit: 60,
                particles: {
                    number: { value: 60, density: { enable: true, area: 800 } },
                    color: { value: "#00F260" },
                    shape: { type: "circle" },
                    opacity: { value: 0.1, random: true },
                    size: { value: { min: 1, max: 3 } },
                    links: { enable: true, distance: 150, color: "#00F260", opacity: 0.1, width: 1 },
                    move: { enable: true, speed: 1 }
                }
            });
        }
    }, []);

    return html`
        <div class="relative min-h-screen">
            <${BackgroundLayer} currentPath=${path} />
            <${Navbar} currentPath=${path} setPath=${setPath} />
            <main>
                <${AnimatePresence} mode="wait">
                    ${path === 'home' && html`<${motion.div} key="home" initial=${{ opacity: 0 }} animate=${{ opacity: 1 }} exit=${{ opacity: 0 }}><${Hero} onStart=${setPath} /></${motion.div}>`}
                    ${path === 'model-selection' && html`<${motion.div} key="model-selection" initial=${{ opacity: 0 }} animate=${{ opacity: 1 }} exit=${{ opacity: 0 }}><${ModelSelection} onSelect=${setPath} /></${motion.div}>`}
                    ${path === 'image-detection' && html`<${motion.div} key="image" initial=${{ opacity: 0 }} animate=${{ opacity: 1 }} exit=${{ opacity: 0 }}><${DetectionView} type="image-detection" setPath=${setPath} /></${motion.div}>`}
                    ${path === 'video-detection' && html`<${motion.div} key="video" initial=${{ opacity: 0 }} animate=${{ opacity: 1 }} exit=${{ opacity: 0 }}><${DetectionView} type="video-detection" setPath=${setPath} /></${motion.div}>`}
                    ${path === 'audio-detection' && html`<${motion.div} key="audio" initial=${{ opacity: 0 }} animate=${{ opacity: 1 }} exit=${{ opacity: 0 }}><${DetectionView} type="audio-detection" setPath=${setPath} /></${motion.div}>`}
                    ${path === 'about' && html`<${motion.div} key="about" initial=${{ opacity: 0 }} animate=${{ opacity: 1 }} exit=${{ opacity: 0 }}><${AboutPage} /></${motion.div}>`}
                </${AnimatePresence}>
            </main>
            <footer class="py-12 border-t border-white/5 text-center text-gray-600 text-xs">
                <p class="mb-2">© 2026 DEEPSIGHT AI FORENSICS. ALL RIGHTS RESERVED.</p>
                <div class="flex justify-center gap-6 items-center">
                    <a href="#" class="hover:text-brand-primary">PRIVACY TERMS</a>
                    <div class="w-1 h-1 bg-gray-800 rounded-full"></div>
                    <a href="#" class="hover:text-brand-primary">API DOCS</a>
                    <div class="w-1 h-1 bg-gray-800 rounded-full"></div>
                    <a href="#" class="hover:text-brand-primary">ENTERPRISE</a>
                </div>
            </footer>
        </div>
    `;
};

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(React.createElement(App));
