/**
 * Cell class represents individual cells in the maze
 * Each cell knows its position and which walls are present
 */
class Cell {
  constructor(x, y, size) {
    this.x = x;
    this.y = y;
    this.size = size;

    // Wall configuration - true means wall is present
    this.walls = {
      top: true,
      right: true,
      bottom: true,
      left: true,
    };

    // States for visualization
    this.visited = false;
    this.current = false;
    this.isPath = false;
    this.isStart = false;
    this.isEnd = false;

    // For DFS algorithm (you'll use these)
    this.parent = null;
    this.inStack = false;
  }

  /**
   * Get pixel coordinates for drawing
   */
  getPixelX() {
    return this.x * this.size;
  }

  getPixelY() {
    return this.y * this.size;
  }

  /**
   * Draw the cell with current state
   */
  draw() {
    const pixelX = this.getPixelX();
    const pixelY = this.getPixelY();

    // Choose color based on cell state
    if (this.isStart) {
      fill(0, 255, 100); // Green for start
    } else if (this.isEnd) {
      fill(255, 100, 100); // Red for end
    } else if (this.current) {
      fill(100, 150, 255); // Blue for current cell
    } else if (this.isPath) {
      fill(255, 200, 0); // Yellow for solution path
    } else if (this.inStack) {
      fill(150, 100, 255); // Purple for cells in DFS stack
    } else if (this.visited) {
      fill(60, 60, 60); // Dark gray for visited
    } else {
      fill(20, 20, 20); // Very dark for unvisited
    }

    // Draw cell background
    noStroke();
    rect(pixelX, pixelY, this.size, this.size);

    // Draw walls
    stroke(255, 255, 255); // White walls
    strokeWeight(2);

    if (this.walls.top) {
      line(pixelX, pixelY, pixelX + this.size, pixelY);
    }
    if (this.walls.right) {
      line(pixelX + this.size, pixelY, pixelX + this.size, pixelY + this.size);
    }
    if (this.walls.bottom) {
      line(pixelX, pixelY + this.size, pixelX + this.size, pixelY + this.size);
    }
    if (this.walls.left) {
      line(pixelX, pixelY, pixelX, pixelY + this.size);
    }
  }

  /**
   * Remove wall between this cell and another cell
   * This is used during maze generation
   */
  removeWall(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;

    if (dx === 1) {
      // Other is to the left
      this.walls.left = false;
      other.walls.right = false;
    } else if (dx === -1) {
      // Other is to the right
      this.walls.right = false;
      other.walls.left = false;
    }

    if (dy === 1) {
      // Other is above
      this.walls.top = false;
      other.walls.bottom = false;
    } else if (dy === -1) {
      // Other is below
      this.walls.bottom = false;
      other.walls.top = false;
    }
  }

  /**
   * Check if this cell can move to another cell (no wall between them)
   * YOU'LL USE THIS IN YOUR DFS IMPLEMENTATION
   */
  canMoveTo(other) {
    const dx = this.x - other.x;
    const dy = this.y - other.y;

    // Check if cells are adjacent
    if (Math.abs(dx) + Math.abs(dy) !== 1) {
      return false;
    }

    // Check walls
    if (dx === 1 && this.walls.left) return false; // Other is to the left
    if (dx === -1 && this.walls.right) return false; // Other is to the right
    if (dy === 1 && this.walls.top) return false; // Other is above
    if (dy === -1 && this.walls.bottom) return false; // Other is below

    return true;
  }

  /**
   * Reset cell state (useful for running DFS multiple times)
   */
  reset() {
    this.visited = false;
    this.current = false;
    this.isPath = false;
    this.parent = null;
    this.inStack = false;
  }

  /**
   * Get string representation for debugging
   */
  toString() {
    return `Cell(${this.x}, ${this.y})`;
  }
}
