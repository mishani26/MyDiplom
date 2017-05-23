const remote = require('electron').remote;
const main = remote.require('./index.js');
var app = require('electron').remote;
var dialog = app.dialog;
var fs = require('fs');
var enigma = require('enigma-js')

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

enigma.load(default_settings)

alert(
  enigma.process('HELLOWORLD')
)

document.getElementById('open-file').onclick=()=>{
  dialog.showOpenDialog((filenames)=>{
    if (filenames === undefined) {
      alert("No file name");
      return;
    } else {
      alert(filenames[0]);
    }
  })
}