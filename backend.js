var express = require('express');
var app = express();
var http = require('http');
var cors = require('cors')
var server = http.createServer(app);
var bodyParser = require('body-parser')
app.use(cors())
const spawn = require("child_process").spawn;
var lineReader = require('line-reader');
const fs = require('fs');

var jsonParser = bodyParser.json()

app.use(jsonParser)
app.post('/', function(req, res) {
  console.log("Recieved Request");
  console.log(req.body);

  const pythonProcess = spawn('python',["historicaldata.py", req.body]);

  pythonProcess.stdout.on('data', (data) => {
    console.log("Python Data Recieved ", data);
    fileData = fs.readFileSync('./data.txt', 'utf8');
    console.log("Completed Reading File")
    returnArray = [];
    buildString = "";
    for(var i = 0; i < fileData.length; i++) {
      if(fileData[i] == '[' || fileData[i] == ' ') {
        // Do Nothing
      }
      else if(fileData[i] == ',') {
        returnArray.push(buildString);
        buildString = "";
        //console.log(returnArray);
      }
      else if(fileData[i] == ']') {
        returnArray.push(buildString);
        buildString = "";
        console.log(returnArray)
        res.status(200).end(String(returnArray));
      }
      else {
        buildString += fileData[i];
      }
    }
  });
});

server.listen(8080);