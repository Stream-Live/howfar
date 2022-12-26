/*
 * @Author: Wjh
 * @Date: 2022-12-25 23:27:55
 * @LastEditors: Wjh
 * @LastEditTime: 2022-12-26 13:50:23
 * @FilePath: \howfar\src\path-libs\MyPathGeometry.js
 * @Description:
 *
 */
import * as _ from "three";
import {
  BufferGeometry,
  Vector3,
  BufferAttribute
} from 'three'

class MyPathGeometry extends BufferGeometry {
  constructor(curve, divisions) {
    super();

    const vertices = [];


    const halfWidth = 0.5;
    const repeatY = 10;

    const up = new Vector3(0, 1, 0);
    const forward = new Vector3();
    const right = new Vector3();
    const left = new Vector3();

    const point = new Vector3();
    const prevPoint = new Vector3();
    prevPoint.copy(curve.getPointAt(0));

    const vector0 = new Vector3();
    const vector1 = new Vector3();
		let uv = [];

    let index = [];

    function extrudeShape(percent){
      
      vector0.copy(prevPoint);
      vector0.add(left);

      vector1.copy(prevPoint);
      vector1.add(right);

      vertices.push( vector0.x, vector0.y, vector0.z );
      vertices.push( vector1.x, vector1.y, vector1.z );

      uv = uv.concat([0, percent * repeatY, 1, percent * repeatY])
    }

    for (let i = 1; i <= divisions; i++) {
      let percent = i / divisions;
      point.copy(curve.getPointAt(percent));

      up.set(0, 1, 0);

      forward.subVectors(point, prevPoint).normalize();
      left.crossVectors(up, forward).normalize().multiplyScalar(halfWidth);
      right.copy(left).negate().normalize().multiplyScalar(halfWidth);
      up.crossVectors(forward, left);
      
      extrudeShape(percent);

			prevPoint.copy( point );
    }
    // extrudeShape();

    
    for(let i=0, len=vertices.length/3;i<len;i+=2){

      let p0 = i,
          p1 = i+1,
          p2 = (i+2) % len,
          p3 = (i+3) % len;
      
      index = index.concat([p0, p1, p3, p0, p3, p2]);
    }

		this.setAttribute( 'position', new BufferAttribute( new Float32Array( vertices ), 3 ) );
		this.setAttribute( 'uv', new BufferAttribute( new Float32Array( uv ), 2 ) );
    this.setIndex(index);
  
  }
}

export {
  MyPathGeometry
}
