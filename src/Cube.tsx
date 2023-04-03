import { Vector3, extend, Object3DNode, useFrame } from "@react-three/fiber";
import { useController } from "@react-three/xr";
import { useRef } from "react";
import { Mesh, MeshStandardMaterial } from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry";
import { TileState } from "./enums";
import { usePuzzleStore } from "./stores";

extend({ RoundedBoxGeometry });

declare module "@react-three/fiber" {
  interface ThreeElements {
    roundedBoxGeometry: Object3DNode<
      RoundedBoxGeometry,
      typeof RoundedBoxGeometry
    >;
  }
}

const K = 300;
const DRAG = 20;

const stateToMaterial = {
  [TileState.FILLED]: <meshStandardMaterial color={0x212121} />,
  [TileState.NOT_FILLED]: <meshStandardMaterial color={0xf8476b} />,
  [TileState.MAYBE]: <meshStandardMaterial color={0x8947f8} />,
  [TileState.UNKNOWN]: <meshStandardMaterial color={0xececec} />,
};

const boxGeometry = <roundedBoxGeometry args={[1, 1, 1, 6, 0.05]} />;

type Props = {
  coordinates: [number, number];
};

export default function Cube({ coordinates: [row, column] }: Props) {
  const defaultPosition: Vector3 = [row + 0.5, column + 0.5, 0];
  const velocity = useRef<number>(10);
  const mesh = useRef<Mesh>(null!);
  const leftController = useController("left");
  const rightController = useController("right");
  const tileState = usePuzzleStore((state) => state.grid[row][column]);
  const toggleTile = usePuzzleStore((state) => state.toggleTile);

  useFrame((_state, dt, _xr) => {
    const pos = mesh.current.position.z;
    const accel = -K * pos;
    const curVel = velocity.current;
    velocity.current = curVel / (1 + dt * DRAG) + accel * dt;
    mesh.current.position.z += curVel * dt;
    if (!handleIntersections()) {
      if (Math.abs(pos) < 0.005 && Math.abs(velocity.current) < 0.005) {
        mesh.current.position.z = 0;
        velocity.current = 0;
      }
    }
  });

  const contains = (point: THREE.Vector3): boolean => {
    const diff = point.clone().sub(mesh.current.position);
    return (
      Math.abs(diff.x) <= 0.5 &&
      Math.abs(diff.y) <= 0.5 &&
      Math.abs(diff.z) <= 0.5
    );
  };

  const getCollisionPoints = (): THREE.Vector3[] => {
    return [
      ...Object.values(leftController?.hand.joints ?? {}),
      ...Object.values(rightController?.hand.joints ?? {}),
      // @ts-ignore
    ].map((joint) => joint.position);
  };

  const handleIntersections = () => {
    const max = getCollisionPoints()
      .map((point) => mesh.current.parent!.worldToLocal(point.clone()))
      .reduce((max: number | undefined, point: THREE.Vector3) => {
        if (contains(point)) {
          if (max !== undefined) {
            return Math.max(max, point.z);
          } else {
            return point.z;
          }
        }
        return max;
      }, undefined);
    if (max !== undefined) {
      mesh.current.position.z = max + 0.5;
      velocity.current = 0;
      return true;
    }
    return false;
  };

  return (
    <mesh
      position={defaultPosition}
      ref={mesh}
      onClick={(event) => {
        velocity.current = 10;
        event.stopPropagation();
        toggleTile(row, column);
      }}
      onPointerEnter={(event) => {
        velocity.current = 3;
        event.stopPropagation();
      }}
    >
      {boxGeometry}
      {stateToMaterial[tileState]}
    </mesh>
  );
}
