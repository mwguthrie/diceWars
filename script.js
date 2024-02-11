document.addEventListener('DOMContentLoaded', () => {
    const gameBoard = document.getElementById('gameBoard');
    const endTurnButton = document.getElementById('endTurn');

    let currentPlayer = 1;
    let territories = []; // Store owner, dice count, and neighbors for each hex
    const mapSize = { x: 8, y: 8 }; // Define map size

    // Calculate hex size based on the game board size
    const hexSize = Math.min(gameBoard.offsetWidth / (mapSize.x + 0.5), gameBoard.offsetHeight / (mapSize.y * Math.sqrt(3)/2 + 0.5));

    // Function to initialize the game board with hexagonal tiles
    function initGame() {
        gameBoard.style.display = 'flex';
        gameBoard.style.flexWrap = 'wrap';
        gameBoard.style.width = `${mapSize.x * hexSize}px`;

        for (let y = 0; y < mapSize.y; y++) {
            for (let x = 0; x < mapSize.x; x++) {
                const index = y * mapSize.x + x;
                const hex = createHex(x, y, index);
                gameBoard.appendChild(hex);
                territories.push({
                    owner: Math.ceil(Math.random() * 2),
                    dice: Math.floor(Math.random() * 6) + 1,
                    neighbors: calculateNeighbors(x, y)
                });
            }
        }
        updateBoard();
    }

    // Create a hexagonal tile
    function createHex(x, y, index) {
        const hex = document.createElement('div');
        hex.className = 'territory hex';
        hex.style.width = `${hexSize}px`;
        hex.style.height = `${hexSize * Math.sqrt(3)}px`;
        hex.style.marginLeft = `${y % 2 ? hexSize / 2 : 0}px`; // Offset every other row
        hex.addEventListener('click', () => handleTerritoryClick(index));
        return hex;
    }

    // Calculate neighbors for a given hex tile
    function calculateNeighbors(x, y) {
        const evenRow = y % 2 === 0;
        return [
            {dx: -1, dy: 0}, {dx: 1, dy: 0}, // Left and right
            {dx: evenRow ? -1 : 0, dy: -1}, {dx: evenRow ? 0 : 1, dy: -1}, // Upper left and right
            {dx: evenRow ? -1 : 0, dy: 1}, {dx: evenRow ? 0 : 1, dy: 1} // Lower left and right
        ].map(delta => ({
            x: x + delta.dx,
            y: y + delta.dy
        })).filter(pos => pos.x >= 0 && pos.x < mapSize.x && pos.y >= 0 && pos.y < mapSize.y)
         .map(pos => pos.y * mapSize.x + pos.x);
    }

    // Update the board based on the territories state
    function updateBoard() {
        territories.forEach((t, index) => {
            const hex = gameBoard.children[index];
            hex.textContent = t.dice;
            hex.className = `territory hex player${t.owner}`;
        });
    }

    // The remaining functions (handleTerritoryClick, attemptAttack, rollDice, distributeReinforcements, checkVictoryConditions)
    // remain largely unchanged but should account for hexagonal adjacency in attack logic.

    initGame(); // Initialize the game on load
});
