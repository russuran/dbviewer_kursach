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
    teacherConfig
} from './config';


const App = () => {
    return (
        <div>
            <Navbar />
            <div className="container">
                <Routes>
                    <Route path="/students" element={<DataTableComponent config={studentConfig} />} />
                    <Route path="/courses" element={<DataTableComponent config={courseConfig} />} />
                    <Route path="/groups" element={<DataTableComponent config={groupConfig} />} />
                    <Route path="/performances" element={<DataTableComponent config={performanceConfig} />} />
                    <Route path="/attendance_logs" element={<DataTableComponent config={attendanceLogConfig} />} />
                    <Route path="/lessons" element={<DataTableComponent config={lessonConfig} />} />
                    <Route path="/contents" element={<DataTableComponent config={contentConfig} />} />
                    <Route path="/schedule" element={<ScheduleList />} />
                    <Route path="/teachers" element={<DataTableComponent config={teacherConfig} />} />
                    <Route path="/sml" element={<DataTableComponent config={studyMaterialConfig} />} />
                    <Route path="/" element={<h1>Система менеджмента учащихся v1</h1>} />
                </Routes>
            </div>
        </div>
    );
};

export default App;