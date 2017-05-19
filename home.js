var app = require('electron').remote;
var dialog = app.dialog;
var fs = require('fs');
var enigma = require('enigma-js')
var crypt = require('crypto'),
    algorithm = 'aes-256-ctr';

  function encrypt(text){  
  var password=document.getElementById('cryptoKey').value;
  var cipher = crypt.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
 
function decrypt(text){
  var password=document.getElementById('cryptoKey').value;
  var decipher = crypt.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

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

document.getElementById('create-file').onclick=()=> {
  dialog.showSaveDialog((fileName) => {
    // fileNames is an array that contains all the selected
    if (fileName === undefined) {
      alert("No file name");
      return;
    } else {

      saveFile(fileName);
    }
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
}

function saveFile(fileName) {
  enigma.load(JSON.parse(JSON.stringify(default_settings)))
  let content=enigma.process(document.getElementById('inputTextArea').value.toUpperCase());
  default_settings.spacing = 0
  enigma.load(JSON.parse(JSON.stringify(default_settings)))
  let decrypted_message = enigma.process(content.replace(/ /g,''))
  alert(
    encrypt(content)+"("+decrypt(encrypt(decrypted_message))+")"
  )
  fs.writeFile(fileName,encrypt(content),(err)=>{
    if (err) elert(err);
    elert("file has been saved");
  });

}

function readFile(filepath) {
  
fs.readFile(filepath,"utf-8", (err, data) => {
  try{
  if (err) throw err;
  enigma.load(JSON.parse(JSON.stringify(default_settings)))
  let decripted_data=decrypt(data);
  if(decripted_data.indexOf('�') > -1){
    throw new Error("Invalid character '�' found in mesage '"+decripted_data+"'")
  }
  let decrypted_message = enigma.process(decripted_data);
  alert(decrypted_message);
  }
  catch(ex){
    alert(ex.message);
    decrypted_message=null;
  }
  document.getElementById('inputTextArea').value=decrypted_message;
});
}
