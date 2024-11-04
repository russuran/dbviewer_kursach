import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

const CourseList = () => {
    const [courses, setCourses] = useState([]);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
        name: { value: null, matchMode: 'contains' },
        description: { value: null, matchMode: 'contains' },
        cost: { value: null, matchMode: 'contains' },
        duration: { value: null, matchMode: 'contains' },
        teacher_id: { value: null, matchMode: 'contains' },
    });

    useEffect(() => {
        const fetchCourses = async () => {
            const response = await axios.get('http://127.0.0.1:8000/courses/');
            setCourses(response.data);
        };
        fetchCourses();
    }, []);

    const handleEdit = (student) => {
        console.log("Редактировать студента:", student);
    };

    const header = (
        <div className="table-header">
            <h2>Список курсов</h2>
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

    const filterMatchModeOptions = {
        text: [
            { label: 'Содержит', value: 'contains' },
            { label: 'Начинается с', value: 'startsWith' },
            { label: 'Заканчивается на', value: 'endsWith' },
            { label: 'Равно', value: 'equals' },
            { label: 'Не равно', value: 'notEquals' },
            { label: 'Не содержит', value: 'notContains' },
            { label: 'Без фильтра', value: 'noFilter' }
        ]
    };

    return (
        <div style={{ padding: '8px' }}>
            <DataTable 
                removableSort 
                value={courses} 
                paginator 
                rows={10} 
                filters={filters} 
                filterDisplay="row" 
                header={header}
                emptyMessage="Курсы не найдены."
            >
                <Column 
                    sortable 
                    field="name" 
                    header="Название Курса" 
                    filter 
                    filterMatchModeOptions={filterMatchModeOptions.text}
                />
                <Column 
                    sortable 
                    field="description" 
                    header="Описание" 
                    filter 
                    filterMatchModeOptions={filterMatchModeOptions.text}
                />
                <Column 
                    sortable 
                    field="duration" 
                    header="Продолжительность (часы)" 
                    filter 
                    filterMatchModeOptions={filterMatchModeOptions.text}
                />
                <Column 
                    sortable 
                    field="cost" 
                    header="Стоимость" 
                    filter 
                    filterMatchModeOptions={filterMatchModeOptions.text}
                />
                <Column 
                    sortable 
                    field="teacher_id" 
                    header="ID Преподавателя" 
                    filter 
                    filterMatchModeOptions={filterMatchModeOptions.text}
                />
                <Column
                    header="Действия"
                    body={(rowData) => (
                        <Button
                            label="Редактировать"
                            icon="pi pi-pencil"
                            onClick={() => handleEdit(rowData)}
                        />
                    )}
                    style={{ minWidth: '8rem' }}
                />
            </DataTable>
        </div>
    );
};

export default CourseList;
