/**
 * Maze class handles maze generation and provides utilities for pathfinding
 */
class Maze {
  constructor(cols, rows, cellSize) {
    this.cols = cols;
    this.rows = rows;
    this.cellSize = cellSize;
    this.grid = [];
    this.startCell = null;
    this.endCell = null;

    this.initializeGrid();
    this.generateMaze();
    this.setStartAndEnd();
  }

  /**
   * Initialize empty grid with walls everywhere
   */
  initializeGrid() {
    this.grid = [];
    for (let x = 0; x < this.cols; x++) {
      this.grid[x] = [];
      for (let y = 0; y < this.rows; y++) {
        this.grid[x][y] = new Cell(x, y, this.cellSize);
      }
    }
  }

  /**
   * Generate maze using recursive backtracking algorithm
   */
  generateMaze() {
    const stack = [];
    let current = this.grid[0][0];
    current.visited = true;

    while (true) {
      const neighbors = this.getUnvisitedNeighbors(current);

      if (neighbors.length > 0) {
        // Choose random neighbor
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        next.visited = true;

        // Add current to stack
        stack.push(current);

        // Remove wall between current and next
        current.removeWall(next);

        // Make next the current cell
        current = next;
      } else if (stack.length > 0) {
        // Backtrack
        current = stack.pop();
      } else {
        break;
      }
    }

    // Reset visited flags for pathfinding
    this.resetVisited();
  }

  /**
   * Get unvisited neighbors of a cell (used in maze generation)
   */
  getUnvisitedNeighbors(cell) {
    const neighbors = [];
    const x = cell.x;
    const y = cell.y;

    // Check all four directions
    if (x > 0 && !this.grid[x - 1][y].visited) {
      neighbors.push(this.grid[x - 1][y]);
    }
    if (x < this.cols - 1 && !this.grid[x + 1][y].visited) {
      neighbors.push(this.grid[x + 1][y]);
    }
    if (y > 0 && !this.grid[x][y - 1].visited) {
      neighbors.push(this.grid[x][y - 1]);
    }
    if (y < this.rows - 1 && !this.grid[x][y + 1].visited) {
      neighbors.push(this.grid[x][y + 1]);
    }

    return neighbors;
  }

  /**
   * Get valid neighbors that can be moved to (no walls blocking)
   * YOU'LL USE THIS IN YOUR DFS IMPLEMENTATION
   */
  getValidNeighbors(cell) {
    const neighbors = [];
    const x = cell.x;
    const y = cell.y;

    // Check all four directions
    const candidates = [
      { x: x - 1, y: y }, // Left
      { x: x + 1, y: y }, // Right
      { x: x, y: y - 1 }, // Up
      { x: x, y: y + 1 }, // Down
    ];

    for (let candidate of candidates) {
      if (this.isValidPosition(candidate.x, candidate.y)) {
        const neighborCell = this.grid[candidate.x][candidate.y];
        if (cell.canMoveTo(neighborCell)) {
          neighbors.push(neighborCell);
        }
      }
    }

    return neighbors;
  }

  /**
   * Check if position is within grid bounds
   */
  isValidPosition(x, y) {
    return x >= 0 && x < this.cols && y >= 0 && y < this.rows;
  }

  /**
   * Set start and end points for the maze
   */
  setStartAndEnd() {
    // Start at top-left corner
    this.startCell = this.grid[0][0];
    this.startCell.isStart = true;

    // End at bottom-right corner
    this.endCell = this.grid[this.cols - 1][this.rows - 1];
    this.endCell.isEnd = true;
  }

  /**
   * Reset all cells for a new pathfinding attempt
   */
  resetForPathfinding() {
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        this.grid[x][y].reset();
      }
    }

    // Restore start and end markers
    this.startCell.isStart = true;
    this.endCell.isEnd = true;
  }

  /**
   * Reset visited flags (used after maze generation)
   */
  resetVisited() {
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        this.grid[x][y].visited = false;
      }
    }
  }

  /**
   * Clear path highlighting from all cells
   */
  resetPathHighlight() {
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        this.grid[x][y].isPath = false;
      }
    }
  }

  /**
   * Draw the entire maze
   */
  draw() {
    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        this.grid[x][y].draw();
      }
    }
  }

  /**
   * Get cell at specific grid coordinates
   */
  getCell(x, y) {
    if (this.isValidPosition(x, y)) {
      return this.grid[x][y];
    }
    return null;
  }

  /**
   * Highlight the solution path from start to end
   * YOU'LL CALL THIS AFTER YOUR DFS FINDS THE SOLUTION
   */
  highlightPath() {
    if (!this.endCell.visited) {
      console.log("No path found!");
      return false;
    }

    // Trace back from end to start using parent pointers
    let current = this.endCell;
    const path = [];

    while (current && current !== this.startCell) {
      current.isPath = true;
      path.push(current);
      current = current.parent;
    }

    console.log(`Path found! Length: ${path.length}`);
    return true;
  }

  /**
   * Get maze statistics for display
   */
  getStats() {
    let visitedCount = 0;
    let totalCells = this.cols * this.rows;

    for (let x = 0; x < this.cols; x++) {
      for (let y = 0; y < this.rows; y++) {
        if (this.grid[x][y].visited) {
          visitedCount++;
        }
      }
    }

    return {
      totalCells: totalCells,
      visitedCells: visitedCount,
      explorationRate: ((visitedCount / totalCells) * 100).toFixed(1),
    };
  }
}
