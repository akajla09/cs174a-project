cs174a-project
==============

Group Members:
    Aditya Kajla,
    Greg Rivera,
    Alexander Leung,
    Kevin Tseng,


To setup locally:

(For OSX)

    brew install node
    npm install
    node app.js
    
(For Ubuntu/Mint)

    sudo apt-get update
    sudo apt-get install python-software-properties python g++ make
    sudo add-apt-repository ppa:chris-lea/node.js
    sudo apt-get update
    sudo apt-get install nodejs
    npm install
    node app.js
    
    *if you get missing package errors:
    npm install [package]
    
Site will be up at http://localhost:3000


Also available online at http://spaceasteroids.cloudapp.net/

GitHub repository link: https://github.com/akajla09/cs174a-project



Project Introduction:

We created a first-person space shooter game in which the player's objective 
is to destroy as many asteroids as possible. The game runs through any browser 
supporting WebGL. The backend is built using Node.js and keeps track of the 
objects in the world including asteroids, ships and lasers and updates clients 
with this information. With the central server, multiple players can join a 
game in the same world and compete against each other to destroy the same set of 
asteroids. Each client retrieves/updates positions of all objects in the world 
and draws them locally according to the local camera position.


Project Results:

The following are the required topics and how we implemented them into our 
project:

Transformations - The main game world utilizes a variety of transformations 
and shapes to implement the required objects. A field of random asteroids is 
created by instancing a low-complexity sphere (sphere implementation adapted 
from learningwebgl.com) and applying translation and scaling matrices to 
create a field of multiple asteroids. In addition, bullets from the laser 
utilize translations for movement animation.

Camera - The game is implemented from a first-person perspective where the 
user has control over manipulating the camera in order to move the ship around 
the world. Utilizing a variety of camera transformations (rotations & translations), 
we were able to implement a camera navigation system controllable via the keyboard.

Lighting - The game utilizes ambient and directional lighting (with a point source) to 
light the asteroid field and add the effect of a dim sun far away in space. The lighting 
implementation procedure is adapted from learningwebgl.com.

Textures - All asteroids have a common texture (image file) applied to them via the 
shaders in order to add color details and realism. The texture implementation 
procedure is adapted from learningwebgl.com.

WebGL - The entire game is implemented using WebGL and is served via a server running Node.js. 
We utilized two utility libraries: Google-webgl-utils and gl-matrix to help with 
animation utility functions and with vector and matrix abstractions. We utilized tutorials 
and examples from learningwebgl.com to help with our implementation.



Advanced Topics:

Collision Detection - We implemented a collision detection algorithm that 
utilizes each asteroid's scale and translations to compute an object volume for 
each asteroid. Then, a method continuously checks all bullet positions in the world 
against the object volumes to find a collision. If collisions are found, the respective 
asteroid and bullet are removed from the world and points are awarded to the player. The 
algorithm could be improved later on by defining more accurate object volumes utilizing 
a more complex sphere representation. However, the current algorithm is relatively efficient 
for use with upwards of 150+ asteroids.

Bump Mapping - We enabled bump mapping on the asteroids to give them more of a bumpy and 
uneven texture. The normals for each asteroid are first calculated normally (spherical) 
and then randomly perturbed to yield new random normals that give a bumpy texture when 
lit.

Physics - We added an acceleration element to our ship so that the player can speed up 
and slow down using the z and x keys. Without the keys being pressed, a moving ship slowly 
comes to a halt after decelerating.

Multiplayer - We utilize the server to keep track of objects in the world via their 
transformation matrices so that multiple players can play together. If one player destroys 
an asteroid, the asteroid array is updated and sent to the server which then sends the array 
to all other clients. This allows us to maintain consistency in the world and enable multiplayer.
The server could potentially be improved in the future and made more efficient to handle more 
object data.

