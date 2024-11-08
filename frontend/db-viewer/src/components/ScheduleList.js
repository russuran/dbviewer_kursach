import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Card } from 'primereact/card';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';

const DataCard = ({ title, description }) => {
  const cardStyle = {
    width: '200px',
    backgroundColor: '#0d0d0d',
    color: 'white',
    height: '120px'
  };

  return (
    <div className="card-container">
      <Card title={title} style={cardStyle}>
        <p>{description}</p>
      </Card>
    </div>
  );
};


const DataTableComponent = () => {
  const [data, setData] = useState([]);
  const [groups, setGroups] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItem, setNewItem] = useState({ group_number: '', time: '', weekday: '', duration: ''});
  const toast = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
          const response1 = await axios.get('http://127.0.0.1:8000/schedules', {});
          setData(response1.data);

          const response2 = await axios.get('http://127.0.0.1:8000/group_options', {}); 
          setGroups(response2.data);
      } catch (error) {
          console.error('Ошибка при загрузке данных', error);
      }
    };

      fetchData();
    }, []);

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  console.log(groups);
  const times = [];
  for (let hour = 8; hour <= 20; hour++) {
      times.push(`${hour}:00`);
      times.push(`${hour}:30`);
  }


  const [isModalOpenAdd, setIsModalOpenAdd] = useState(false);

  const tableData = data.map((item) => {
    const row = { time: item.time, group_number: item.group_number, duration: item.duration };
    
    daysOfWeek.forEach((day) => {
      if (day === item.weekday) {
        row[day] = <DataCard title={item.group_number} description={item.duration} />;
      } else {
        row[day] = null;
      }
    });
    
    return row;
  });


  const handleDelete = async (item) => {
    try {
        setSelectedItem(item);
        await axios.delete(``); 
        
        setData((prevData) =>
            prevData.filter((prevItem) => (prevItem.group_number !== item.group_number && prevItem.duration !== item.duration))
        );

        toast.current.show({ severity: 'success', summary: 'Успех', detail: 'Запись удалена', life: 3000 });
    } catch (error) {
        console.error("Ошибка при удалении записи:", error);
        toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось удалить запись', life: 3000 });
    }
  };



  const handleAdd = async () => {
      try {
          const date = new Date(newItem.time);
          const hours = String(date.getHours()).padStart(2, '0');
          const minutes = String(date.getMinutes()).padStart(2, '0');
          const formattedTime = `${hours}:${minutes}`;
          newItem.time = formattedTime;
          const response = await axios.post('http://127.0.0.1:8000/schedules', newItem, {});
          setData((prevData) => [...prevData, response.data]);
          setIsModalOpenAdd(false);
          setNewItem({ group_number: '', time: '', weekday: '', duration: ''});
          toast.current.show({ severity: 'success', summary: 'Успех', detail: 'Запись добавлена', life: 3000 });
      } catch (error) {
          console.error(123123, error);
          toast.current.show({ severity: 'error', summary: 'Ошибка', detail: 'Не удалось добавить запись', life: 3000 });
      }
  };

  const header = (
    <div>
        <h2>Расписание</h2>
        <Button label="" icon="pi pi-plus" onClick={() => [setIsModalOpenAdd(true), setNewItem({ group_number: '', time: '', weekday: '', duration: ''})]} style={{ marginRight: '20px' }} />
        <span className="p-input-icon-left">
            
        </span>
    </div>
  );


  return (
    <div>
      <Toast ref={toast} />
      <DataTable value={tableData} rows={30} header={header}>
        <Column field="time" header="Время" sortable/>
        {daysOfWeek.map((day) => (
          <Column key={day} field={day} header={day} />
        ))}
      </DataTable>

      <Dialog header="Добавить Запись" visible={isModalOpenAdd} onHide={() => setIsModalOpenAdd(false)}>
      <div>

        <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
            <label>Номер группы</label>
            {
            groups ?
            <Dropdown 
                style={{ width: '236px' }}
                value={newItem.group_number} 
                onChange={(e) => setNewItem({ ...newItem, group_number: e.target.value })}
                options={groups} 
                checkmark={true}  
                highlightOnSelect={false} 
            />
            :
            <p>Загрузка</p>
            }

        </div>

        <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
            <label>Время</label>
            <Calendar value={newItem.time} 
                      onChange={(e) => setNewItem({ ...newItem, time: e.target.value })} 
                      timeOnly 
            />

        </div>

        <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
            <label>День недели</label>
            <Dropdown 
                style={{ width: '236px' }}
                value={newItem.weekday} 
                onChange={(e) => setNewItem({ ...newItem, weekday: e.target.value })}
                options={daysOfWeek} 
            />
        </div>

        <div style={{ display: 'flex', alignItems: 'baseline',  justifyContent: 'space-between', marginTop: '20px', gap: '20px'}}>
            <label>Продолжительность</label>
            <InputText 
                value={newItem.duration} 
                onChange={(e) => setNewItem({ ...newItem, duration: e.target.value })}
                required 
            />
        </div>
        
        </div>
        <div style={{ display: 'flex', justifyContent: 'right', marginTop: '20px', gap: '20px'}}>
           <Button label="Сохранить" icon="pi pi-check" onClick={handleAdd} />
           <Button label="Отмена" icon="pi pi-times" onClick={() => setIsModalOpenAdd(false)} className="p-button-secondary" />
        </div>
            </Dialog>

    </div>
  );
};

export default DataTableComponent;
