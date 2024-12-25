export const levelGeneratorPrompt = `
I am using a 2d array to represent a grid (9 rows and 20 columns) which will be used to build a level in a video game.

OBJECTS:
0 = void,
1 = floor
2 = target (enemy)
3 = floor spikes - trap
4 = swinging axe - trap
5 = pitfall - trap 
6 = boulder - trap 
7 = teleporter to bonus room - firing range (FR)
8 = teleporter to bonus room - swinging pole (SP)

All objects (0-8) takes 1 cell space.

FINAL VALIDATION CHECKLIST (MUST MATCH EXACTLY):
- Total Void (0): 90 cells
- Total Floor (1): 37 cells
- Total Target (2): 23 cells
- Total Spikes (3): 8 cells
- Total Axe (4): 8 cells
- Total Pitfall (5): 8 cells
- Total Boulder (6): 4 cells
- Total FR (7): 1 cell
- Total SP (8): 1 cell
- Total cells filled (non-zero): 90 cells


Examples:
[
  [0, 0, 0, 2, 4, 1, 0, 0, 0, 6, 2, 0, 0, 0, 1, 5, 1, 0, 2, 7],
  [0, 1, 0, 1, 0, 2, 3, 1, 0, 3, 0, 0, 2, 1, 2, 0, 1, 2, 1, 0],
  [0, 2, 0, 0, 0, 0, 0, 1, 4, 1, 0, 0, 1, 0, 0, 0, 0, 5, 0, 0],
  [0, 1, 4, 2, 1, 0, 0, 0, 0, 2, 4, 1, 5, 0, 1, 3, 1, 2, 6, 0],
  [1, 2, 0, 0, 5, 1, 3, 6, 0, 0, 0, 0, 1, 4, 2, 0, 0, 0, 2, 1],
  [0, 0, 0, 0, 0, 0, 1, 5, 1, 5, 1, 0, 0, 0, 1, 3, 1, 0, 0, 0],
  [0, 1, 4, 2, 0, 0, 0, 0, 2, 0, 1, 3, 1, 0, 0, 0, 2, 1, 0, 8],
  [0, 0, 0, 3, 1, 2, 1, 0, 4, 0, 0, 0, 2, 4, 1, 0, 0, 5, 1, 1],
  [0, 0, 0, 1, 0, 0, 2, 5, 6, 3, 2, 0, 0, 0, 2, 1, 0, 0, 2, 0]
]
[
  [0, 0, 0, 6, 2, 1, 5, 1, 0, 0, 2, 1, 0, 0, 0, 2, 0, 0, 0, 0],
  [0, 2, 3, 1, 0, 0, 0, 4, 1, 0, 5, 1, 2, 0, 3, 1, 2, 1, 8, 0],
  [0, 1, 0, 2, 0, 2, 0, 0, 3, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  [0, 5, 0, 1, 4, 1, 2, 0, 1, 5, 2, 0, 4, 1, 2, 1, 0, 2, 0, 0],
  [1, 1, 6, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 5, 0, 4, 1, 3, 2, 1],
  [0, 2, 0, 3, 1, 0, 5, 0, 0, 2, 1, 3, 0, 1, 0, 0, 0, 0, 0, 0],
  [0, 1, 0, 0, 0, 0, 1, 2, 0, 0, 0, 1, 4, 2, 6, 2, 0, 0, 0, 0],
  [2, 4, 1, 0, 5, 0, 0, 1, 6, 1, 0, 0, 0, 0, 3, 1, 5, 1, 0, 0],
  [0, 0, 2, 4, 1, 3, 0, 2, 0, 2, 1, 4, 1, 0, 7, 0, 0, 2, 0, 0]
]
[
  [0, 0, 0, 1, 2, 1, 0, 0, 2, 1, 4, 1, 0, 0, 0, 0, 2, 1, 0, 0],
  [0, 2, 3, 1, 0, 4, 1, 0, 0, 3, 0, 5, 1, 2, 1, 0, 0, 4, 0, 0],
  [0, 1, 0, 2, 0, 1, 2, 1, 0, 1, 0, 0, 0, 0, 5, 6, 0, 1, 0, 0],
  [0, 5, 0, 1, 0, 0, 0, 3, 0, 4, 1, 4, 1, 0, 0, 2, 1, 3, 1, 0],
  [1, 1, 0, 6, 2, 1, 4, 1, 1, 0, 0, 0, 2, 0, 2, 1, 2, 0, 2, 1],
  [0, 0, 0, 0, 0, 3, 0, 0, 2, 1, 5, 0, 0, 0, 0, 3, 5, 0, 0, 0],
  [0, 2, 6, 4, 1, 1, 0, 0, 0, 2, 1, 6, 1, 2, 1, 1, 2, 5, 0, 0],
  [0, 0, 3, 0, 0, 5, 1, 2, 0, 0, 0, 0, 0, 0, 3, 2, 0, 2, 0, 0],
  [0, 0, 2, 8, 0, 0, 0, 1, 4, 1, 2, 5, 7, 0, 1, 0, 0, 0, 0, 0]
]
[
  [0, 0, 2, 0, 0, 0, 0, 1, 4, 1, 2, 0, 0, 0, 2, 0, 0, 0, 2, 0],
  [0, 3, 1, 0, 0, 2, 3, 1, 0, 0, 5, 1, 0, 3, 1, 4, 0, 0, 5, 0],
  [0, 1, 4, 1, 0, 1, 0, 0, 0, 7, 1, 2, 0, 1, 0, 0, 2, 1, 2, 0],
  [0, 2, 0, 5, 1, 2, 1, 4, 0, 0, 0, 0, 0, 5, 1, 0, 0, 0, 1, 0],
  [1, 1, 6, 1, 0, 0, 0, 6, 4, 1, 3, 2, 0, 1, 2, 6, 4, 1, 2, 1],
  [0, 2, 0, 3, 1, 2, 0, 0, 0, 3, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0],
  [0, 0, 0, 1, 0, 1, 4, 1, 0, 1, 2, 6, 1, 2, 5, 1, 2, 2, 0, 0],
  [0, 5, 0, 2, 0, 3, 0, 2, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0],
  [0, 1, 4, 1, 0, 1, 0, 1, 5, 1, 2, 0, 0, 0, 3, 2, 0, 8, 0, 0]
]
[
  [0, 0, 1, 2, 0, 1, 5, 1, 8, 0, 0, 1, 2, 0, 0, 0, 0, 2, 0, 0],
  [0, 2, 6, 1, 3, 1, 0, 4, 0, 0, 3, 1, 0, 0, 2, 4, 6, 1, 2, 0],
  [0, 1, 0, 0, 0, 2, 0, 1, 2, 0, 1, 5, 1, 0, 1, 1, 0, 3, 1, 0],
  [2, 4, 1, 2, 1, 4, 0, 3, 0, 0, 0, 1, 4, 0, 5, 1, 0, 0, 0, 0],
  [1, 0, 0, 0, 6, 1, 4, 1, 2, 1, 0, 0, 2, 5, 6, 2, 3, 4, 2, 1],
  [2, 1, 0, 0, 0, 0, 1, 0, 1, 5, 2, 0, 0, 0, 0, 0, 0, 1, 0, 0],
  [0, 5, 1, 2, 0, 2, 4, 1, 5, 0, 1, 3, 0, 2, 1, 3, 0, 2, 0, 0],
  [0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 1, 2, 1, 0, 0],
  [0, 2, 1, 3, 1, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0]
]

PATH DEFINITIONS:
Corridors (straight lines), Rooms (rectangles), and Dead ends (isolated paths that contain targets/bonus rooms). 

PLAYER: 
The player can move left, right, up and down.
The player can move freely around the grid where there are floors.
The player can dash. The dash makes the player skip a floor (typically where there are traps) and go to the one after.
The player can attack targets.

RULES:
1. The player MUST start at row 4 column 0. The goal is for the player to reach the exit on row 4 column 19. (Zero-based indexing)
2. If there is only one floor connecting to another floor, they cannot be connected diagonally. (ORTHOGONALLY)
3. Objects other than floors count towards the path. A floor will be automatically placed under them.
4. MAXIMIZE dead ends and MINIMIZE interconnections between paths. 
5. Do not exceed 6 cells (in a single direction) for a corridor.
6. Make sure corridors/rooms are accessible. This means that a corridor/room cannot be all surrounded by zeros.
7. Do not place traps at the end of dead ends.
8. Do not place traps (except boulders) next to each other. The player can only dash 1 at a time. We cannot have the player dash a trap to fall into another trap.
9. Boulders (6) can be placed next to another trap since the player can stand on that cell.
11. Do not place more than 1 boulder in the same corridor.
12. Make sure the boulders are far from each other.
13. Place 7 and 8 in dead ends. Make sure they are opposite (from left to right )of each other.
14. Make sure the remaining dead ends are always rewarded with at least one target.
15. Make sure the total amount for each object matches that in the checklist.

Generate a new randomized path where all the rules are carefully followed. Make the grid look very different from the examples.
Do not write any sentence/words. Only return the grid in the format provided in the example.
`;