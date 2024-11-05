import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

const ContentList = () => {
    const [contents, setContents] = useState([]);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
        name: { value: null, matchMode: 'contains' },
        material_id: { value: null, matchMode: 'contains' },
    });

    const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        const fetchContents = async () => {
            const response = await axios.get('http://127.0.0.1:8000/contents/');
            setContents(response.data);
        };
        fetchContents();
    }, []);

    const handleEdit = (student) => {
        console.log("Редактировать студента:", student);
    };

    const header = (
        <div className="table-header">
            <h2>Содержимое</h2>
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
                value={contents} 
                paginator 
                rows={10} 
                filters={filters} 
                filterDisplay="row" 
                header={header}
                emptyMessage="Содержимое не найдено."
            >
                <Column 
                    sortable 
                    field="name" 
                    header="Название" 
                    filter 
                />
                <Column 
                    sortable 
                    field="material_id" 
                    header="ID Материала" 
                    filter 
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

export default ContentList;
