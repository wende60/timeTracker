import React from 'react';
import ReactDom from 'react-dom';
import './styles/global.scss';
import Home from './components/Home/Home.js';

const App = React.createClass({
	render() {
		return (
            <Home />
        );
	}
});

ReactDom.render(<App/>, document.getElementById('react-root'));