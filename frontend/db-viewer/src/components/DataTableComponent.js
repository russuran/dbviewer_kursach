import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';


const DataTableComponent = ({ config, fitlers_to_pass }) => {
    const [data, setData] = useState([]);
    const [filters, setFilters] = useState(fitlers_to_pass);

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

    const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);
    const [isModalOpenEdit, setIsModalOpenEdit] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [newItem, setNewItem] = useState(config.initialState);
    const toast = useRef(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(config.apiEndpoint, {});
                setData(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке данных', error);
            }
        };

        fetchData();
    }, [config.apiEndpoint]);

    const handleEdit = (item) => {
        setSelectedItem(item);
        setNewItem(item);
        setIsModalOpenEdit(true);
    };

    const handleDelete = async (item) => {
        try {
            setSelectedItem(item);
            await axios.delete(`${config.apiEndpoint}${item[config.edit_key]}`);
            
            setData((prevData) =>
                prevData.filter((prevItem) => prevItem[config.edit_key] !== item[config.edit_key])
            );
    
            toast.current.show({ severity: 'success', summary: 'Успех', detail: 'Запись удалена', life: 3000 });
        } catch (error) {
            console.error("Ошибка при удалении записи:", error);
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось удалить запись', life: 3000 });
        }
    };
    

    const handleUpdate = async () => {
        try {
            await axios.put(`${config.apiEndpoint}${selectedItem[config.edit_key]}`, newItem, {});

            setData((prevData) =>
                prevData.map((item) => (item[config.edit_key] === selectedItem[config.edit_key] ? newItem : item))
            );
            setIsModalOpenEdit(false);
            toast.current.show({ severity: 'success', summary: 'Успех', detail: 'Запись обновлена', life: 3000 });
        } catch (error) {
            console.error("Ошибка при обновлении записи:", error);
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось обновить запись', life: 3000 });
        }
    };

    const handleAdd = async () => {
        try {
            const response = await axios.post(config.apiEndpoint, newItem, {});
            setData((prevData) => [...prevData, response.data]);
            setIsModalOpenAdd(false);
            setNewItem(config.initialState);
            toast.current.show({ severity: 'success', summary: 'Успех', detail: 'Запись добавлена', life: 3000 });
        } catch (error) {
            console.error("Ошибка при добавлении записи:", error);
            toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось добавить запись', life: 3000 });
        }
    };

    const header = (
        <div>
            <h2>{config.title}</h2>
            <Button label="" icon="pi pi-plus" onClick={() => [setIsModalOpenAdd(true), setNewItem(config.initialState)]} style={{ marginRight: '20px' }} />
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
        <>
            <Toast ref={toast} />
            <DataTable
                style={{ padding: '16px' }}
                value={data}
                showGridlines
                rows={10}
                filters={filters}
                filterDisplay="row"
                header={header}
                emptyMessage="Записи не найдены."
                removableSort
            >
                {config.columns.map((col) => (
                    <Column key={col.field} 
                            field={col.field} 
                            header={col.header} 
                            sortable={col.sortable} 
                            filter={col.filter}
                            filterMatchModeOptions={filterMatchModeOptions.text} />
                ))}
                <Column
                    header="Действия"
                    body={(rowData) => (
                        <div style={{ display: 'flex', gap: '20px'}}>
                        <Button
                            label="Редактировать"
                            icon="pi pi-pencil"
                            onClick={() => handleEdit(rowData)}
                        />
                        <Button
                            label="Удалить"
                            icon="pi pi-times"
                            onClick={() => handleDelete(rowData)}
                        />
                        </div>
                    )}
                    style={{ minWidth: '8rem' }}
                />
            </DataTable>

            <Dialog header="Добавить Запись" visible={isModalOpenAdd} onHide={() => setIsModalOpenAdd(false)}>
                <div>
                    {config.columns.map((col) => (
                        <div key={col.field} style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                            <label>{col.header}</label>
                            {col.dropdown ? (
                                col.dropdown.options ? (
                                    <Dropdown 
                                        style={{ width: '236px' }}
                                        value={newItem[col.field]} 
                                        onChange={(e) => setNewItem({ ...newItem, [col.field]: e.target.value })}
                                        options={col.dropdown.options} 
                                        checkmark={true}  
                                        highlightOnSelect={false} 
                                    />
                                ) : (
                                    <div>Загрузка опций</div>
                                )
                            ) : (
                                <InputText
                                    style={{ width: '236px' }}
                                    value={newItem[col.field]}
                                    onChange={(e) => setNewItem({ ...newItem, [col.field]: e.target.value })}
                                    disabled={col.disabled}
                                />
                            )}

                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'right', marginTop: '20px', gap: '20px' }}>
                    <Button label="Добавить" icon="pi pi-check" onClick={handleAdd} />
                    <Button label="Отмена" icon="pi pi-times" onClick={() => setIsModalOpenAdd(false)} className="p-button-secondary" />
                </div>
            </Dialog>

            <Dialog header="Редактировать Запись" visible={isModalOpenEdit} onHide={() => setIsModalOpenEdit(false)}>
                <div>
                    {config.columns.map((col) => (
                        <div key={col.field} style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
                            <label>{col.header}</label>

                            {col.dropdown ? (
                                col.dropdown.options ? (
                                    <Dropdown 
                                        style={{ width: '236px' }}
                                        value={newItem[col.field]}
                                        onChange={(e) => setNewItem({ ...newItem, [col.field]: e.target.value })}
                                        options={col.dropdown.options} 
                                        checkmark={true}  
                                        highlightOnSelect={false} 
                                    />
                                ) : (
                                    <div>Загрузка опций</div>
                                )
                            ) : (
                                <InputText
                                    style={{ width: '236px' }}
                                    value={newItem[col.field]}
                                    onChange={(e) => setNewItem({ ...newItem, [col.field]: e.target.value })}
                                    disabled={col.disabled}
                                />
                            )}

                        </div>
                    ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'right', marginTop: '20px', gap: '20px' }}>
                    <Button label="Сохранить" icon="pi pi-check" onClick={handleUpdate} />
                    <Button label="Отмена" icon="pi pi-times" onClick={() => setIsModalOpenEdit(false)} className="p-button-secondary" />
                </div>
            </Dialog>
        </>
    );
};

export default DataTableComponent;

