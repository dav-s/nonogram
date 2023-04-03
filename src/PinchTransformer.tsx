import { useFrame } from "@react-three/fiber";
import { useController } from "@react-three/xr";
import { PropsWithChildren, useRef } from "react";
import { Group, Line3, Matrix4, Vector3, XRHandSpace } from "three";
import { getLineTransform } from "./math";

type Props = {};

export default function PinchTransformer({
  children,
}: PropsWithChildren<Props>) {
  const transformer = useRef<Group>(null!);
  const pinchState = useRef({
    leftPinched: false,
    rightPinched: false,
    leftStart: new Vector3(),
    rightStart: new Vector3(),
    transformStart: new Matrix4(),
  });
  const leftController = useController("left");
  const leftHand = leftController?.hand;
  const rightController = useController("right");
  const rightHand = rightController?.hand;

  const getIndexPosition = (hand?: XRHandSpace): Vector3 => {
    // @ts-ignore
    const joint: Group = hand?.joints["index-finger-tip"];
    return (joint?.position ?? new Vector3()).clone();
  };

  const recordHandState = () => {
    pinchState.current.leftStart.copy(getIndexPosition(leftHand));
    pinchState.current.rightStart.copy(getIndexPosition(rightHand));
    pinchState.current.transformStart.copy(transformer.current.matrix);
  };

  leftHand?.addEventListener("pinchstart", () => {
    pinchState.current.leftPinched = true;
    recordHandState();
  });
  leftHand?.addEventListener("pinchend", () => {
    pinchState.current.leftPinched = false;
    recordHandState();
  });
  rightHand?.addEventListener("pinchstart", () => {
    pinchState.current.rightPinched = true;
    recordHandState();
  });
  leftHand?.addEventListener("pinchend", () => {
    pinchState.current.rightPinched = false;
    recordHandState();
  });

  useFrame(() => {
    const currentLeft = getIndexPosition(leftHand);
    const currentRight = getIndexPosition(rightHand);
    const state = pinchState.current;
    if (state.leftPinched && state.rightPinched) {
      transformer.current.matrix.multiplyMatrices(
        getLineTransform(
          new Line3(state.leftStart, state.rightStart),
          new Line3(currentLeft, currentRight)
        ),
        state.transformStart
      );
    } else if (state.leftPinched) {
      const diff = new Vector3().subVectors(currentLeft, state.leftStart);
      transformer.current.matrix.multiplyMatrices(
        new Matrix4().makeTranslation(diff.x, diff.y, diff.z),
        state.transformStart
      );
    } else if (state.rightPinched) {
      const diff = new Vector3().subVectors(currentRight, state.rightStart);
      transformer.current.matrix.multiplyMatrices(
        new Matrix4().makeTranslation(diff.x, diff.y, diff.z),
        state.transformStart
      );
    }
  });

  return (
    <group ref={transformer} matrixAutoUpdate={false}>
      {children}
    </group>
  );
}
