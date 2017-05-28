import React from 'react';
import ReactDom from 'react-dom';
import './styles/global.scss';
import Home from './components/Home/Home.js';

const isElectron = require('is-electron-renderer') ? true : false;
let ipcRenderer = false;
if (isElectron) {
    ipcRenderer = require('electron').ipcRenderer;
}

console.info("ipcRenderer", ipcRenderer)



const App = React.createClass({
	render() {
		return (
            <Home />
        );
	}
});

ReactDom.render(<App/>, document.getElementById('react-root'));