import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

const StudyMaterialList = () => {
    const [studyMaterials, setStudyMaterials] = useState([]);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
        material_id: { value: null, matchMode: 'contains' },
        name: { value: null, matchMode: 'contains' },
    });

    useEffect(() => {
        const fetchStudyMaterials = async () => {
            const response = await axios.get('http://127.0.0.1:8000/study_materials/');
            setStudyMaterials(response.data);
        };
        fetchStudyMaterials();
    }, []);

    const handleEdit = (student) => {
        console.log("Редактировать студента:", student);
    };

    const header = (
        <div className="table-header">
            <h2>Учебные Материалы</h2>
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
                value={studyMaterials} 
                paginator 
                rows={10} 
                filters={filters} 
                filterDisplay="row" 
                header={header}
                emptyMessage="Учебные материалы не найдены."
            >
                <Column 
                    sortable 
                    field="material_id" 
                    header="ID Материала" 
                    filter 
                />
                <Column 
                    sortable 
                    field="name" 
                    header="Название" 
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

export default StudyMaterialList;
