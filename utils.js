const Utils = {
    getDateTime: () => {
        return new Date().toLocaleString();
    },

    getDate: () => {
        return new Date().toLocaleDateString();
    },

    getTime: () => {
        return new Date().toLocaleTimeString();
    },

    generateUUID: () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    },

    sha256Simulate: (text) => {
        // This is a simulation, not a real crypto hash for security
        let hash = 0;
        if (text.length === 0) return 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
        for (let i = 0; i < text.length; i++) {
            const char = text.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32bit integer
        }
        // Make it look like a sha256 hex string
        return Math.abs(hash).toString(16).repeat(8).substring(0, 64);
    },

    base64Encode: (text) => {
        try {
            return btoa(text);
        } catch (e) {
            return "Error: Invalid input for Base64 encoding";
        }
    },

    base64Decode: (text) => {
        try {
            return atob(text);
        } catch (e) {
            return "Error: Invalid Base64 string";
        }
    },

    formatJSON: (text) => {
        try {
            const obj = JSON.parse(text);
            return JSON.stringify(obj, null, 2);
        } catch (e) {
            return "Error: Invalid JSON string";
        }
    },

    calculate: (expression) => {
        try {
            // Basic safety check
            if (/[^0-9+\-*/().\s]/.test(expression)) {
                return "Error: Invalid characters in expression";
            }
            return Function('"use strict";return (' + expression + ')')();
        } catch (e) {
            return "Error: Invalid expression";
        }
    },

    // --- REAL DATA APIS ---

    fetchCryptoPrice: async (symbol) => {
        try {
            // Using Binance API for real-time prices (reliable and fast for major pairs)
            // Symbol needs to be uppercase, e.g., BTC -> BTCUSDT
            const pair = symbol.toUpperCase() + 'USDT';
            const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${pair}`);
            if (!response.ok) throw new Error('Symbol not found');
            const data = await response.json();
            return parseFloat(data.price);
        } catch (e) {
            // Fallback to CoinGecko if Binance fails or for non-standard pairs (simplified mapping)
            try {
                const idMap = { 'BTC': 'bitcoin', 'ETH': 'ethereum', 'SOL': 'solana', 'XRP': 'ripple' };
                const id = idMap[symbol.toUpperCase()] || symbol.toLowerCase();
                const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${id}&vs_currencies=usd`);
                const data = await response.json();
                if (data[id] && data[id].usd) return data[id].usd;
                throw new Error('Price not found');
            } catch (err) {
                return null;
            }
        }
    },

    fetchExchangeRate: async (from, to) => {
        try {
            const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${from.toUpperCase()}`);
            const data = await response.json();
            return data.rates[to.toUpperCase()];
        } catch (e) {
            return null;
        }
    },

    getIpInfo: async () => {
        try {
            const response = await fetch('https://ipapi.co/json/');
            return await response.json();
        } catch (e) {
            return null;
        }
    },

    httpPing: async (url) => {
        const start = performance.now();
        try {
            // We use no-cors to allow pinging opaque resources, we just care about timing
            await fetch(url, { mode: 'no-cors', cache: 'no-cache' });
            return Math.round(performance.now() - start);
        } catch (e) {
            return -1; // Failed
        }
    },

    randomInt: (min, max) => {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    generatePassword: (length = 12) => {
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
        let retVal = "";
        for (let i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        return retVal;
    },

    delay: (ms) => new Promise(resolve => setTimeout(resolve, ms))
};
