/**
 * Main p5.js file - handles setup, drawing, and user interaction
 */

// Global variables
let maze;
let cellSize = 20;
let cols, rows;
let isDarkTheme = true;

// Player variables for manual solving
let playerCell = null;
let manualSolving = false;
let playerPath = [];
let moveCount = 0;

// DFS variables (for you to use)
let dfsStack = [];
let currentDFSCell = null;
let dfsComplete = false;
let dfsRunning = false;

/**
 * p5.js setup function - runs once
 */
function setup() {
  // Calculate grid dimensions based on window size
  cols = Math.floor((windowWidth - 200) / cellSize);
  rows = Math.floor((windowHeight - 100) / cellSize);

  // Ensure minimum size
  cols = Math.max(cols, 10);
  rows = Math.max(rows, 10);

  createCanvas(windowWidth, windowHeight);
  // Create initial maze
  maze = new Maze(cols, rows, cellSize);

  // Initialize player at start position
  initializePlayer();

  // Update UI
  updateUI();

  console.log("🧩 Maze Solver Ready!");
  console.log("🎮 Use ARROW KEYS to manually solve the maze!");
  console.log("🔄 Press SPACE to toggle between manual/DFS mode");
  console.log("📋 Your task: Implement DFS algorithm in the startDFS() function");
  console.log("🎯 Use maze.getValidNeighbors(cell) to get moveable neighbors");
  console.log("✅ Set cell.visited = true when you visit a cell");
  console.log("🔗 Set cell.parent to track the path");
}

/**
 * p5.js draw function - runs every frame
 */
function draw() {
  background(isDarkTheme ? 30 : 240);
  // Draw maze
  maze.draw();

  // Draw player if in manual mode
  if (manualSolving && playerCell) {
    drawPlayer();
  }

  // Draw DFS visualization if running
  if (dfsRunning) {
    drawDFSVisualization();
  }

  // Update stats
  updateStats();
}

/**
 * Draw DFS visualization elements
 */
function drawDFSVisualization() {
  // This function is called during DFS execution
  // You can add custom visualization here if needed

  if (currentDFSCell) {
    // Highlight current cell being explored
    fill(100, 150, 255, 150);
    noStroke();
    rect(currentDFSCell.getPixelX(), currentDFSCell.getPixelY(), currentDFSCell.size, currentDFSCell.size);
  }
}

/**
 * Handle window resize
 */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

/**
 * Generate a new maze
 */
function generateNewMaze() {
  console.log("🔄 Generating new maze...");
  maze = new Maze(cols, rows, cellSize);
  resetDFS();
  initializePlayer(); // Reset player position
  updateUI();
}

/**
 * Reset maze for new DFS attempt
 */
function resetMaze() {
  console.log("↺ Resetting maze...");
  maze.resetForPathfinding();
  resetDFS();
  if (manualSolving) {
    initializePlayer(); // Reset player if in manual mode
  }
  updateUI();
}

/**
 * Reset DFS state
 */
function resetDFS() {
  dfsStack = [];
  currentDFSCell = null;
  dfsComplete = false;
  dfsRunning = false;

  document.getElementById("dfs-btn").textContent = "🎯 Start DFS";
  document.getElementById("status").textContent = "Ready to implement DFS!";
}

/**
 * Toggle between dark and light theme
 */
function toggleTheme() {
  isDarkTheme = !isDarkTheme;
  document.getElementById("theme-btn").textContent = isDarkTheme ? "🌙 Dark Theme" : "☀️ Light Theme";

  // Update body background
  document.body.style.backgroundColor = isDarkTheme ? "#1a1a1a" : "#f0f0f0";
  document.body.style.color = isDarkTheme ? "#ffffff" : "#000000";
}

/**
 * Update UI elements
 */
function updateUI() {
  const startPos = `(${maze.startCell.x}, ${maze.startCell.y})`;
  const endPos = `(${maze.endCell.x}, ${maze.endCell.y})`;

  // Update current position based on mode
  let currentPos;
  if (manualSolving && playerCell) {
    currentPos = `(${playerCell.x}, ${playerCell.y})`;
  } else if (currentDFSCell) {
    currentPos = `(${currentDFSCell.x}, ${currentDFSCell.y})`;
  } else {
    currentPos = startPos;
  }

  document.getElementById("current-cell").textContent = currentPos;
  document.getElementById("target-cell").textContent = endPos;
}

/**
 * Update statistics display
 */
