const electron = require('electron')
const {app,BrowserWindow}=electron

app.on('ready', ()=>{
	let win = new BrowserWindow({width:700,height:650})
	win.loadURL(`file://${__dirname}/index.html`)
})

exports.openWindow = (filename) =>{
	let win = new BrowserWindow({width:700,height:650})
	win.loadURL(`file://${__dirname}/` + filename + `.html`)
}
