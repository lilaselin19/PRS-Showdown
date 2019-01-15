var express = require('express');
var fs = require('fs');
var favicon = require('serve-favicon');


var app = express();
app.use(express.static('public'));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(favicon(__dirname + '/public/images/logo.png'));

var port = process.env.PORT || 3000; //||8000
app.listen(port, function(){
  console.log('Easy server listening for requests on port '+ port+'!');
});

app.get('/', function(request, response){
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('index');
});

app.get('/login', function(request, response){
  //console.log('Login requested');
  var user_data={
      name: request.query.player_name,
      password: request.query.password
  };
  if(user_data["name"]==""){
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render('index');
  }

  var return_user=false;
  var correct_password=false;
  var user_file=fs.readFileSync("data/users.csv", "utf8");
  var user_lines = user_file.split('\n');
  for(var i=1; i<user_lines.length-1; i++){
    var single_user = user_lines[i].trim().split(",");
    if(user_data["name"]==single_user[0]){
      return_user=true;
      if(user_data["password"]==single_user[1]) correct_password=true;
      break;
    }
  }

  if(return_user==false){
    ////create new user
    //console.log("New user");
    user_file+=user_data["name"]+","+user_data["password"]+",0,0,0,0,0,0"+'\n';
    fs.writeFileSync("data/users.csv",user_file,"utf8");

    //move to next page
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render('login_game', {user:user_data});
  }

  else if(correct_password==false){
    ////ask for password again
    //console.log("Incorrect password");
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render('retry');
  }

  else{
    //move to next page
    //console.log("Returning player and password");
    response.status(200);
    response.setHeader('Content-Type', 'text/html')
    response.render('login_game', {user:user_data});
  }
});

app.get('/:user/game', function(request, response){
  var user_data={
    name: request.params.user
  };
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('game', {user:user_data});
});

app.get('/:user/results', function(request, response){
  var user_data={
      name: request.params.user,
      weapon: request.query.weapon,
      villain: request.query.villain,
  };

//finds player in csv file
  var user_file=fs.readFileSync("data/users.csv", "utf8");
  var user_lines = user_file.split('\n');
  var player;
  var p_index;
  for(var i=1; i<user_lines.length-1; i++){
    var single_user = user_lines[i].trim().split(",");
    if(user_data["name"]==single_user[0]){
      p_index=i;
      player = single_user;
      break;
    }
  }

//finds villain in csv file
  var v_hand;
  var villain;
  var v_index;
  var v_file=fs.readFileSync("data/villains.csv","utf8");
  var v_lines = v_file.split("\n");
  for(var i=1; i<v_lines.length-1; i++){
    var single_v = v_lines[i].trim().split(",");
    if(user_data["villain"]==single_v[0]){
      villain = single_v;
      v_index=i;
      //determines the villain's hand
      if(single_v[7]=="Random"){
        var r = Math.random();
        if(r<=.33)v_hand="paper";
        else if(r<=.66)v_hand="rock";
        else v_hand="scissors";
      }
      else if(single_v[7]=="Cheater"){
        if(user_data["weapon"]=="rock")v_hand="paper";
        else if(user_data["weapon"]=="scissors")v_hand="rock";
        else v_hand="scissors";
      }
      else if(single_v[7]=="Win Stats"){
        if(Math.max(player[5],player[6],player[7])==player[5])v_hand="scissors";
        else if(Math.max(player[5],player[6],player[7])==player[6])v_hand="paper";
        else if(Math.max(player[5],player[6],player[7])==player[7])v_hand="rock";
      }
      else if(single_v[7]=="Lose Stats"){
        if(Math.max(player[5],player[6],player[7])==player[5])v_hand="rock";
        else if(Math.max(player[5],player[6],player[7])==player[6])v_hand="scissors";
        else if(Math.max(player[5],player[6],player[7])==player[7])v_hand="paper";
      }
      else if(single_v[7]=="Tie Stats"){
        if(Math.max(player[5],player[6],player[7])==player[5])v_hand="paper";
        else if(Math.max(player[5],player[6],player[7])==player[6])v_hand="rock";
        else if(Math.max(player[5],player[6],player[7])==player[7])v_hand="scissors";
      }
      else if(single_v[7]=="No Ties"){
        var r = Math.random();
        var a = ["paper","rock","scissors"];
        a.splice(a.indexOf(user_data["weapon"]),1);
        if(r<.5) v_hand=a[0];
        else v_hand=a[1];
      }
      else if(single_v[7]=="Favors Scissors"){
        var r = Math.random();
        if(r<.5) v_hand="scissors";
        else if(r<.75) v_hand="rock";
        else v_hand="paper";
      }
    }
  }
  //sends file name of villain hand
  user_data["villain image"]=user_data["villain"]+"_"+v_hand+".svg";

  //sends text results of game
  if(user_data["weapon"]==v_hand) user_data["result"]="tied."
  else if(user_data["weapon"]=="paper"&&v_hand=="rock")user_data["result"]="won!"
  else if(user_data["weapon"]=="rock"&&v_hand=="scissors")user_data["result"]="won!"
  else if(user_data["weapon"]=="scissors"&&v_hand=="paper")user_data["result"]="won!"
  else user_data["result"]="lost."

  //updates player stats
  player[2]=parseInt(player[2])+1;
  if(user_data["result"]=="won!"){
    player[3]=parseInt(player[3])+1;}
  else if(user_data["result"]=="lost."){
    player[4]=parseInt(player[4])+1;}
  if(user_data["weapon"]=="paper"){
    player[5]=parseInt(player[5])+1;}
  else if(user_data["weapon"]=="rock"){
    player[6]=parseInt(player[6])+1;}
  else if(user_data["weapon"]=="scissors"){
    player[7]=parseInt(player[7])+1;}
  user_lines[p_index]=player.join(",");

  //compiles player stats updates
  user_file=user_lines.join('\n');
  fs.writeFileSync("data/users.csv",user_file,"utf8");

  //updates villain stats
  villain[1]=parseInt(villain[1])+1;
  if(user_data["result"]=="lost."){
    villain[2]=parseInt(villain[2])+1;}
  else if(user_data["result"]=="won!"){
    villain[3]=parseInt(villain[3])+1;}
  if(v_hand=="paper"){
    villain[4]=parseInt(villain[4])+1;}
  else if(v_hand=="rock"){
    villain[5]=parseInt(villain[5])+1;}
  else if(v_hand=="scissors"){
    villain[6]=parseInt(villain[6])+1;}
  v_lines[v_index]=villain.join(",");

  //compiles villain stats updates
  v_file=v_lines.join('\n');
  fs.writeFileSync("data/villains.csv",v_file,"utf8");

  //sends the response
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('results', {user:user_data});
});

