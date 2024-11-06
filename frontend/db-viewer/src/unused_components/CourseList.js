import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';

const CourseList = () => {
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
        name: { value: null, matchMode: 'contains' },
        description: { value: null, matchMode: 'contains' },
        cost: { value: null, matchMode: 'contains' },
        duration: { value: null, matchMode: 'contains' },
        teacher_id: { value: null, matchMode: 'contains' },
    });
    
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [newCourse, setNewCourse] = useState({ name: '', description: '', duration: '', cost: '', teacher_id: '' });
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        const fetchCourses = async () => {
            const response = await axios.get('http://127.0.0.1:8000/courses/');
            setCourses(response.data);
        };
        fetchCourses();
    }, []);

    const handleEdit = (Course) => {
        setSelectedCourse(Course);
        setIsDialogVisible(true);
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/courses/${selectedCourse.name}`, selectedCourse);
            setCourses((prevCourse) => 
                prevCourse.map((Course) => 
                    Course.name === selectedCourse.name ? selectedCourse : Course
                )
            );
            setIsDialogVisible(false);
            toast.current.show({ severity: 'success', summary: 'Успех', detail: 'Данные курса обновлены', life: 3000 });
        } catch (error) {
            console.error("Ошибка при обновлении данных:", error);
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось обновить данные', life: 3000 });
        }
    };

    const handleAdd = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/courses/', newCourse);
            setCourses((prevCourse) => [...prevCourse, response.data]);
            setIsAddDialogVisible(false);
            setNewCourse({ name: '', description: '', duration: '', cost: '', teacher_id: '' });
            toast.current.show({ severity: 'success', summary: 'Успех', detail: 'Курс добавлен', life: 3000 });
        } catch (error) {
            console.error("Ошибка при добавлении курс:", error);
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось добавить курс', life: 3000 });
        }
    };

    const header = (
        <div className="table-header">
            <h2>Список курсов</h2>
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
                removableSort 
                value={courses} 
                paginator 
                rows={10} 
                filters={filters} 
                filterDisplay="row" 
                header={header}
                emptyMessage="Курсы не найдены."
            >
                <Column 
                    sortable 
                    field="name" 
                    header="Название Курса" 
                    filter 
                    filterMatchModeOptions={filterMatchModeOptions.text}
                />
                <Column 
                    sortable 
                    field="description" 
                    header="Описание" 
                    filter 
                    filterMatchModeOptions={filterMatchModeOptions.text}
                />
                <Column 
                    sortable 
                    field="duration" 
                    header="Продолжительность (часы)" 
                    filter 
                    filterMatchModeOptions={filterMatchModeOptions.text}
                />
                <Column 
                    sortable 
                    field="cost" 
                    header="Стоимость" 
                    filter 
                    filterMatchModeOptions={filterMatchModeOptions.text}
                />
                <Column 
                    sortable 
                    field="teacher_id" 
                    header="ID Преподавателя" 
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

            <Dialog header="Редактировать курс" visible={isDialogVisible} onHide={() => setIsDialogVisible(false)}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Название</label>
                        <InputText 
                            value={selectedCourse?.name} 
                            onChange={(e) => setSelectedCourse({ ...selectedCourse, name: e.target.value })}
                            disabled
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Описание</label>
                        <InputText 
                            value={selectedCourse?.description} 
                            onChange={(e) => setSelectedCourse({ ...selectedCourse, description: e.target.value })}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Продолжительность</label>
                        <InputText 
                            value={selectedCourse?.duration} 
                            onChange={(e) => setSelectedCourse({ ...selectedCourse, duration: e.target.value })} 
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Стоимость</label>
                        <InputText 
                            value={selectedCourse?.cost} 
                            onChange={(e) => setSelectedCourse({ ...selectedCourse, cost: e.target.value })}
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>ID преподавателя</label>
                        <InputText 
                            value={selectedCourse?.teacher_id} 
                            onChange={(e) => setSelectedCourse({ ...selectedCourse, teacher_id: e.target.value })} 
                        />
                    </div>
                    
                </div>
                <div style={{ display: 'flex', justifyContent: 'right', marginTop: '20px', gap: '20px'}}>
                    <Button label="Сохранить" icon="pi pi-check" onClick={handleUpdate} />
                    <Button label="Отмена" icon="pi pi-times" onClick={() => setIsDialogVisible(false)} className="p-button-secondary" />
                </div>
            </Dialog>
    
            <Dialog header="Добавить курс" visible={isAddDialogVisible} onHide={() => setIsAddDialogVisible(false)}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Название</label>
                        <InputText 
                            onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
                            required
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Описание</label>
                        <InputText 
                            onChange={(e) => setNewCourse({ ...newCourse, description: e.target.value })} 
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Продолжительность</label>
                        <InputText 
                            onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })} 
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Стоимость</label>
                        <InputText 
                            onChange={(e) => setNewCourse({ ...newCourse, cost: e.target.value })} 
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>ID Преподавателя</label>
                        <InputText 
                            onChange={(e) => setNewCourse({ ...newCourse, teacher_id: e.target.value })} 
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

export default CourseList;
