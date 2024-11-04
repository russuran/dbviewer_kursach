import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

const ItemType = 'SCHEDULE';

const ScheduleItem = ({ schedule, index, moveSchedule }) => {
    const [, ref] = useDrag({
        type: ItemType,
        item: { index },
    });

    const [, drop] = useDrop({
        accept: ItemType,
        hover(item) {
            if (item.index !== index) {
                moveSchedule(item.index, index);
                item.index = index;
            }
        },
    });

    return (
        <div
            ref={(node) => ref(drop(node))}
            style={{
                userSelect: 'none',
                padding: '10px',
                margin: '0 0 10px 0',
                background: '#fff',
                borderRadius: '5px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
            }}
        >
            <p>Group Number: {schedule.group_number}</p>
            <p>Time: {schedule.time}</p>
            <p>Duration: {schedule.duration} min</p>
        </div>
    );
};

const ScheduleColumn = ({ day, schedules, moveSchedule }) => {
    return (
        <div style={{ background: '#f0f0f0', padding: '10px', width: '200px', borderRadius: '5px', margin: '0 10px' }}>
            <h3>{day}</h3>
            {schedules.map((schedule, index) => (
                <ScheduleItem key={schedule.schedule_id} index={index} schedule={schedule} moveSchedule={moveSchedule} />
            ))}
        </div>
    );
};

const ScheduleList = () => {
    const [schedules, setSchedules] = useState([]);
    const [columns, setColumns] = useState({
        Monday: [],
        Tuesday: [],
        Wednesday: [],
        Thursday: [],
        Friday: [],
        Saturday: [],
        Sunday: [],
    });

    useEffect(() => {
        const fetchSchedules = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/schedules/');
                setSchedules(response.data);
                organizeSchedules(response.data);
            } catch (error) {
                console.error("Ошибка при получении расписания:", error);
            }
        };
        fetchSchedules();
    }, []);

    const organizeSchedules = (schedules) => {
        const newColumns = { ...columns };
        schedules.forEach(schedule => {
            if (newColumns[schedule.weekday]) {
                newColumns[schedule.weekday].push(schedule);
            } else {
                console.warn(`Invalid weekday: ${schedule.weekday}`);
            }
        });
        setColumns(newColumns);
    };

    const moveSchedule = (fromIndex, toIndex, day) => {
        const newColumns = { ...columns };
        const scheduleToMove = newColumns[day].splice(fromIndex, 1)[0];
        newColumns[day].splice(toIndex, 0, scheduleToMove);
        setColumns(newColumns);
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                {Object.keys(columns).map((day) => (
                    <ScheduleColumn key={day} day={day} schedules={columns[day]} moveSchedule={(fromIndex, toIndex) => moveSchedule(fromIndex, toIndex, day)} />
                ))}
            </div>
        </DndProvider>
    );
};

export default ScheduleList;
