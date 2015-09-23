var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var mqtt = require('mqtt');

var options = {
  port: 1883,
  host: '192.168.1.100',
  clientId:'Node_mqtt_client_001'
};

client = mqtt.connect(options);


client.subscribe('/status');
client.on('message', function (topic, message) {
  console.log(message.toString());
  io.emit('chat message', message.toString());
});

 
app.get('/', function(req, res){
  res.sendFile(path.join(__dirname, 'index.html'));
});
 
io.on('connection', function(socket){
  console.log('a user connected');
 
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
    
  socket.on('cmd',function(msg){
  	var obj = JSON.parse(msg.toString());

  	var clientId = obj.clientId;
  	delete obj.clientId;
    console.log(msg.toString())
  	client.publish('/cmd/'+clientId,JSON.stringify(obj));
  });
 
});
 
app.set('port', process.env.PORT || 3000);
 
var server = http.listen(app.get('port'), function() {
  console.log('start at port:' + server.address().port);
});