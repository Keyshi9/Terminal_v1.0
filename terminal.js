const Terminal = {
    output: document.getElementById('output'),
    input: document.getElementById('command-input'),
    prompt: document.getElementById('prompt'),

    history: [],
    historyIndex: -1,

    currentMode: 'dev', // Default mode

    modes: ['dev', 'crypto', 'network', 'tools'],

    commands: {
        global: {
            help: 'List commands for current mode',
            clear: 'Clear terminal output',
            about: 'System information',
            date: 'Show current date',
            time: 'Show current time',
            mode: 'Switch mode (dev | crypto | network | tools)'
        },
        dev: {
            calc: 'Calculate math expression (e.g., calc 2+2)',
            convert: 'Convert 100 USD CHF',
            json: 'Format JSON string',
            uuid: 'Generate UUID',
            hash: 'Simulate SHA-256 hash',
            encode: 'Base64 encode',
            decode: 'Base64 decode',
            regex: 'Test regex (e.g., regex pattern string)'
        },
        crypto: {
            price: 'Show simulated price (e.g., price BTC)',
            roi: 'Calculate ROI (e.g., roi 100 150)',
            simulate: 'Simulate delta-neutral strategy',
            funding: 'Show simulated funding rate',
            spread: 'Show simulated bid/ask spread',
            portfolio: 'Show simulated portfolio'
        },
        network: {
            ping: 'Simulate ping (e.g., ping google.com)',
            trace: 'Simulate traceroute',
            whois: 'Simulate whois lookup',
            scan: 'Simulate network scan',
            check: 'Check port status (e.g., check 80)'
        },
        tools: {
            password: 'Generate password',
            note: 'Manage notes (add | list)',
            task: 'Manage tasks (add | list)',
            timer: 'Set timer (e.g., timer 5)',
            random: 'Generate random number (e.g., random 1 100)'
        }
    },

    init() {
        // Load saved mode
        const savedMode = localStorage.getItem('pro-terminal-mode');
        if (savedMode && this.modes.includes(savedMode)) {
            this.switchMode(savedMode, true);
        } else {
            this.switchMode('dev', true);
        }

        this.input.addEventListener('keydown', (e) => this.handleInput(e));
        document.addEventListener('click', () => this.input.focus());

        this.printWelcomeMessage();
    },

    async printWelcomeMessage() {
        this.print("Dev Terminal System v1.0", 'success-msg');
        this.print("Made by SS.");
        this.print("Type 'help' to see commands.");
        this.print("Type 'mode dev | crypto | network | tools' to switch.");
        this.print("Initializing modules...", 'system-msg');
        await Utils.delay(800);
        this.print("System ready.", 'success-msg');
        this.print("----------------------------------------", 'system-msg');
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
        }
    },

    async executeModeCommand(cmd, params) {
        switch (this.currentMode) {
            case 'dev':
                this.executeDev(cmd, params);
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
        }
    },

    executeTools(cmd, params) {
        switch (cmd) {
            case 'password':
                this.print(`Generated Password: ${Utils.generatePassword()}`);
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
                } else {
                    this.print("Usage: note add <content> | note list", 'error-msg');
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
                } else {
                    this.print("Usage: task add <content> | task list", 'error-msg');
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
                    // Optional: play sound or alert
                }, seconds * 1000);
                break;
            case 'random':
                const min = parseInt(params[0]) || 0;
                const max = parseInt(params[1]) || 100;
                this.print(`Random (${min}-${max}): ${Utils.randomInt(min, max)}`);
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
        // Keep the input line in view
        const terminal = document.getElementById('terminal');
        terminal.scrollTop = terminal.scrollHeight;
    }
};

// Start the terminal
window.onload = () => {
    Terminal.init();
};
