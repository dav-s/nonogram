import { OrbitControls, Stats } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Controllers, Hands, VRButton, XR } from "@react-three/xr";
import { useEffect } from "react";
import Cube from "./Cube";
import { coalesceToGrid } from "./helpers";
import PinchTransformer from "./PinchTransformer";
import Puzzle from "./Puzzle";
import PuzzleRunner from "./PuzzleRunner";
import { usePuzzleStore } from "./stores";

export default function GameScene() {
  //   const grid = coalesceToGrid([
  //     [0, 1, 1, 1, 0],
  //     [1, 0, 1, 0, 1],
  //     [0, 1, 1, 1, 0],
  //     [0, 1, 0, 1, 0],
  //     [1, 0, 0, 0, 1],
  //     [0, 1, 1, 1, 1],
  //   ]);

  const grid = coalesceToGrid([
    [1, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ]);

  const puzzle = Puzzle.fromGrid(grid);

  return (
    <>
      <VRButton />
      <Canvas camera={{ position: [-1, 2, -1] }}>
        <XR>
          <Stats />
          <color attach="background" args={[0xb9f2ff]} />
          <Controllers />
          <Hands />
          <OrbitControls target={[0, 1.5, 1.2]} />
          <gridHelper args={[20, 20]} />
          <pointLight position={[4, 3, -1]} />
          <ambientLight color={0xffffff} intensity={0.2} />
          <PinchTransformer>
            <group scale={[0.15, 0.15, 0.15]} position={[0.5, 2, 0.8]}>
              <PuzzleRunner
                puzzle={puzzle}
                onComplete={() => {
                  console.log("poggies");
                }}
              />
            </group>
          </PinchTransformer>
        </XR>
      </Canvas>
    </>
  );
}
