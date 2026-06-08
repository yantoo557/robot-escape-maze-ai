import { useState, useEffect } from "react";
import "./App.css";

import Maze from "./components/Maze";
import { findPath } from "./algorithms/astar";

function App() {

  const ROWS = 15;
  const COLS = 15;

  const START = {
    row: 0,
    col: 0
  };

  const GOAL = {
    row: 14,
    col: 14
  };

  const createMaze = () => {

    const maze = [];

    for (let r = 0; r < ROWS; r++) {

      const row = [];

      for (let c = 0; c < COLS; c++) {

        row.push(
          Math.random() < 0.20
            ? "wall"
            : "path"
        );

      }

      maze.push(row);

    }

    maze[
      START.row
    ][
      START.col
    ] = "path";

    maze[
      GOAL.row
    ][
      GOAL.col
    ] = "goal";

    return maze;

  };

  const createValidMaze = () => {

    let maze;
    let path;

    do {

      maze = createMaze();

      path = findPath(
        maze,
        START,
        GOAL
      );

    } while (
      path.length === 0
    );

    return maze;

  };

const generateCrystals = (maze) => {

  const crystals = [];

  while (crystals.length < 3) {

    const row =
      Math.floor(Math.random() * 15);

    const col =
      Math.floor(Math.random() * 15);

    if (
      maze[row][col] !== "path"
    ) continue;

    if (
      row === 0 &&
      col === 0
    ) continue;

    if (
      row === 14 &&
      col === 14
    ) continue;

    const reachable =
      findPath(
        maze,
        { row: 0, col: 0 },
        { row, col }
      );

    if (
      reachable.length === 0
    ) continue;

    const exists =
      crystals.some(
        crystal =>
          crystal.row === row &&
          crystal.col === col
      );

    if (!exists) {

      crystals.push({
        row,
        col
      });

    }
  }

  return crystals;
};

  const initialMaze =
    createValidMaze();

  const [maze, setMaze] =
    useState(
      initialMaze
    );

  const [
    crystals,
    setCrystals
  ] = useState(
    generateCrystals(
      initialMaze
    )
  );

  const [
    collectedCrystals,
    setCollectedCrystals
  ] = useState([]);

  const [
    robotPos,
    setRobotPos
  ] = useState(
    START
  );

  const [
    status,
    setStatus
  ] = useState(
    "Siap memulai misi"
  );

  const [
    portalUnlocked,
    setPortalUnlocked
  ] = useState(false);

  const [
    isMoving,
    setIsMoving
  ] = useState(false);
  
    const resetRoutes = (
    currentMaze
  ) => {

    return currentMaze.map(
      row =>

        row.map(
          cell =>

            cell === "route"
              ? "path"
              : cell
        )
    );

  };

const generateMaze = () => {

  const newMaze =
    createValidMaze();

  const newCrystals =
    generateCrystals(
      newMaze
    );

  setMaze(newMaze);

  setCrystals(
    newCrystals
  );

  setCollectedCrystals(
    []
  );

  setPortalUnlocked(
    false
  );

  setRobotPos({
    row: 0,
    col: 0
  });

  setStatus(
    "Labirin baru dibuat"
  );

};

  const collectCrystal = (
  row,
  col
) => {

  const crystal =
    crystals.find(

      c =>

        c.row === row &&
        c.col === col

    );

  if (!crystal)
    return;

  const alreadyCollected =
    collectedCrystals.some(

      c =>

        c.row === row &&
        c.col === col

    );

  if (
    alreadyCollected
  ) {
    return;
  }

  const updated = [

    ...collectedCrystals,
    crystal

  ];

  setCollectedCrystals(
    updated
  );

  if (
    updated.length >=
    crystals.length
  ) {

    setPortalUnlocked(
      true
    );

    setStatus(
      "Portal berhasil dibuka!"
    );

  }

};

  const getNextTarget =
    () => {

const remainingCrystals =
  crystals.filter(

    crystal =>

      !collectedCrystals.some(

        collected =>

          collected.row === crystal.row &&
          collected.col === crystal.col

      )

  );

  let nearestCrystal = null;
let shortestDistance = Infinity;

remainingCrystals.forEach(
  crystal => {

    const distance =

      Math.abs(
        crystal.row -
        robotPos.row
      ) +

      Math.abs(
        crystal.col -
        robotPos.col
      );

    if (
      distance <
      shortestDistance
    ) {

      shortestDistance =
        distance;

      nearestCrystal =
        crystal;

    }

  }
);

target = {

  row:
    nearestCrystal.row,

  col:
    nearestCrystal.col

};

    if (
      remainingCrystal
    ) {

      return {

        row:
          remainingCrystal.row,

        col:
          remainingCrystal.col,

        type:
          "crystal"

      };

    }

    if (
      portalUnlocked
    ) {

      return {

        row:
          GOAL.row,

        col:
          GOAL.col,

        type:
          "portal"

      };

    }

    return null;

  };

    const animateRobot = (path) => {

    if (isMoving) return;

    setIsMoving(true);

    let step = 0;

    const interval = setInterval(() => {

      if (step >= path.length) {

        clearInterval(interval);

        setIsMoving(false);

setStatus(
  "Target tercapai"
);

setTimeout(() => {

  setStatus(
    "Klik Cari Jalur AI"
  );

}, 500);

return;
      }

      const current =
        path[step];

      setRobotPos({

        row: current.row,
        col: current.col

      });

      collectCrystal(
        current.row,
        current.col
      );

      step++;

    }, 250);

  };

  const searchPath = () => {
    console.log(
  "Robot sekarang:",
  robotPos
);

if (isMoving) return;

    setStatus(
      "AI sedang menghitung jalur..."
    );

    let target;

const remainingCrystals =
  crystals.filter(

    crystal =>

      !collectedCrystals.some(

        collected =>

          collected.row === crystal.row &&
          collected.col === crystal.col

      )

  );

let nearestCrystal = null;
let shortestPath = Infinity;

remainingCrystals.forEach(
  crystal => {

    const testPath =
      findPath(
        maze,
        robotPos,
        {
          row: crystal.row,
          col: crystal.col
        }
      );

    if (
      testPath.length > 0 &&
      testPath.length < shortestPath
    ) {

      shortestPath =
        testPath.length;

      nearestCrystal =
        crystal;

    }

  }
);

if (nearestCrystal) {

      target = {

        row:
          nearestCrystal.row,

        col:
          nearestCrystal.col

      };

      setStatus(
        "Menuju Crystal..."
      );

    } else {

      if (!portalUnlocked) {

        setStatus(
          "Portal masih terkunci"
        );

        return;
      }

      target = {
        row: 14,
        col: 14
      };

      setStatus(
        "Menuju Portal..."
      );
    }

    const path =
      findPath(
        maze,
        robotPos,
        target
      );

    if (
      path.length === 0
    ) {

      setStatus(
        "Jalur tidak ditemukan"
      );

      return;
    }

    const newMaze =
      maze.map(
        row => [...row]
      );

    path.forEach(node => {

      const cell =
        newMaze[
          node.row
        ][
          node.col
        ];

      if (
        cell !== "goal"
      ) {

        if (
          node.row !== robotPos.row ||
          node.col !== robotPos.col
        ) {

          newMaze[
            node.row
          ][
            node.col
          ] = "route";

        }

      }

    });

    setMaze(newMaze);

    animateRobot(path);

  };

  useEffect(() => {

  const interval =
    setInterval(() => {

      setMaze(oldMaze => {

        const newMaze =
          oldMaze.map(
            row => [...row]
          );

        for (
          let i = 0;
          i < 2;
          i++
        ) {

          const r =
            Math.floor(
              Math.random() * 15
            );

          const c =
            Math.floor(
              Math.random() * 15
            );

          if (
            r === robotPos.row &&
            c === robotPos.col
          ) continue;

          if (
            Math.abs(r - 14) <= 1 &&
            Math.abs(c - 14) <= 1
          ) continue;

          const isCrystal =
            crystals.some(

              crystal =>

                crystal.row === r &&
                crystal.col === c

            );

          if (isCrystal)
            continue;

          if (
            newMaze[r][c] ===
            "wall"
          ) {

            newMaze[r][c] =
              "path";

          } else {

            newMaze[r][c] =
              "wall";

          }

        }

        return newMaze;

      });

    }, 5000);

  return () =>
    clearInterval(
      interval
    );

}, [
  robotPos,
  crystals
]);

    return (

    <div className="container">

      <h1>
        🤖 ROBOT ESCAPE MAZE
      </h1>

      <p className="subtitle">
        AI Facility Escape - A* Dynamic Pathfinding
      </p>

      <div className="control-panel">

        <button
          className="btn"
          onClick={generateMaze}
        >
          Generate Maze
        </button>

        <button
          className="btn"
          onClick={searchPath}
        >
          Cari Jalur AI
        </button>

      </div>

      <div className="info-panels">

  <div className="status-panel">

    <h3>AI STATUS</h3>

    <p>{status}</p>

    <p>
      Position :
      ({robotPos.row},
      {robotPos.col})
    </p>

    <p>
      Crystal :
      {collectedCrystals.length}
      /
      {crystals.length}
    </p>

    <p>
      Portal :
      {
        portalUnlocked
          ? " 🟢 UNLOCKED"
          : " 🔴 LOCKED"
      }
    </p>

  </div>

  <div className="crystal-panel">

    <h3>ENERGY CRYSTAL</h3>

    {
      crystals.map(
        (crystal,index)=>{

          const collected =
            collectedCrystals.some(
              c =>
                c.row === crystal.row &&
                c.col === crystal.col
            );

          return (

            <p key={index}>

              {
                collected
                  ? "✅"
                  : "⬜"
              }

              {" "}
              Crystal {index+1}

            </p>

          );

        }
      )
    }

  </div>

</div>

      <Maze

        maze={maze}

        robotPos={robotPos}

        crystals={crystals}

        collectedCrystals={
          collectedCrystals
        }

      />

    </div>

  );

}

export default App;