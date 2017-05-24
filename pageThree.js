const remote = require('electron').remote;
const main = remote.require('./index.js');
var app = require('electron').remote;
var dialog = app.dialog;
var fs = require('fs');
var enigma = require('enigma-js');
var record = require('node-record-lpcm16')

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


document.querySelector("#PageTwo").addEventListener('click',()=>{
  var window= remote.getCurrentWindow();
  main.openWindow('PageTwo');
  window.close();
},false)


document.getElementById('encode-file').onclick=()=>{
  dialog.showOpenDialog({filters: [
                        { name: 'sound', extensions: ['mp3'] },
                    ]},(filenames)=>{
    if (filenames === undefined) {
      alert("No file name");
      return;
    } else {
      alert(filenames[0]);
      encodeFile(filenames[0]);
    }
  })
};

function encodeFile(filepath){
  if(filepath.endsWith('.mp3')){
fs.readFile(filepath,"utf-8", (err, data) => {
    let result_Numstring="";
                let result_string="";
                let LattersArr=["A","B","C","D","E","F","G","H","I","J"];
                var b_data = new Buffer(data);
                var s_data = b_data.toString('base64');
                alert("ready");
                s_data.split("").forEach(function(element, index, array) {
                   var simbolChar= s_data.charCodeAt(index).toString();
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
                               alert("File encoded succesfully");
                           }
                       });
                });
  });
  }
}

document.getElementById('decode-file').onclick=()=>{
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
  alert("pase 1");
  decrypted_message.split("").forEach(function(element, index, array) {
                      result_Numstring=result_Numstring + DigitArray[element]               
            }, this);
            alert("pase 2");
  let test=result_Numstring.split(/(\d{3})/);
            test.forEach(function(element, index, array) {
                   if(element!==""){
                       result_string=result_string+String.fromCodePoint(parseInt(element));
                   }
            }, this);
            alert("pase 3");
            var b = new Buffer(result_string, 'base64')
            var s = b.toString();
            dialog.showSaveDialog({
                    filters: [
                        { name: 'sound', extensions: ['mp3'] },
                    ]
                },function (fileName) {
                       if (fileName === undefined){
                            console.log("You didn't save the file because you exit or didn't give a name");
                            return;
                       }
                       // If the user gave a name to the file, then save it
                       // using filesystem writeFile function
                       fs.writeFile(fileName, s, function(err) {
                           if(err){
                               console.log("Cannot save the file :'( time to cry !");
                           }else{
                               alert("File saved succesfully");
                           }
                       });
                });
});
}