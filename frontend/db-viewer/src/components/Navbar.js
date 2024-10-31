import React from 'react';
import { Menubar } from 'primereact/menubar';

const Navbar = () => {
    const items = [
        {
            label: 'Студенты',
            icon: 'pi pi-fw pi-users',
            command: () => { window.location.href = '/students'; }
        },
        {
            label: 'Курсы',
            icon: 'pi pi-fw pi-book',
            command: () => { window.location.href = '/courses'; }
        },
        {
            label: 'Группы',
            icon: 'pi pi-fw pi-users',
            command: () => { window.location.href = '/groups'; }
        },
        {
            label: 'Успеваемость',
            icon: 'pi pi-fw pi-star',
            command: () => { window.location.href = '/performances'; }
        },
        {
            label: 'Посещаемость',
            icon: 'pi pi-fw pi-calendar',
            command: () => { window.location.href = '/attendance_logs'; }
        }
    ];

    return (
        <Menubar model={items} />
    );
};

export default Navbar;
