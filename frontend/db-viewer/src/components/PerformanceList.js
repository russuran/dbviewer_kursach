import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const PerformanceList = () => {
    const [performances, setPerformances] = useState([]);

    useEffect(() => {
        const fetchPerformances = async () => {
            const response = await axios.get('http://127.0.0.1:8000/performances/');
            setPerformances(response.data);
        };
        fetchPerformances();
    }, []);

    return (
        <div style={{ padding: '8px'}}>
            <h2>Успеваемость</h2>
            <DataTable removableSort value={performances} paginator rows={10}>
                <Column sortable field="performance_id" header="Performance ID" />
                <Column sortable field="student_login" header="Student Login" />
                <Column sortable field="course_name" header="Course Name" />
                <Column sortable field="grade" header="Grade" />
            </DataTable>
        </div>
    );
};

export default PerformanceList;
