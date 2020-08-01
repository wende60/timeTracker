import './TimesFilter.scss';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import LocalizationContext from '../../context/LocalizationContext';
import translate from '../../helper/translate.js';
import timesHelper from '../../helper/timesHelper.js';

// todo, set locale here
timesHelper.init();

class TimesFilter extends PureComponent {
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
            // endDate mus be the last second of the day in order not to exclude records during the last day
            endDate = timesHelper.createDateFromParts(year, endMonth, lastDayOfMonth, 23, 59, 59);
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
        const years = [{ value: '', label: translate(this.context, 'allYears') }];
        let currentYear = new Date().getFullYear();
        while (years.length < maxLength) {
            years.push({ value: currentYear, label: currentYear });
            currentYear -= 1;
        }
        return years;
    }

    getMonths = () => {
        return [
            { value: '', label: translate(this.context, 'allMonth') },
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
                <div>{translate(this.context, 'filterTimes')}</div>
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

TimesFilter.contextType = LocalizationContext;

TimesFilter.propTypes = {
    timesFilterChange: PropTypes.func.isRequired
};

export default TimesFilter;

