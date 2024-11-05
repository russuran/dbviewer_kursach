from sqlalchemy import create_engine, Column, Integer, String, Text, ForeignKey, Date, Time, DECIMAL, CheckConstraint
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from database import Base

class Student(Base):
    __tablename__ = 'Student'
    
    login = Column(String(255), primary_key=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    contact_info = Column(String(255), nullable=False, unique=True)
    password = Column(String(255), nullable=False)
    group_number = Column(String, ForeignKey('Group.group_number'), nullable=False)
    
    __table_args__ = (
        CheckConstraint('LENGTH(password) >= 8', name='check_password_length'),
    )

class Course(Base):
    __tablename__ = 'Course'
    
    name = Column(String(255), primary_key=True, nullable=False)
    description = Column(Text, nullable=False)
    duration = Column(Integer, nullable=False)
    cost = Column(DECIMAL(10, 2), nullable=False)
    teacher_id = Column(Integer, ForeignKey('Teacher.teacher_id'), nullable=False)
    
    __table_args__ = (
        CheckConstraint('duration >= 0', name='check_duration_non_negative'),
        CheckConstraint('cost > 0', name='check_cost_positive'),
    )

class Lesson(Base):
    __tablename__ = 'Lesson'
    
    lesson_id = Column(Integer, primary_key=True, nullable=False)
    course_name = Column(String(255), ForeignKey('Course.name'), nullable=False)
    date = Column(Date, nullable=False)

class Teacher(Base):
    __tablename__ = 'Teacher'
    
    teacher_id = Column(Integer, primary_key=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    contact_info = Column(String(255), nullable=False, unique=True)
    qualification = Column(String(255))

class StudyMaterial(Base):
    __tablename__ = 'StudyMaterial'
    
    material_id = Column(Integer, primary_key=True, nullable=False)
    name = Column(String(255), nullable=False)

class Schedule(Base):
    __tablename__ = 'Schedule'
    
    schedule_id = Column(Integer, primary_key=True, nullable=False)
    group_number = Column(String(255), ForeignKey('Group.group_number'), nullable=False)
    time = Column(Time, nullable=False)
    weekday = Column(String(20), nullable=False)
    duration = Column(Integer, nullable=False)
    
    __table_args__ = (
        CheckConstraint("weekday IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')", name='check_weekday'),
        CheckConstraint('duration > 0', name='check_duration_positive'),
    )

class Group(Base):
    __tablename__ = 'Group'
    
    group_number = Column(String, primary_key=True, nullable=False)
    course_name = Column(String(255), ForeignKey('Course.name'), nullable=False)

class Performance(Base):
    __tablename__ = 'Performance'
    
    performance_id = Column(Integer, primary_key=True, nullable=False)
    login = Column(String(255), ForeignKey('Student.login'), nullable=False)
    grade = Column(Integer, nullable=False)
    lesson_id = Column(Integer, ForeignKey('Lesson.lesson_id'), nullable=False)
    
    __table_args__ = (
        CheckConstraint('grade >= 1 AND grade <= 10', name='check_grade_range'),
    )

class AttendanceLog(Base):
    __tablename__ = 'AttendanceLog'
    
    attendance_id = Column(Integer, primary_key=True, nullable=False)
    login = Column(String(255), ForeignKey('Student.login'), nullable=False)
    attendance_status = Column(String(20), nullable=False, default='Absent')
    lesson_id = Column(Integer, ForeignKey('Lesson.lesson_id'), nullable=False)
    
    __table_args__ = (
        CheckConstraint("attendance_status IN ('Present', 'Absent', 'Late')", name='check_attendance_status'),
    )

class Content(Base):
    __tablename__ = 'Content'
    
    name = Column(String(255), nullable=False)
    material_id = Column(Integer, ForeignKey('StudyMaterial.material_id'), nullable=False)
    
    __table_args__ = (
        Column('name1', String(255), primary_key=True),   #TODO: dafuck?
        Column('material_id1', Integer, primary_key=True),
    )