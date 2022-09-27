import {
	BufferAttribute,
	BufferGeometry,
	Quaternion,
	Raycaster,
	Vector3
} from 'three';
class TheGeometry extends BufferGeometry {

  constructor( curve, divisions ) {

		super();

		const vertices = [];
		const normals = [];
		const uv = [];
		const colors = [];

		const color1 = [ 1, 0, 1 ];
		const color2 = [ 1, 1, 0 ];
    const halfWidth = 0.5;

		const up = new Vector3( 0, 1, 0 );
		const forward = new Vector3();
		const right = new Vector3();
		const left = new Vector3();

		const quaternion = new Quaternion();
		const prevQuaternion = new Quaternion();
		prevQuaternion.setFromAxisAngle( up, Math.PI / 2 );

		const point = new Vector3();
		const prevPoint = new Vector3();
		prevPoint.copy( curve.getPointAt( 0 ) );
    let preUvIndex = 0;
    let uvIndex = 0;

		// shapes

		const step = [
			new Vector3( - 0.225, 0, 0 ),
			new Vector3( 0, - 0.050, 0 ),
			new Vector3( 0, - 0.175, 0 ),

			new Vector3( 0, - 0.050, 0 ),
			new Vector3( 0.225, 0, 0 ),
			new Vector3( 0, - 0.175, 0 )
		];

		const PI2 = Math.PI * 2;


		const vector = new Vector3();
		const normal = new Vector3();


		const vector1 = new Vector3();
		const vector2 = new Vector3();
		const vector3 = new Vector3();
		const vector4 = new Vector3();

		const normal1 = new Vector3();
		const normal2 = new Vector3();
		const normal3 = new Vector3();
		const normal4 = new Vector3();

		function extrudeShape( left, right, uvIndex) {

      vector1.copy(prevPoint);
      vector1.add(left);

      vector2.copy(prevPoint);
      vector2.add(right);

      vector3.copy(point);
      vector3.add(left);

      vector4.copy(point);
      vector4.add(right);

      vertices.push( vector1.x, vector1.y, vector1.z );
      vertices.push( vector4.x, vector4.y, vector4.z );
      vertices.push( vector2.x, vector2.y, vector2.z );

      vertices.push( vector1.x, vector1.y, vector1.z );
      vertices.push( vector3.x, vector3.y, vector3.z );
      vertices.push( vector4.x, vector4.y, vector4.z );


      normals.push( up.x, up.y, up.z );
      normals.push( up.x, up.y, up.z );
      normals.push( up.x, up.y, up.z );

      normals.push( up.x, up.y, up.z );
      normals.push( up.x, up.y, up.z );
      normals.push( up.x, up.y, up.z );
      
      uv.push( 0, preUvIndex );
      uv.push( 1, uvIndex );
      uv.push( 1, preUvIndex );

      uv.push( 0, preUvIndex );
      uv.push( 0, uvIndex );
      uv.push( 1, uvIndex );

		}

		const offset = new Vector3();


		for ( let i = 1; i <= divisions; i ++ ) {

			point.copy( curve.getPointAt( i / divisions ) );

			up.set( 0, 1, 0 );

			forward.subVectors( point, prevPoint ).normalize();
			right.crossVectors( up, forward ).normalize().multiplyScalar(halfWidth);
			left.copy(right).negate().normalize().multiplyScalar(halfWidth);
			up.crossVectors( forward, right );

			const angle = Math.atan2( forward.x, forward.z );

			quaternion.setFromAxisAngle( up, angle );

      let uvIndex = i % 20 / 19;

			extrudeShape( left, right, uvIndex );

			prevPoint.copy( point );
			prevQuaternion.copy( quaternion );
      preUvIndex = uvIndex;

		}

		this.setAttribute( 'position', new BufferAttribute( new Float32Array( vertices ), 3 ) );
		this.setAttribute( 'normal', new BufferAttribute( new Float32Array( normals ), 3 ) );
		this.setAttribute( 'uv', new BufferAttribute( new Float32Array( uv ), 2 ) );
		// this.setAttribute( 'color', new BufferAttribute( new Float32Array( colors ), 3 ) );

	}
}


export {
  TheGeometry
}