import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';


const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
        full_name: { value: null, matchMode: 'contains' },
        login: { value: null, matchMode: 'contains' },
        contact_info: { value: null, matchMode: 'contains' },
    });

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [newStudent, setNewStudent] = useState({ full_name: '', contact_info: '', login: '', group_number: '', password: '' });
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
    const toast = useRef(null);

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
        setSelectedStudent(student);
        setIsDialogVisible(true);
    };

    const handleUpdate = async () => {
        try {
            console.log(selectedStudent);
            await axios.put(`http://127.0.0.1:8000/students/${selectedStudent.login}`, selectedStudent);
            setStudents((prevStudents) => 
                prevStudents.map((Student) => 
                    Student.login === selectedStudent.login ? selectedStudent : Student
                )
            );
            setIsDialogVisible(false);
            toast.current.show({ severity: 'success', summary: 'Успех', detail: 'Данные студента обновлены', life: 3000 });
        } catch (error) {
            console.error("Ошибка при обновлении данных:", error);
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось обновить данные', life: 3000 });
        }
    };

    const handleAdd = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/students/', newStudent);
            setStudents((prevStudents) => [...prevStudents, response.data]);
            setIsAddDialogVisible(false);
            setNewStudent({ full_name: '', contact_info: '', login: '', group_number: '', password: '' });
            toast.current.show({ severity: 'success', summary: 'Успех', detail: 'Студент добавлен', life: 3000 });
        } catch (error) {
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось добавить студента', life: 3000 });
        }
    };

    const header = (
        <div className="table-header">
            <h2>Список студентов</h2>
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
            <DataTable  showGridlines
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

            <Dialog header="Редактировать Судента" visible={isDialogVisible} onHide={() => setIsDialogVisible(false)}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>ФИО</label>
                        <InputText 
                            value={selectedStudent?.full_name} 
                            onChange={(e) => setSelectedStudent({ ...selectedStudent, full_name: e.target.value })}
                            required 
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Контактная информация</label>
                        <InputText 
                            value={selectedStudent?.contact_info} 
                            onChange={(e) => setSelectedStudent({ ...selectedStudent, contact_info: e.target.value })}
                            required 
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Логин</label>
                        <InputText 
                            value={selectedStudent?.login} 
                            onChange={(e) => setSelectedStudent({ ...selectedStudent, login: e.target.value })} 
                            disabled
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Пароль</label>
                        <InputText 
                            value={selectedStudent?.password} 
                            onChange={(e) => setSelectedStudent({ ...selectedStudent, login: e.target.value })} 
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Группа</label>
                        <InputText 
                            value={selectedStudent?.group_number} 
                            onChange={(e) => setSelectedStudent({ ...selectedStudent, group_number: e.target.value })} 
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'right', marginTop: '20px', gap: '20px'}}>
                    <Button label="Сохранить" icon="pi pi-check" onClick={handleUpdate} />
                    <Button label="Отмена" icon="pi pi-times" onClick={() => setIsDialogVisible(false)} className="p-button-secondary" />
                </div>
            </Dialog>
    
            <Dialog header="Добавить Студента" visible={isAddDialogVisible} onHide={() => setIsAddDialogVisible(false)}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Логин</label>
                        <InputText 
                            onChange={(e) => setNewStudent({ ...newStudent, login: e.target.value })}
                            required
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>ФИО</label>
                        <InputText 
                            onChange={(e) => setNewStudent({ ...newStudent, full_name: e.target.value })}
                            required
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Контактная информация</label>
                        <InputText 
                            onChange={(e) => setNewStudent({ ...newStudent, contact_info: e.target.value })} 
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Пароль</label>
                        <InputText 
                            onChange={(e) => setNewStudent({ ...newStudent, password: e.target.value })} 
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Группа</label>
                        <InputText 
                            onChange={(e) => setNewStudent({ ...newStudent, group_number: e.target.value })} 
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

export default StudentList;
