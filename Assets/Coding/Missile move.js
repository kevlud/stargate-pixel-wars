#pragma strict
//var EnemyTrans : Transform;
var timeDestroy : float = 3;
var applyDemage : float = 5;
var speed : int = 20;
private var canTurn : boolean = false;
private var canTurnFirst : boolean = true;
function Start () {
	
}

function Update () {
	var enemyObject = GameObject.FindGameObjectWithTag("Enemy");
	var playerObject = GameObject.FindGameObjectWithTag("Player");
	var EnemyTrans = FindClosestEnemy().transform;
	var PlayerTrans = enemyObject.transform;
	
	var dir = EnemyTrans.position - transform.position;
	
	//var targetRotation = Quaternion.LookRotation(Vector3(0,0,1),dir);
	
	//transform.rotation = Quaternion.Slerp(transform.rotation, targetRotation, Time.deltaTime * 0.8);
	
	Rotate();
	
	if(canTurn && dir.magnitude < 170){
		var angle = Mathf.Atan2(dir.y, dir.x) * Mathf.Rad2Deg;
		angle -= 180;
		var nextRotation = Quaternion.AngleAxis(angle, Vector3.forward);
		transform.rotation = Quaternion.Slerp(transform.rotation, nextRotation, Time.deltaTime * 2);
		canTurn = false;
	}
	
	
	transform.Translate(-Vector2.right * 30 * Time.deltaTime);

	
	
	
	//StartCoroutine(CountDestroy());
	
	
}

function OnTriggerEnter2D(coll: Collider2D) {
	if (coll.gameObject.tag == "Enemy"){
		coll.gameObject.SendMessage("ApplyDamage", applyDemage);
		Destroy(this.gameObject);
	}
	if (coll.gameObject.tag == "Player"){
		coll.gameObject.SendMessage("ApplyDamage", applyDemage);
		Destroy(this.gameObject);
	}
	
	Debug.Log("HIT");
}

function Rotate(){
	yield WaitForSeconds(1);
	canTurn = true;
}


function FindClosestEnemy () : GameObject {
	// Find all game objects with tag Enemy
	var gos : GameObject[];
	gos = GameObject.FindGameObjectsWithTag("Enemy"); 
	var closest : GameObject; 
	var distance = Mathf.Infinity; 
	var position = transform.position; 
	// Iterate through them and find the closest one
	for (var go : GameObject in gos)  { 
		var diff = (go.transform.position - position);
		var curDistance = diff.sqrMagnitude; 
		if (curDistance < distance) { 
			closest = go; 
			distance = curDistance; 
		} 
	} 
	return closest;	
}

function CountDestroy(){
	yield WaitForSeconds(timeDestroy);
	Destroy(this.gameObject);
	Debug.Log("TIMEOUT");

}