#pragma strict
var healthPlayer : float = 100;
var ammo : int = 200;
var energy : int = 12000;
private var speed : float;
private var turnSpeed = 50;
private var MaxSpeedF     : float = 10;
private var MaxSpeedB     : float = -4;
var projectile : Transform;
var beam : Transform;
var missile : Transform;
var hardPoint : Transform;
private var gunFired : boolean = false;
private var beamFired : boolean = false;
var projectileSound : AudioClip;
var missileSound : AudioClip;
var beamSound : AudioClip;
var engineSound : AudioClip;
var impactSound : AudioClip;
var impactShieldSound : AudioClip;
private var anim : Animator;
private var shootingAudio: AudioSource; 
private var engineAudio: AudioSource;
private var impactAudio: AudioSource;
var customSkin : GUISkin;

function Start () {
    anim = GetComponent("Animator");
    var aSources = GetComponents(AudioSource);
    shootingAudio = aSources[0];
    engineAudio = aSources[1];
    impactAudio = aSources[2];
    impactAudio.clip = impactSound;
    engineAudio.clip = engineSound;
    engineAudio.loop = true;
    engineAudio.pitch = 0.9;
    engineAudio.Play();
}

function Update () {

	if(speed > 3)
		engineAudio.pitch = speed/5;
	else
		engineAudio.pitch = 0.9;
	
		
	if( anim.GetInteger("Move") != 2 && anim.GetInteger("Move") != 5 && anim.GetInteger("Move") != 6 )
		anim.SetInteger("Move",0);
	if (Input.GetKey(KeyCode.W)){
		if(anim.GetInteger("Move") != 2 && anim.GetInteger("Move") != 5 && anim.GetInteger("Move") != 6 )
			anim.SetInteger("Move",1);
		if(speed < MaxSpeedF)
            speed += Time.deltaTime * 10;
		if(speed > MaxSpeedF)
            speed -= Time.deltaTime * 10;
	}
	
	else if (Input.GetKey(KeyCode.S)){
		if(anim.GetInteger("Move") != 2 && anim.GetInteger("Move") != 5 && anim.GetInteger("Move") != 6 )
			anim.SetInteger("Move",1);
		if(speed < MaxSpeedF && speed > MaxSpeedB)
            speed -= Time.deltaTime * 5;
		if(speed > MaxSpeedF && speed < MaxSpeedB)
            speed += Time.deltaTime * 5;
	}
	
	else{
    if(speed > 12 * Time.deltaTime)
        speed = speed - 12 * Time.deltaTime;
    else if(speed < -12 * Time.deltaTime)
        speed = speed + 12 * Time.deltaTime;
    else
        speed = 0;
	}	
	
	transform.Translate(-Vector2.right * speed * Time.deltaTime);
	
	if (Input.GetKey(KeyCode.A)) {
		transform.Rotate(Vector3.forward * Time.deltaTime * turnSpeed);
    }
    if (Input.GetKey(KeyCode.D)) {
        transform.Rotate(-Vector3.forward * Time.deltaTime * turnSpeed);
    }
    
    if (Input.GetKey(KeyCode.H) && anim.GetInteger("Move") != 2){
		var camera = GameObject.FindGameObjectWithTag("MainCamera");
    	camera.transform.position.z = -200;
    	camera.gameObject.SendMessage("dump", 0.1);
    	turnSpeed = 20;
		anim.SetInteger("Move",4);
		energy-=20;
		if(energy < 1000){
			speed = 0;
			energy = 1000;}
		if(speed < 70)
            speed += Time.deltaTime * 60;
		if(speed > 70)
            speed -= Time.deltaTime * 60;
        if(energy < 1500){
        camera.transform.position.z = -80;
        }
	}
	
	// Hyperspace
	
	if (Input.GetKeyUp(KeyCode.H)){
            speed = 9.99;
            camera = GameObject.FindGameObjectWithTag("MainCamera");
    		camera.transform.position.z = -80;
    		camera.gameObject.SendMessage("dump", 1);
    		turnSpeed = 60;
    		
	}
	
	// Projectile Fire
    
    if (Input.GetKey(KeyCode.J) && !gunFired && ammo > 0) {
    	Instantiate (projectile, hardPoint.position,transform.rotation);
		ammo--;
		shootingAudio.clip = projectileSound;
		shootingAudio.Play();
    	StartCoroutine(GunFire(0.2));
    }
    
    // Asgard Beam
    
    if (Input.GetKey(KeyCode.K) && !beamFired && energy > 3000) {
    	Instantiate (beam, hardPoint.position,transform.rotation);
    	energy -=2000;
    	shootingAudio.clip = beamSound;
		shootingAudio.Play();
    	StartCoroutine(Beam(5));
    }
    
    // Missile	
    
    if (Input.GetKey(KeyCode.L) && !gunFired && ammo > 30) {
    	Instantiate (missile, hardPoint.position,transform.rotation);
    	ammo -=30;
    	shootingAudio.clip = missileSound;
    	shootingAudio.Play();
    	StartCoroutine(GunFire(3));
    }
    
    
    // Map zoom out
    
    if (Input.GetKeyDown(KeyCode.M)) {
    	camera = GameObject.FindGameObjectWithTag("MainCamera");
    	camera.transform.position.z = -200;
    }
    if (Input.GetKeyUp(KeyCode.M)) {
    	camera = GameObject.FindGameObjectWithTag("MainCamera");
    	camera.transform.position.z = -80;
    }  
}

function GunFire(timeWait : float)
{
   gunFired = true;
   yield WaitForSeconds(timeWait);
   gunFired = false;
}

function OnGUI(){
if(healthPlayer <= 0){
		GUI.skin = customSkin;
		GUI.skin.box.alignment = TextAnchor.MiddleCenter;
		GUI.Box(Rect(Screen.width/2 - 75,Screen.height/2 - 20,150,40),"KONEC HRY");
		if(GUI.Button(Rect(Screen.width/2 - 50,Screen.height/2 + 30,100,40),"Znovu !"))
			Application.LoadLevel(Application.loadedLevel);

		DestroyFunc();
	}

}

function DestroyFunc (){
	anim.SetInteger("Move",2);
	yield WaitForSeconds(2.1);
	Time.timeScale = 0;
}



function AddAmmo(addAmmo : int){
ammo +=addAmmo;
}

function Beam(timeWait : float)
{
   beamFired = true;
   yield WaitForSeconds(timeWait);
   beamFired = false;
}

function ApplyDamage(healthDecrease : int){

	if(energy > 500){
		anim.SetInteger("Move",5);
		energy -= healthDecrease *100;
		impactAudio.clip = impactShieldSound;
		impactAudio.Play();
		yield WaitForSeconds (1);
		anim.SetInteger("Move",0);
		
	}
	else if (healthPlayer != 0){
		healthPlayer -= healthDecrease;
		impactAudio.clip = impactSound;
		impactAudio.Play();
		anim.SetInteger("Move",6);
		yield WaitForSeconds (1);
		anim.SetInteger("Move",0);
	}
}

	
function OnTriggerEnter2D(coll: Collider2D) {
	
	if(coll.gameObject.CompareTag("EnemyShoot")){
		
	}

	if(coll.gameObject.CompareTag("Enemy")){
		speed = 0;
		healthPlayer -= 10;
		}
	else
		speed -= 1;
}