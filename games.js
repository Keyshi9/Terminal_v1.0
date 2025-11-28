// Games Module
const Games = {
    snake: {
        running: false,
        grid: [],
        snake: [],
        food: {},
        direction: 'right',
        score: 0,

        init(terminal) {
            this.terminal = terminal;
            this.width = 20;
            this.height = 15;
            this.snake = [{ x: 10, y: 7 }];
            this.direction = 'right';
            this.score = 0;
            this.running = true;
            this.spawnFood();
            this.setupControls();
            this.gameLoop();
        },

        setupControls() {
            this.keyHandler = (e) => {
                if (!this.running) return;
                const key = e.key.toLowerCase();
                if (key === 'w' && this.direction !== 'down') this.direction = 'up';
                if (key === 's' && this.direction !== 'up') this.direction = 'down';
                if (key === 'a' && this.direction !== 'right') this.direction = 'left';
                if (key === 'd' && this.direction !== 'left') this.direction = 'right';
                if (key === 'q') this.stop();
            };
            document.addEventListener('keydown', this.keyHandler);
        },

        spawnFood() {
            do {
                this.food = {
                    x: Math.floor(Math.random() * this.width),
                    y: Math.floor(Math.random() * this.height)
                };
            } while (this.snake.some(s => s.x === this.food.x && s.y === this.food.y));
        },

        gameLoop() {
            if (!this.running) return;

            const head = { ...this.snake[0] };

            if (this.direction === 'up') head.y--;
            if (this.direction === 'down') head.y++;
            if (this.direction === 'left') head.x--;
            if (this.direction === 'right') head.x++;

            // Check collision with walls
            if (head.x < 0 || head.x >= this.width || head.y < 0 || head.y >= this.height) {
                this.stop();
                this.terminal.print(`Game Over! Score: ${this.score}`, 'error-msg');
                return;
            }

            // Check collision with self
            if (this.snake.some(s => s.x === head.x && s.y === head.y)) {
                this.stop();
                this.terminal.print(`Game Over! Score: ${this.score}`, 'error-msg');
                return;
            }

            this.snake.unshift(head);

            // Check food
            if (head.x === this.food.x && head.y === this.food.y) {
                this.score++;
                this.spawnFood();
            } else {
                this.snake.pop();
            }

            this.render();
            setTimeout(() => this.gameLoop(), 150);
        },

        render() {
            let display = `Score: ${this.score}\n`;
            display += '┌' + '─'.repeat(this.width * 2) + '┐\n';

            for (let y = 0; y < this.height; y++) {
                display += '│';
                for (let x = 0; x < this.width; x++) {
                    if (this.snake[0].x === x && this.snake[0].y === y) {
                        display += '●●';
                    } else if (this.snake.some(s => s.x === x && s.y === y)) {
                        display += '○○';
                    } else if (this.food.x === x && this.food.y === y) {
                        display += '◆◆';
                    } else {
                        display += '  ';
                    }
                }
                display += '│\n';
            }

            display += '└' + '─'.repeat(this.width * 2) + '┘';
            display += '\nControls: W/A/S/D to move, Q to quit';

            // Clear previous game state and print new one
            const lines = this.terminal.output.querySelectorAll('.game-frame');
            lines.forEach(l => l.remove());

            const gameFrame = document.createElement('div');
            gameFrame.className = 'line game-frame';
            gameFrame.style.whiteSpace = 'pre';
            gameFrame.textContent = display;
            this.terminal.output.appendChild(gameFrame);
            this.terminal.scrollToBottom();
        },

        stop() {
            this.running = false;
            if (this.keyHandler) {
                document.removeEventListener('keydown', this.keyHandler);
            }
        }
    }
};
