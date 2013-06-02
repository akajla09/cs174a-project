/*
	Ship implementation
	Pyramid implementation adapted from learningwebgl.com
*/

var size = 20;

function Ship() {
	this.posBuffer;
	this.colorBuffer;

	this.vertices = [
		// Front face
		 0.0,  0.0,  3.0,
		-1.0, -1.0, -1.0,
		 1.0, -1.0, -1.0,
		// Right face
		 0.0,  0.0,  3.0,
		 1.0, -1.0, -1.0,
		 4.0,  0.0,  0.0,
		//
		 0.0,  0.0,  3.0,
		 4.0,  0.0,  0.0,
		 1.0,  1.0, -1.0,
		// Back face
		 0.0,  0.0,  3.0,
		 1.0,  1.0, -1.0,
		-1.0,  1.0, -1.0,
		// Left face
		 0.0,  0.0,  3.0,
		-1.0,  1.0, -1.0,
		-4.0,  0.0,  0.0,		
		 // 
		 0.0,  0.0,  3.0,
		-4.0,  0.0,  0.0,
		-1.0, -1.0, -1.0,
		// Bottom Right
		 4.0,  0.0,  0.0,
		 1.0, -1.0, -1.0,
		 1.0, -1.0, -1.0,
		// Bottom Left
		-4.0,  0.0,  0.0,
		-1.0,  1.0, -1.0,
		-1.0, -1.0, -1.0,
		// Bottom
		 1.0, -1.0, -1.0,
		 1.0,  1.0, -1.0,
		-1.0, -1.0, -1.0,
		//
		-1.0, -1.0, -1.0,
		-1.0,  1.0, -1.0,
		 1.0, -1.0, -1.0
	];
	this.vertices = this.vertices.map(function(x) { return x * size; });

	this.colors = [
		// Front face
		1.0, 0.0, 0.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 1.0,
		// Right face
		1.0, 0.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
		// Back face
		1.0, 0.0, 0.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 1.0,
		// Left face
		1.0, 0.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
		// Left face
		1.0, 0.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
		// Left face
		1.0, 0.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
		// Back face
		1.0, 0.0, 0.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 1.0,
		// Left face
		1.0, 0.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
		// Left face
		1.0, 0.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
		// Left face
		1.0, 0.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 1.0,
		0.0, 1.0, 0.0, 1.0
	];
}

Ship.prototype.initBuffers = function(gl, shaderProgram) {
	this.posBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);
	this.posBuffer.itemSize = 3;
	this.posBuffer.numItems = 30;

	this.colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);
	this.colorBuffer.itemSize = 4;
	this.colorBuffer.numItems = 30;
}

Ship.prototype.draw = function(gl, shaderProgram) {
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.posBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.colorBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.drawArrays(gl.TRIANGLES, 0, this.posBuffer.numItems);
}