import './TimesList.scss';
import React, { PropTypes } from 'react';
import timesHelper from '../../helper/timesHelper.js';

const TimesList = props => {
    timesHelper.resetTotal();

    return (
        <div className='timesListWrapper'>
            <table>
                <thead>
                    <tr>
                        <th>Datum</th>
                        <th>Startzeit</th>
                        <th>Endzeit</th>
                        <th>Dauer (Stunden)</th>
                    </tr>
                </thead>
                <tbody>
                    {props.times.map((row, index) => {
                        const formattedDate = timesHelper.getFormattedDate(row.start);
                        const formattedStart = timesHelper.getFormattedTime(row.start);
                        const formattedEnd = row.end ? timesHelper.getFormattedTime(row.end) : '';
                        const roundedHours = row.end ? timesHelper.getRoundedHours(row.start, row.end, 1000) : '';

                        return (
                            <tr key={index}>
                                <td>{formattedDate}</td>
                                <td>{formattedStart}</td>
                                <td>{formattedEnd}</td>
                                <td>{roundedHours}</td>
                            </tr>
                        );
                    })}
                </tbody>
                <tfoot>
                    <tr>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td>{timesHelper.getTotal()}</td>
                    </tr>
                </tfoot>
            </table>
        </div>
    );
};

export default TimesList;