app.get('/:user/rules', function(request, response){
  var this_user={
      name: request.params.user,
  }
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('rules',{user:this_user});
});

app.get('/:user/stats', function(request, response){
  var this_user={
      name: request.params.user,
  }
  var villains_data=[];
  //load the data from the csv
  var v_file=fs.readFileSync("data/villains.csv", "utf8");

  //parse the data from the csv into a non-string format
    var v_lines = v_file.split('\n');
    for(var i=1; i<v_lines.length-1; i++){
      var v_object={};
      var single_v = v_lines[i].trim().split(",");
      v_object["name"]=single_v[0];
      v_object["games played"]=parseInt(single_v[1]);
      v_object["games won"]=parseInt(single_v[2]);
      v_object["games lost"]=parseInt(single_v[3]);
      v_object["paper"]=parseInt(single_v[4]);
      v_object["rock"]=parseInt(single_v[5]);
      v_object["scissors"]=parseInt(single_v[6]);

      villains_data.push(v_object);
    }

  var users_data=[];
//load the data from the csv
  var user_file=fs.readFileSync("data/users.csv", "utf8");

//parse the data from the csv into a non-string format
  var user_lines = user_file.split('\n');
  for(var i=1; i<user_lines.length-1; i++){
    var user_object={};
    var single_user = user_lines[i].trim().split(",");
    user_object["name"]=single_user[0];
    user_object["games played"]=parseInt(single_user[2]);
    user_object["games won"]=parseInt(single_user[3]);
    user_object["games lost"]=parseInt(single_user[4]);
    user_object["paper"]=parseInt(single_user[5]);
    user_object["rock"]=parseInt(single_user[6]);
    user_object["scissors"]=parseInt(single_user[7]);

    users_data.push(user_object);
    if(single_user[0]==this_user["name"]) this_user=single_user[0]
  }

  users_data.sort(function(a,b){return b["games won"]-a["games won"]});
  villains_data.sort(function(a,b){return b["games won"]-a["games won"]});

  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('stats',{users:users_data, user:this_user, villains:villains_data});
});

app.get('/:user/about', function(request, response){
  var this_user={
      name: request.params.user,
  }
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('about',{user:this_user});
});
