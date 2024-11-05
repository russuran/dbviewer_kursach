import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';

const PerformanceList = () => {
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
        performance_id: { value: null, matchMode: 'contains' },
        student_login: { value: null, matchMode: 'contains' },
        course_name: { value: null, matchMode: 'contains' },
        grade: { value: null, matchMode: 'contains' },
    });

    const [performances, setPerformances] = useState([]);
    const [selectedPerfomance, setSelectedPerfomance] = useState(null);
    const [newPerfomance, setNewPerfomance] = useState({ performance_id: '', login: '', grade: '', lesson_id: '' });
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        const fetchPerformances = async () => {
            const response = await axios.get('http://127.0.0.1:8000/performances/');
            setPerformances(response.data);
        };
        fetchPerformances();
    }, []);

    const handleEdit = (Perfomance) => {
        setSelectedPerfomance(Perfomance);
        setIsDialogVisible(true);
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/performances/${selectedPerfomance.performance_id}`, selectedPerfomance);
            setPerformances((prevPerfomance) => 
                prevPerfomance.map((Perfomance) => 
                    Perfomance.performance_id === selectedPerfomance.performance_id ? selectedPerfomance : Perfomance
                )
            );
            setIsDialogVisible(false);
            toast.current.show({ severity: 'success', summary: 'Успех', detail: 'Данные оценки обновлены', life: 3000 });
        } catch (error) {
            console.error("Ошибка при обновлении данных:", error);
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось обновить данные', life: 3000 });
        }
    };

    const handleAdd = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/performances/', newPerfomance);
            setPerformances((prevPerfomance) => [...prevPerfomance, response.data]);
            setIsAddDialogVisible(false);
            setNewPerfomance({ performance_id: '', login: '', grade: '', lesson_id: '' });
            toast.current.show({ severity: 'success', summary: 'Успех', detail: 'Преподаватель добавлен', life: 3000 });
        } catch (error) {
            console.error("Ошибка при добавлении оценку:", error);
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось добавить оценку', life: 3000 });
        }
    };

    const header = (
        <div className="table-header">
            <h2>Успеваемость</h2>
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
            <Toast ref={toast} />
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
                    header="ID оценки" 
                    filter 
                    filterMatchModeOptions={filterMatchModeOptions.text} 
                />

                <Column 
                    sortable 
                    field="login" 
                    header="Логин Студента" 
                    filter 
                    filterMatchModeOptions={filterMatchModeOptions.text} 
                />
                <Column 
                    sortable 
                    field="lesson_id" 
                    header="ID Занятия" 
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

            <Dialog header="Редактировать оценку" visible={isDialogVisible} onHide={() => setIsDialogVisible(false)}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>ID оценки</label>
                        <InputText 
                            value={selectedPerfomance?.performance_id} 
                            onChange={(e) => setSelectedPerfomance({ ...selectedPerfomance, performance_id: e.target.value })}
                            disabled 
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Логин</label>
                        <InputText 
                            value={selectedPerfomance?.login} 
                            onChange={(e) => setSelectedPerfomance({ ...selectedPerfomance, login: e.target.value })}
                            required 
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Оценка</label>
                        <InputText 
                            value={selectedPerfomance?.grade} 
                            onChange={(e) => setSelectedPerfomance({ ...selectedPerfomance, grade: e.target.value })} 
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'right', marginTop: '20px', gap: '20px'}}>
                    <Button label="Сохранить" icon="pi pi-check" onClick={handleUpdate} />
                    <Button label="Отмена" icon="pi pi-times" onClick={() => setIsDialogVisible(false)} className="p-button-secondary" />
                </div>
            </Dialog>
    
            <Dialog header="Добавить оценку" visible={isAddDialogVisible} onHide={() => setIsAddDialogVisible(false)}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Логин</label>
                        <InputText 
                            onChange={(e) => setNewPerfomance({ ...newPerfomance, login: e.target.value })}
                            required
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Оценка</label>
                        <InputText 
                            onChange={(e) => setNewPerfomance({ ...newPerfomance, grade: e.target.value })} 
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>ID занятия</label>
                        <InputText 
                            onChange={(e) => setNewPerfomance({ ...newPerfomance, lesson_id: e.target.value })} 
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

export default PerformanceList;
