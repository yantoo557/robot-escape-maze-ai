export function findPath(maze, start, goal) {

    const rows = maze.length;
    const cols = maze[0].length;

    const open = [];
    const closed = new Set();
 
    const heuristic = (row, col) => {

        return (
            Math.abs(row - goal.row) +
            Math.abs(col - goal.col)
        );

    };

    open.push({
        row: start.row,
        col: start.col,
        g: 0,
        h: heuristic(
            start.row,
            start.col
        ),
        f: heuristic(
            start.row,
            start.col
        ),
        parent: null
    });

    while (open.length > 0) {

        open.sort(
            (a, b) => a.f - b.f
        );

        const current =
            open.shift();

        const key =
            `${current.row}-${current.col}`;

        closed.add(key);

        if (
            current.row === goal.row &&
            current.col === goal.col
        ) {

            const path = [];

            let node = current;

            while (node) {

                path.push({
                    row: node.row,
                    col: node.col
                });

                node =
                    node.parent;
            }

            return path.reverse();
        }

        const directions = [

            [1, 0],
            [-1, 0],
            [0, 1],
            [0, -1]

        ];

        for (const [dr, dc]
            of directions) {

            const nr =
                current.row + dr;

            const nc =
                current.col + dc;

            if (
                nr < 0 ||
                nc < 0 ||
                nr >= rows ||
                nc >= cols
            ) {
                continue;
            }

            const cell =
                maze[nr][nc];

            if (
                cell === "wall"
            ) {
                continue;
            }

            const neighborKey =
                `${nr}-${nc}`;

            if (
                closed.has(
                    neighborKey
                )
            ) {
                continue;
            }

            const g =
                current.g + 1;

            const h =
                heuristic(
                    nr,
                    nc
                );

            const f =
                g + h;

            const existing =
                open.find(
                    node =>
                        node.row === nr &&
                        node.col === nc
                );

            if (
                !existing
            ) {

                open.push({

                    row: nr,
                    col: nc,

                    g,
                    h,
                    f,

                    parent:
                        current

                });

            }
            else if (
                g < existing.g
            ) {

                existing.g = g;

                existing.f =
                    g +
                    existing.h;

                existing.parent =
                    current;
            }
        }
    }

    return [];
}