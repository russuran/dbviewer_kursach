import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const StudentList = () => {
    const [students, setStudents] = useState([]);

    useEffect(() => {
        const fetchStudents = async () => {
            const response = await axios.get('http://127.0.0.1:8000/students/');
            setStudents(response.data);
        };
        fetchStudents();
    }, []);

    return (
        <div style={{ padding: '8px'}}>
            <h2>Студенты</h2>
            <DataTable value={students} paginator rows={10}>
                <Column field="full_name" header="Full Name" />
                <Column field="login" header="Login" />
                <Column field="contact_info" header="Contact Info" />
            </DataTable>
        </div>
    );
};

export default StudentList;