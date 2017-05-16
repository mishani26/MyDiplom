var app = require('electron').remote;
var dialog = app.dialog;
var fs = require('fs');
var enigma = require('enigma-js')

var default_settings = {
  rotors: [{
      type: "III",
      ring: 0,
      position: "A"
    }, // Right
    {
      type: "II",
      ring: 0,
      position: "A"
    }, // Middle
    {
      type: "I",
      ring: 0,
      position: "A"
    } // Left
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

document.getElementById('create-file').addEventListener('click', function() {
  dialog.showSaveDialog((fileName) => {
    // fileNames is an array that contains all the selected
    if (fileName === undefined) {
      alert("No file name");
      return;
    } else {

      saveFile(fileName);
    }
  });
}, false);
document.getElementById('open-file').onclick=()=>{
  dialog.showOpenDialog((filenames)=>{
    if (filenames === undefined) {
      alert("No file name");
      return;
    } else {
      readFile(filenames[0]);
    }
  })
}

function saveFile(fileName) {

  enigma.load(JSON.parse(JSON.stringify(default_settings)))
  let content=enigma.process(document.getElementById('inputTextArea').value.toUpperCase());
  default_settings.spacing = 0
  enigma.load(JSON.parse(JSON.stringify(default_settings)))
  let decrypted_message = enigma.process(content.replace(/ /g,''))
  alert(
    content+"("+decrypted_message+")"
  )
  fs.writeFile(fileName,content,(err)=>{
    if (err) elert(err);
    elert("file has been saved");
  });

}
function readFile(filepath) {
  fs.readFile(filepath,"utf-8", (err, data) => {
  if (err) throw err;
  enigma.load(JSON.parse(JSON.stringify(default_settings)))
  let decrypted_message = enigma.process(data);
  alert(decrypted_message);
  document.getElementById('inputTextArea').value=decrypted_message;
});
}
