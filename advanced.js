// AI Module with Gemini API
const AI = {
    apiKey: '', // User will need to set this
    conversationHistory: [],

    async chat(message) {
        if (!this.apiKey) {
            return {
                error: true,
                message: "AI not configured. Set API key with: ai config <your-gemini-api-key>"
            };
        }

        this.conversationHistory.push({ role: 'user', content: message });

        try {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: message }]
                    }]
                })
            });

            const data = await response.json();

            if (data.candidates && data.candidates[0]) {
                const reply = data.candidates[0].content.parts[0].text;
                this.conversationHistory.push({ role: 'assistant', content: reply });
                return { error: false, message: reply };
            } else {
                throw new Error('Invalid response from API');
            }
        } catch (e) {
            return { error: true, message: `Error: ${e.message}` };
        }
    },

    setApiKey(key) {
        this.apiKey = key;
        localStorage.setItem('gemini-api-key', key);
    },

    loadApiKey() {
        const saved = localStorage.getItem('gemini-api-key');
        if (saved) this.apiKey = saved;
    },

    clearHistory() {
        this.conversationHistory = [];
    }
};

// Blackjack Game
const Blackjack = {
    deck: [],
    playerHand: [],
    dealerHand: [],
    playerBalance: 1000,
    currentBet: 0,
    gameActive: false,

    init() {
        const saved = localStorage.getItem('blackjack-balance');
        if (saved) this.playerBalance = parseInt(saved);
    },

    createDeck() {
        const suits = ['♠', '♥', '♦', '♣'];
        const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        this.deck = [];

        for (let suit of suits) {
            for (let value of values) {
                this.deck.push({ suit, value });
            }
        }

        // Shuffle
        for (let i = this.deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.deck[i], this.deck[j]] = [this.deck[j], this.deck[i]];
        }
    },

    cardValue(card) {
        if (card.value === 'A') return 11;
        if (['J', 'Q', 'K'].includes(card.value)) return 10;
        return parseInt(card.value);
    },

    handValue(hand) {
        let value = 0;
        let aces = 0;

        for (let card of hand) {
            value += this.cardValue(card);
            if (card.value === 'A') aces++;
        }

        while (value > 21 && aces > 0) {
            value -= 10;
            aces--;
        }

        return value;
    },

    startGame(bet) {
        if (bet > this.playerBalance) {
            return { error: true, message: 'Insufficient balance!' };
        }

        this.currentBet = bet;
        this.playerBalance -= bet;
        this.createDeck();
        this.playerHand = [this.deck.pop(), this.deck.pop()];
        this.dealerHand = [this.deck.pop(), this.deck.pop()];
        this.gameActive = true;

        return { error: false };
    },

    hit() {
        if (!this.gameActive) return { error: true, message: 'No active game!' };

        this.playerHand.push(this.deck.pop());
        const value = this.handValue(this.playerHand);

        if (value > 21) {
            this.gameActive = false;
            this.saveBalance();
            return { bust: true, value };
        }

        return { bust: false, value };
    },

    stand() {
        if (!this.gameActive) return { error: true, message: 'No active game!' };

        this.gameActive = false;

        // Dealer plays
        while (this.handValue(this.dealerHand) < 17) {
            this.dealerHand.push(this.deck.pop());
        }

        const playerValue = this.handValue(this.playerHand);
        const dealerValue = this.handValue(this.dealerHand);

        let result;
        if (dealerValue > 21 || playerValue > dealerValue) {
            this.playerBalance += this.currentBet * 2;
            result = 'win';
        } else if (playerValue === dealerValue) {
            this.playerBalance += this.currentBet;
            result = 'push';
        } else {
            result = 'lose';
        }

        this.saveBalance();
        return { result, playerValue, dealerValue };
    },

    saveBalance() {
        localStorage.setItem('blackjack-balance', this.playerBalance.toString());
    },

    displayCard(card) {
        return `${card.value}${card.suit}`;
    }
};

