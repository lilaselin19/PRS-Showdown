
///////////////////Event Listeners//////////////////
var weapons=document.getElementById("weapon_select");
var p_img=document.getElementById("player_hand");
weapons.addEventListener("change",function(){
  if(weapons.value=="")p_img.src="../images/ _waiting.svg";
  else p_img.src="../images/player_"+weapons.value+".png";
});

var villains=document.getElementById("villain_select");
var v_img = document.getElementById("villain_hand");
villains.addEventListener("change",function(){
  v_img.src="../images/"+villains.value+"_waiting.svg";
});

///////////////////Helper function//////////////////