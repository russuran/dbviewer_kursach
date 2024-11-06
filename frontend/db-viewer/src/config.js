function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0'); // Получаем день и добавляем ведущий ноль
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Получаем месяц (0-11) и добавляем ведущий ноль
    const year = date.getFullYear(); // Получаем год
    return `${day}.${month}.${year}`; // Форматируем строку
}



export const teacherConfig = {
    apiEndpoint: 'http://127.0.0.1:8000/teachers/',
    columns: [
        { field: 'teacher_id', header: 'ID Преподавателя', sortable: true, filter: true },
        { field: 'full_name', header: 'ФИО', sortable: true, filter: true },
        { field: 'contact_info', header: 'Контактная информация', sortable: true, filter: true },
        { field: 'qualification', header: 'Квалификация', sortable: true, filter: true },
    ],
    initialState: {
        full_name: '',
        contact_info: '',
        qualification: '',
    },
    filters: {
        global: { value: null, matchMode: 'contains' },
        teacher_id: { value: null, matchMode: 'contains' },
        full_name: { value: null, matchMode: 'contains' },
        contact_info: { value: null, matchMode: 'contains' },
        qualification: { value: null, matchMode: 'contains' },
    },
    edit_key: 'teacher_id'
};

export const studyMaterialConfig = {
    apiEndpoint: 'http://127.0.0.1:8000/study_materials/',
    columns: [
        { field: 'material_id', header: 'ID Материала', sortable: true, filter: true, disabled: true },
        { field: 'name', header: 'Название', sortable: true, filter: true },
    ],
    initialState: {
        name: '',
    },
    filters: {
        global: { value: null, matchMode: 'contains' },
        material_id: { value: null, matchMode: 'contains' },
        name: { value: null, matchMode: 'contains' }
    },
    edit_key: 'material_id'
};

export const studentConfig = {
    apiEndpoint: 'http://127.0.0.1:8000/students/',
    columns: [
        { field: 'full_name', header: 'ФИО', sortable: true, filter: true },
        { field: 'login', header: 'Логин', sortable: true, filter: true },
        { field: 'contact_info', header: 'Контактная информация', sortable: true, filter: true },
    ],
    initialState: {
        full_name: '',
        contact_info: '',
        login: '',
        group_number: '',
        password: '',
    },
    filters: {
        global: { value: null, matchMode: 'contains' },
        full_name: { value: null, matchMode: 'contains' },
        login: { value: null, matchMode: 'contains' },
        contact_info: { value: null, matchMode: 'contains' }
    },
    edit_key: 'login'
};

export const performanceConfig = {
    apiEndpoint: 'http://127.0.0.1:8000/performances/',
    columns: [
        { field: 'performance_id', header: 'ID оценки', sortable: true, filter: true, disabled: true },
        { field: 'login', header: 'Логин Студента', sortable: true, filter: true },
        { field: 'lesson_id', header: 'ID Занятия', sortable: true, filter: true },
        { field: 'grade', header: 'Оценка', sortable: true, filter: true },
    ],
    initialState: {
        performance_id: '',
        login: '',
        grade: '',
        lesson_id: '',
    },
    filters: {
        global: { value: null, matchMode: 'contains' },
        performance_id: { value: null, matchMode: 'contains' },
        student_login: { value: null, matchMode: 'contains' },
        course_name: { value: null, matchMode: 'contains' },
        grade: { value: null, matchMode: 'contains' },
    },
    edit_key: 'performance_id'
};

export const lessonConfig = {
    apiEndpoint: 'http://127.0.0.1:8000/lessons/',
    columns: [
        { field: 'lesson_id', header: 'ID Урока', sortable: true, filter: true },
        { field: 'course_name', header: 'Название Курса', sortable: true, filter: true },
        { field: 'date', header: 'Дата', sortable: true, filter: true,
            format: (rowData) => {
                const date = new Date(rowData.date);
                if (isNaN(date.getTime())) {
                    return 'Некорректная дата';
                }
                return formatDate(date);
            }
        }
    ],
    initialState: {
        lesson_id: '',
        course_name: '',
        date: '',
    },
    filters: {
        global: { value: null, matchMode: 'contains' },
        lesson_id: { value: null, matchMode: 'contains' },
        course_name: { value: null, matchMode: 'contains' },
        date: { value: null, matchMode: 'contains' }
    },
    edit_key: 'lesson_id'
};

export const groupConfig = {
    apiEndpoint: 'http://127.0.0.1:8000/groups/',
    columns: [
        { field: 'group_number', header: 'Номер Группы', sortable: true, filter: true },
        { field: 'course_name', header: 'Название Курса', sortable: true, filter: true },
    ],
    initialState: {
        group_number: 0,
        course_name: '',
    },
    filters: {
        global: { value: null, matchMode: 'contains' },
        group_number: { value: null, matchMode: 'contains' },
        course_name: { value: null, matchMode: 'contains' }
    },
    edit_key: 'group_number'
};

export const courseConfig = {
    apiEndpoint: 'http://127.0.0.1:8000/courses/',
    columns: [
        { field: 'name', header: 'Название Курса', sortable: true, filter: true },
        { field: 'description', header: 'Описание', sortable: true, filter: true },
        { field: 'duration', header: 'Продолжительность (часы)', sortable: true, filter: true },
        { field: 'cost', header: 'Стоимость', sortable: true, filter: true },
        { field: 'teacher_id', header: 'ID Преподавателя', sortable: true, filter: true },
    ],
    initialState: {
        name: '',
        description: '',
        duration: '',
        cost: '',
        teacher_id: '',
    },
    filters: {
        global: { value: null, matchMode: 'contains' },
        name: { value: null, matchMode: 'contains' },
        description: { value: null, matchMode: 'contains' },
        cost: { value: null, matchMode: 'contains' },
        duration: { value: null, matchMode: 'contains' },
        teacher_id: { value: null, matchMode: 'contains' }
    },
    edit_key: 'name'
};

export const contentConfig = {
    apiEndpoint: 'http://127.0.0.1:8000/contents/',
    columns: [
        { field: 'name', header: 'Название', sortable: true, filter: true },
        { field: 'material_id', header: 'ID Материала', sortable: true, filter: true, disabled: true },
    ],
    initialState: {
        id: '',
        name: '',
        material_id: '',
    },
    filters: {
        global: { value: null, matchMode: 'contains' } ,
        name: { value: null, matchMode: 'contains' },
        material_id: { value: null, matchMode: 'contains' },
    },
    edit_key: 'id'
};

export const attendanceLogConfig = {
    apiEndpoint: 'http://127.0.0.1:8000/attendance_logs/',
    columns: [
        //{ field: 'attendance_id', header: 'ID Посещаемости', sortable: true, filter: true },
        { field: 'login', header: 'Логин Студента', sortable: true, filter: true },
        { field: 'lesson_id', header: 'ID Урока', sortable: true, filter: true },
        { field: 'attendance_status', header: 'Статус', sortable: true, filter: true },
    ],
    initialState: {
        attendance_id: '',
        login: '',
        attendance_status: '',
        lesson_id: '',
    },
    filters: {
        global: { value: null, matchMode: 'contains' }
    },
    edit_key: 'attendance_id'
};

