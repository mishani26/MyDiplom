const remote = require('electron').remote;
const main = remote.require('./index.js');
var app = require('electron').remote;
var dialog = app.dialog;
var fs = require('fs');
var enigma = require('enigma-js');
var WebCamera = require("webcamjs");

var button=document.createElement('button');
button.textContent='Open Window'
button.addEventListener('click',()=>{
  var window= remote.getCurrentWindow();
  main.openWindow('index');
  window.close();
},false)
document.body.appendChild(button);

var default_settings = {
  rotors: [
    {type: "III", ring: 0, position: "A"}, // Right
    {type: "II",  ring: 0, position: "A"}, // Middle
    {type: "I",   ring: 0, position: "A"}  // Left
  ],
  plugboard: [
    "AB",
    "CD",
    "EF",
    "GH"
  ],
  reflector: "B",
  spacing: 4
}

var enabled = false;
// Use require to add webcamjs;
WebCamera.attach('#camdemo');

function processBase64Image(dataString) {
      var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),response = {};

      if (matches.length !== 3) {
          return new Error('Invalid input string');
      }

      response.type = matches[1];
      response.data = new Buffer(matches[2], 'base64');

      return response;
}
document.getElementById("Encodefile").onclick=()=>{
            WebCamera.snap(function(data_uri) {
                // Save the image in a variable
                let result_Numstring="";
                let result_string="";
                let LattersArr=["A","B","C","D","E","F","G","H","I","J"];
                data_uri.split("").forEach(function(element, index, array) {
                   var simbolChar= data_uri.charCodeAt(index).toString();
                   if(simbolChar.length<3){
                   do{
                       simbolChar="0"+simbolChar;
                   }
                   while(simbolChar.length<3)
                }
                result_Numstring=result_Numstring+simbolChar;
                   
            }, this);
            
            
            result_Numstring.split("").forEach(function(element, index, array) {
                      result_string=result_string + LattersArr[parseInt(element)]               
            }, this);
            console.log(result_string);
                // Start the save dialog to give a name to the file
                dialog.showSaveDialog({
                    filters: [
                        { name: 'Text', extensions: ['txt'] },
                    ]
                }, (fileName)=>{
                       if (fileName === undefined){
                            console.log("You didn't save the file because you exit or didn't give a name");
                            return;
                       }
                       // If the user gave a name to the file, then save it
                       // using filesystem writeFile function
                       enigma.load(JSON.parse(JSON.stringify(default_settings)));
                       let newresult_string=enigma.process(result_string);
                       fs.writeFile(fileName, newresult_string, (err)=>{
                           if(err){
                               console.log("Cannot save the file :'( time to cry !");
                           }else{
                               alert("Image encoded succesfully");
                           }
                       });
                });
             });
};

document.getElementById('open-file').onclick=()=>{
  dialog.showOpenDialog((filenames)=>{
    if (filenames === undefined) {
      alert("No file name");
      return;
    } else {
      readFile(filenames[0]);
    }
  })
};

function readFile(filepath) {
    let result_Numstring="";
    let result_string="";
  let DigitArray={A:0,B:1,C:2,D:3,E:4,F:5,G:6,H:7,I:8,J:9};
fs.readFile(filepath,"utf-8", (err, data) => {
  let decrypted_message=null;
  try{
  if (err) throw err;
  
  enigma.load(JSON.parse(JSON.stringify(default_settings)));
  decrypted_message = enigma.process(data).replace(/\s/g,"");
  }
  catch(ex){
    alert(ex.message);
    decrypted_message=null;
  }
  console.log(decrypted_message);
  decrypted_message.split("").forEach(function(element, index, array) {
                      result_Numstring=result_Numstring + DigitArray[element]               
            }, this);
  console.log(result_Numstring);
  let test=result_Numstring.split(/(\d{3})/);
            test.forEach(function(element, index, array) {
                   if(element!==""){
                       result_string=result_string+String.fromCodePoint(parseInt(element));
                   }
            }, this);
            console.log(result_string);
            var imageBuffer = processBase64Image(result_string);
            dialog.showSaveDialog({
                    filters: [
                        { name: 'Images', extensions: ['png'] },
                    ]
                },function (fileName) {
                       if (fileName === undefined){
                            console.log("You didn't save the file because you exit or didn't give a name");
                            return;
                       }
                       // If the user gave a name to the file, then save it
                       // using filesystem writeFile function
                       fs.writeFile(fileName, imageBuffer.data, function(err) {
                           if(err){
                               console.log("Cannot save the file :'( time to cry !");
                           }else{
                               alert("Image saved succesfully");
                           }
                       });
                });
});
}

document.getElementById("savefile").onclick=()=>{
            WebCamera.snap(function(data_uri) {
                // Save the image in a variable
                alert(data_uri);
                var imageBuffer = processBase64Image(data_uri);
                // Start the save dialog to give a name to the file
                dialog.showSaveDialog({
                    filters: [
                        { name: 'Images', extensions: ['png'] },
                    ]
                },function (fileName) {
                       if (fileName === undefined){
                            console.log("You didn't save the file because you exit or didn't give a name");
                            return;
                       }
                       // If the user gave a name to the file, then save it
                       // using filesystem writeFile function
                       fs.writeFile(fileName, imageBuffer.data, function(err) {
                           if(err){
                               console.log("Cannot save the file :'( time to cry !");
                           }else{
                               alert("Image saved succesfully");
                           }
                       });
                });
             });
};