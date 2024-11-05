import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

const LessonList = () => {
    const [lessons, setLessons] = useState([]);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
        lesson_id: { value: null, matchMode: 'contains' },
        course_name: { value: null, matchMode: 'contains' },
        date: { value: null, matchMode: 'contains' },
    });

    const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        const fetchLessons = async () => {
            const response = await axios.get('http://127.0.0.1:8000/lessons/');
            setLessons(response.data);
        };
        fetchLessons();
    }, []);

    const handleEdit = (student) => {
        console.log("Редактировать студента:", student);
    };

    const header = (
        <div className="table-header">
            <h2>Уроки</h2>
            <Button label="" icon="pi pi-plus" onClick={() => setIsAddDialogVisible(true)} style={{ marginRight: '20px' }}/>
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
                value={lessons} 
                paginator 
                rows={10} 
                filters={filters} 
                filterDisplay="row" 
                header={header}
                emptyMessage="Уроки не найдены."
            >
                <Column 
                    sortable 
                    field="lesson_id" 
                    header="ID Урока" 
                    filter 
                />
                <Column 
                    sortable 
                    field="course_name" 
                    header="Название Курса" 
                    filter 
                />
                <Column 
                    sortable 
                    field="date" 
                    header="Дата" 
                    filter 
                    body={(rowData) => new Date(rowData.date).toLocaleDateString()} // Форматирование даты
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

export default LessonList;
