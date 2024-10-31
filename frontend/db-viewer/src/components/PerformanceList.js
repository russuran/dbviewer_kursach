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
            <DataTable value={performances} paginator rows={10}>
                <Column field="performance_id" header="Performance ID" />
                <Column field="student_login" header="Student Login" />
                <Column field="course_name" header="Course Name" />
                <Column field="grade" header="Grade" />
            </DataTable>
        </div>
    );
};

export default PerformanceList;
