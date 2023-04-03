import { Billboard, Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { Mesh, Quaternion } from "three";

type Props = {
  number: number;
  coordinates: [number, number];
};

export default function Number({ number, coordinates: [row, column] }: Props) {
  const textRef = useRef<Mesh>(null!);
  useFrame(({ camera }) => {
    //   textRef.current.quaternion.w
    // const quat = new Quaternion().copy(camera.quaternion);
    // textRef.current.quaternion.copy(camera.quaternion);
    textRef.current.lookAt(camera.position);
    // textRef.current.quaternion.
  });
  return (
    <Text
      color="white"
      anchorX="center"
      anchorY="middle"
      position={[row + 0.5, column + 0.5, 0]}
      fontSize={1}
      letterSpacing={-0.05}
      lineHeight={1}
      material-toneMapped={false}
      ref={textRef}
      outlineWidth={"5%"}
      outlineColor="#000000"
      outlineOpacity={1}
    >
      {number.toString()}
    </Text>
  );
}
