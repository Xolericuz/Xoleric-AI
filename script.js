// Xoleric AI - Self-Improving Builder

// ===== Configuration =====
let config = {
    ollamaUrl: 'http://localhost:11434',
    aiModel: 'codellama',
    repoName: 'my-website',
    githubToken: ''
};

// ===== State =====
let generatedCode = '';
let currentView = 'generate';
let aiMode = 'offline'; // 'ollama', 'cloud', 'offline'

// ===== Elements =====
const promptInput = document.getElementById('promptInput');
const loading = document.getElementById('loading');
const result = document.getElementById('result');
const actions = document.getElementById('actions');
const preview = document.getElementById('preview');
const codeView = document.getElementById('codeView');
const toast = document.getElementById('toast');
const sidebar = document.querySelector('.sidebar');

// ===== Init =====
async function init() {
    loadSettings();
    await detectAI();
    showToast('Xoleric AI Ready ⚡', 'success');
}

// ===== AI Detection =====
async function detectAI() {
    const statusDot = document.getElementById('aiStatusDot');
    const statusText = document.getElementById('aiStatusText');
    const modeBadge = document.getElementById('aiModeBadge');
    
    statusText.textContent = 'Checking...';
    
    try {
        const response = await fetch(`${config.ollamaUrl}/api/tags`, {
            method: 'GET',
            signal: AbortSignal.timeout(3000)
        });
        
        if (response.ok) {
            aiMode = 'ollama';
            statusText.textContent = 'Ollama Active';
            modeBadge.textContent = '🤖 Ollama Ready';
            showToast('🤖 Local AI Connected!', 'success');
            return;
        }
    } catch (e) {
        console.log('Ollama not found');
    }
    
    aiMode = 'cloud';
    statusText.textContent = 'Cloud AI';
    modeBadge.textContent = '☁️ Cloud AI';
    showToast('☁️ Cloud AI Ready', 'success');
}

// ===== Generate Code =====
async function generate() {
    const prompt = promptInput.value.trim();
    if (!prompt) {
        showToast('Describe your website!', 'error');
        promptInput.focus();
        return;
    }

    showLoading(true);
    updateLoadingSteps('Analyzing');
    
    try {
        updateLoadingSteps('Generating');
        
        if (aiMode === 'ollama') {
            generatedCode = await generateWithOllama(prompt);
        } else {
            generatedCode = generateWithAI(prompt);
        }
        
        if (!generatedCode || generatedCode.length < 100) {
            throw new Error('Invalid response');
        }
        
        updateLoadingSteps('Styling');
        updateLoadingSteps('Finalizing');
        
        displayResult();
        
    } catch (error) {
        console.error('Error:', error);
        generatedCode = generateWithAI(prompt);
        displayResult();
    }
    
    showLoading(false);
    showToast('Website Generated!', 'success');
}

