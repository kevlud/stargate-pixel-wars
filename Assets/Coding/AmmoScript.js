#pragma strict

function Start () {

}

function Update () {

}

function OnTriggerEnter2D(coll: Collider2D) {
	if (coll.gameObject.tag == "Player"){
		coll.gameObject.SendMessage("AddAmmo", 50);
		Destroy(this.gameObject);
	}
}