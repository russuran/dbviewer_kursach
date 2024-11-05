from pydantic import BaseModel, constr
from typing import Optional
from datetime import date, time

# Модель для студента
class StudentCreate(BaseModel):
    login: constr(max_length=255)
    full_name: constr(max_length=255)
    contact_info: constr(max_length=255)
    password: constr(min_length=8)
    group_number: str

class Student(StudentCreate):
    class Config:
        from_attributes = True

# Модель для курса
class CourseCreate(BaseModel):
    name: constr(max_length=255)
    description: str
    duration: int
    cost: float
    teacher_id: int

class Course(CourseCreate):
    class Config:
        from_attributes = True

# Модель для занятия
class LessonCreate(BaseModel):
    lesson_id: int
    course_name: constr(max_length=255)
    date: date

class Lesson(LessonCreate):
    class Config:
        from_attributes = True

# Модель для преподавателя
class TeacherCreate(BaseModel):
    full_name: constr(max_length=255)
    contact_info: constr(max_length=255)
    qualification: Optional[constr(max_length=255)] = None

class Teacher(TeacherCreate):
    teacher_id: int
    
    class Config:
        from_attributes = True

# Модель для учебного материала
class StudyMaterialCreate(BaseModel):
    name: constr(max_length=255)

class StudyMaterial(StudyMaterialCreate):
    material_id: int
    class Config:
        from_attributes = True

# Модель для расписания
class ScheduleCreate(BaseModel):
    schedule_id: int
    group_number: constr(max_length=255)
    time: time
    weekday: constr(max_length=20)
    duration: int

class Schedule(ScheduleCreate):
    class Config:
        from_attributes = True

# Модель для группы
class GroupCreate(BaseModel):
    group_number: int
    course_name: constr(max_length=255)

class Group(GroupCreate):
    class Config:
        from_attributes = True

# Модель для успеваемости
class PerformanceCreate(BaseModel):
    login: constr(max_length=255)
    grade: int
    lesson_id: int

class Performance(PerformanceCreate):
    performance_id: int
    login: constr(max_length=255)
    grade: int
    lesson_id: int
    class Config:
        from_attributes = True

# Модель для журнала посещений
class AttendanceLogCreate(BaseModel):
    login: constr(max_length=255)
    attendance_status: constr(max_length=20) = 'Absent'
    lesson_id: int

class AttendanceLog(AttendanceLogCreate):
    attendance_id: int
    class Config:
        from_attributes = True

# Модель для содержания
class ContentCreate(BaseModel):
    name: constr(max_length=255)
    material_id: int

class Content(ContentCreate):
    class Config:
        from_attributes = True
