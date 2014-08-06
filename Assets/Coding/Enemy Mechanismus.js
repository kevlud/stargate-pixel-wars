#pragma strict
var healthEnemy : int = 100;
var EnemyName : String;
//var enemyObject = gameObject;
var EnemyTrans : Transform;
var energy = 10000;
private var DistanceFromPlayer : float;
var projectile : Transform;
var hardPoint : Transform;
private var gunFired : boolean = false;
var fireRate : float;
var projectileSound : AudioClip;
var missileSound : AudioClip;
var impactSound : AudioClip;
var impactShieldSound : AudioClip;
private var anim : Animator;
private var shootingAudio: AudioSource; 
private var engineAudio: AudioSource;
private var impactAudio: AudioSource;

function Start () {
anim = GetComponent("Animator");
//var enemyObject = GameObject.FindGameObjectWithTag("Player");
//EnemyTrans = enemyObject.transform;
var aSources = GetComponents(AudioSource);
    shootingAudio = aSources[0];
    engineAudio = aSources[1];
    impactAudio = aSources[2];
    
    impactAudio.clip = impactSound;
    shootingAudio.clip = projectileSound;
}

function Update () {

	if( energy != 11000)
			energy+= 2;
	if(healthEnemy <= 0){
		DestroyThis();

	}
	
	if(anim.GetInteger("Move") != 2 && anim.GetInteger("Move") != 6 )
		anim.SetInteger("Move",0);
	var dir = EnemyTrans.position - transform.position;
	DistanceFromPlayer = dir.magnitude;	
		
	var hit: RaycastHit2D = Physics2D.Raycast(transform.position, Vector2.right);
	
	if (hit.collider != null) {
		if(hit.collider.CompareTag(EnemyName))
		{			
		  Debug.Log("Zaměřuji: " + hit.transform.name);			  								
		  EnemyTrans = hit.transform;
		}
	}
	
	if(EnemyTrans && DistanceFromPlayer < 50)
     {
		var targetRotation = Quaternion.LookRotation(Vector3.forward, EnemyTrans.position - transform.position);
		transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, Time.deltaTime * 0.8);
 		
		if (!gunFired && energy > 50) {
	    	Instantiate (projectile, hardPoint.position,transform.rotation);
	    	
	    	shootingAudio.Play();
	    	energy -=50;
	    	StartCoroutine(GunFire());
	    } 


     }
     if(EnemyTrans && DistanceFromPlayer < 150 && DistanceFromPlayer > 40)
     {
     	if(anim.GetInteger("Move") != 2 && anim.GetInteger("Move") != 6 )
     		anim.SetInteger("Move",1);
     	targetRotation = Quaternion.LookRotation(Vector3.forward, EnemyTrans.position - transform.position);
		transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, Time.deltaTime * 0.5);
		transform.Translate(Vector2.up * 4 * Time.deltaTime);
     }

}

function ApplyDamage(healthDecrease : int){
	
	if(energy > 500){
		anim.SetInteger("Move",6);
		energy -= healthDecrease *100;
		impactAudio.clip = impactShieldSound;
		impactAudio.Play();
		yield WaitForSeconds (1);
		anim.SetInteger("Move",0);
		
	}
	else if (healthEnemy != 0){
		healthEnemy -= healthDecrease;
		impactAudio.clip = impactSound;
		impactAudio.Play();
		anim.SetInteger("Move",0);
		yield WaitForSeconds (1);
		anim.SetInteger("Move",0);
	}
}

function OnTriggerEnter2D(coll: Collider2D){
	if(coll.gameObject.CompareTag("Player"))
		healthEnemy -= 10;
	
	if(coll.gameObject.CompareTag("PlayerShoot")){
		impactAudio.Play();
	}
}

function DestroyThis(){

anim.SetInteger("Move",2);
		yield WaitForSeconds(1.8);
		Destroy(this.gameObject);
		}

function GunFire()
{
   gunFired = true;
   yield WaitForSeconds(fireRate);
   gunFired = false;
}