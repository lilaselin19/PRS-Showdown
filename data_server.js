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
      weapon: request.query.weapon
  };
  var user_file=fs.readFileSync("data/users.csv", "utf8");
  var user_lines = user_file.split('\n');
  for(var i=1; i<user_lines.length-1; i++){
    var single_user = user_lines[i].trim().split(",");
    if(user_data["name"]==single_user[0]){
      single_user[2]=parseInt(single_user[2])+1;
      if(user_data["weapon"]=="paper"){
        single_user[5]=parseInt(single_user[5])+1;}
      if(user_data["weapon"]=="rock"){
        single_user[6]=parseInt(single_user[6])+1;}
      if(user_data["weapon"]=="scissors"){
        single_user[7]=parseInt(single_user[7])+1;}
      user_lines[i]=single_user.join(",");
      break;
    }
  }
  user_file=user_lines.join('\n');

  fs.writeFileSync("data/users.csv",user_file,"utf8");

  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('results');
});

app.get('/rules', function(request, response){
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('rules');
});

app.get('/:user/stats', function(request, response){
  var this_user={
      name: request.params.user,
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
  }

  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('stats',{users:users_data});
});
app.get('/about', function(request, response){
  response.status(200);
  response.setHeader('Content-Type', 'text/html')
  response.render('about');
});
