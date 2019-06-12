import './TimesFilter.scss';
import React, { PropTypes, Component } from 'react';
import timesHelper from '../../helper/timesHelper.js';

// todo, set locale here
timesHelper.init();

class TimesFilter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: false
        }
    }

    handleFilterChange = e => {
        const year = this.refs['selectedYear'].value || false;
        const month = this.refs['selectedMonth'].value || false;
        this.setState({ year });

        let startDate = false;
        let endDate = false;
        let startMonth = month;
        let endMonth = month;

        if (year && !month) {
            startMonth = 1;
            endMonth = 12;
        }

        if (year) {
            const lastDayOfMonth = timesHelper.getLastDayOfMonth(year, endMonth);
            startDate = timesHelper.createDateFromParts(year, startMonth, 1);
            endDate = timesHelper.createDateFromParts(year, endMonth, lastDayOfMonth);
        } else {
            this.refs['selectedMonth'].selectedIndex = 0;
        }

        this.props.timesFilterChange(startDate, endDate);
    }

    getOptions = options => {
        return options.map((option, index) => {
            return (
                <option key={index} value={option.value}>{option.label}</option>
            )
        });
    }

    getYears = () => {
        const maxLength = 10;
        const years = [{ value: '', label: 'alle Jahre' }];
        let currentYear = new Date().getFullYear();
        while (years.length < maxLength) {
            years.push({ value: currentYear, label: currentYear });
            currentYear -= 1;
        }
        return years;
    }

    getMonths = () => {
        return [
            { value: '', label: 'alle Monate' },
            { value: 1, label: 'Januar' },
            { value: 2, label: 'Februar' },
            { value: 3, label: 'März' },
            { value: 4, label: 'April' },
            { value: 5, label: 'Mai' },
            { value: 6, label: 'Juni' },
            { value: 7, label: 'Juli' },
            { value: 8, label: 'August' },
            { value: 9, label: 'September' },
            { value: 10, label: 'Oktober' },
            { value: 11, label: 'November' },
            { value: 12, label: 'Dezember' }
        ];
    }

    render() {
        const monthClass = this.state.year ? 'selectActive'  : 'selectDisabled';
        return (
            <div className='timesFilterWrapper'>
                <div>Zeiten filtern</div>
                <form>
                    <select
                        ref='selectedYear'
                        onChange={this.handleFilterChange}>
                            {this.getOptions(this.getYears())}
                    </select>
                    <select
                        className={monthClass}
                        ref='selectedMonth'
                        onChange={this.handleFilterChange}
                        disabled={!this.state.year}>
                            {this.getOptions(this.getMonths())}
                    </select>                    
                </form>
            </div>
        )
    };
};

export default TimesFilter;

