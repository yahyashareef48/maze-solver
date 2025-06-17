# 🧩 Maze Solver - DFS Learning Project

A dark-themed maze game built with p5.js for learning Depth-First Search (DFS) algorithm implementation.

## 🎯 Project Goal

This project provides a complete maze game framework where you need to implement the **Depth-First Search (DFS)** algorithm to solve randomly generated mazes.

## 🚀 Getting Started

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Start the development server:**

   ```bash
   npm start
   ```

   Or alternatively:

   ```bash
   npm run dev
   ```

3. **Open your browser:**
   - Navigate to `http://localhost:3000` or `http://localhost:8080`
   - You should see the maze game with a dark theme

## 🎮 Controls

### Mouse Controls

- **Click on cells** to see their valid neighbors in the console

### Keyboard Shortcuts

- **R** - Reset maze (clear pathfinding state)
- **N** - Generate new maze
- **D** - Start DFS (your implementation)
- **T** - Toggle dark/light theme
- **H** - Show help in console

### UI Buttons

- **🔄 New Maze** - Generate a new random maze
- **🎯 Start DFS** - Run your DFS implementation
- **↺ Reset** - Reset current maze for new pathfinding
- **🌙 Dark Theme** - Toggle theme

## 📝 Your Task: Implement DFS

### Location

Implement your DFS algorithm in the `startDFS()` function in `js/main.js` (around line 120).

### Available Tools

```javascript
// Starting point
maze.startCell; // The green starting cell

// Target
maze.endCell; // The red target cell

// Get moveable neighbors (no walls blocking)
maze.getValidNeighbors(cell); // Returns array of cells you can move to

// Cell properties
cell.visited = true; // Mark cell as visited
cell.parent = parentCell; // Set parent for path reconstruction
cell.x, cell.y; // Grid coordinates

// Visualization
currentDFSCell = cell; // Highlight current cell being explored
dfsStack = []; // Use this array as your DFS stack
```

### Implementation Steps

1. **Initialize DFS:**

   ```javascript
   dfsRunning = true;
   dfsStack = [maze.startCell];
   maze.startCell.visited = true;
   ```

2. **Main DFS Loop:**

   - Pop cell from stack
   - Check if it's the target
   - Get valid neighbors using `maze.getValidNeighbors(cell)`
   - For each unvisited neighbor:
     - Mark as visited
     - Set parent pointer
     - Add to stack

3. **Finish:**
   ```javascript
   maze.highlightPath(); // Show solution path
   dfsComplete = true;
   dfsRunning = false;
   ```

## 🎨 Features

- **Dark Theme UI** - Easy on the eyes for coding sessions
- **Interactive Maze** - Click cells to explore their properties
- **Real-time Visualization** - See your DFS algorithm in action
- **Path Highlighting** - Solution path shown in yellow
- **Statistics Display** - Track exploration efficiency
- **Responsive Design** - Adapts to different screen sizes

## 🏗️ Project Structure

```
maze-solver/
├── index.html          # Main HTML file with UI
├── js/
│   ├── main.js         # Main p5.js code (IMPLEMENT DFS HERE)
│   ├── maze.js         # Maze generation and utilities
│   └── cell.js         # Cell class definition
├── package.json        # Dependencies and scripts
└── README.md          # This file
```

## 🔍 Understanding the Code

### Cell Class (`js/cell.js`)

- Represents individual maze cells
- Handles wall configuration and drawing
- Provides `canMoveTo()` method for movement validation

### Maze Class (`js/maze.js`)

- Generates random mazes using recursive backtracking
- Provides `getValidNeighbors()` for pathfinding
- Handles maze visualization and path highlighting

### Main File (`js/main.js`)

- p5.js setup and draw loops
- UI interaction handling
- **Your DFS implementation goes here!**

## 🎓 Learning Resources

- **DFS Algorithm:** Stack-based graph traversal
- **Maze Representation:** Grid with wall-based connectivity
- **Path Reconstruction:** Using parent pointers to trace solution
- **Visualization:** Real-time algorithm animation

## 🐛 Debugging Tips

1. **Use Console Logging:**

   ```javascript
   console.log("Current cell:", currentCell.x, currentCell.y);
   console.log("Valid neighbors:", maze.getValidNeighbors(currentCell));
   ```

2. **Check Cell States:**

   - Click cells to see their neighbors
   - Watch the statistics panel for exploration progress

3. **Step Through Algorithm:**
   - Add delays with `setTimeout()` to slow down execution
   - Use `currentDFSCell` to highlight your current position

## 🎯 Success Criteria

Your DFS implementation should:

- ✅ Find a path from start (green) to end (red)
- ✅ Highlight the solution path in yellow
- ✅ Show exploration progress in real-time
- ✅ Handle cases where no path exists (shouldn't happen in this maze)

## 🏆 Challenge Yourself

After implementing basic DFS:

- Add animation with delays
- Implement iterative deepening
- Compare with other algorithms (BFS, A\*)
- Add heuristics for better pathfinding

---

**Happy Coding! 🚀**

_Remember: The goal is to learn DFS, so take your time to understand each step of the algorithm._
