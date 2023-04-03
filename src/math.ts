import { Vector3, Quaternion, Line3, Matrix4 } from "three";

export function getLineTransform(from: Line3, to: Line3): Matrix4 {
  from = from.clone();
  to = to.clone();
  const fromVector = from.end.sub(from.start);
  const toVector = to.end.sub(to.start);
  const scale = toVector.length() / fromVector.length();
  const quaternion = new Quaternion().setFromUnitVectors(
    fromVector.normalize(),
    toVector.normalize()
  );
  return new Matrix4()
    .compose(to.start, quaternion, new Vector3(scale, scale, scale))
    .multiply(
      new Matrix4().makeTranslation(-from.start.x, -from.start.y, -from.start.z)
    );
}
