/*
 * @Author: Wjh
 * @Date: 2022-12-25 23:27:55
 * @LastEditors: Wjh
 * @LastEditTime: 2022-12-25 23:40:33
 * @FilePath: \howfar\src\path-libs\MyPathGeometry.js
 * @Description:
 *
 */
import * as _ from "three";

class MyPathGeometry extends BufferGeometry {
  constructor(curve, divisions) {
    super();

    const vertices = [];

    const up = new Vector3(0, 1, 0);
    const forward = new Vector3();
    const right = new Vector3();
    const left = new Vector3();

    const point = new Vector3();
    const prevPoint = new Vector3();
    prevPoint.copy(curve.getPointAt(0));

    const vector1 = new Vector3();
    const vector2 = new Vector3();
    const vector3 = new Vector3();
    const vector4 = new Vector3();

    for (let i = 1; i <= divisions; i++) {
      point.copy(curve.getPointAt(i / divisions));

      up.set(0, 1, 0);

      forward.subVectors(point, prevPoint).normalize();
      right.crossVectors(up, forward).normalize().multiplyScalar(halfWidth);
      left.copy(right).negate().normalize().multiplyScalar(halfWidth);
      up.crossVectors(forward, right);
    }
  }
}
