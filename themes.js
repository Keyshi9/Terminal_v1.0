// Themes System
const Themes = {
    current: 'matrix',

    themes: {
        matrix: {
            bg: '#0d0d0d',
            text: '#33ff33',
            secondary: '#cccccc',
            error: '#ff3333',
            prompt: '#00ccff'
        },
        cyberpunk: {
            bg: '#0a0a0a',
            text: '#ff00ff',
            secondary: '#00ffff',
            error: '#ff0066',
            prompt: '#00ffff'
        },
        hacker: {
            bg: '#000000',
            text: '#00ff00',
            secondary: '#00cc00',
            error: '#ff0000',
            prompt: '#00ff00'
        },
        retro: {
            bg: '#1a1a1a',
            text: '#ffb000',
            secondary: '#ff8800',
            error: '#ff0000',
            prompt: '#ffcc00'
        },
        ocean: {
            bg: '#001a33',
            text: '#00ccff',
            secondary: '#0099cc',
            error: '#ff6666',
            prompt: '#00ffff'
        },
        dracula: {
            bg: '#282a36',
            text: '#f8f8f2',
            secondary: '#6272a4',
            error: '#ff5555',
            prompt: '#50fa7b'
        }
    },

    apply(themeName) {
        if (!this.themes[themeName]) return false;

        const theme = this.themes[themeName];
        const root = document.documentElement;

        root.style.setProperty('--bg-color', theme.bg);
        root.style.setProperty('--text-color', theme.text);
        root.style.setProperty('--text-secondary', theme.secondary);
        root.style.setProperty('--error-color', theme.error);
        root.style.setProperty('--prompt-color', theme.prompt);

        this.current = themeName;
        localStorage.setItem('pro-terminal-theme', themeName);
        return true;
    },

    list() {
        return Object.keys(this.themes);
    },

    load() {
        const saved = localStorage.getItem('pro-terminal-theme');
        if (saved && this.themes[saved]) {
            this.apply(saved);
        }
    }
};
