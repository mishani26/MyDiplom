const electron = require('electron')
const {app,BrowserWindow}=electron

app.on('ready', ()=>{
	let win = new BrowserWindow({width:700,height:600})
	win.loadURL(`file://${__dirname}/index.html`)
})

exports.openWindow = (filename) =>{
	let win = new BrowserWindow({width:600,height:400})
	win.loadURL(`file://${__dirname}/` + filename + `.html`)
}