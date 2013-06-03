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
	
	//normals for point light source
	pyramidVertexNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexNormalBuffer);
	
	var vertexNormals = [
	// Front face
	 0.0,  -0.9701,  .2425,
	 0.0,  -0.9701,  .2425,
	 0.0,  -0.9701,  .2425,
	// Right face
	 0.2154,  -0.9333,  .2871,
	 0.2154,  -0.9333,  .2871,
	 0.2154,  -0.9333,  .2871,
	//
	 0.2154,  0.9333,  .2871,
	 0.2154,  0.9333,  .2871,
	 0.2154,  0.9333,  .2871,
	// Back face
	 0.0,  0.9701,  .2325,
	 0.0,  0.9701,  .2325,
	 0.0,  0.9701,  .2325,
	// Left face
	 -.2154,  0.9333,  .2871,
	-.2154,  0.9333,  .2871,
	-.2154,  0.9333,  .2871,
	 // 
	 -0.2153,  -0.9333,  .2871,
	-0.2153,  -0.9333,  .2871,
	-0.2153,  -0.9333,  .2871,
	// Bottom Right cross products for this will be zero
	 0,0,0,
	 0,0,0,
	 0,0,0,
	// Bottom Left: 
	-.3162,  0.0,  0.9487,
	-.3162,  0.0,  0.9487,
	-.3162,  0.0,  0.9487,
	// Bottom
	 0,0,1,
	 0,0,1,
	 0,0,1,
	//
	0,0,1,
	0,0,1,
	 0,0,1
	];
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);
	
	pyramidVertexNormalBuffer.itemSize = 3;
	pyramidVertexNormalBuffer.numItems = 30;
        
        
}

Ship.prototype.draw = function(gl, shaderProgram) {
	gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, this.posBuffer.itemSize, gl.FLOAT, false, 0, 0);

	gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
	gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, this.colorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    //normals for the pyramid
    gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexNormalBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexNormalAttribute, pyramidVertexNormalBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    //ambient lighting
    gl.uniform3f(
	shaderProgram.ambientColorUniform,
	parseFloat(.2),
	parseFloat(.2),
	parseFloat(.2)
	);
	
	var lightingDirection = [
	parseFloat(-.25),
	parseFloat(-.25),
	parseFloat(-1)
	];
	var adjustedLD = vec3.create();
	vec3.normalize(lightingDirection, adjustedLD);
	vec3.scale(adjustedLD, -1);
	gl.uniform3fv(shaderProgram.lightingDirectionUniform, adjustedLD);
	
	gl.uniform3f(
	shaderProgram.directionalColorUniform,
	parseFloat(.8),
	parseFloat(.8),
	parseFloat(.8)
	);
    
    
    
    
	gl.drawArrays(gl.TRIANGLES, 0, this.posBuffer.numItems);
}
