#pragma strict

function Start () {

}

function Update () {
	transform.Rotate(Vector3.forward * Time.deltaTime * 1);
}