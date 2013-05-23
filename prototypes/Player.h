#include "SpaceObject.h"

const int LIFE   = 1;
const int HEALTH = 2;

class Player : SpaceObject
{
	private:
		unsigned int m_health;
		unsigned int m_lives;
		unsigned int receiveDmg(const unsigned int dmg);
		unsigned int receivePowerUp(const int type);
		
	public:
		unsigned int getHealth();
		unsigned int getLives();
		bool intersectsPlayer();
		bool intersectsBullet();
		bool intersectsPowerUp();

};

//These are just some notes I wanted to write down, we don't have to use this
//So every display we have to check if bullets are hitting rocks and if rocks
//are hitting players and if players are hitting each other.


//A piece of logic would be responsible for instantiating these objects,
//managing them, and drawing them in WebGL.

//Just some thoughts I wanted to commit to make sure I get the application
//we are trying to build.