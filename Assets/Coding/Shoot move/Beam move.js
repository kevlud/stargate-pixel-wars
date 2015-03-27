#pragma strict
var timeDestroy : float = 3;
var applyDemage : float = 5;
var speed : int = 20;
function Start () {

}

function Update () {
	
	if(this.gameObject.tag == "PlayerShoot"){
		transform.Translate(-Vector2.right * speed * Time.deltaTime);
	}
	
	if(this.gameObject.tag == "EnemyShoot"){
		transform.Translate(Vector2.up * speed * Time.deltaTime);
	}
	
	StartCoroutine(CountDestroy());
	
	
}

function OnTriggerStay2D(coll: Collider2D) {
	if (coll.gameObject.tag == "Enemy"){
		coll.gameObject.SendMessage("ApplyDamage", applyDemage);
		if(this.name != "beam_Prefab(Clone)")
			Destroy(this.gameObject);
	}
	if (coll.gameObject.tag == "Player"){
		coll.gameObject.SendMessage("ApplyDamage", applyDemage);
		Destroy(this.gameObject);
	}
	
	Debug.Log("HIT");
}

function CountDestroy(){
	yield WaitForSeconds(timeDestroy);
	Destroy(this.gameObject);
	Debug.Log("TIMEOUT");

}