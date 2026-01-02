// Puzzle Game Logic
class PuzzleGame {
    constructor() {
        this.boardSize = 4;
        this.tiles = [];
        this.emptyPos = { row: 3, col: 3 };
        this.moves = 0;
        this.timer = 0;
        this.timerInterval = null;
        this.isComplete = false;
        
        this.images = [
            'lucia-caminos-3840x2160-22320.jpg',
            'jason-gta-6-aim-3840x2160-22314.jpg',
            'lucia-gta-6-grand-3840x2160-13625.jpg',
            'lucia-caminos-night-3840x2160-22316.jpg',
            'gta-6-lucia-caminos-boxing-4k-wallpaper-uhdpaper.com-9@5@f.jpg'
        ];
        
        this.currentImage = this.images[0];
        
        this.init();
    }
    
    init() {
        this.setupBoard();
        this.setupControls();
        this.shuffle();
        this.startTimer();
    }
    
    setupBoard() {
        const board = document.getElementById('puzzleBoard');
        const preview = document.getElementById('previewImage');
        
        if (!board || !preview) return;
        
        board.innerHTML = '';
        preview.src = this.currentImage;
        
        // Create tiles
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const tile = document.createElement('div');
                tile.className = 'puzzle-piece';
                tile.dataset.row = row;
                tile.dataset.col = col;
                tile.dataset.correctRow = row;
                tile.dataset.correctCol = col;
                
                if (row === this.boardSize - 1 && col === this.boardSize - 1) {
                    tile.classList.add('empty');
                } else {
                    tile.style.backgroundImage = `url('${this.currentImage}')`;
                    // Calculate exact background position for 4x4 grid
                    const bgPosX = (col * 100) / (this.boardSize - 1);
                    const bgPosY = (row * 100) / (this.boardSize - 1);
                    tile.style.backgroundPosition = `${bgPosX}% ${bgPosY}%`;
                }
                
                tile.addEventListener('click', () => this.moveTile(tile));
                board.appendChild(tile);
                this.tiles.push(tile);
            }
        }
    }
    
    setupControls() {
        const newPuzzleBtn = document.getElementById('newPuzzle');
        const showHintBtn = document.getElementById('showHint');
        const playAgainBtn = document.getElementById('playAgain');
        
        if (newPuzzleBtn) {
            newPuzzleBtn.addEventListener('click', () => this.newPuzzle());
        }
        
        if (showHintBtn) {
            showHintBtn.addEventListener('click', () => this.showHint());
        }
        
        if (playAgainBtn) {
            playAgainBtn.addEventListener('click', () => this.closeModal());
        }
    }
    
    moveTile(tile) {
        if (this.isComplete) return;
        
        const row = parseInt(tile.dataset.row);
        const col = parseInt(tile.dataset.col);
        
        // Check if tile is adjacent to empty space
        const rowDiff = Math.abs(row - this.emptyPos.row);
        const colDiff = Math.abs(col - this.emptyPos.col);
        
        if ((rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1)) {
            // Swap tile with empty space
            const emptyTile = this.tiles.find(t => 
                parseInt(t.dataset.row) === this.emptyPos.row && 
                parseInt(t.dataset.col) === this.emptyPos.col
            );
            
            // Swap positions
            const tempRow = tile.dataset.row;
            const tempCol = tile.dataset.col;
            
            tile.dataset.row = emptyTile.dataset.row;
            tile.dataset.col = emptyTile.dataset.col;
            emptyTile.dataset.row = tempRow;
            emptyTile.dataset.col = tempCol;
            
            this.emptyPos = { row: parseInt(tempRow), col: parseInt(tempCol) };
            
            this.moves++;
            this.updateMoves();
            
            // Reorder DOM elements
            this.reorderTiles();
            
            // Check if puzzle is complete
            this.checkComplete();
        }
    }
    
    reorderTiles() {
        const board = document.getElementById('puzzleBoard');
        const sortedTiles = this.tiles.sort((a, b) => {
            const aPos = parseInt(a.dataset.row) * this.boardSize + parseInt(a.dataset.col);
            const bPos = parseInt(b.dataset.row) * this.boardSize + parseInt(b.dataset.col);
            return aPos - bPos;
        });
        
        sortedTiles.forEach(tile => board.appendChild(tile));
    }
    
    shuffle() {
        // Perform random valid moves to shuffle
        const shuffleMoves = 100;
        
        for (let i = 0; i < shuffleMoves; i++) {
            const validMoves = this.getValidMoves();
            const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
            
            const tile = this.tiles.find(t => 
                parseInt(t.dataset.row) === randomMove.row && 
                parseInt(t.dataset.col) === randomMove.col
            );
            
            if (tile) {
                const emptyTile = this.tiles.find(t => 
                    parseInt(t.dataset.row) === this.emptyPos.row && 
                    parseInt(t.dataset.col) === this.emptyPos.col
                );
                
                const tempRow = tile.dataset.row;
                const tempCol = tile.dataset.col;
                
                tile.dataset.row = emptyTile.dataset.row;
                tile.dataset.col = emptyTile.dataset.col;
                emptyTile.dataset.row = tempRow;
                emptyTile.dataset.col = tempCol;
                
                this.emptyPos = { row: parseInt(tempRow), col: parseInt(tempCol) };
            }
        }
        
        this.reorderTiles();
        this.moves = 0;
        this.updateMoves();
    }
    
    getValidMoves() {
        const moves = [];
        const directions = [
            { row: -1, col: 0 },
            { row: 1, col: 0 },
            { row: 0, col: -1 },
            { row: 0, col: 1 }
        ];
        
        directions.forEach(dir => {
            const newRow = this.emptyPos.row + dir.row;
            const newCol = this.emptyPos.col + dir.col;
            
            if (newRow >= 0 && newRow < this.boardSize && newCol >= 0 && newCol < this.boardSize) {
                moves.push({ row: newRow, col: newCol });
            }
        });
        
        return moves;
    }
    
    checkComplete() {
        let complete = true;
        
        this.tiles.forEach(tile => {
            if (tile.dataset.row !== tile.dataset.correctRow || 
                tile.dataset.col !== tile.dataset.correctCol) {
                complete = false;
            }
        });
        
        if (complete) {
            this.isComplete = true;
            this.stopTimer();
            this.showCompleteModal();
        }
    }
    
    showCompleteModal() {
        const modal = document.getElementById('completeModal');
        const finalTime = document.getElementById('finalTime');
        const finalMoves = document.getElementById('finalMoves');
        
        if (modal && finalTime && finalMoves) {
            finalTime.textContent = this.formatTime(this.timer);
            finalMoves.textContent = this.moves;
            modal.classList.add('active');
        }
    }
    
    closeModal() {
        const modal = document.getElementById('completeModal');
        if (modal) {
            modal.classList.remove('active');
        }
        this.newPuzzle();
    }
    
    newPuzzle() {
        // Select random image
        this.currentImage = this.images[Math.floor(Math.random() * this.images.length)];
        
        // Reset game state
        this.tiles = [];
        this.emptyPos = { row: 3, col: 3 };
        this.moves = 0;
        this.timer = 0;
        this.isComplete = false;
        
        // Restart
        this.stopTimer();
        this.setupBoard();
        this.shuffle();
        this.startTimer();
    }
    
    showHint() {
        // Highlight correct positions briefly
        this.tiles.forEach(tile => {
            if (tile.dataset.row === tile.dataset.correctRow && 
                tile.dataset.col === tile.dataset.correctCol) {
                tile.style.border = '3px solid var(--primary-color)';
                setTimeout(() => {
                    tile.style.border = '1px solid rgba(0, 255, 136, 0.2)';
                }, 1000);
            } else {
                tile.style.border = '3px solid var(--secondary-color)';
                setTimeout(() => {
                    tile.style.border = '1px solid rgba(0, 255, 136, 0.2)';
                }, 1000);
            }
        });
    }
    
    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timer++;
            this.updateTimer();
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    updateTimer() {
        const timerElement = document.getElementById('timer');
        if (timerElement) {
            timerElement.textContent = this.formatTime(this.timer);
        }
    }
    
    updateMoves() {
        const movesElement = document.getElementById('moves');
        if (movesElement) {
            movesElement.textContent = this.moves;
        }
    }
    
    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
}

// Initialize puzzle when page loads
if (document.getElementById('puzzleBoard')) {
    window.addEventListener('load', () => {
        new PuzzleGame();
    });
}
