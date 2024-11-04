import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';

const AttendanceLogList = () => {
    const [attendanceLogs, setAttendanceLogs] = useState([]);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
    });

    useEffect(() => {
        const fetchAttendanceLogs = async () => {
            const response = await axios.get('http://127.0.0.1:8000/attendance_logs/');
            setAttendanceLogs(response.data);
        };
        fetchAttendanceLogs();
    }, []);

    const header = (
        <div className="table-header">
            <h2>Посещаемость</h2>
            <span className="p-input-icon-left">
                <InputText
                    type="search"
                    onInput={(e) => setFilters(prevFilters => ({
                        ...prevFilters,
                        global: { value: e.target.value, matchMode: 'contains' }
                    }))}
                    placeholder="Поиск"
                />
            </span>
        </div>
    );

    return (
        <div style={{ padding: '8px' }}>
            <DataTable 
                removableSort 
                value={attendanceLogs} 
                paginator 
                rows={10} 
                filters={filters} 
                filterDisplay="row" 
                header={header}
                emptyMessage="Записи о посещаемости не найдены."
            >
                <Column 
                    sortable 
                    field="attendance_id" 
                    header="ID Посещаемости" 
                    filter 
                />
                <Column 
                    sortable 
                    field="student_login" 
                    header="Логин Студента" 
                    filter 
                />
                <Column 
                    sortable 
                    field="lesson_id" 
                    header="ID Урока" 
                    filter 
                />
                <Column 
                    sortable 
                    field="attendance_status" 
                    header="Статус" 
                    filter 
                />
            </DataTable>
        </div>
    );
};

export default AttendanceLogList;
