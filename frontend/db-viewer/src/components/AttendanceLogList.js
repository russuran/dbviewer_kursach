import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const AttendanceLogList = () => {
    const [attendanceLogs, setAttendanceLogs] = useState([]);

    useEffect(() => {
        const fetchAttendanceLogs = async () => {
            const response = await axios.get('http://127.0.0.1:8000/attendance_logs/');
            setAttendanceLogs(response.data);
        };
        fetchAttendanceLogs();
    }, []);

    return (
        <div style={{ padding: '8px'}}>
            <h2>Посещаемость</h2>
            <DataTable removableSort value={attendanceLogs} paginator rows={10}>
                <Column sortable field="attendance_id" header="Attendance ID" />
                <Column sortable field="student_login" header="Student Login" />
                <Column sortable field="lesson_id" header="Lesson ID" />
                <Column sortable field="status" header="Status" />
            </DataTable>
        </div>
    );
};

export default AttendanceLogList;