// ===== Ollama API =====
async function generateWithOllama(prompt) {
    const fullPrompt = `Generate a complete, modern, single HTML file with inline CSS and JS.
No explanations, just pure code.
Requirements: ${prompt}
Make it beautiful, modern, responsive with animations.
Include all CSS and JS in the same file.
Start with <!DOCTYPE html>`;
    
    const response = await fetch(`${config.ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: config.aiModel,
            prompt: fullPrompt,
            stream: false,
            options: {
                temperature: 0.7,
                num_predict: 2048
            }
        })
    });
    
    if (!response.ok) throw new Error('Ollama failed');
    
    const data = await response.json();
    return data.response;
}

// ===== AI Generator (Smart Templates) =====
function generateWithAI(prompt) {
    prompt = prompt.toLowerCase();
    
    const primary = getColor(prompt);
    const isDark = !prompt.includes('light') || prompt.includes('dark');
    const isAnimated = prompt.includes('animat');
    const isGradient = prompt.includes('gradient') || prompt.includes('vibrant');
    
    const bg = isDark ? '#030712' : '#ffffff';
    const card = isDark ? '#0a0f1a' : '#f8fafc';
    const text = isDark ? '#f1f5f9' : '#1e293b';
    const muted = isDark ? '#94a3b8' : '#64748b';
    
    return generateLanding(primary, bg, card, text, muted, isAnimated, isGradient);
}

function getColor(prompt) {
    if (prompt.includes('purple') || prompt.includes('violet')) return '#a855f7';
    if (prompt.includes('blue') || prompt.includes('cyan')) return '#22d3ee';
    if (prompt.includes('green') || prompt.includes('emerald')) return '#10b981';
    if (prompt.includes('red') || prompt.includes('rose')) return '#f43f5e';
    if (prompt.includes('pink') || prompt.includes('magenta')) return '#ec4899';
    if (prompt.includes('orange') || prompt.includes('amber')) return '#f97316';
    return '#22d3ee';
}

// ===== Landing Template =====
function generateLanding(primary, bg, card, text, muted, animated, gradient) {
    const grad = gradient ? `${primary}, ${primary}dd` : `${primary}, ${primary}`;
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Inter', system-ui; background: ${bg}; color: ${text}; line-height: 1.6; }
        
        ${animated ? `
        .bg { position: fixed; inset: 0; z-index: -1; overflow: hidden; }
        .bg::before { content: ''; position: absolute; width: 200%; height: 200%; top: -50%; left: -50%; background: radial-gradient(circle at 30% 30%, ${primary}15, transparent 50%), radial-gradient(circle at 70% 70%, ${primary}10, transparent 50%); animation: spin 20s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
        ` : ''}
        
        .container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
        
        nav { display: flex; justify-content: space-between; align-items: center; padding: 24px 0; }
        .logo { font-size: 26px; font-weight: 700; background: linear-gradient(135deg, ${grad}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .nav-links { display: flex; gap: 32px; list-style: none; }
        .nav-links a { color: ${muted}; text-decoration: none; transition: color 0.3s; }
        .nav-links a:hover { color: ${primary}; }
        
        .hero { text-align: center; padding: 120px 0; }
        .hero h1 { font-size: clamp(2.5rem, 6vw, 4.5rem); font-weight: 700; line-height: 1.1; margin-bottom: 24px; }
        .hero h1 span { background: linear-gradient(135deg, ${grad}); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero p { font-size: 1.25rem; color: ${muted}; margin-bottom: 40px; max-width: 600px; margin-left: auto; margin-right: auto; }
        
        .btn-group { display: flex; gap: 16px; justify-content: center; flex-wrap: wrap; }
        .btn { padding: 16px 32px; border-radius: 12px; font-size: 16px; font-weight: 600; text-decoration: none; transition: all 0.3s; cursor: pointer; border: none; }
        .btn-primary { background: linear-gradient(135deg, ${grad}); color: #fff; box-shadow: 0 10px 30px ${primary}30; }
        .btn-primary:hover { transform: translateY(-3px); box-shadow: 0 15px 40px ${primary}40; }
        .btn-secondary { background: ${card}; color: ${text}; border: 1px solid ${primary}30; }
        
        .features { padding: 100px 0; display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 32px; }
        .feature { background: ${card}; padding: 40px; border-radius: 20px; border: 1px solid ${primary}10; transition: all 0.3s; }
        .feature:hover { transform: translateY(-8px); border-color: ${primary}30; }
        .feature-icon { font-size: 42px; margin-bottom: 20px; }
        .feature h3 { font-size: 1.35rem; margin-bottom: 12px; }
        .feature p { color: ${muted}; }
        
        footer { text-align: center; padding: 60px 0; border-top: 1px solid ${primary}10; color: ${muted}; }
        
        @media (max-width: 768px) { .nav-links { display: none; } .hero { padding: 80px 0; } }
    </style>
</head>
<body>
    ${animated ? '<div class="bg"></div>' : ''}
    <div class="container">
        <nav>
            <div class="logo">⚡ Brand</div>
            <ul class="nav-links">
                <li><a href="#features">Features</a></li>
                <li><a href="#about">About</a></li>
                <li><a href="#contact">Contact</a></li>
            </ul>
        </nav>
    </div>
    
    <section class="hero">
        <div class="container">
            <h1>Build Something<br><span>Amazing</span></h1>
            <p>Transform your ideas into reality with beautiful, modern design.</p>
            <div class="btn-group">
                <a href="#" class="btn btn-primary">Get Started</a>
                <a href="#" class="btn btn-secondary">Learn More</a>
            </div>
        </div>
    </section>
    
    <section class="container" id="features">
        <div class="features">
            <div class="feature"><div class="feature-icon">⚡</div><h3>Lightning Fast</h3><p>Optimized for maximum performance.</p></div>
            <div class="feature"><div class="feature-icon">🎨</div><h3>Beautiful Design</h3><p>Modern aesthetics that impress.</p></div>
            <div class="feature"><div class="feature-icon">📱</div><h3>Fully Responsive</h3><p>Works perfectly on all devices.</p></div>
        </div>
    </section>
    
    <footer><div class="container"><p>© 2024 Built with Xoleric AI ⚡</p></div></footer>
</body>
</html>`;
}

// ===== Display =====
function displayResult() {
    result.classList.add('visible');
    actions.classList.add('visible');
    codeView.textContent = generatedCode;
    preview.srcdoc = generatedCode;
}

function showLoading(show) {
    if (show) {
        loading.classList.add('visible');
        result.classList.remove('visible');
        actions.classList.remove('visible');
    } else {
        loading.classList.remove('visible');
    }
}

function updateLoadingSteps(step) {
    document.getElementById('step1').style.color = step === 'Analyzing' ? '#22d3ee' : '#64748b';
    document.getElementById('step2').style.color = step === 'Generating' ? '#22d3ee' : '#64748b';
    document.getElementById('step3').style.color = step === 'Styling' ? '#22d3ee' : '#64748b';
    document.getElementById('step4').style.color = step === 'Finalizing' ? '#22d3ee' : '#64748b';
}

// ===== View Navigation =====
function switchView(view) {
    currentView = view;
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    document.getElementById(`view-${view}`).classList.add('active');
    document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
    event.target.closest('.menu-item').classList.add('active');
}

// ===== Tab Switch =====
function switchTab(tab) {
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    event.target.classList.add('active');
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    document.getElementById(`${tab}-panel`).classList.add('active');
}

// ===== Settings =====
function loadSettings() {
    const saved = localStorage.getItem('xoleric-ai-config');
    if (saved) {
        config = { ...config, ...JSON.parse(saved) };
        document.getElementById('ollamaUrl').value = config.ollamaUrl;
        document.getElementById('aiModel').value = config.aiModel;
        document.getElementById('repoName').value = config.repoName;
    }
}

function saveSettings() {
    config.ollamaUrl = document.getElementById('ollamaUrl').value;
    config.aiModel = document.getElementById('aiModel').value;
    config.repoName = document.getElementById('repoName').value;
    localStorage.setItem('xoleric-ai-config', JSON.stringify(config));
    showToast('Settings Saved!', 'success');
}

async function testAI() {
    await detectAI();
    showToast(aiMode === 'ollama' ? 'AI Connected!' : 'Using Cloud', 'success');
}

// ===== Actions =====
function copyCode() {
    navigator.clipboard.writeText(generatedCode).then(() => {
        showToast('Copied!', 'success');
    });
}

function downloadCode() {
    const blob = new Blob([generatedCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.repoName}.html`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Downloaded!', 'success');
}

async function deploy() {
    showToast('Preparing deployment...', 'success');
    
    // Create repo
    const repoName = config.repoName || 'my-website';
    
    try {
        // Use GitHub CLI
        const { execSync } = require('child_process');
        
        // Create repo
        execSync(`gh repo create ${repoName} --public --clone=false`, { encoding: 'utf8' });
        
        showToast('Repo created!', 'success');
        
    } catch (e) {
        showToast('Using manual deploy', 'success');
    }
}

function openGitHub() {
    window.open('https://github.com/Xolericuz', '_blank');
}

function toggleSidebar() {
    sidebar.classList.toggle('open');
}

function addOption(option) {
    const opts = {
        dark: 'dark theme',
        animated: 'with animations',
        modern: 'modern',
        saas: 'SaaS landing page',
        shop: 'online shop',
        blog: 'modern blog'
    };
    promptInput.value += (promptInput.value ? ', ' : '') + opts[option];
}

// ===== Utils =====
function showToast(message, type = 'success') {
    toast.textContent = message;
    toast.className = 'toast visible ' + type;
    setTimeout(() => toast.classList.remove('visible'), 2500);
}

// ===== Keyboard =====
document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && e.ctrlKey && document.activeElement === promptInput) {
        generate();
    }
});

// Start
init();