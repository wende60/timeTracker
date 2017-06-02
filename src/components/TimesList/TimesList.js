import './TimesList.scss';
import React, { PropTypes } from 'react';
import timesHelper from '../../helper/timesHelper.js';

const TimesList = props => {
    timesHelper.resetTotal();

    const handleFieldLeave = (allData, field) => e => {
        const el = e.currentTarget;
        const edit = el.innerHTML;
        const update = {
            start: allData.start,
            end: allData.end
        };
        switch (field) {
            case 'date':
                update.start = timesHelper.createDateFromFormattedStrings(edit, allData.formattedStart);
                update.end = timesHelper.createDateFromFormattedStrings(edit, allData.formattedEnd);
                break;
            case 'start':
                update.start = timesHelper.createDateFromFormattedStrings(allData.formattedDate, edit);
                break;
            case 'end':
                update.end = timesHelper.createDateFromFormattedStrings(allData.formattedDate, edit);
                break;
        }

        if (update.start && update.end && update.start < update.end) {
            props.updateHandler(
                allData._id,
                update.start,
                update.end,
                allData.customerId,
                allData.customerName,
                allData.projectId,
                allData.projectName);
        }

        e.currentTarget.classList.remove('contentEditable');
    }

    const handleFieldEnter = e => {
        if (props.isRecording) {
            return false;
        }

        const el = e.currentTarget;
        el.contentEditable = true;
        el.classList.add('contentEditable');
    }

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
                        const roundedHours = row.end ? timesHelper.getRoundedHours(row.start, row.end) : '';
                        const allData = Object.assign({}, row, { formattedDate, formattedStart, formattedEnd });

                        return (
                            <tr key={index}>
                                <td
                                    onMouseDown={handleFieldEnter}
                                    onBlur={handleFieldLeave(allData, 'date')}>{formattedDate}</td>
                                <td
                                    onMouseDown={handleFieldEnter}
                                    onBlur={handleFieldLeave(allData, 'start')}>{formattedStart}</td>
                                <td
                                    onMouseDown={handleFieldEnter}
                                    onBlur={handleFieldLeave(allData, 'end')}>{formattedEnd}</td>
                                <td>{roundedHours}</td>
                            </tr>
                        );
                    })}
                </tbody>
                {props.times.length > 1 &&
                    <tfoot>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>{timesHelper.getTotal()}</td>
                        </tr>
                    </tfoot>
                }
            </table>
        </div>
    );
};

export default TimesList;

