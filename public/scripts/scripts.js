
///////////////////Event Listeners//////////////////
var villains=document.getElementById("villain_select");
var img = document.getElementById("villain_hand");
villains.addEventListener("change",function(){
  console.log(villains.value);
  console.log(img.src);
  img.src="../images/"+villains.value+"_waiting.svg";
  console.log(img.src);
});
///////////////////Helper function//////////////////
