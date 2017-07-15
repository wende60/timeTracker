import './TimesList.scss';
import React, { PropTypes } from 'react';
import timesHelper from '../../helper/timesHelper.js';

// todo, set locale here
timesHelper.init();

const HOUR_UNIT = 'h';

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
            case 'startDate':
                update.start = timesHelper.createDateFromFormattedStrings(edit, allData.formattedStartTime);
                update.end = (update.end > update.start) ? update.end : update.start;
                break;
            case 'endDate':
                update.end = timesHelper.createDateFromFormattedStrings(edit, allData.formattedEndTime);
                update.start = (update.start < update.end) ? update.start : update.end;
                break;
            case 'startTime':
                update.start = timesHelper.createDateFromFormattedStrings(allData.formattedStartDate, edit);
                update.end = (update.end > update.start) ? update.end : update.start;
                break;
            case 'endTime':
                update.end = timesHelper.createDateFromFormattedStrings(allData.formattedEndDate, edit);
                update.start = (update.start < update.end) ? update.start : update.end;
                break;
        }

        if (update.start && update.end) {
            props.updateHandler(
                allData._id,
                update.start,
                update.end,
                allData.customerId,
                allData.customerName,
                allData.projectId,
                allData.projectName);
        } else {
            // error, reset edited field
            switch (field) {
                case 'startDate':
                    el.innerHTML = allData.formattedStartDate;
                    break;
                case 'endDate':
                    el.innerHTML = allData.formattedEndDate;
                    break;
                case 'startTime':
                    el.innerHTML = allData.formattedStartTime;
                    break;
                case 'endTime':
                    el.innerHTML = allData.formattedEndTime;
                    break;
            }
            e.currentTarget.classList.add('contentError');
        }

        e.currentTarget.classList.remove('contentEditable');
    }

    const handleRowDelete = allData => e => {
        if (props.deleteHandler) {
            props.deleteHandler(allData);
        }
    }

    const handleFieldEnter = e => {
        if (props.isRecording) {
            return false;
        }

        const el = e.currentTarget;
        el.contentEditable = true;
        e.currentTarget.classList.remove('contentError');
        el.classList.add('contentEditable');
    }

    return (
        <div className='timesListWrapper'>
            <table>
                <thead>
                    <tr>
                        <th>Startdatum</th>
                        <th>Startzeit</th>
                        <th>Enddatum</th>
                        <th>Endzeit</th>
                        <th>Dauer</th>
                        {props.deleteHandler &&
                            <th></th>
                        }
                    </tr>
                </thead>
                <tbody>
                    {props.times.map((row, index) => {
                        const formattedStartDate = timesHelper.getFormattedDate(row.start);
                        const formattedEndDate = row.end ? timesHelper.getFormattedDate(row.end) : '';
                        const formattedStartTime = timesHelper.getFormattedTime(row.start);
                        const formattedEndTime = row.end ? timesHelper.getFormattedTime(row.end) : '';
                        const roundedHours = row.end ? timesHelper.getRoundedHours(row.start, row.end) : '';
                        const hourUnit = row.end ? HOUR_UNIT : '';
                        const allData = Object.assign({}, row, {
                            formattedStartDate,
                            formattedEndDate,
                            formattedStartTime,
                            formattedEndTime
                        });

                        const styles = row._id === props.updated ? 'rowUpdated' : 'rowNorm';
                        return (
                            <tr key={index} className={styles}>
                                <td
                                    onMouseDown={handleFieldEnter}
                                    onBlur={handleFieldLeave(allData, 'startDate')}>{formattedStartDate}</td>
                                <td
                                    onMouseDown={handleFieldEnter}
                                    onBlur={handleFieldLeave(allData, 'startTime')}>{formattedStartTime}</td>
                                <td
                                    onMouseDown={handleFieldEnter}
                                    onBlur={handleFieldLeave(allData, 'endDate')}>{formattedEndDate}</td>
                                <td
                                    onMouseDown={handleFieldEnter}
                                    onBlur={handleFieldLeave(allData, 'endTime')}>{formattedEndTime}</td>
                                <td>{roundedHours} {hourUnit}</td>

                                {props.deleteHandler &&
                                    <td>
                                        <div onClick={handleRowDelete(allData)}>del</div>
                                    </td>
                                }
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
                            <td></td>
                            <td>{timesHelper.getTotal()} {HOUR_UNIT}</td>
                            {props.deleteHandler &&
                                <td></td>
                            }
                        </tr>
                    </tfoot>
                }
            </table>
        </div>
    );
};

export default TimesList;

