import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import StudentList from './components/StudentList';
import CourseList from './components/CourseList';
import GroupList from './components/GroupList';
import PerformanceList from './components/PerformanceList';
import AttendanceLogList from './components/AttendanceLogList';

const App = () => {
    return (
        <div>
            <Navbar />
            <div className="container">
                <Routes>
                    <Route path="/students" element={<StudentList />} />
                    <Route path="/courses" element={<CourseList />} />
                    <Route path="/groups" element={<GroupList />} />
                    <Route path="/performances" element={<PerformanceList />} />
                    <Route path="/attendance_logs" element={<AttendanceLogList />} />
                    <Route path="/" element={<h1>Welcome to the School Management System</h1>} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
