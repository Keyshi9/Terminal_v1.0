# Dev Terminal System v1.0

A professional, feature-rich web-based terminal emulator built with Vanilla JavaScript. Experience a fully functional command-line interface directly in your browser with multiple modes, real-time data, games, and extensive customization options.

## 🚀 Features

### 🎨 **6 Stunning Themes**
- **Matrix** (Classic green on black)
- **Cyberpunk** (Pink & cyan neon)
- **Hacker** (Bright green terminal)
- **Retro** (Amber/orange vintage)
- **Ocean** (Blue aquatic theme)
- **Dracula** (Popular dark theme)

### 🔧 **6 Operational Modes**

#### **Dev Mode** - Developer Tools
- Math calculator with expression evaluation
- Real-time currency conversion (180+ currencies)
- JSON formatter and validator
- UUID generator
- SHA-256 hash simulator
- Base64 encoding/decoding
- Regex pattern tester
- Caesar cipher encryption/decryption

#### **Crypto Mode** - Cryptocurrency Tools
- **Live price data** from Binance & CoinGecko APIs
- ROI calculator
- Delta-neutral strategy simulator
- Funding rate tracker
- Bid/ask spread calculator
- Real-time portfolio valuation
- Price alerts (coming soon)

#### **Network Mode** - Network Diagnostics
- HTTP latency testing (ping)
- Traceroute simulation
- WHOIS domain lookup (RDAP)
- Public IP geolocation
- URL content fetcher (curl)

#### **Tools Mode** - Productivity Suite
- Secure password generator (customizable length)
- Notes manager (add/list/clear/export)
- Task manager with checkboxes
- Countdown timer
- Random number generator
- Usage statistics tracker
- JSON export functionality

#### **FS Mode** - Virtual File System
- Complete Unix-like filesystem in localStorage
- Commands: `ls`, `cd`, `pwd`, `mkdir`, `touch`, `cat`, `echo`, `rm`, `tree`
- Persistent across sessions
- File and directory management

#### **Fun Mode** - Games & Entertainment
- **Snake game** (WASD controls)
- Matrix rain effect
- Cowsay ASCII art
- Fortune cookie quotes
- ASCII art banner generator
- Real-time weather (wttr.in API)
- Programming jokes

### ⚙️ **Customization**
- **3 Font styles**: Classic (Courier), Retro (VT323), Modern (Fira Code)
- **5 Text colors**: Green, Red, Blue, Pink, White
- **Fullscreen mode** for immersive experience
- Persistent preferences via localStorage

### 🎯 **Terminal Features**
- Command history navigation (↑/↓ arrows)
- TAB auto-completion
- Smooth startup animation with progress bar
- Hidden scrollbar for clean aesthetics
- Responsive design
- Keyboard shortcuts support

## 🛠️ Tech Stack

- **Core**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Storage**: LocalStorage for persistence
- **APIs**: 
  - Binance & CoinGecko (Crypto prices)
  - ExchangeRate-API (Currency conversion)
  - ipapi.co (IP geolocation)
  - wttr.in (Weather data)
  - RDAP (WHOIS lookups)

## 📦 Installation

Simply open `index.html` in any modern web browser. No build process or dependencies required!

```bash
git clone https://github.com/Keyshi9/Terminal_v1.0.git
cd Terminal_v1.0
# Open index.html in your browser
```

## 🎮 Usage

### Getting Started
1. Wait for the startup sequence to complete
2. Type `help` to see available commands
3. Use `mode <name>` to switch between modes
4. Try `theme cyberpunk` for a visual change
5. Explore with `neofetch`, `fortune`, or `snake`!

### Example Commands
```bash
# Change appearance
theme cyberpunk
font retro
color pink
fullscreen

# Developer tools
calc 2+2*5
convert 100 USD EUR
json {"name":"test"}
uuid
encrypt "secret message"

# Crypto trading
mode crypto
price BTC
portfolio
simulate

# File system
mode fs
ls
mkdir projects
cd projects
touch README.md
echo "Hello World" > README.md
cat README.md

# Fun stuff
mode fun
snake
cowsay "I love coding!"
weather Paris
fortune
banner HACK
```

## 🌟 Highlights

- **100% Client-Side**: No server required, runs entirely in browser
- **Real-Time Data**: Live crypto prices and currency rates
- **Persistent State**: Your files, notes, and preferences are saved
- **Extensible**: Easy to add new commands and modes
- **Professional**: Clean code, modular architecture
- **Educational**: Great for learning terminal commands

## 📝 Command Reference

Type `help` in any mode to see mode-specific commands. Global commands work everywhere:
- `help` - Show commands
- `clear` - Clear screen
- `mode <name>` - Switch mode
- `theme <name>` - Change theme
- `neofetch` - System info
- `exit` - Reload terminal

## 🔮 Future Enhancements

- AI chat integration (OpenAI/Gemini)
- More mini-games (2048, Tetris)
- Code playground (JavaScript/Python execution)
- SSH-like remote connections
- Plugin system
- Mobile optimization

## 👨‍💻 Author

**Made by SS**

## 📄 License

MIT License - Feel free to use and modify!

---

**Try it live**: [https://keyshi9.github.io/Terminal_v1.0/](https://keyshi9.github.io/Terminal_v1.0/)

*Experience the power of a professional terminal in your browser!*

