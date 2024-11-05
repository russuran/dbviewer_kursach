import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';


const GroupList = () => {
    
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
        group_number: { value: null, matchMode: 'contains' },
        course_name: { value: null, matchMode: 'contains' },
    });
    const [groups, setGroups] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState(null);
    const [newGroup, setNewGroups] = useState({ group_number: 0, course_name: '' });
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        const fetchGroups = async () => {
            const response = await axios.get('http://127.0.0.1:8000/groups/');
            setGroups(response.data);
        };
        fetchGroups();
    }, []);

    const handleEdit = (Group) => {
        setSelectedGroups(Group);
        setIsDialogVisible(true);
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/groups/${selectedGroups.group_number}`, selectedGroups);
            setGroups((prevGroup) => 
                prevGroup.map((Group) => 
                    Group.group_number === selectedGroups.group_number ? selectedGroups : Group
                )
            );
            setIsDialogVisible(false);
            toast.current.show({ severity: 'success', summary: 'Успех', detail: 'Данные группы обновлены', life: 3000 });
        } catch (error) {
            console.error("Ошибка при обновлении данных:", error);
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось обновить данные', life: 3000 });
        }
    };

    const handleAdd = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/groups/', newGroup);
            setGroups((prevGroup) => [...prevGroup, response.data]);
            setIsAddDialogVisible(false);
            setNewGroups({ performance_id: '', login: '', grade: '', lesson_id: '' });
            toast.current.show({ severity: 'success', summary: 'Успех', detail: 'Преподаватель добавлен', life: 3000 });
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось добавить группу', life: 3000 });
        }
    };

    const header = (
        <div className="table-header">
            <h2>Группы</h2>
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
            <DataTable  showGridlines 
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

            <Dialog header="Редактировать группу" visible={isDialogVisible} onHide={() => setIsDialogVisible(false)}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Номер группы</label>
                        <InputText 
                            value={selectedGroups?.group_number} 
                            onChange={(e) => setSelectedGroups({ ...selectedGroups, performance_id: e.target.value })}
                            disabled 
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Название курса</label>
                        <InputText 
                            value={selectedGroups?.course_name} 
                            onChange={(e) => setSelectedGroups({ ...selectedGroups, course_name: e.target.value })}
                            required 
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'right', marginTop: '20px', gap: '20px'}}>
                    <Button label="Сохранить" icon="pi pi-check" onClick={handleUpdate} />
                    <Button label="Отмена" icon="pi pi-times" onClick={() => setIsDialogVisible(false)} className="p-button-secondary" />
                </div>
            </Dialog>
    
            <Dialog header="Добавить группу" visible={isAddDialogVisible} onHide={() => setIsAddDialogVisible(false)}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Номер группы</label>
                        <InputText 
                            onChange={(e) => setNewGroups({ ...newGroup, group_number: e.target.value })}
                            required
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Название курса</label>
                        <InputText 
                            onChange={(e) => setNewGroups({ ...newGroup, course_name: e.target.value })} 
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'right', marginTop: '20px', gap: '20px'}}>
                    <Button label="Добавить" icon="pi pi-check" onClick={handleAdd} />
                    <Button label="Отмена" icon="pi pi-times" onClick={() => setIsAddDialogVisible(false)} className="p-button-secondary" />
                </div>
            </Dialog>

        </div>
    );
};

export default GroupList;
