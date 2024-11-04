import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

const PerformanceList = () => {
    const [performances, setPerformances] = useState([]);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
        performance_id: { value: null, matchMode: 'contains' },
        student_login: { value: null, matchMode: 'contains' },
        course_name: { value: null, matchMode: 'contains' },
        grade: { value: null, matchMode: 'contains' },
    });

    useEffect(() => {
        const fetchPerformances = async () => {
            const response = await axios.get('http://127.0.0.1:8000/performances/');
            setPerformances(response.data);
        };
        fetchPerformances();
    }, []);

    const handleEdit = (student) => {
        console.log("Редактировать студента:", student);
    };

    const header = (
        <div className="table-header">
            <h2>Успеваемость</h2>
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
                value={performances} 
                paginator 
                rows={10} 
                filters={filters} 
                filterDisplay="row" 
                header={header}
                emptyMessage="Успеваемость не найдена."
            >
                <Column 
                    sortable 
                    field="performance_id" 
                    header="ID Успеваемости" 
                    filter 
                    filterMatchModeOptions={filterMatchModeOptions.text} 
                />
                <Column 
                    sortable 
                    field="student_login" 
                    header="Логин Студента" 
                    filter 
                    filterMatchModeOptions={filterMatchModeOptions.text} 
                />
                <Column 
                    sortable 
                    field="course_name" 
                    header="Название Курса" 
                    filter 
                    filterMatchModeOptions={filterMatchModeOptions.text} 
                />
                <Column 
                    sortable 
                    field="grade" 
                    header="Оценка" 
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

export default PerformanceList;
