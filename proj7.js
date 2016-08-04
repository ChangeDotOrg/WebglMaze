/*
 * CS435
 * Project#7
 * Hampton Brewer
 * 4/22/2016
 * Description:
 * The project creates a maze for the user to solve.
 * The user has completed the maze when they make it
 * to the big room. 
 * Using w,a,s,d the user is able to navigate the maze.
 * w moves forward
 * a looks left
 * s looks right
 * d moves backwards
 * 
 * I used texture mapping, translations,viewing,bump mapping,
 * environment,modeling,user interation, and also transformations
 */

//0 = forward, 1 = right, 2 = back, 3 = left
var direction = 0;
var moveForward = 0;
var moveSideToSide = 0;
var angleMoved = 0;

var canvas;
var gl;

var program;
var cBuffer;
var vColor;
var vBuffer;
var vPosition;
var tBuffer;
var vTexCoord;
var numVertices  = 24;
var texSize = 64;
var program;
var texture;


var verticesNum = 0;
var newPointsArray = [[]];

var pointsArray = [[]];
var colorsArray = [[]];
var texCoordsArray = [[]];

// keeps track of maze positions and array spots
var cubeNumber = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15];
var maze = [11,7,7,7,1,12,1,7,2,7,3,10,1,6,1,6,1,7,3,1,0,8,8,4,0,4,0,15,2,9,3,8];
var vertexCubeNumber = [];

var texCoord = [
                vec2(0, 0),
                vec2(0, 1),
                vec2(1, 1),
                vec2(1, 0)
            ];

var originalVertices = [
                        vec4(-0.5, -0.5,  1.5, 1.0),
                        vec4(-0.5,  0.5,  1.5, 1.0),
                        vec4(0.5,  0.5,  1.5, 1.0),
                        vec4(0.5, -0.5,  1.5, 1.0),
                        vec4(-0.5, -0.5, 0.5, 1.0),
                        vec4(-0.5,  0.5, 0.5, 1.0),
                        vec4(0.5,  0.5, 0.5, 1.0),
                        vec4( 0.5, -0.5, 0.5, 1.0) ]
var vertices = [[
                  vec4(-0.5, -0.5,  1.5, 1.0),
                  vec4(-0.5,  0.5,  1.5, 1.0),
                  vec4(0.5,  0.5,  1.5, 1.0),
                  vec4(0.5, -0.5,  1.5, 1.0),
                  vec4(-0.5, -0.5, 0.5, 1.0),
                  vec4(-0.5,  0.5, 0.5, 1.0),
                  vec4(0.5,  0.5, 0.5, 1.0),
                  vec4( 0.5, -0.5, 0.5, 1.0) ]]


var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // yellow
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // green
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // magenta
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // cyan
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
];


var near = 0.6;
var far = 6.0;
var radius = .5;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect;       // Viewport aspect ratio

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var eye;
const at = vec3(0.0, 0.0, 0.0);
const up = vec3(0.0, 1.0, 0.0);

function configureTexture( image ) {
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB,gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}


//helps with translations!
function moveBox(vertArray, newPos){
    var x = [];
    var y = [];
    var z = [];
    var newArr = []
    for(i = 0; i < vertArray.length; i++){
        x[i] = vertArray[i][0]+newPos[0];
        y[i] = vertArray[i][1]+newPos[1];
        z[i] = vertArray[i][2]+newPos[2];
        newArr.push(vec4(x[i],y[i],z[i],1));
    }
    return newArr
}

//creats vertex positions
function quad(a, b, c, d,e) {
     pointsArray[e].push(vertices[e][a]); 
     colorsArray[e].push(vertexColors[a]); 
     texCoordsArray[e].push(texCoord[0]);
     
     pointsArray[e].push(vertices[e][b]); 
     colorsArray[e].push(vertexColors[a]); 
     texCoordsArray[e].push(texCoord[1]);
     
     pointsArray[e].push(vertices[e][c]); 
     colorsArray[e].push(vertexColors[a]);  
     texCoordsArray[e].push(texCoord[2]);
     
     pointsArray[e].push(vertices[e][a]); 
     colorsArray[e].push(vertexColors[a]); 
     texCoordsArray[e].push(texCoord[0]);
     
     pointsArray[e].push(vertices[e][c]); 
     colorsArray[e].push(vertexColors[a]); 
     texCoordsArray[e].push(texCoord[2]);
     
     pointsArray[e].push(vertices[e][d]); 
     colorsArray[e].push(vertexColors[a]); 
     texCoordsArray[e].push(texCoord[3]);
}

