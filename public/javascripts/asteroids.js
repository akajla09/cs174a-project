/*
	Asteroid implementation
	Basic sphere & lighting implementation adapted from learningwebgl.com
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
	this.collisionArray = [];
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
	// Lighting elements
	gl.uniform1i(shaderProgram.useLightingUniform, 1);
	gl.uniform3f(shaderProgram.ambientColorUniform, 0.8, 0.8, 0.8);
	var lightingDirection = [50.0, 0.0, 0.0];
	var adjustedLD = vec3.create();
	vec3.normalize(adjustedLD, lightingDirection);
	vec3.scale(adjustedLD, adjustedLD, -1);
	gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);
	gl.uniform3f(shaderProgram.directionalColorUniform, 1.0, 1.0, 1.0);
	// Bind buffers
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordBuffer);
	gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, 2, gl.FLOAT, false, 0, 0);
	// Set texture
	gl.activeTexture(gl.TEXTURE0);
	gl.bindTexture(gl.TEXTURE_2D, texture);
	gl.uniform1i(shaderProgram.samplerUniform, 0);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
}

Asteroid.prototype.parseAsteroidField = function(data) {
	var asteroidArray = [];
	for (var i in data) {
		var asteroidMatrix = mat4.create();
		mat4.identity(asteroidMatrix);
		var randScale = vec3.fromValues(data[i].scale[0], data[i].scale[1], data[i].scale[2]);
		var randTrans = vec3.fromValues(data[i].coord[0], data[i].coord[1], data[i].coord[2]);
		mat4.translate(asteroidMatrix, asteroidMatrix, randTrans);
		mat4.scale(asteroidMatrix, asteroidMatrix, randScale);
		asteroidArray.push(asteroidMatrix);
		this.collisionArray.push({id: i, trans: randTrans, scale: randScale});
	}
	return asteroidArray;
}

Asteroid.prototype.checkCollisions = function(bulletIndex, bullets, bulletPos, asteroidArray, callback) {
	var score = 0;
	for (var i = 0; i < this.collisionArray.length; i++) {
		var trans = this.collisionArray[i].trans;
		var scale = this.collisionArray[i].scale;
		var xmin = trans[0] - 1.5 * scale[0];
		var xmax = trans[0] + 1.5 * scale[0];
		var ymin = trans[1] - 1.5 * scale[1];
		var ymax = trans[1] + 1.5 * scale[1];
		var zmin = trans[2] - 1.5 * scale[2];
		var zmax = trans[2] + 1.5 * scale[2];
		var bulletxmin = bulletPos[0] - 1.0;
		var bulletxmax = bulletPos[0] + 1.0;
		var bulletymin = bulletPos[1] - 1.0;
		var bulletymax = bulletPos[1] + 1.0;
		var bulletzmin = bulletPos[2] - 1.0;
		var bulletzmax = bulletPos[2] + 1.0;

		// bullet collided with asteroid
		if ((bulletxmin >= xmin && bulletxmax <= xmax) && (bulletymin >= ymin && bulletymax <= ymax) 
			&& (bulletzmin >= zmin && bulletzmax <= zmax))
		{
			// Remove asteroid & bullet
			score += 10;
			this.collisionArray.splice(i, 1);
			asteroidArray.splice(i, 1);
			bullets.splice(bulletIndex, 1);
			callback(this.collisionArray[i].id);
		}
	}
	return score;
}
