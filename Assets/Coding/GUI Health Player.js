#pragma strict

var customSkin : GUISkin;
var playerScript : MoveShip;
var healthGUI : float;
var ammoGUI : int;
var energyGUI : int;
var nrgON : Texture2D;
var nrgOFF : Texture2D;

function Start () {

}

function Update () {

playerScript = gameObject.GetComponent("MoveShip");
healthGUI = playerScript.healthPlayer;
ammoGUI = playerScript.ammo;
energyGUI = playerScript.energy;

}

function OnGUI () {
        GUI.skin = customSkin;
        GUI.skin.box.alignment = TextAnchor.MiddleLeft;
		GUI.Box(Rect(20,20,150,40),"Životy : " + healthGUI.ToString());
		GUI.Box(Rect(190,20,150,40),"Náboje : " + ammoGUI.ToString());
		GUI.Box(Rect(360,20,210,40),"Energie : ");
		
		var y : int = 470;	
		for(var x : int = 0; x < energyGUI/2000; x++){
			
			GUI.Box(Rect(y,25, 14, 30),"");
			y += 20;
		}
    }
    
    function END (){
    		yield WaitForSeconds (2);
			
    
    }