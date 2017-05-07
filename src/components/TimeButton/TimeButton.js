import './TimeButton.scss';
import React, { PropTypes, Component } from 'react';

class TimeButton extends Component {

    constructor(props) {
        super(props);
        this.state = {
            buttonDown: false,
            timeRunner: false
        }

        // make sure timeRunner stores an end-time when window is closed
        window.addEventListener('beforeunload', e => {
            if (this.state.timeRunner) {
                this.props.buttonClick('end', false);
            }
        });
    }

    componentWillMount() {
        this.setState(this.state);
    }

    componentWillUnmount() {
        if (this.state.timeRunner) {
            this.props.buttonClick('end', false);
        }
    }

    mouseDown = e => {
        this.setState({buttonDown: true});
    }

    mouseUp = e => {
        this.setState({buttonDown: false});
    }

    toggleTimeRunner = e => {
        const timeRunner = !this.state.timeRunner;
        this.setState({timeRunner}, () => {
            this.props.buttonClick(this.state.timeRunner ? 'start' : 'end');
        });
    }

    render() {
        const classes = ['timeButton'];
        if (this.state.buttonDown) {
            classes.push('timeButtonDown');
        }
        if (this.state.timeRunner) {
            classes.push('timeIsRunning');
        }

        return (
            <div className='timeButtonWrapper'>

                <div
                    className={classes.join(' ')}
                    onMouseDown={this.mouseDown}
                    onMouseUp={this.mouseUp}
                    onClick={this.toggleTimeRunner} >
                    <p>Press</p>
                </div>

            </div>
        );
    }
};

export default TimeButton;