function updateStats() {
  let statusText;

  if (manualSolving) {
    if (playerCell === maze.endCell) {
      statusText = `🎉 Maze solved manually! Moves: ${moveCount}, Path length: ${playerPath.length}`;
    } else {
      statusText = `🎮 Manual mode - Position: (${playerCell.x}, ${playerCell.y}), Moves: ${moveCount}`;
    }
  } else {
    const stats = maze.getStats();
    statusText = dfsRunning
      ? `DFS Running... Explored: ${stats.visitedCells}/${stats.totalCells} (${stats.explorationRate}%)`
      : dfsComplete
      ? `DFS Complete! Explored: ${stats.visitedCells}/${stats.totalCells} (${stats.explorationRate}%)`
      : "Ready to implement DFS!";
  }

  document.getElementById("status").textContent = statusText;
}

/**
 * Initialize player position and manual solving mode
 */
function initializePlayer() {
  playerCell = maze.startCell;
  manualSolving = true;
  playerPath = [playerCell];
  moveCount = 0;

  // Clear any previous visualization states
  maze.resetForPathfinding();

  console.log("🎮 Manual solving mode activated!");
  console.log("🏁 Navigate from START (green) to END (red) using arrow keys");
}

/**
 * Draw the player as a distinct visual element
 */
function drawPlayer() {
  if (!playerCell) return;

  const pixelX = playerCell.getPixelX();
  const pixelY = playerCell.getPixelY();
  const centerX = pixelX + playerCell.size / 2;
  const centerY = pixelY + playerCell.size / 2;

  // Draw player as a bright circle
  fill(255, 255, 0); // Bright yellow
  stroke(0, 0, 0); // Black outline
  strokeWeight(2);
  ellipse(centerX, centerY, playerCell.size * 0.6, playerCell.size * 0.6);

  // Add a smaller inner circle for more visibility
  fill(255, 200, 0);
  noStroke();
  ellipse(centerX, centerY, playerCell.size * 0.3, playerCell.size * 0.3);
}

/**
 * Move player in the specified direction
 */
function movePlayer(direction) {
  if (!manualSolving || !playerCell || dfsRunning) return;

  let targetX = playerCell.x;
  let targetY = playerCell.y;

  // Calculate target position based on direction
  switch (direction) {
    case "UP":
      targetY--;
      break;
    case "DOWN":
      targetY++;
      break;
    case "LEFT":
      targetX--;
      break;
    case "RIGHT":
      targetX++;
      break;
  }

  // Check if the move is valid
  const targetCell = maze.getCell(targetX, targetY);
  if (!targetCell) return; // Out of bounds

  // Check if there's a wall blocking the movement
  if (!canMoveBetweenCells(playerCell, targetCell)) {
    console.log("🚫 Can't move there - wall is blocking!");
    return;
  }

  // Make the move
  playerCell = targetCell;
  playerPath.push(playerCell);
  moveCount++;

  console.log(`🎮 Moved to (${playerCell.x}, ${playerCell.y}) - Move #${moveCount}`);

  // Check if player reached the end
  if (playerCell === maze.endCell) {
    console.log("🎉 CONGRATULATIONS! You solved the maze manually!");
    console.log(`📊 Total moves: ${moveCount}`);
    console.log(`📈 Path length: ${playerPath.length}`);

    // Highlight the player's path
    highlightPlayerPath();
    manualSolving = false;
  }

  updateUI();
}

/**
 * Check if player can move between two adjacent cells
 */
function canMoveBetweenCells(from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;

  // Only allow adjacent cells
  if (Math.abs(dx) + Math.abs(dy) !== 1) return false;

  // Check walls
  if (dx === 1) return !from.walls.right; // Moving right
  if (dx === -1) return !from.walls.left; // Moving left
  if (dy === 1) return !from.walls.bottom; // Moving down
  if (dy === -1) return !from.walls.top; // Moving up

  return false;
}

/**
 * Highlight the path the player took
 */
function highlightPlayerPath() {
  // Clear previous path highlighting
  maze.resetPathHighlight();

  // Highlight player's path
  for (let cell of playerPath) {
    cell.isPath = true;
  }
}

/**
 * Toggle between manual solving and DFS mode
 */
function toggleSolvingMode() {
  if (dfsRunning) {
    console.log("❌ Cannot switch modes while DFS is running!");
    return;
  }

  manualSolving = !manualSolving;

  if (manualSolving) {
    console.log("🎮 Switched to MANUAL solving mode");
    document.getElementById("mode-btn").textContent = "🎮 Manual Mode";
    initializePlayer();
  } else {
    console.log("🤖 Switched to DFS mode - ready for algorithm implementation");
    document.getElementById("mode-btn").textContent = "🤖 DFS Mode";
    maze.resetForPathfinding();
    playerCell = null;
    playerPath = [];
    moveCount = 0;
  }

  updateUI();
}

