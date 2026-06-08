function Maze({
  maze,
  robotPos,
  crystals,
  collectedCrystals
}) {

  const isCrystalCollected = (
    row,
    col
  ) => {

    return collectedCrystals.some(
      crystal =>
        crystal.row === row &&
        crystal.col === col
    );

  };

  return (

    <div className="maze">

      {maze.flat().map(
        (cell, index) => {

          const row =
            Math.floor(
              index /
              maze[0].length
            );

          const col =
            index %
            maze[0].length;

          const isRobot =
            robotPos.row === row &&
            robotPos.col === col;

          const crystal =
            crystals.find(
              c =>
                c.row === row &&
                c.col === col
            );

          return (

            <div
              key={index}
              className={`cell ${cell}`}
            >

              {/* Robot */}
              {isRobot &&
                "🤖"}

              {/* Crystal */}
              {!isRobot &&
                crystal &&
                !isCrystalCollected(
                  row,
                  col
                ) &&
                "💎"}

              {/* Goal */}
              {!isRobot &&
                !crystal &&
                cell === "goal" &&
                "🌀"}

              {/* Route */}
              {!isRobot &&
                !crystal &&
                cell === "route" &&
                "⚡"}

            </div>

          );

        }
      )}

    </div>

  );
}

export default Maze;