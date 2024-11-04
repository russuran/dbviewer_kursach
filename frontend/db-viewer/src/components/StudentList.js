import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
        full_name: { value: null, matchMode: 'contains' },
        login: { value: null, matchMode: 'contains' },
        contact_info: { value: null, matchMode: 'contains' },
    });

    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://127.0.0.1:8000/students/');
                setStudents(response.data);
            } catch (error) {
                console.error("Ошибка при получении студентов:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStudents();
    }, []);

    const handleEdit = (student) => {
        console.log("Редактировать студента:", student);
    };

    const header = (
        <div className="table-header">
            <h2>Список студентов</h2>
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
                value={students}
                paginator
                rows={10}
                dataKey="id"
                filters={filters}
                filterDisplay="row"
                loading={loading}
                header={header}
                emptyMessage="Студенты не найдены."
            >
                <Column
                    field="full_name"
                    header="ФИО"
                    filter
                    filterPlaceholder="Поиск по ФИО"
                    style={{ minWidth: '12rem' }}
                    filterMatchModeOptions={filterMatchModeOptions.text}
                />
                <Column
                    field="login"
                    header="Логин"
                    filter
                    filterPlaceholder="Поиск по логину"
                    style={{ minWidth: '12rem' }}
                    filterMatchModeOptions={filterMatchModeOptions.text}
                />
                <Column
                    field="contact_info"
                    header="Контактная информация"
                    filter
                    filterPlaceholder="Поиск по контактной информации"
                    style={{ minWidth: '12rem' }}
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

export default StudentList;
