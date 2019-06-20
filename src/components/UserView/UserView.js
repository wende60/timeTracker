import './UserView.scss';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import LocalizationContext from '../../context/LocalizationContext';
import translate from '../../helper/translate.js';
import formats from '../../config/formats.js';

class UserView extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            language: props.language,
            format: props.format
        };
    }

    handleLanguageChange = () => {
        const language = this.refs['selectedLanguage'].value || false;
        this.setState({ language })
        this.props.changeHandler(language, this.state.format);
    };

    handleFormatChange = () => {
        const format = this.refs['selectedFormat'].value || false;
        this.setState({ format })
        this.props.changeHandler(this.state.language, format);
    };

    getOptions = options => {
        return options.map((option, index) => {
            return (
                <option key={index} value={option.value}>{option.label}</option>
            )
        });
    }

    getLanguages = () => {
        return [
            { value: 'de', label: 'Deutsch' },
            { value: 'en', label: 'English' }
        ];
    }

    getFormats = () => {
        return Object.keys(formats).reduce((acc, key) => {
            acc.push({ value: key, label: formats[key].formatDate });
            return acc;
        }, []);
    }

    render() {
        return (
            <div className='userWrapper'>
                <form>
                    <h2>{translate(this.context, 'selectLanguage')}</h2>
                    <select
                        defaultValue={this.props.language}
                        ref='selectedLanguage'
                        onChange={this.handleLanguageChange}>
                        {this.getOptions(this.getLanguages())}
                    </select>

                    <h2>{translate(this.context, 'selectedFormat')}</h2>
                    <select
                        defaultValue={this.props.format}
                        ref='selectedFormat'
                        onChange={this.handleFormatChange}>
                        {this.getOptions(this.getFormats())}
                    </select>
                </form>
            </div>
        );
    }
};

UserView.contextType = LocalizationContext;

UserView.propTypes = {
    changeHandler: PropTypes.func.isRequired,
    language: PropTypes.string.isRequired,
    format: PropTypes.string.isRequired
};

export default UserView;
