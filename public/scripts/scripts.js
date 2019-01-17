
///////////////////Event Listeners//////////////////
var weapons=document.getElementById("weapon_select");
var p_img=document.getElementById("player_hand");
weapons.addEventListener("change",function(){
  if(weapons.value=="")p_img.src="../images/ _waiting.svg";
  else p_img.src="../images/player_"+weapons.value+".png";
});
setTimeout(function(){document.getElementById("ref").src="../images/ref/two.svg";
document.getElementById("ref_text").innerHTML="Two!"}, 1000);
setTimeout(function(){document.getElementById("ref").src="../images/ref/one.svg";
document.getElementById("ref_text").innerHTML="One!"}, 2000);
setTimeout(function(){document.getElementById("ref").src="../images/ref/fist_bump.svg"
document.getElementById("ref_text").innerHTML="Shoot!"}, 3000);
setTimeout(function(){document.getElementById("ref").src="../images/ref/watch.svg";
document.getElementById("ref_text").innerHTML="You're taking too long!!!"}, 10000);


var villains=document.getElementById("villain_select");
var v_img = document.getElementById("villain_hand");
villains.addEventListener("change",function(){
  v_img.src="../images/"+villains.value+"_waiting.svg";
});

///////////////////Helper function//////////////////
