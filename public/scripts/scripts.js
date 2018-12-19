var player_name = localStorage.getItem("player_name");

if(!player_name){
  showOrNot(document.getElementById("enter_name"), true);
}else {
  updateNames(player_name);
  showOrNot(document.getElementById("throw_choice"), true);
}

///////////////////Event Listions//////////////////
toggleVisibility(document.getElementById("show_rules_button"), document.getElementById("rules"));
toggleVisibility(document.getElementById("show_stats_button"), document.getElementById("stats"));

document.getElementById("enter_name_button").addEventListener("click", function(){
  var p_name=document.getElementById("enter_name_input").value;
  var user_file=fs.readFileSync("data/users.csv", "utf8");

  var user_lines = user_file.split('\n');
  for(var i=1; i<user_lines.length-1; i++){
    var user_object={};
    var single_user = user_lines[i].trim().split(",");
    user_object["name"]=single_user[0];

    users_data.push(user_object);
  }

  showOrNot(document.getElementById("enter_name"), false);
  showOrNot(document.getElementById("throw_choice"), true);
  updateNames(p_name);
});

///////////////////Helper function//////////////////
function updateNames(name){
  var name_spots=document.getElementsByClassName("player_name_span");
  for(var i=0; i<name_spots.length;i++){
    console.log(name_spots[i]);
    name_spots[i].innerHTML = name;
  }
}

function showOrNot(div_element, show){
  if(show && div_element.classList.contains("hidden")){
    div_element.classList.remove("hidden");
    div_element.classList.add("visible");
  }else if(!show && div_element.classList.contains("visible")){
    div_element.classList.remove("visible");
    div_element.classList.add("hidden");
    }
}

function toggleVisibility(button_element, div_element){
  button_element.addEventListener("click", function(){
    if(div_element.classList.contains("hidden")){
      div_element.classList.remove("hidden");
      div_element.classList.add("visible");
    }else{
      div_element.classList.remove("visible");
      div_element.classList.add("hidden");
      }
  });
}
