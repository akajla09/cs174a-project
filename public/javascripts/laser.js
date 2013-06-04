/*
	Laser implementation
	Basic sphere implementation adapted from learningwebgl.com
*/

// Sphere complexity
var latitudeBands = 5;
var longitudeBands = 5;
var radius = 1;

function Laser() {
	this.vertices = [];
	this.indices = [];
	this.vertexBuffer;
	this.indexBuffer;
	this.bullets = [];
	this.lastFireTime = 0;

	// Generate vertices:
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

Laser.prototype.initBuffers = function(gl, shaderProgram) {
	this.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

	this.indexBuffer = gl.createBuffer();	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STREAM_DRAW);
}

Laser.prototype.draw = function(gl, shaderProgram) {
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);
}

Laser.prototype.shoot = function(vertRad, horizRad, cameraX, cameraY, cameraZ, laserID, myID) {
	// limit fire rate
	var currentTime = (new Date).getTime();
	if (currentTime - this.lastFireTime >= 200) {
		// initialize new bullet and add to array
		var bulletMatrix = mat4.create();
		mat4.identity(bulletMatrix);
		mat4.translate(bulletMatrix, bulletMatrix, [-cameraX, -cameraY, -cameraZ]);
		this.bullets.push([bulletMatrix, vertRad, horizRad, 0, laserID]);
		console.log({vertRad: vertRad, horizRad: horizRad});
		if(laserID === myID)
			this.lastFireTime = currentTime;
	}
}

Laser.prototype.removeBullets = function() {
	for (var i = 0; i < this.bullets.length; i++) {
		// Remove bullet if it has been alive for 15 ticks
		if (this.bullets[i][3] >= 100) {
			this.bullets.splice(i, 1);
		}
	}
}



/*
	Crosshair Implementation
*/

var crosshairVertices = [
	// top triangle
	0.0, 0.02, 0.0,
	0.005, 0.04, 0.0,
	-0.005, 0.04, 0.0,
	// left triangle
	-0.005, 0.0, 0.0,
	-0.03, 0.005, 0.0,
	-0.03, -0.005, 0.0,
	// bottom triangle
	0.0, -0.02, 0.0,
	-0.005, -0.04, 0.0,
	0.005, -0.04, 0.0,
	// right triangle
	0.005, 0.0, 0.0,
	0.03, 0.005, 0.0,
	0.03, -0.005, 0.0
];

function Crosshair() {
	this.vertexBuffer;
	this.vertices = crosshairVertices;
}

Crosshair.prototype.initBuffers = function(gl, shaderProgram) {
	this.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
}

Crosshair.prototype.draw = function(gl, shaderProgram) {
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	gl.drawArrays(gl.TRIANGLES, 0, 12);
}
