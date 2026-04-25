# Xoleric AI Builder - SPEC

## Project: Xoleric-AI (Self-Improving AI Builder)

### Core Features
- [x] Ollama Auto-Detection
- [x] Local AI Code Generation
- [x] GitHub Deployment
- [x] Self-Improving System
- [x] Cross-Platform

### AI Flow
```
User Prompt → Ollama (local) → Generated Code → GitHub (auto-deploy)
```

### Technical Stack
- HTML5 + CSS3 (Modern UI)
- Vanilla JavaScript
- Ollama API (localhost:11434)
- GitHub API

### File Structure
```
Xoleric-AI/
├── index.html    (Main UI)
├── style.css    (Styles)
├── script.js    (AI + GitHub logic)
├── README.md   (Documentation)
```

### Ollama Integration
```javascript
// Auto-detect Ollama
async function detectOllama() {
    try {
        await fetch('http://localhost:11434/api/tags');
        return true;
    } catch {
        return false;
    }
}

// Generate with Ollama
await fetch('http://localhost:11434/api/generate', {
    model: 'codellama',
    prompt: userPrompt
});
```

### GitHub Integration
- Auto-create repo on deploy
- Push generated code
- Enable GitHub Pages

### Self-Improving
- AI learns from user feedback
- Saves to localStorage
- Syncs with GitHub