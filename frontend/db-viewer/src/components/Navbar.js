import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const items = [
        {
            label: 'Студенты',
            icon: 'pi pi-fw pi-users',
            path: '/students'
        },
        {
            label: 'Курсы',
            icon: 'pi pi-fw pi-book',
            path: '/courses'
        },
        {
            label: 'Группы',
            icon: 'pi pi-fw pi-users',
            path: '/groups'
        },
        {
            label: 'Успеваемость',
            icon: 'pi pi-fw pi-star',
            path: '/performances'
        },
        {
            label: 'Посещаемость',
            icon: 'pi pi-fw pi-calendar',
            path: '/attendance_logs'
        },
        {
            label: 'Преподаватели',
            icon: 'pi pi-fw pi-building-columns',
            path: '/teachers'
        },
        {
            label: 'Курсы',
            icon: 'pi pi-fw pi-folder',
            path: '/courses'
        },
        {
            label: 'Занятия',
            icon: 'pi pi-fw pi-save',
            path: '/lessons'
        },
        {
            label: 'Уч. Материал',
            icon: 'pi pi-fw pi-file-word',
            path: '/sml'
        },
        {
            label: 'Содержание',
            icon: 'pi pi-fw pi-paperclip',
            path: '/contents'
        }
    ];

    const menuItems = items.map(item => ({
        label: item.label,
        icon: item.icon,
        template: () => (
            <Link to={item.path} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', padding:'1rem 0.75rem' }}>
                <i className={item.icon} style={{ marginRight: '0.5em' }}></i>
                {item.label}
            </Link>
        )
    }));

    return (
        <Menubar model={menuItems} />
    );
};

export default Navbar;