/*
 * called by buildCube
 * builds the cube needed based on the switch
 */
function colorCube(a,whichCube)
{	
	//draw front - back
	switch(whichCube){
	case 0: //quad( 1, 0, 3, 2 ,whichCube); //front
		    //quad( 2, 3, 7, 6 ,a ); //right side
		    quad( 3, 0, 4, 7 ,a); //floor--------
		    quad( 6, 5, 1, 2 ,a); //top---------
		    //quad( 4, 5, 6, 7 ,whichCube); //back
		    quad( 5, 4, 0, 1 ,a); //left side
		    break;
	case 1:
			//quad( 1, 0, 3, 2 ); //front piece
		    //quad( 2, 3, 7, 6 ); //right side
			quad( 3, 0, 4, 7 ,a); //floor--------
			quad( 6, 5, 1, 2 ,a); //top----------
			quad( 4, 5, 6, 7 ,a); //back piece
			//quad( 5, 4, 0, 1 ,a); //left side
			break;
	case 2:
			//quad( 1, 0, 3, 2 ,whichCube); //front piece
		    quad( 2, 3, 7, 6 ,a ); //right side
		    quad( 3, 0, 4, 7 ,a); //floor---------
		    quad( 6, 5, 1, 2 ,a); //top---------
		    //quad( 4, 5, 6, 7 ,whichCube); //back piece
		    //quad( 5, 4, 0, 1 ,a); //left side
			break;
	case 3: 
			quad( 1, 0, 3, 2 ,a); //front
		    //quad( 2, 3, 7, 6 ,a ); //right
		    quad( 3, 0, 4, 7 ,a); //floor----------
		    quad( 6, 5, 1, 2 ,a); //top------------
		    //quad( 4, 5, 6, 7 ,whichCube); //back
		    //quad( 5, 4, 0, 1 ,a); //left
			break;
	case 4: 
			//quad( 1, 0, 3, 2 ,whichCube); //front
		    //quad( 2, 3, 7, 6 ,a ); //right
		    quad( 3, 0, 4, 7 ,a); //floor----------
		    quad( 6, 5, 1, 2 ,a); //top------------
		    quad( 4, 5, 6, 7 ,a); //back
		    quad( 5, 4, 0, 1 ,a); //left
		break;
	case 5: 
			//quad( 1, 0, 3, 2 ,whichCube); //front
		    quad( 2, 3, 7, 6 ,a ); //right
		    quad( 3, 0, 4, 7 ,a); //floor----------
		    quad( 6, 5, 1, 2 ,a); //top------------
		    quad( 4, 5, 6, 7 ,a); //back
		    //quad( 5, 4, 0, 1 ,a); //left
		break;
	case 6: 
			quad( 1, 0, 3, 2 ,a); //front
		    //quad( 2, 3, 7, 6 ,a ); //right
		    quad( 3, 0, 4, 7 ,a); //floor----------
		    quad( 6, 5, 1, 2 ,a); //top------------
		    quad( 4, 5, 6, 7 ,a); //back
		    //quad( 5, 4, 0, 1 ,a); //left
		break;
	case 7: 
			//quad( 1, 0, 3, 2 ,whichCube); //front
		    quad( 2, 3, 7, 6 ,a ); //right
		    quad( 3, 0, 4, 7 ,a); //floor----------
		    quad( 6, 5, 1, 2 ,a); //top------------
		    //quad( 4, 5, 6, 7 ,whichCube); //back
		    quad( 5, 4, 0, 1 ,a); //left
		break;
	case 8: 
			quad( 1, 0, 3, 2 ,a); //front
		    //quad( 2, 3, 7, 6 ,a ); //right
		    quad( 3, 0, 4, 7 ,a); //floor----------
		    quad( 6, 5, 1, 2 ,a); //top------------
		    //quad( 4, 5, 6, 7 ,whichCube); //back
		    quad( 5, 4, 0, 1 ,a); //left
		break;
	case 9: 
			quad( 1, 0, 3, 2 ,a); //front
		    quad( 2, 3, 7, 6 ,a ); //right
		    quad( 3, 0, 4, 7 ,a); //floor----------
		    quad( 6, 5, 1, 2 ,a); //top------------
		    //quad( 4, 5, 6, 7 ,whichCube); //back
		    //quad( 5, 4, 0, 1 ,a); //left
		break;
	case 10: 
			quad( 1, 0, 3, 2 ,a); //front
		    //quad( 2, 3, 7, 6 ,a ); //right
		    quad( 3, 0, 4, 7 ,a); //floor----------
		    quad( 6, 5, 1, 2 ,a); //top------------
		    quad( 4, 5, 6, 7 ,a); //back
		    quad( 5, 4, 0, 1 ,a); //left
		break;
	case 11: 
			quad( 1, 0, 3, 2 ,a); //front
		    quad( 2, 3, 7, 6 ,a ); //right
		    quad( 3, 0, 4, 7 ,a); //floor----------
		    quad( 6, 5, 1, 2 ,a); //top------------
		    //quad( 4, 5, 6, 7 ,whichCube); //back
		    quad( 5, 4, 0, 1 ,a); //left
		break;
	case 12: 
			quad( 1, 0, 3, 2 ,a); //front
		    quad( 2, 3, 7, 6 ,a ); //right
		    quad( 3, 0, 4, 7 ,a); //floor----------
		    quad( 6, 5, 1, 2 ,a); //top------------
		    quad( 4, 5, 6, 7 ,a); //back
		    //quad( 5, 4, 0, 1 ,a); //left
		break;
	case 13: 
			//quad( 1, 0, 3, 2 ,whichCube); //front
		    quad( 2, 3, 7, 6 ,a ); //right
		    quad( 3, 0, 4, 7 ,a); //floor----------
		    quad( 6, 5, 1, 2 ,a); //top------------
		    quad( 4, 5, 6, 7 ,a); //back
		    quad( 5, 4, 0, 1 ,a); //left
		break;
		
	case 14: 
		quad( 1, 0, 3, 2 ,a); //front
	    quad( 2, 3, 7, 6 ,a ); //right
	    quad( 3, 0, 4, 7 ,a); //floor----------
	    quad( 6, 5, 1, 2 ,a); //top------------
	    quad( 4, 5, 6, 7 ,a); //back
	    quad( 5, 4, 0, 1 ,a); //left
	break;
	case 15: 
		//quad( 1, 0, 3, 2 ,a); //front
	    //quad( 2, 3, 7, 6 ,a ); //right
	    quad( 3, 0, 4, 7 ,a); //floor----------
	    quad( 6, 5, 1, 2 ,a); //top------------
	    //quad( 4, 5, 6, 7 ,a); //back
	    //quad( 5, 4, 0, 1 ,a); //left
	break;
	default:
			break;
		
	}
}

