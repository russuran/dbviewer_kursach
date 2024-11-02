import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const CourseList = () => {
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const fetchCourses = async () => {
            const response = await axios.get('http://127.0.0.1:8000/courses/');
            setCourses(response.data);
        };
        fetchCourses();
    }, []);

    return (
        <div style={{ padding: '8px'}}>
            <h2>Курсы</h2>
            <DataTable removableSort value={courses} paginator rows={10}>
                <Column sortable field="name" header="Course Name" />
            </DataTable>
        </div>
    );
};

export default CourseList;
