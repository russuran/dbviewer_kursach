import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';

const TeacherList = () => {
    const [teachers, setTeachers] = useState([]);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
        teacher_id: { value: null, matchMode: 'contains' },
        full_name: { value: null, matchMode: 'contains' },
        contact_info: { value: null, matchMode: 'contains' },
        qualification: { value: null, matchMode: 'contains' },
    });
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [newTeacher, setNewTeacher] = useState({ full_name: '', contact_info: '', qualification: '' });
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        const fetchTeachers = async () => {
            const response = await axios.get('http://127.0.0.1:8000/teachers/');
            console.log(response.data);
            setTeachers(response.data);
        };
        fetchTeachers();
    }, []);

    const handleEdit = (teacher) => {
        setSelectedTeacher(teacher);
        setIsDialogVisible(true);
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/teachers/${selectedTeacher.teacher_id}`, selectedTeacher);
            setTeachers((prevTeachers) => 
                prevTeachers.map((teacher) => 
                    teacher.teacher_id === selectedTeacher.teacher_id ? selectedTeacher : teacher
                )
            );
            setIsDialogVisible(false);
            toast.current.show({ severity: 'success', summary: 'Успех', detail: 'Данные преподавателя обновлены', life: 3000 });
        } catch (error) {
            console.error("Ошибка при обновлении данных:", error);
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось обновить данные', life: 3000 });
        }
    };

    const handleAdd = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/teachers/', newTeacher);
            setTeachers((prevTeachers) => [...prevTeachers, response.data]);
            setIsAddDialogVisible(false);
            setNewTeacher({ full_name: '', contact_info: '', qualification: '' });
            toast.current.show({ severity: 'success', summary: 'Успех', detail: 'Преподаватель добавлен', life: 3000 });
        } catch (error) {
            console.error("Ошибка при добавлении преподавателя:", error);
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось добавить преподавателя', life: 3000 });
        }
    };

    const header = (
        <div className="table-header">
            <h2>Преподаватели</h2>
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
                value={teachers} 
                paginator 
                rows={10} 
                filters={filters} 
                filterDisplay="row" 
                header={header}
                emptyMessage="Преподаватели не найдены."
            >
                <Column 
                    sortable 
                    field="teacher_id" 
                    header="ID Преподавателя" 
                    filter 
                />
                <Column 
                    sortable 
                    field="full_name" 
                    header="ФИО" 
                    filter 
                />
                <Column 
                    sortable 
                    field="contact_info" 
                    header="Контактная информация" 
                    filter 
                />
                <Column 
                    sortable 
                    field="qualification" 
                    header="Квалификация" 
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
            
            <Dialog header="Редактировать Преподавателя" visible={isDialogVisible} onHide={() => setIsDialogVisible(false)}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>ID Преподавателя</label>
                        <InputText 
                            value={selectedTeacher?.teacher_id} 
                            disabled 
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>ФИО</label>
                        <InputText 
                            value={selectedTeacher?.full_name} 
                            onChange={(e) => setSelectedTeacher({ ...selectedTeacher, full_name: e.target.value })}
                            required 
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Контактная информация</label>
                        <InputText 
                            value={selectedTeacher?.contact_info} 
                            onChange={(e) => setSelectedTeacher({ ...selectedTeacher, contact_info: e.target.value })}
                            required 
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Квалификация</label>
                        <InputText 
                            value={selectedTeacher?.qualification} 
                            onChange={(e) => setSelectedTeacher({ ...selectedTeacher, qualification: e.target.value })} 
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'right', marginTop: '20px', gap: '20px'}}>
                    <Button label="Сохранить" icon="pi pi-check" onClick={handleUpdate} />
                    <Button label="Отмена" icon="pi pi-times" onClick={() => setIsDialogVisible(false)} className="p-button-secondary" />
                </div>
            </Dialog>
    
            <Dialog header="Добавить Преподавателя" visible={isAddDialogVisible} onHide={() => setIsAddDialogVisible(false)}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>ФИО</label>
                        <InputText 
                            onChange={(e) => setNewTeacher({ ...newTeacher, full_name: e.target.value })}
                            required
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Контактная информация</label>
                        <InputText 
                            onChange={(e) => setNewTeacher({ ...newTeacher, contact_info: e.target.value })}
                            required
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Квалификация</label>
                        <InputText 
                            onChange={(e) => setNewTeacher({ ...newTeacher, qualification: e.target.value })} 
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
}    

export default TeacherList;
