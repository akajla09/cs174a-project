/*
	Defines AsteroidField and Asteroid
	Current implementation of asteroid (cube) adapted from learningwebgl.com

	TODO: change geometry of asteroid from cube to actual asteroid
	TODO: implement AsteroidField
*/


var vertices = [
    // Front face
    -1.0, -1.0,  1.0,
     1.0, -1.0,  1.0,
     1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
     1.0,  1.0,  1.0,
     1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
     1.0, -1.0, -1.0,
     1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
     1.0, -1.0, -1.0,
     1.0,  1.0, -1.0,
     1.0,  1.0,  1.0,
     1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0
];

var colors = [
	[1.0, 0.0, 0.0, 1.0], // white
    [1.0, 1.0, 0.0, 1.0], // red
    [0.0, 1.0, 0.0, 1.0], // green
    [1.0, 0.5, 0.5, 1.0], // blue
    [1.0, 0.0, 1.0, 1.0], // yellow
    [0.0, 0.0, 1.0, 1.0]  // purple
];

var cubeVertexIndices = [
    0, 1, 2,      0, 2, 3,    // Front face
    4, 5, 6,      4, 6, 7,    // Back face
    8, 9, 10,     8, 10, 11,  // Top face
    12, 13, 14,   12, 14, 15, // Bottom face
    16, 17, 18,   16, 18, 19, // Right face
    20, 21, 22,   20, 22, 23  // Left face
];

var normals = [];
var vertexBuffer, colorBuffer;

function Asteroid(asteroidIndex) {
	var cubeColors = [];
	var vertexBuffer, colorBuffer, indexBuffer;
	this.index = asteroidIndex;
	this.vertices = vertices;
	this.normals = normals;
	this.vertexBuffer = vertexBuffer;
	this.colorBuffer = colorBuffer;
	this.indexBuffer = indexBuffer;
	for (var i = 0; i < 6; i++) {
		var c = colors[i];
		for (var j = 0; j < 4; j++) { 
			cubeColors = cubeColors.concat(c);
		}
	}
	this.colors = cubeColors;
}

Asteroid.prototype.initBuffers = function(gl, shaderProgram) {	
	this.vertexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW);

	this.colorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.colors), gl.STATIC_DRAW);

	this.indexBuffer = gl.createBuffer();	
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);
	
}

Asteroid.prototype.draw = function(gl, shaderProgram) {
	gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, 4, gl.FLOAT, false, 0, 0);
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
	gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
}