/*
 * Used for creating the cube
 * It is a consolidation function call.
 * Takes the x and y for transformation
 * and also the length for a loop and the
 * previously used vertices array pos
 */

function buildCube(x,z,length,vertPos){
    for(j=0; j<length; j++){
    	verticesNum++;
	    pointsArray.push(new Array());
	    colorsArray.push(new Array());
	    texCoordsArray.push(new Array());
	    var trans = vec3(x,0,z);
	    var count = j;
	    vertices.push(moveBox(vertices[verticesNum-vertPos],trans));
	    colorCube(verticesNum,maze[verticesNum]);
	    vertexCubeNumber.push(maze[verticesNum]);
	   
    }
}


window.onload = function init() {

    canvas = document.getElementById( "gl-canvas" );
    
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    
    aspect =  canvas.width/canvas.height;
    
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    
    gl.enable(gl.DEPTH_TEST);
    

    //
    //  Load shaders and initialize attribute buffers
    //
    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    
    

    /*
     * all the calls to create each block
     */
    colorCube(verticesNum,maze[0]);
    vertexCubeNumber.push(maze[0]);
    pointsArray.push(new Array());
    colorsArray.push(new Array());
    texCoordsArray.push(new Array());
    
    /// params(x pos,z pos,#of loops,previous vertex position - 1)
    buildCube(0,-1,3,1);
    buildCube(0,-1,1,1);
    buildCube(1,0,1,1);
    buildCube(-1,0,1,2);
    buildCube(0,1,4,1);
    buildCube(-1,0,1,1);
    buildCube(0,-1,4,1);
    buildCube(-1,0,1,1);
    buildCube(0,1,4,1);
    buildCube(-1,0,1,1);
    buildCube(0,-1,4,1);
    buildCube(0,1,1,5);
    buildCube(1,0,2,1);
    buildCube(0,1,1,1);
    buildCube(-1,0,2,1);
    

    
    
    
    cBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );
    
    vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    vBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );
    
    vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
    
    tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );
    
    vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );
    
    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" );
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" );