// Crypto Dashboard
const CryptoDashboard = {
    top10: [],
    updateInterval: null,

    async fetchTop10() {
        try {
            console.log("Fetching crypto data...");
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

            const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false&price_change_percentage=24h', {
                signal: controller.signal
            });
            clearTimeout(timeoutId);

            if (!response.ok) throw new Error(`API Error: ${response.status}`);

            const data = await response.json();

            const newData = data.map(coin => ({
                rank: coin.market_cap_rank,
                symbol: coin.symbol.toUpperCase(),
                name: coin.name,
                price: coin.current_price,
                change24h: coin.price_change_percentage_24h,
                marketCap: coin.market_cap
            }));

            // Detect price changes
            newData.forEach((newCoin, i) => {
                if (this.top10[i]) {
                    const oldPrice = this.top10[i].price;
                    newCoin.priceDirection = newCoin.price > oldPrice ? '↑' : newCoin.price < oldPrice ? '↓' : '→';
                } else {
                    newCoin.priceDirection = '→';
                }
            });

            this.top10 = newData;
            return { error: false, data: this.top10 };
        } catch (e) {
            console.warn("Crypto API failed, using mock data:", e);
            // Fallback to mock data for demo purposes
            const mockData = [
                { rank: 1, symbol: 'BTC', name: 'Bitcoin', price: 95432.10, change24h: 2.5, marketCap: 1800000000000, priceDirection: '↑' },
                { rank: 2, symbol: 'ETH', name: 'Ethereum', price: 3456.78, change24h: -1.2, marketCap: 400000000000, priceDirection: '↓' },
                { rank: 3, symbol: 'SOL', name: 'Solana', price: 145.20, change24h: 5.4, marketCap: 65000000000, priceDirection: '↑' },
                { rank: 4, symbol: 'BNB', name: 'Binance Coin', price: 602.50, change24h: 0.5, marketCap: 90000000000, priceDirection: '→' },
                { rank: 5, symbol: 'XRP', name: 'Ripple', price: 0.62, change24h: -0.8, marketCap: 34000000000, priceDirection: '↓' }
            ];
            this.top10 = mockData;
            return { error: false, data: mockData, warning: "Using simulated data (API unavailable)" };
        }
    },

    startAutoUpdate(callback) {
        this.fetchTop10().then(callback);
        this.updateInterval = setInterval(() => {
            this.fetchTop10().then(callback);
        }, 10000); // Update every 10 seconds
    },

    stopAutoUpdate() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    },

    formatPrice(price) {
        return price >= 1 ? `$${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : `$${price.toFixed(6)}`;
    },

    formatMarketCap(cap) {
        if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
        if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
        if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
        return `$${cap.toLocaleString()}`;
    }
};

// Live Chat using ntfy.sh (Public Pub/Sub service)
const LiveChat = {
    username: 'Anonymous',
    topic: 'pro-terminal-chat-global', // Public topic
    eventSource: null,

    setUsername(name) {
        this.username = name || 'Anonymous';
        localStorage.setItem('chat-username', this.username);
    },

    loadUsername() {
        const saved = localStorage.getItem('chat-username');
        if (saved) this.username = saved;
    },

    async sendMessage(text) {
        const message = JSON.stringify({
            user: this.username,
            text: text,
            time: Date.now()
        });

        try {
            await fetch(`https://ntfy.sh/${this.topic}`, {
                method: 'POST',
                body: message
            });
            return { error: false };
        } catch (e) {
            return { error: true, message: e.message };
        }
    },

    startPolling(callback) {
        if (this.eventSource) return;

        // Use Server-Sent Events for real-time updates
        this.eventSource = new EventSource(`https://ntfy.sh/${this.topic}/sse`);

        this.eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // ntfy sends the message body in the 'message' field of the event data
                // But since we sent a JSON string as the body, we need to parse it again
                // Wait, ntfy sends the raw body.
                // Let's handle both raw text and JSON if possible.

                // When we POST to ntfy, the body is the message.
                // The SSE event.data is a JSON object describing the notification.
                // The 'message' field contains our payload.

                if (data.message) {
                    try {
                        const payload = JSON.parse(data.message);
                        // Validate payload structure
                        if (payload.user && payload.text && payload.time) {
                            callback([{
                                username: payload.user,
                                text: payload.text,
                                timestamp: payload.time
                            }]);
                        }
                    } catch (e) {
                        // Ignore non-JSON messages (maybe sent by others on the same topic)
                    }
                }
            } catch (e) {
                console.error("Chat SSE Error:", e);
            }
        };

        this.eventSource.onerror = (err) => {
            console.error("EventSource failed:", err);
            // It will auto-reconnect usually
        };
    },

    stopPolling() {
        if (this.eventSource) {
            this.eventSource.close();
            this.eventSource = null;
        }
    }
};
