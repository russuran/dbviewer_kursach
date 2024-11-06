import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';

const AttendanceLogList = () => {
    
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: 'contains' },
    });
    
    const [attendanceLogs, setAttendanceLogs] = useState([]);
    const [selectedLog, setSelectedLog] = useState(null);
    const [newLog, setNewLog] = useState({ attendance_id: '', login: '', attendance_status: '', lesson_id: '' });
    const [isDialogVisible, setIsDialogVisible] = useState(false);
    const [isAddDialogVisible, setIsAddDialogVisible] = useState(false);
    const toast = useRef(null);

    useEffect(() => {
        const fetchAttendanceLogs = async () => {
            const response = await axios.get('http://127.0.0.1:8000/attendance_logs/');
            setAttendanceLogs(response.data);
        };
        fetchAttendanceLogs();
    }, []);

    const handleEdit = (Perfomance) => {
        setSelectedLog(Perfomance);
        setIsDialogVisible(true);
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/attendance_logs/${selectedLog.attendance_id}`, selectedLog);
            setAttendanceLogs((prevLogs) => 
                prevLogs.map((AttendanceLog) => 
                    AttendanceLog.attendance_id === selectedLog.attendance_id ? selectedLog : AttendanceLog
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
            const response = await axios.post('http://127.0.0.1:8000/attendance_logs/', newLog);
            setAttendanceLogs((prevLogs) => [...prevLogs, response.data]);
            setIsAddDialogVisible(false);
            setNewLog({ attendance_id: '', login: '', attendance_status: '', lesson_id: '' });
            toast.current.show({ severity: 'success', summary: 'Успех', detail: 'Преподаватель добавлен', life: 3000 });
        } catch (error) {
            console.error("Ошибка при добавлении посещение:", error);
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось добавить посещение', life: 3000 });
        }
    };

    const header = (
        <div className="table-header">
            <h2>Посещаемость</h2>
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
                value={attendanceLogs} 
                paginator 
                rows={10} 
                filters={filters} 
                filterDisplay="row" 
                header={header}
                emptyMessage="Записи о посещаемости не найдены."
            >
                <Column 
                    sortable 
                    field="attendance_id" 
                    header="ID Посещаемости" 
                    filter 
                />
                <Column 
                    sortable 
                    field="login" 
                    header="Логин Студента" 
                    filter 
                />
                <Column 
                    sortable 
                    field="lesson_id" 
                    header="ID Урока" 
                    filter 
                />
                <Column 
                    sortable 
                    field="attendance_status" 
                    header="Статус" 
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

            <Dialog header="Редактировать посещение" visible={isDialogVisible} onHide={() => setIsDialogVisible(false)}>
                <div>
                <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>ID посещения</label>
                        <InputText 
                            value={selectedLog?.attendance_id} 
                            onChange={(e) => setSelectedLog({ ...selectedLog, attendance_id: e.target.value })} 
                            disabled
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Логин</label>
                        <InputText 
                            value={selectedLog?.login} 
                            onChange={(e) => setSelectedLog({ ...selectedLog, login: e.target.value })}
                            required 
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>ID занятия</label>
                        <InputText 
                            value={selectedLog?.lesson_id} 
                            onChange={(e) => setSelectedLog({ ...selectedLog, lesson_id: e.target.value })} 
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Статус</label>
                        <InputText 
                            value={selectedLog?.attendance_status} 
                            onChange={(e) => setSelectedLog({ ...selectedLog, attendance_status: e.target.value })} 
                        />
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'right', marginTop: '20px', gap: '20px'}}>
                    <Button label="Сохранить" icon="pi pi-check" onClick={handleUpdate} />
                    <Button label="Отмена" icon="pi pi-times" onClick={() => setIsDialogVisible(false)} className="p-button-secondary" />
                </div>
            </Dialog>
    
            <Dialog header="Добавить посещение" visible={isAddDialogVisible} onHide={() => setIsAddDialogVisible(false)}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Логин</label>
                        <InputText 
                            onChange={(e) => setNewLog({ ...newLog, login: e.target.value })}
                            required
                        />
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>ID занятия</label>
                        <InputText 
                            onChange={(e) => setNewLog({ ...newLog, lesson_id: e.target.value })} 
                        />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                        <label>Статус</label>
                        <InputText 
                            onChange={(e) => setNewLog({ ...newLog, attendance_status: e.target.value })} 
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

export default AttendanceLogList;