/**
 * START YOUR DFS IMPLEMENTATION HERE!
 *
 * This is where you'll implement the Depth-First Search algorithm.
 * The maze is already set up and ready for you.
 *
 * Available resources:
 * - maze.startCell: The starting cell
 * - maze.endCell: The target cell
 * - maze.getValidNeighbors(cell): Get cells you can move to from current cell
 * - cell.visited: Boolean to track if cell has been visited
 * - cell.parent: Set this to track the path for solution reconstruction
 * - dfsStack: Array to use as your DFS stack
 * - currentDFSCell: Set this to highlight the current cell being explored
 *
 * Steps to implement:
 * 1. Initialize your DFS with the start cell
 * 2. Use a stack to keep track of cells to explore
 * 3. For each cell, get valid neighbors using maze.getValidNeighbors()
 * 4. Mark cells as visited and set parent pointers
 * 5. When you reach the end cell, call maze.highlightPath()
 *
 * Tips:
 * - Set dfsRunning = true when starting
 * - Set dfsComplete = true when finished
 * - Use setTimeout() or a loop counter to animate the search
 * - Update currentDFSCell to show progress
 */
function startDFS() {
  if (dfsRunning) {
    console.log("DFS is already running!");
    return;
  }

  console.log("🎯 Starting DFS...");
  console.log("📝 TODO: Implement your DFS algorithm here!");
  console.log("🔧 Available tools:");
  console.log("   - maze.startCell (starting point)");
  console.log("   - maze.endCell (target)");
  console.log("   - maze.getValidNeighbors(cell) (get moveable neighbors)");
  console.log("   - cell.visited (mark as visited)");
  console.log("   - cell.parent (track path)");
  console.log("   - dfsStack (use as your stack)");

  // Reset maze state
  maze.resetForPathfinding();

  // TODO: IMPLEMENT YOUR DFS ALGORITHM HERE!
  //
  // Example structure (replace with your implementation):
  /*
    dfsRunning = true;
    dfsStack = [maze.startCell];
    maze.startCell.visited = true;
    
    // Your DFS implementation here...
    // Remember to:
    // 1. Use maze.getValidNeighbors(currentCell) 
    // 2. Set cell.visited = true for visited cells
    // 3. Set cell.parent for path tracking
    // 4. Use dfsStack for the algorithm
    // 5. Set currentDFSCell for visualization
    // 6. Call maze.highlightPath() when done
    // 7. Set dfsComplete = true when finished
    */

  // Placeholder - remove this when you implement DFS
  alert("🚨 DFS not implemented yet! This is your task to complete. Check the console for hints!");

  updateUI();
}

/**
 * Handle mouse clicks for interactive features
 */
function mousePressed() {
  // Calculate which cell was clicked
  const gridX = Math.floor(mouseX / cellSize);
  const gridY = Math.floor(mouseY / cellSize);

  const clickedCell = maze.getCell(gridX, gridY);
  if (clickedCell) {
    console.log(`Clicked cell: (${gridX}, ${gridY})`);
    console.log(
      `Can move to neighbors:`,
      maze.getValidNeighbors(clickedCell).map((c) => `(${c.x},${c.y})`)
    );
  }
}

/**
 * Keyboard shortcuts and player controls
 */
function keyPressed() {
  // Arrow keys for player movement (using keyCode for better detection)
  if (keyCode === UP_ARROW) {
    movePlayer("UP");
    return;
  }
  if (keyCode === DOWN_ARROW) {
    movePlayer("DOWN");
    return;
  }
  if (keyCode === LEFT_ARROW) {
    movePlayer("LEFT");
    return;
  }
  if (keyCode === RIGHT_ARROW) {
    movePlayer("RIGHT");
    return;
  }

  // Other controls
  switch (key.toLowerCase()) {
    case "r":
      resetMaze();
      break;
    case "n":
      generateNewMaze();
      break;
    case "d":
      startDFS();
      break;
    case "t":
      toggleTheme();
      break;
    case "h":
      showHelp();
      break;
    case " ":
      toggleSolvingMode();
      break;
  }
}

/**
 * Show help information
 */
function showHelp() {
  console.log("🆘 HELP - Keyboard Shortcuts:");
  console.log("   ↑↓←→ - Move player (manual mode)");
  console.log("   SPACE - Toggle manual/DFS mode");
  console.log("   R - Reset maze");
  console.log("   N - Generate new maze");
  console.log("   D - Start DFS");
  console.log("   T - Toggle theme");
  console.log("   H - Show this help");
  console.log("");
  console.log("🎮 Manual Mode:");
  console.log("   Use arrow keys to navigate from green START to red END");
  console.log("   Yellow circle shows your current position");
  console.log("");
  console.log("🎯 Your Mission:");
  console.log("   Implement DFS algorithm in the startDFS() function!");
  console.log("   Use the provided tools and follow the hints in the code.");
}
