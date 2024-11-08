import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Navbar from './components/Navbar';
import ScheduleList from './components/ScheduleList'
import DataTableComponent from './components/DataTableComponent';

import { 
    studentConfig, 
    groupConfig, 
    attendanceLogConfig, 
    courseConfig, 
    contentConfig, 
    lessonConfig, 
    performanceConfig, 
    studyMaterialConfig, 
    teacherConfig,
    filters
} from './config';


const App = () => {
    return (
        <div>
            <Navbar />
            <div className="container">
                <Routes>
                    <Route path="/students" element={<DataTableComponent config={studentConfig} fitlers_to_pass={filters} />} />
                    <Route path="/courses" element={<DataTableComponent config={courseConfig} fitlers_to_pass={filters} />} />
                    <Route path="/groups" element={<DataTableComponent config={groupConfig} fitlers_to_pass={filters} />} />
                    <Route path="/performances" element={<DataTableComponent config={performanceConfig} fitlers_to_pass={filters} />} />
                    <Route path="/attendance_logs" element={<DataTableComponent config={attendanceLogConfig} fitlers_to_pass={filters} />} />
                    <Route path="/lessons" element={<DataTableComponent config={lessonConfig} fitlers_to_pass={filters} />} />
                    <Route path="/contents" element={<DataTableComponent config={contentConfig} fitlers_to_pass={filters} />} />
                    <Route path="/schedule" element={<ScheduleList />} />
                    <Route path="/teachers" element={<DataTableComponent config={teacherConfig} fitlers_to_pass={filters} />} />
                    <Route path="/sml" element={<DataTableComponent config={studyMaterialConfig} fitlers_to_pass={filters} />} />
                    <Route path="/" element={<h1>Система менеджмента учащихся v1</h1>} />
                </Routes>
            </div>
        </div>
    );
};

export default App;