// buttons for viewing parameters
/*
    document.getElementById("Button1").onclick = function(){near  *= 1.1; far *= 1.1;console.log(near + ' ' +far);};
    document.getElementById("Button2").onclick = function(){near *= 0.9; far *= 0.9;console.log(near + ' ' +far);};
    document.getElementById("Button3").onclick = function(){radius += 0.2;console.log(radius);};
    document.getElementById("Button4").onclick = function(){radius -= 0.2;console.log(radius);};
    document.getElementById("Button5").onclick = function(){theta += dr; console.log(theta);};
    document.getElementById("Button6").onclick = function(){theta -= dr; console.log(theta); };
    document.getElementById("Button7").onclick = function(){phi += dr;};
    document.getElementById("Button8").onclick = function(){phi -= dr;};
    /*
    document.getElementById("btnMove").onclick = function(){moveForward = .1;};
    */
    
    var image = document.getElementById("brickImage");    
    configureTexture( image );
    render(); 
}

/*
 * onkeycalls for moving user through maze
 */
document.onkeydown = function(e){
	if(e.keyCode === 68){ //right
		theta -= dr;
		//console.log(theta);
		direction += 1;
		if(direction > 71){
			direction = 0;
		}
		console.log(direction);
	}
	else if(e.keyCode === 83){//down
		if(direction > -5 && direction < 5 || direction < -66 || direction >66){
			moveForward -= .1;
		}
		else if(direction > 31 && direction < 41 || direction < -31 && direction > -41){
			moveForward += .1;
		}
		else if(direction > 13 && direction < 23 || direction < -49 && direction > -59){
			moveSideToSide += .1;
		}
		else if(direction < -13 && direction > -23 || direction > 49 && direction < 59){
			moveSideToSide -= .1;
		}
		
	}
	else if(e.keyCode === 65){//left
		theta += dr;
		direction -= 1;
		if(direction < -71){
			direction = 0;
		}
		console.log(direction);
	}
	else if(e.keyCode === 87){//up
		if(direction > -5 && direction < 5 || direction < -66 || direction >66){
			moveForward += .1;
		}
		else if(direction > 31 && direction < 41 || direction < -31 && direction > -41){
			moveForward -= .1;
		}
		else if(direction > 13 && direction < 23 || direction < -49 && direction > -59){
			moveSideToSide -= .1;
		}
		else if(direction < -13 && direction > -23 || direction > 49 && direction < 59){
			moveSideToSide += .1;
		}
		/*else if(direction <= -5 && direction >= 13 || direction >= -66 || direction <= -59){
			
		}*/
	}
	else if(e.keyCode === 39){
		moveSideToSide -=.1;
	}
	else if(e.keyCode === 37){
		moveSideToSide += .1;
	}
}
document.onkeyup = function(e){
	if(e.keyCode === 68 || e.keyCode === 39){ //right
	}
	else if(e.keyCode === 83 || e.keyCode === 40){ //down
	}
	else if(e.keyCode === 65 || e.keyCode === 37){ //left
	}
	else if(e.keyCode === 87 || e.keyCode === 38){  //up
	}
}

var render = function(){
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            
    eye = vec3(radius*Math.sin(theta)*Math.cos(phi), 
        radius*Math.sin(theta)*Math.sin(phi), radius*Math.cos(theta));
    modelViewMatrix = lookAt(eye, at , up);
    projectionMatrix = perspective(fovy, aspect, near, far);
    
    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );
    
    
    /*
     * loops through 2d array
     * does a translation to see if moving or not
     * values globally updated, so if so the character moves
     */
    for(j=0; j<pointsArray.length; j++){
    	
    	var trans = vec3(moveSideToSide,0,moveForward);
        pointsArray[j] = moveBox(pointsArray[j],trans);
        
        
    	var vertNum;
    	gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray[j]), gl.STATIC_DRAW );
        gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray[j]), gl.STATIC_DRAW );
        gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
        gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray[j]), gl.STATIC_DRAW );

        if(vertexCubeNumber[j]<4){
        	vertNum = 18;
        	//console.log('hey');
        }
        else if(vertexCubeNumber[j] == 15){
        	vertNum = 12;
        }
        else if(vertexCubeNumber[j]>9){
        	vertNum = 30;
        	//console.log(vertexCubeNumber[i]);
        }
        else{
        	vertNum = 24;
        }
        gl.drawArrays( gl.TRIANGLES, 0, vertNum );
    }
    
    if(moveForward != 0){
		moveForward = 0;
	}
    if(moveSideToSide != 0){
    	moveSideToSide = 0;
    }
    /*
    
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArrayRight), gl.STATIC_DRAW );
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArrayRight), gl.STATIC_DRAW );
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArrayRight), gl.STATIC_DRAW );
    
    gl.drawArrays( gl.TRIANGLES, 0, numVertices );*/
    requestAnimFrame(render);
}
