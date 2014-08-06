#pragma strict
var help : Texture2D;
var count = false;
var time : int;
function Start () {
	Time.timeScale = 0;
}

function Update () {

 time = Time.realtimeSinceStartup;
 

 if(time > 3){
 	count = true;
 	guiTexture.texture = help;
 	}
 	
 
 if(Input.GetKeyDown(KeyCode.Return) && count)
   {
         Time.timeScale = 1;
         this.gameObject.SetActive(false);
   }
}

