import React, { PureComponent } from 'react';
import ReactDom from 'react-dom';
import './styles/global.scss';
import Home from './components/Home/Home.js';
import LocalizationContext from './context/LocalizationContext';

// dynamic import fails in electron :(
import phrasesDe from './config/phrasesDe.js';
import phrasesEn from './config/phrasesEn.js';

class App extends PureComponent {
    constructor() {
        super();
        this.state = {
            dict: {}
        }
    }

    setPhrases = language => {
        switch (language) {
            case 'de':
                this.setState({ dict: phrasesDe });
                break;
            default:
                this.setState({ dict: phrasesEn });
        }
    };

    changeLanguageHandler = language => {
        this.setPhrases(language);
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
