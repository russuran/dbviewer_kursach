import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import StudentList from './components/StudentList';
import CourseList from './components/CourseList';
import GroupList from './components/GroupList';
import PerformanceList from './components/PerformanceList';
import AttendanceLogList from './components/AttendanceLogList';
import LessonList from './components/LessonList'
import ContentList from './components/ContentList'
import ScheduleList from './components/ScheduleList'
import TeacherList from './components/TeacherList'
import StudyMaterialList from './components/StudyMaterialList'


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
                    <Route path="/lessons" element={<LessonList />} />
                    <Route path="/contents" element={<ContentList />} />
                    <Route path="/schedule" element={<ScheduleList />} />
                    <Route path="/teachers" element={<TeacherList />} />
                    <Route path="/sml" element={<StudyMaterialList />} />
                    <Route path="/" element={<h1>Система менеджмента учащихся v1</h1>} />
                </Routes>
            </div>
        </div>
    );
};

export default App;
