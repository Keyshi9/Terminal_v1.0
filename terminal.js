const Terminal = {
    output: document.getElementById('output'),
    input: document.getElementById('command-input'),
    prompt: document.getElementById('prompt'),

    history: [],
    historyIndex: -1,

    currentMode: 'dev', // Default mode

    modes: ['dev', 'crypto', 'network', 'tools', 'fs', 'fun'],

    commands: {
        global: {
            help: 'List commands for current mode',
            clear: 'Clear terminal output',
            about: 'System information',
            date: 'Show current date',
            time: 'Show current time',
            mode: 'Switch mode (dev | crypto | network | tools | fs | fun)',
            fullscreen: 'Toggle fullscreen mode',
            font: 'Change font (classic | retro | modern)',
            color: 'Change text color (green | red | blue | pink | white)',
            theme: 'Change theme (matrix | cyberpunk | hacker | retro | ocean | dracula)',
            neofetch: 'Display system information',
            exit: 'Exit terminal (reload page)'
        },
        dev: {
            calc: 'Calculate math expression (e.g., calc 2+2)',
            convert: 'Convert currency (e.g., convert 100 USD EUR)',
            json: 'Format JSON string',
            uuid: 'Generate UUID',
            hash: 'Simulate SHA-256 hash',
            encode: 'Base64 encode',
            decode: 'Base64 decode',
            regex: 'Test regex (e.g., regex pattern string)',
            encrypt: 'Encrypt text (Caesar cipher)',
            decrypt: 'Decrypt text (Caesar cipher)'
        },
        crypto: {
            price: 'Show real-time price (e.g., price BTC)',
            roi: 'Calculate ROI (e.g., roi 100 150)',
            simulate: 'Simulate delta-neutral strategy',
            funding: 'Show simulated funding rate',
            spread: 'Show simulated bid/ask spread',
            portfolio: 'Show live portfolio value',
            alert: 'Set price alert (e.g., alert BTC 100000)'
        },
        network: {
            ping: 'HTTP ping (e.g., ping google.com)',
            trace: 'Simulate traceroute',
            whois: 'WHOIS lookup',
            scan: 'Show public IP info',
            check: 'Check port status',
            curl: 'Fetch URL content (e.g., curl https://api.github.com)'
        },
        tools: {
            password: 'Generate password',
            note: 'Manage notes (add | list | clear)',
            task: 'Manage tasks (add | list | clear)',
            timer: 'Set timer (e.g., timer 5)',
            random: 'Generate random number (e.g., random 1 100)',
            export: 'Export data (notes | tasks)',
            stats: 'Show usage statistics'
        },
        fs: {
            ls: 'List directory contents',
            cd: 'Change directory',
            pwd: 'Print working directory',
            mkdir: 'Create directory',
            touch: 'Create file',
            cat: 'Display file content',
            echo: 'Write to file (e.g., echo "text" > file.txt)',
            rm: 'Remove file/directory',
            tree: 'Show directory tree'
        },
        fun: {
            snake: 'Play Snake game',
            matrix: 'Matrix effect',
            cowsay: 'Cowsay (e.g., cowsay Hello)',
            fortune: 'Random quote',
            banner: 'ASCII art banner (e.g., banner CODE)',
            weather: 'Get weather (e.g., weather Paris)',
            joke: 'Random programming joke'
        }
    },

    init() {
        // Initialize modules
        FileSystem.init();
        Themes.load();

        // Load saved mode
        const savedMode = localStorage.getItem('pro-terminal-mode');
        if (savedMode && this.modes.includes(savedMode)) {
            this.currentMode = savedMode;
        } else {
            this.currentMode = 'dev';
        }

        // Load saved font
        const savedFont = localStorage.getItem('pro-terminal-font');
        if (savedFont) {
            document.documentElement.style.setProperty('--font-family', `var(--font-${savedFont})`);
        }

        // Load saved color
        const savedColor = localStorage.getItem('pro-terminal-color');
        if (savedColor) {
            this.changeColor(savedColor);
        }

        this.input.addEventListener('keydown', (e) => this.handleInput(e));
        document.addEventListener('click', () => this.input.focus());

        this.runStartupSequence();
    },

    async runStartupSequence() {
        this.input.disabled = true;
        this.print("BIOS CHECK ...................................... [OK]", 'system-msg');
        await Utils.delay(300);
        this.print("LOADING KERNEL .................................. [OK]", 'system-msg');
        await Utils.delay(300);
        this.print("MOUNTING VOLUMES ................................ [OK]", 'system-msg');
        await Utils.delay(200);
        this.print("NETWORK INTERFACE ............................... [ONLINE]", 'system-msg');
        await Utils.delay(400);

        const loadingLine = document.createElement('div');
        loadingLine.className = 'line system-msg';
        this.output.appendChild(loadingLine);

        for (let i = 0; i <= 100; i += 4) {
            const bars = '|'.repeat(Math.floor(i / 2));
            const spaces = ' '.repeat(50 - Math.floor(i / 2));
            loadingLine.textContent = `SYSTEM LOADING [${bars}${spaces}] ${i}%`;
            this.scrollToBottom();
            await Utils.delay(20);
        }

        this.printWelcomeMessage();
        this.input.disabled = false;
        this.input.focus();
    },

    async printWelcomeMessage() {
        this.print("Dev Terminal System v1.0", 'success-msg');
        this.print("Made by SS.");
        this.print("Type 'help' to see commands.");
        this.print("Type 'mode dev | crypto | network | tools' to switch.");
        this.print("System ready.", 'success-msg');
        this.print("----------------------------------------", 'system-msg');
        this.switchMode(this.currentMode, true); // Update prompt
    },

    switchMode(mode, silent = false) {
        if (this.modes.includes(mode)) {
            this.currentMode = mode;
            localStorage.setItem('pro-terminal-mode', mode);
            this.prompt.innerHTML = `user@pro-sys [${mode}]:~$`;
            if (!silent) this.print(`Switched to ${mode} mode.`, 'system-msg');
        } else {
            this.print(`Invalid mode: ${mode}. Available: ${this.modes.join(', ')}`, 'error-msg');
        }
    },

    handleInput(e) {
        if (e.key === 'Enter') {
            const command = this.input.value.trim();
            if (command) {
                this.history.push(command);
                this.historyIndex = this.history.length;
                this.print(`${this.prompt.innerText} ${command}`);
                this.execute(command);
                this.input.value = '';
            }
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.historyIndex > 0) {
                this.historyIndex--;
                this.input.value = this.history[this.historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.historyIndex < this.history.length - 1) {
                this.historyIndex++;
                this.input.value = this.history[this.historyIndex];
            } else {
                this.historyIndex = this.history.length;
                this.input.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            this.autoComplete();
        }
    },

    autoComplete() {
        const currentInput = this.input.value;
        const availableCommands = [
            ...Object.keys(this.commands.global),
            ...Object.keys(this.commands[this.currentMode])
        ];

        const matches = availableCommands.filter(cmd => cmd.startsWith(currentInput));
        if (matches.length === 1) {
            this.input.value = matches[0] + ' ';
        } else if (matches.length > 1) {
            this.print(matches.join('  '), 'system-msg');
        }
    },

    async execute(input) {
        const args = input.split(' ');
        const cmd = args[0].toLowerCase();
        const params = args.slice(1);

        // Global commands
        if (this.commands.global[cmd]) {
            await this.executeGlobal(cmd, params);
            return;
        }

        // Mode specific commands
        if (this.commands[this.currentMode][cmd]) {
            await this.executeModeCommand(cmd, params);
            return;
        }

        this.print(`Command not found: ${cmd}`, 'error-msg');
    },

    async executeGlobal(cmd, params) {
        switch (cmd) {
            case 'help':
                this.print(`--- Global Commands ---`, 'system-msg');
                for (const [key, desc] of Object.entries(this.commands.global)) {
                    this.print(`${key.padEnd(15)} ${desc}`);
                }
                this.print(`--- ${this.currentMode.toUpperCase()} Commands ---`, 'system-msg');
                for (const [key, desc] of Object.entries(this.commands[this.currentMode])) {
                    this.print(`${key.padEnd(15)} ${desc}`);
                }
                break;
            case 'clear':
                this.output.innerHTML = '';
                break;
            case 'about':
                this.print("Pro Terminal System v1.0");
                this.print("Built for professional use cases.");
                break;
            case 'date':
                this.print(Utils.getDate());
                break;
            case 'time':
                this.print(Utils.getTime());
                break;
            case 'mode':
                if (params.length > 0) {
                    this.switchMode(params[0]);
                } else {
                    this.print(`Current mode: ${this.currentMode}`);
                    this.print(`Available modes: ${this.modes.join(', ')}`);
                }
                break;
            case 'fullscreen':
                if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(e => {
                        this.print(`Error enabling fullscreen: ${e.message}`, 'error-msg');
                    });
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen();
                    }
                }
                break;
            case 'font':
                const fontName = params[0];
                const validFonts = ['classic', 'retro', 'modern'];
                if (validFonts.includes(fontName)) {
                    document.documentElement.style.setProperty('--font-family', `var(--font-${fontName})`);
                    localStorage.setItem('pro-terminal-font', fontName);
                    this.print(`Font switched to ${fontName}.`);
                } else {
                    this.print(`Usage: font <classic | retro | modern>`, 'error-msg');
                }
                break;
            case 'color':
                const colorName = params[0];
                const validColors = ['green', 'red', 'blue', 'pink', 'white'];
                if (validColors.includes(colorName)) {
                    this.changeColor(colorName);
                    this.print(`Color switched to ${colorName}.`);
                } else {
                    this.print(`Usage: color <green | red | blue | pink | white>`, 'error-msg');
                }
                break;
            case 'theme':
                const themeName = params[0];
                if (themeName) {
                    if (Themes.apply(themeName)) {
                        this.print(`Theme switched to ${themeName}.`);
                    } else {
                        this.print(`Invalid theme. Available: ${Themes.list().join(', ')}`, 'error-msg');
                    }
                } else {
                    this.print(`Current theme: ${Themes.current}`);
                    this.print(`Available: ${Themes.list().join(', ')}`);
                }
                break;
            case 'neofetch':
                this.print(Utils.neofetch());
                break;
            case 'exit':
                this.print("Goodbye!", 'success-msg');
                await Utils.delay(500);
                location.reload();
                break;
        }
    },

    changeColor(color) {
        const colors = {
            'green': '#33ff33',
            'red': '#ff3333',
            'blue': '#33ccff',
            'pink': '#ff33cc',
            'white': '#ffffff'
        };
        if (colors[color]) {
            document.documentElement.style.setProperty('--text-color', colors[color]);
            localStorage.setItem('pro-terminal-color', color);
        }
    },

    async executeModeCommand(cmd, params) {
        switch (this.currentMode) {
            case 'dev':
                await this.executeDev(cmd, params);
                break;
            case 'crypto':
                await this.executeCrypto(cmd, params);
                break;
            case 'network':
                await this.executeNetwork(cmd, params);
                break;
            case 'tools':
                this.executeTools(cmd, params);
                break;
            case 'fs':
                this.executeFS(cmd, params);
                break;
            case 'fun':
                await this.executeFun(cmd, params);
                break;
        }
    },

    async executeDev(cmd, params) {
        switch (cmd) {
            case 'calc':
                this.print(Utils.calculate(params.join('')));
                break;
            case 'convert':
                // convert <amount> <from> <to>
                if (params.length < 3) {
                    this.print("Usage: convert <amount> <from> <to> (e.g., convert 100 USD EUR)", 'error-msg');
                    return;
                }
                const amount = parseFloat(params[0]);
                const from = params[1];
                const to = params[2];
                this.print(`Converting ${amount} ${from} to ${to}...`, 'system-msg');
                const rate = await Utils.fetchExchangeRate(from, to);
                if (rate) {
                    const result = (amount * rate).toFixed(2);
                    this.print(`${amount} ${from.toUpperCase()} = ${result} ${to.toUpperCase()} (Rate: ${rate})`);
                } else {
                    this.print("Error: Could not fetch exchange rate.", 'error-msg');
                }
                break;
            case 'json':
                // Expecting 'json format <string>' but simplified to 'json <string>' for ease
                if (params[0] === 'format') {
                    this.print(Utils.formatJSON(params.slice(1).join(' ')));
                } else {
                    this.print(Utils.formatJSON(params.join(' ')));
                }
                break;
            case 'uuid':
                this.print(Utils.generateUUID());
                break;
            case 'hash':
                this.print(Utils.sha256Simulate(params.join(' ')));
                break;
            case 'encode':
                this.print(Utils.base64Encode(params.join(' ')));
                break;
            case 'decode':
                this.print(Utils.base64Decode(params.join(' ')));
                break;
            case 'regex':
                // regex <pattern> <string>
                if (params.length < 2) {
                    this.print("Usage: regex <pattern> <string>", 'error-msg');
                    return;
                }
                try {
                    const pattern = new RegExp(params[0]);
                    const str = params.slice(1).join(' ');
                    this.print(`Match: ${pattern.test(str)}`);
                } catch (e) {
                    this.print("Invalid Regex", 'error-msg');
                }
                break;
            case 'encrypt':
                this.print(Utils.encrypt(params.join(' ')));
                break;
            case 'decrypt':
                this.print(Utils.decrypt(params.join(' ')));
                break;
        }
    },

    async executeCrypto(cmd, params) {
        switch (cmd) {
            case 'price':
                const coin = (params[0] || 'BTC').toUpperCase();
                this.print(`Fetching price for ${coin}...`, 'system-msg');
                const price = await Utils.fetchCryptoPrice(coin);
                if (price) {
                    this.print(`${coin}: $${price.toLocaleString()}`);
                } else {
                    this.print(`Error: Could not fetch price for ${coin}`, 'error-msg');
                }
                break;
            case 'roi':
                const initial = parseFloat(params[0]);
                const final = parseFloat(params[1]);
                if (isNaN(initial) || isNaN(final)) {
                    this.print("Usage: roi <initial> <final>", 'error-msg');
                    return;
                }
                const roi = ((final - initial) / initial) * 100;
                this.print(`ROI: ${roi.toFixed(2)}%`);
                break;
            case 'simulate':
                this.print("Fetching live data for Delta-Neutral Strategy...", 'system-msg');
                const btcPrice = await Utils.fetchCryptoPrice('BTC');
                if (btcPrice) {
                    this.print(`Current BTC Price: $${btcPrice.toLocaleString()}`);
                    this.print("Strategy: Long BTC / Short BTC-Perp");
                    this.print("Hedge Ratio: 1.0");
                    // Simulated rates based on real price context
                    const fundingRate = (Math.random() * 0.02).toFixed(4);
                    const apy = (fundingRate * 3 * 365).toFixed(2);
                    this.print(`Current Funding Rate (8h): ${fundingRate}%`);
                    this.print(`Estimated APY: ${apy}%`);
                } else {
                    this.print("Error: Could not fetch market data.", 'error-msg');
                }
                break;
            case 'funding':
                // Real funding rates require specific exchange APIs often with keys or complex parsing
                // We will simulate based on a realistic range or fetch if possible.
                // For now, let's keep it simulated but realistic looking
                this.print("Fetching funding rates...", 'system-msg');
                await Utils.delay(500);
                this.print("BTC-PERP: 0.0100% (8h)");
                this.print("ETH-PERP: 0.0125% (8h)");
                this.print("SOL-PERP: 0.0085% (8h)");
                break;
            case 'spread':
                const spreadCoin = (params[0] || 'BTC').toUpperCase();
                const spreadPrice = await Utils.fetchCryptoPrice(spreadCoin);
                if (spreadPrice) {
                    const spread = (spreadPrice * 0.0001).toFixed(2); // Simulated 0.01% spread
                    const bid = (spreadPrice - spread / 2).toFixed(2);
                    const ask = (spreadPrice + spread / 2).toFixed(2);
                    this.print(`[${spreadCoin}] Bid: ${bid} | Ask: ${ask} | Spread: ${spread}`);
                } else {
                    this.print("Error fetching price.", 'error-msg');
                }
                break;
            case 'portfolio':
                this.print("Fetching real-time portfolio value...", 'system-msg');
                const pBtc = await Utils.fetchCryptoPrice('BTC') || 0;
                const pEth = await Utils.fetchCryptoPrice('ETH') || 0;
                const pSol = await Utils.fetchCryptoPrice('SOL') || 0;

                const holdings = { BTC: 0.5, ETH: 4.2, SOL: 150, USDT: 5000 };
                const valBtc = holdings.BTC * pBtc;
                const valEth = holdings.ETH * pEth;
                const valSol = holdings.SOL * pSol;
                const total = valBtc + valEth + valSol + holdings.USDT;

                this.print("--- Live Portfolio ---");
                this.print(`BTC:  ${holdings.BTC} ($${valBtc.toLocaleString(undefined, { maximumFractionDigits: 2 })})`);
                this.print(`ETH:  ${holdings.ETH} ($${valEth.toLocaleString(undefined, { maximumFractionDigits: 2 })})`);
                this.print(`SOL:  ${holdings.SOL} ($${valSol.toLocaleString(undefined, { maximumFractionDigits: 2 })})`);
                this.print(`USDT: ${holdings.USDT.toLocaleString()}`);
                this.print("----------------------");
                this.print(`Total Value: $${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}`, 'success-msg');
                break;
        }
    },

    async executeNetwork(cmd, params) {
        switch (cmd) {
            case 'ping':
                let host = params[0] || 'google.com';
                if (!host.startsWith('http')) host = 'https://' + host;
                this.print(`Pinging ${host} (HTTP Latency)...`, 'system-msg');

                for (let i = 0; i < 4; i++) {
                    const time = await Utils.httpPing(host);
                    if (time >= 0) {
                        this.print(`Reply from ${host}: time=${time}ms`);
                    } else {
                        this.print(`Request timed out.`);
                    }
                    await Utils.delay(1000);
                }
                this.print("Ping complete.");
                break;
            case 'trace':
                this.print("Error: 'traceroute' requires raw socket access, not available in browser.", 'error-msg');
                this.print("Simulating for demonstration:", 'system-msg');
                await Utils.delay(500);
                this.print("1  192.168.1.1  2ms");
                this.print("2  10.0.0.1     15ms");
                this.print("3  172.217.0.1  24ms");
                break;
            case 'whois':
                const domain = params[0];
                if (!domain) {
                    this.print("Usage: whois <domain>", 'error-msg');
                    return;
                }
                this.print(`Querying RDAP for ${domain}...`, 'system-msg');
                try {
                    const response = await fetch(`https://rdap.org/domain/${domain}`);
                    if (response.ok) {
                        const data = await response.json();
                        this.print(`Domain Name: ${data.ldhName || domain}`);
                        this.print(`Status: ${data.status ? data.status.join(', ') : 'Active'}`);
                        this.print(`Port 43: ${data.port43 || 'N/A'}`);
                    } else {
                        throw new Error("Not found");
                    }
                } catch (e) {
                    this.print("Could not fetch WHOIS data (CORS or Rate Limit).", 'error-msg');
                }
                break;
            case 'scan':
                this.print("Error: Network scanning requires local network access.", 'error-msg');
                this.print("Fetching public IP info instead...", 'system-msg');
                const ipInfo = await Utils.getIpInfo();
                if (ipInfo) {
                    this.print(`Public IP: ${ipInfo.ip}`);
                    this.print(`City: ${ipInfo.city}`);
                    this.print(`Region: ${ipInfo.region}`);
                    this.print(`Country: ${ipInfo.country_name}`);
                    this.print(`ISP: ${ipInfo.org}`);
                } else {
                    this.print("Could not fetch IP info.", 'error-msg');
                }
                break;
            case 'check':
                // Real port checking is impossible from browser
                this.print("Error: Port checking requires backend proxy.", 'error-msg');
                break;
            case 'curl':
                const url = params[0];
                if (!url) {
                    this.print("Usage: curl <url>", 'error-msg');
                    return;
                }
                this.print(`Fetching ${url}...`, 'system-msg');
                try {
                    const response = await fetch(url);
                    const text = await response.text();
                    const preview = text.substring(0, 500);
                    this.print(preview + (text.length > 500 ? '...' : ''));
                    this.print(`\nStatus: ${response.status} | Size: ${text.length} bytes`, 'system-msg');
                } catch (e) {
                    this.print(`Error: ${e.message}`, 'error-msg');
                }
                break;
        }
    },

    executeTools(cmd, params) {
        switch (cmd) {
            case 'password':
                const length = parseInt(params[0]) || 12;
                this.print(`Generated Password: ${Utils.generatePassword(length)}`);
                break;
            case 'note':
                const noteAction = params[0];
                const noteContent = params.slice(1).join(' ');
                let notes = JSON.parse(localStorage.getItem('pro-terminal-notes') || '[]');

                if (noteAction === 'add' && noteContent) {
                    notes.push(noteContent);
                    localStorage.setItem('pro-terminal-notes', JSON.stringify(notes));
                    this.print("Note added.");
                } else if (noteAction === 'list') {
                    this.print("--- Notes ---");
                    notes.forEach((n, i) => this.print(`${i + 1}. ${n}`));
                } else if (noteAction === 'clear') {
                    localStorage.setItem('pro-terminal-notes', '[]');
                    this.print("Notes cleared.");
                } else {
                    this.print("Usage: note add <content> | note list | note clear", 'error-msg');
                }
                break;
            case 'task':
                const taskAction = params[0];
                const taskContent = params.slice(1).join(' ');
                let tasks = JSON.parse(localStorage.getItem('pro-terminal-tasks') || '[]');

                if (taskAction === 'add' && taskContent) {
                    tasks.push({ text: taskContent, done: false });
                    localStorage.setItem('pro-terminal-tasks', JSON.stringify(tasks));
                    this.print("Task added.");
                } else if (taskAction === 'list') {
                    this.print("--- Tasks ---");
                    tasks.forEach((t, i) => this.print(`${i + 1}. [${t.done ? 'x' : ' '}] ${t.text}`));
                } else if (taskAction === 'clear') {
                    localStorage.setItem('pro-terminal-tasks', '[]');
                    this.print("Tasks cleared.");
                } else {
                    this.print("Usage: task add <content> | task list | task clear", 'error-msg');
                }
                break;
            case 'timer':
                const seconds = parseInt(params[0]);
                if (isNaN(seconds)) {
                    this.print("Usage: timer <seconds>", 'error-msg');
                    return;
                }
                this.print(`Timer set for ${seconds} seconds...`, 'system-msg');
                setTimeout(() => {
                    this.print(`TIMER DONE: ${seconds} seconds elapsed.`, 'success-msg');
                }, seconds * 1000);
                break;
            case 'random':
                const min = parseInt(params[0]) || 0;
                const max = parseInt(params[1]) || 100;
                this.print(`Random (${min}-${max}): ${Utils.randomInt(min, max)}`);
                break;
            case 'export':
                const dataType = params[0];
                if (dataType === 'notes') {
                    const notes = localStorage.getItem('pro-terminal-notes') || '[]';
                    const blob = new Blob([notes], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'notes.json';
                    a.click();
                    this.print("Notes exported.");
                } else if (dataType === 'tasks') {
                    const tasks = localStorage.getItem('pro-terminal-tasks') || '[]';
                    const blob = new Blob([tasks], { type: 'application/json' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'tasks.json';
                    a.click();
                    this.print("Tasks exported.");
                } else {
                    this.print("Usage: export <notes | tasks>", 'error-msg');
                }
                break;
            case 'stats':
                const commandCount = this.history.length;
                const mostUsed = {};
                this.history.forEach(cmd => {
                    const base = cmd.split(' ')[0];
                    mostUsed[base] = (mostUsed[base] || 0) + 1;
                });
                const sorted = Object.entries(mostUsed).sort((a, b) => b[1] - a[1]).slice(0, 5);

                this.print("--- Usage Statistics ---");
                this.print(`Total commands: ${commandCount}`);
                this.print(`Current mode: ${this.currentMode}`);
                this.print("\nTop 5 commands:");
                sorted.forEach(([cmd, count]) => this.print(`  ${cmd}: ${count}`));
                break;
        }
    },

    executeFS(cmd, params) {
        switch (cmd) {
            case 'ls':
                const path = params[0] || '.';
                const result = FileSystem.ls(path);
                if (result.error) {
                    this.print(result.error, 'error-msg');
                } else {
                    result.forEach(item => {
                        const icon = item.isDir ? '📁' : '📄';
                        this.print(`${icon} ${item.name}`);
                    });
                }
                break;
            case 'cd':
                const cdResult = FileSystem.cd(params[0] || '/home/user');
                if (cdResult.error) {
                    this.print(cdResult.error, 'error-msg');
                } else {
                    this.prompt.innerHTML = `user@pro-sys [fs]:${FileSystem.currentPath}$`;
                }
                break;
            case 'pwd':
                this.print(FileSystem.pwd());
                break;
            case 'mkdir':
                if (!params[0]) {
                    this.print("Usage: mkdir <name>", 'error-msg');
                    return;
                }
                const mkdirResult = FileSystem.mkdir(params[0]);
                if (mkdirResult.error) {
                    this.print(mkdirResult.error, 'error-msg');
                } else {
                    this.print(`Directory created: ${params[0]}`);
                }
                break;
            case 'touch':
                if (!params[0]) {
                    this.print("Usage: touch <filename>", 'error-msg');
                    return;
                }
                const touchResult = FileSystem.touch(params[0]);
                if (touchResult.error) {
                    this.print(touchResult.error, 'error-msg');
                } else {
                    this.print(`File created: ${params[0]}`);
                }
                break;
            case 'cat':
                if (!params[0]) {
                    this.print("Usage: cat <filename>", 'error-msg');
                    return;
                }
                const catResult = FileSystem.cat(params[0]);
                if (catResult.error) {
                    this.print(catResult.error, 'error-msg');
                } else {
                    this.print(catResult.content);
                }
                break;
            case 'echo':
                // echo "text" > file.txt
                const text = params.join(' ');
                const match = text.match(/^"([^"]+)"\s*>\s*(.+)$/);
                if (match) {
                    const echoResult = FileSystem.echo(match[1], match[2]);
                    if (echoResult.error) {
                        this.print(echoResult.error, 'error-msg');
                    } else {
                        this.print(`Written to ${match[2]}`);
                    }
                } else {
                    this.print(text);
                }
                break;
            case 'rm':
                if (!params[0]) {
                    this.print("Usage: rm <name>", 'error-msg');
                    return;
                }
                const rmResult = FileSystem.rm(params[0]);
                if (rmResult.error) {
                    this.print(rmResult.error, 'error-msg');
                } else {
                    this.print(`Removed: ${params[0]}`);
                }
                break;
            case 'tree':
                this.print("Directory tree:");
                this.print(FileSystem.currentPath);
                const treeResult = FileSystem.ls('.');
                if (!treeResult.error) {
                    treeResult.forEach(item => {
                        const icon = item.isDir ? '├── 📁' : '├── 📄';
                        this.print(`${icon} ${item.name}`);
                    });
                }
                break;
        }
    },

    async executeFun(cmd, params) {
        switch (cmd) {
            case 'snake':
                this.print("Starting Snake game...", 'system-msg');
                this.print("Use W/A/S/D to move, Q to quit", 'system-msg');
                await Utils.delay(1000);
                Games.snake.init(this);
                break;
            case 'matrix':
                this.print("Entering the Matrix...", 'success-msg');
                await Utils.delay(500);
                Utils.matrixEffect(this, 3000);
                break;
            case 'cowsay':
                const cowText = params.join(' ') || 'Hello from the terminal!';
                this.print(Utils.cowsay(cowText));
                break;
            case 'fortune':
                this.print(Utils.fortune());
                break;
            case 'banner':
                const bannerText = params.join(' ') || 'CODE';
                this.print(Utils.banner(bannerText));
                break;
            case 'weather':
                const city = params[0] || 'Paris';
                this.print(`Fetching weather for ${city}...`, 'system-msg');
                const weather = await Utils.getWeather(city);
                if (weather) {
                    this.print(`Temperature: ${weather.temp}°C`);
                    this.print(`Condition: ${weather.desc}`);
                    this.print(`Humidity: ${weather.humidity}%`);
                    this.print(`Wind: ${weather.wind} km/h`);
                } else {
                    this.print("Could not fetch weather data.", 'error-msg');
                }
                break;
            case 'joke':
                const jokes = [
                    "Why do programmers prefer dark mode? Because light attracts bugs!",
                    "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
                    "Why do Java developers wear glasses? Because they don't C#.",
                    "A SQL query walks into a bar, walks up to two tables and asks... 'Can I join you?'",
                    "There are 10 types of people in the world: those who understand binary, and those who don't."
                ];
                this.print(jokes[Math.floor(Math.random() * jokes.length)]);
                break;
        }
    },

    print(text, className = '') {
        const line = document.createElement('div');
        line.className = 'line ' + className;
        line.textContent = text;
        this.output.appendChild(line);
        this.scrollToBottom();
    },

    scrollToBottom() {
        const terminal = document.getElementById('terminal');
        // Use setTimeout to ensure DOM has updated
        setTimeout(() => {
            terminal.scrollTop = terminal.scrollHeight;
        }, 0);
    }
};

// Start the terminal
window.onload = () => {
    Terminal.init();
};
