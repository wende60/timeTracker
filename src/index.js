import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import './styles/global.scss';
import Home from './components/Home/Home.js';
import LocalizationContext from './context/LocalizationContext';

class App extends PureComponent {
    constructor() {
		super();
		this.state = {
			dict: {}
		}
	}

	loadPhrases = async(language) => {
		let phrases = {};
		try {
			switch (language) {
				case 'de':
					phrases = await import('./config/phrasesDe.js');
					this.setState({ dict: phrases.default });
					break;
				default:
					phrases = await import('./config/phrasesEn.js');
					this.setState({ dict: phrases.default });
			}
		} catch(error) {
            console.info('LOAD_PHRASES_ERROR', error);
		}
	};

	changeLanguageHandler = language => {
		console.info("LANGUAGE", language)
		this.loadPhrases(language);
	};

	render() {
		return (
			<LocalizationContext.Provider value={this.state.dict}>
            	<Home changeLanguage={this.changeLanguageHandler} />
			</LocalizationContext.Provider>
        );
	}
};

ReactDom.render(<App/>, document.getElementById('react-root'));
