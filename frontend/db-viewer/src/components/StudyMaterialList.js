import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

const StudyMaterialList = () => {
    const [studyMaterials, setStudyMaterials] = useState([]);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
        material_id: { value: null, matchMode: 'contains' },
        name: { value: null, matchMode: 'contains' },
    });
    const [selectedMaterial, setSelectedMaterial] = useState(null);
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
    const [newMaterial, setNewMaterial] = useState({ name: '' });
    const toast = useRef(null);

    useEffect(() => {
        const fetchStudyMaterials = async () => {
            const response = await axios.get('http://127.0.0.1:8000/study_materials/');
            setStudyMaterials(response.data);
        };
        fetchStudyMaterials();
    }, []);

    const handleEdit = (material) => {
        setSelectedMaterial(material);
        setIsDialogVisible(true);
    };

    const handleSave = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/study_materials/${selectedMaterial.material_id}/`, selectedMaterial);
            setStudyMaterials((prev) => prev.map((item) => (item.material_id === selectedMaterial.material_id ? selectedMaterial : item)));
            setIsDialogVisible(false);
            toast.current.show({ severity: 'success', summary: 'Success', detail: 'Material updated successfully!', life: 3000 });
        } catch (error) {
            console.error("Error updating material:", error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to update material.', life: 3000 });
        }
    };

    const handleAdd = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/study_materials/', newMaterial);
            setStudyMaterials((prevMaterials) => [...prevMaterials, response.data]);
            setIsAddDialogVisible(false);
            setNewMaterial({ name: '' });
            toast.current.show({ severity: 'success', summary: 'Успех', detail: 'Материал добавлен', life: 3000 });
        } catch (error) {
            console.error("Ошибка при добавлении преподавателя:", error);
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось добавить преподавателя', life: 3000 });
        }
    };

    const header = (
        <div className="table-header">
            <h2>Учебные Материалы</h2>
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
            <Toast ref={toast} />
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

            <Dialog header="Редактировать Материал" style={{ width: '500px' }} visible={isDialogVisible} onHide={() => setIsDialogVisible(false)}>
            {selectedMaterial && (
                <div>
                    <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <label htmlFor="material_id">ID Материала</label>
                        <InputText
                            id="material_id"
                            value={selectedMaterial.material_id}
                            onChange={(e) => setSelectedMaterial({ ...selectedMaterial, material_id: e.target.value })}
                            disabled
                        />
                    </div>
                    <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <label htmlFor="name">Название</label>
                        <InputText
                            id="name"
                            value={selectedMaterial.name}
                            onChange={(e) => setSelectedMaterial({ ...selectedMaterial, name: e.target.value })}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'right', marginTop: '20px', gap: '20px'}}>
                        <Button label="Сохранить" icon="pi pi-check" onClick={handleSave} />
                        <Button label="Отмена" icon="pi pi-times" onClick={() => setIsDialogVisible(false)} className="p-button-secondary" />
                    </div>
                </div>
            )}
        </Dialog>
        <Dialog header="Cоздать Материал" style={{ width: '500px' }} visible={isAddDialogVisible} onHide={() => setIsAddDialogVisible(false)}>
            <div>
                <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <label htmlFor="name">Название</label>
                    <InputText
                        id="name"
                        onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                    />
                </div>
                <div style={{ display: 'flex', justifyContent: 'right', marginTop: '20px', gap: '20px'}}>
                    <Button label="Сохранить" icon="pi pi-check" onClick={handleAdd} />
                    <Button label="Отмена" icon="pi pi-times" onClick={() => setIsAddDialogVisible(false)} className="p-button-secondary" />
                </div>
            </div>
        </Dialog>
        </div>
    );
};

export default StudyMaterialList;