import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

const GroupList = () => {
    const [groups, setGroups] = useState([]);

    useEffect(() => {
        const fetchGroups = async () => {
            const response = await axios.get('http://127.0.0.1:8000/groups/');
            setGroups(response.data);
        };
        fetchGroups();
    }, []);

    return (
        <div style={{ padding: '8px'}}>
            <h2>Группы</h2>
            <DataTable removableSort value={groups} paginator rows={10}>
                <Column sortable field="group_number" header="Group Number" />
            </DataTable>
        </div>
    );
};

export default GroupList;
