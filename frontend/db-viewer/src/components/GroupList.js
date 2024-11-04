import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';

const GroupList = () => {
    const [groups, setGroups] = useState([]);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
        group_number: { value: null, matchMode: 'contains' },
        course_name: { value: null, matchMode: 'contains' },
    });

    useEffect(() => {
        const fetchGroups = async () => {
            const response = await axios.get('http://127.0.0.1:8000/groups/');
            setGroups(response.data);
        };
        fetchGroups();
    }, []);

    const header = (
        <div className="table-header">
            <h2>Группы</h2>
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
                value={groups} 
                paginator 
                rows={10} 
                filters={filters} 
                filterDisplay="row" 
                header={header}
                emptyMessage="Группы не найдены."
            >
                <Column 
                    sortable 
                    field="group_number" 
                    header="Номер Группы" 
                    filter 
                />
                <Column 
                    sortable 
                    field="course_name" 
                    header="Название Курса" 
                    filter 
                />
            </DataTable>
        </div>
    );
};

export default GroupList;
