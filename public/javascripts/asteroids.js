/*
	Asteroid implementation
	Sphere implementation adapted from learningwebgl.com
*/

function Asteroid(asteroidIndex, latitudeBands, longitudeBands, radius) {
	this.vertices = [];
	this.normals = [];
	this.textureCoords = [];
	this.indices = [];
	this.vertexBuffer;
	this.normalBuffer;
	this.textureCoordBuffer;
	this.indexBuffer;
	// Generate vertices, normals and texture coords:
	for (var latNum = 0; latNum <= latitudeBands; latNum++) {
		var theta = latNum * Math.PI / latitudeBands;
		var sinTheta = Math.sin(theta);
		var cosTheta = Math.cos(theta);
		
		for (var longNum = 0; longNum <= longitudeBands; longNum++) {
			var phi = longNum * 2 * Math.PI / longitudeBands;
			var sinPhi = Math.sin(phi);
			var cosPhi = Math.cos(phi);
			var x = cosPhi * sinTheta;
			var y = cosTheta;
			var z = sinPhi * sinTheta;
			var u = 1 - (longNum / longitudeBands);
			var v = latNum / latitudeBands;
			this.normals.push(x);
			this.normals.push(y);
			this.normals.push(z);
			this.textureCoords.push(u);
			this.textureCoords.push(v);
			this.vertices.push(radius * x);
			this.vertices.push(radius * y);
			this.vertices.push(radius * z);
		}
	}
	
	for (var latNum = 0; latNum < latitudeBands; latNum++) {
		for (var longNum = 0; longNum < longitudeBands; longNum++) {
			var first = (latNum * (longitudeBands + 1)) + longNum;
			var second = first + longitudeBands + 1;
			this.indices.push(first);	
			this.indices.push(second);
			this.indices.push(first + 1);
			this.indices.push(second);
			this.indices.push(second + 1);
			this.indices.push(first + 1);
		}
	}
}

Asteroid.prototype.initBuffers = function(gl, shaderProgram) {
	this.normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);
	
	this.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

	this.textureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.textureCoords), gl.STATIC_DRAW);

	this.indexBuffer = gl.createBuffer();	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STREAM_DRAW);
	
}

Asteroid.prototype.draw = function(gl, shaderProgram, texture) {
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	/*gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);*/
	gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
}

// returns array of random transformation matrices that are used to draw multiple asteroids
Asteroid.prototype.createAsteroidField = function(numAsteroids) {
	var asteroidArray = [];
	for (var i = 0; i < numAsteroids; i++) {
		var asteroidMatrix = mat4.create();
		mat4.identity(asteroidMatrix);
		// random scale vector:
		var randScale = vec3.fromValues((4.5 * Math.random()) + 1.5, (4.5 * Math.random()) + 1.5, (4.5 * Math.random()) + 1.5);
		// random translation vector:
		var randx = Math.random() * 70.0 * (Math.random() < 0.5 ? -1 : 1);
		var randy = Math.random() * 70.0 * (Math.random() < 0.5 ? -1 : 1);
		var randz = Math.random() * 70.0 * (Math.random() < 0.5 ? -1 : 1);
		var randTrans = vec3.fromValues(randx, randy, randz);
		mat4.scale(asteroidMatrix, asteroidMatrix, randScale);
		mat4.translate(asteroidMatrix, asteroidMatrix, randTrans);
		asteroidArray.push(asteroidMatrix);
	}
	return asteroidArray;
}

