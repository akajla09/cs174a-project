#include "SpaceObject.h"

class Player : SpaceObject
{
	private:
		unsigned int m_health;
		unsigned int m_speed;
		unsigned int receiveDmg(const unsigned int dmg);
		
		
	public:
		unsigned int getHealth();
		

};