import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';

const TeacherList = () => {
    const [teachers, setTeachers] = useState([]);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
        teacher_id: { value: null, matchMode: 'contains' },
        full_name: { value: null, matchMode: 'contains' },
        contact_info: { value: null, matchMode: 'contains' },
        qualification: { value: null, matchMode: 'contains' },
    });

    useEffect(() => {
        const fetchTeachers = async () => {
            const response = await axios.get('http://127.0.0.1:8000/teachers/');
            setTeachers(response.data);
        };
        fetchTeachers();
    }, []);

    const header = (
        <div className="table-header">
            <h2>Преподаватели</h2>
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
                value={teachers} 
                paginator 
                rows={10} 
                filters={filters} 
                filterDisplay="row" 
                header={header}
                emptyMessage="Преподаватели не найдены."
            >
                <Column 
                    sortable 
                    field="teacher_id" 
                    header="ID Преподавателя" 
                    filter 
                />
                <Column 
                    sortable 
                    field="full_name" 
                    header="ФИО" 
                    filter 
                />
                <Column 
                    sortable 
                    field="contact_info" 
                    header="Контактная информация" 
                    filter 
                />
                <Column 
                    sortable 
                    field="qualification" 
                    header="Квалификация" 
                    filter 
                />
            </DataTable>
        </div>
    );
};

export default TeacherList;
