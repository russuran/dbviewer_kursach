from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas
from database import engine, get_db
from fastapi.middleware.cors import CORSMiddleware


models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Студенты
@app.post("/students/", response_model=schemas.Student)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    db_student = models.Student(**student.dict())
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

@app.get("/students/{login}", response_model=schemas.Student)
def read_student(login: str, db: Session = Depends(get_db)):
    db_student = db.query(models.Student).filter(models.Student.login == login).first()
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return db_student

@app.get("/students/", response_model=list[schemas.Student])
def read_students(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    students = db.query(models.Student).offset(skip).limit(limit).all()
    return students

@app.put("/students/{login}", response_model=schemas.Student)
def update_student(login: str, student: schemas.StudentCreate, db: Session = Depends(get_db)):
    db_student = db.query(models.Student).filter(models.Student.login == login).first()
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    for key, value in student.dict().items():
        setattr(db_student, key, value)
    db.commit()
    db.refresh(db_student)
    return db_student

@app.delete("/students/{login}", response_model=schemas.Student)
def delete_student(login: str, db: Session = Depends(get_db)):
    db_student = db.query(models.Student).filter(models.Student.login == login).first()
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    db.delete(db_student)
    db.commit()
    return db_student

# Курсы
@app.post("/courses/", response_model=schemas.Course)
def create_course(course: schemas.CourseCreate, db: Session = Depends(get_db)):
    db_course = models.Course(**course.dict())
    db.add(db_course)
    db.commit()
    db.refresh(db_course)
    return db_course

@app.get("/courses/{name}", response_model=schemas.Course)
def read_course(name: str, db: Session = Depends(get_db)):
    db_course = db.query(models.Course).filter(models.Course.name == name).first()
    if db_course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    return db_course

@app.get("/courses/", response_model=list[schemas.Course])
def read_courses(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    courses = db.query(models.Course).offset(skip).limit(limit).all()
    return courses

@app.put("/courses/{name}", response_model=schemas.Course)
def update_course(name: str, course: schemas.CourseCreate, db: Session = Depends(get_db)):
    db_course = db.query(models.Course).filter(models.Course.name == name).first()
    if db_course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    for key, value in course.dict().items():
        setattr(db_course, key, value)
    db.commit()
    db.refresh(db_course)
    return db_course

@app.delete("/courses/{name}", response_model=schemas.Course)
def delete_course(name: str, db: Session = Depends(get_db)):
    db_course = db.query(models.Course).filter(models.Course.name == name).first()
    if db_course is None:
        raise HTTPException(status_code=404, detail="Course not found")
    db.delete(db_course)
    db.commit()
    return db_course

# Занятия
@app.post("/lessons/", response_model=schemas.Lesson)
def create_lesson(lesson: schemas.LessonCreate, db: Session = Depends(get_db)):
    db_lesson = models.Lesson(**lesson.dict())
    db.add(db_lesson)
    db.commit()
    db.refresh(db_lesson)
    return db_lesson

@app.get("/lessons/{lesson_id}", response_model=schemas.Lesson)
def read_lesson(lesson_id: int, db: Session = Depends(get_db)):
    db_lesson = db.query(models.Lesson).filter(models.Lesson.lesson_id == lesson_id).first()
    if db_lesson is None:
        raise HTTPException(status_code=404, detail="Lesson not found")
    return db_lesson

@app.get("/lessons/", response_model=list[schemas.Lesson])
def read_lessons(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    lessons = db.query(models.Lesson).offset(skip).limit(limit).all()
    return lessons

@app.put("/lessons/{lesson_id}", response_model=schemas.Lesson)
def update_lesson(lesson_id: int, lesson: schemas.LessonCreate, db: Session = Depends(get_db)):
    db_lesson = db.query(models.Lesson).filter(models.Lesson.lesson_id == lesson_id).first()
    if db_lesson is None:
        raise HTTPException(status_code=404, detail="Lesson not found")
    for key, value in lesson.dict().items():
        setattr(db_lesson, key, value)
    db.commit()
    db.refresh(db_lesson)
    return db_lesson

@app.delete("/lessons/{lesson_id}", response_model=schemas.Lesson)
def delete_lesson(lesson_id: int, db: Session = Depends(get_db)):
    db_lesson = db.query(models.Lesson).filter(models.Lesson.lesson_id == lesson_id).first()
    if db_lesson is None:
        raise HTTPException(status_code=404, detail="Lesson not found")
    db.delete(db_lesson)
    db.commit()
    return db_lesson

# Преподаватели
@app.post("/teachers/", response_model=schemas.Teacher)
def create_teacher(teacher: schemas.TeacherCreate, db: Session = Depends(get_db)):
    db_teacher = models.Teacher(**teacher.dict())
    db.add(db_teacher)
    db.commit()
    db.refresh(db_teacher)
    return db_teacher

@app.get("/teachers/{teacher_id}", response_model=schemas.Teacher)
def read_teacher(teacher_id: int, db: Session = Depends(get_db)):
    db_teacher = db.query(models.Teacher).filter(models.Teacher.teacher_id == teacher_id).first()
    if db_teacher is None:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return db_teacher

@app.get("/teachers/", response_model=list[schemas.Teacher])
def read_teachers(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    teachers = db.query(models.Teacher).offset(skip).limit(limit).all()
    return teachers

@app.put("/teachers/{teacher_id}", response_model=schemas.Teacher)
def update_teacher(teacher_id: int, teacher: schemas.TeacherCreate, db: Session = Depends(get_db)):
    db_teacher = db.query(models.Teacher).filter(models.Teacher.teacher_id == teacher_id).first()
    if db_teacher is None:
        raise HTTPException(status_code=404, detail="Teacher not found")
    for key, value in teacher.dict().items():
        setattr(db_teacher, key, value)
    db.commit()
    db.refresh(db_teacher)
    return db_teacher

@app.delete("/teachers/{teacher_id}", response_model=schemas.Teacher)
def delete_teacher(teacher_id: int, db: Session = Depends(get_db)):
    db_teacher = db.query(models.Teacher).filter(models.Teacher.teacher_id == teacher_id).first()
    if db_teacher is None:
        raise HTTPException(status_code=404, detail="Teacher not found")
    db.delete(db_teacher)
    db.commit()
    return db_teacher

# Учебные материалы
@app.post("/study_materials/", response_model=schemas.StudyMaterial)
def create_study_material(material: schemas.StudyMaterialCreate, db: Session = Depends(get_db)):
    db_material = models.StudyMaterial(**material.dict())
    db.add(db_material)
    db.commit()
    db.refresh(db_material)
    return db_material

@app.get("/study_materials/{material_id}", response_model=schemas.StudyMaterial)
def read_study_material(material_id: int, db: Session = Depends(get_db)):
    db_material = db.query(models.StudyMaterial).filter(models.StudyMaterial.material_id == material_id).first()
    if db_material is None:
        raise HTTPException(status_code=404, detail="Study material not found")
    return db_material

@app.get("/study_materials/", response_model=list[schemas.StudyMaterial])
def read_study_materials(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    materials = db.query(models.StudyMaterial).offset(skip).limit(limit).all()
    return materials

@app.put("/study_materials/{material_id}", response_model=schemas.StudyMaterial)
def update_study_material(material_id: int, material: schemas.StudyMaterialCreate, db: Session = Depends(get_db)):
    db_material = db.query(models.StudyMaterial).filter(models.StudyMaterial.material_id == material_id).first()
    if db_material is None:
        raise HTTPException(status_code=404, detail="Study material not found")
    for key, value in material.dict().items():
        setattr(db_material, key, value)
    db.commit()
    db.refresh(db_material)
    return db_material

@app.delete("/study_materials/{material_id}", response_model=schemas.StudyMaterial)
def delete_study_material(material_id: int, db: Session = Depends(get_db)):
    db_material = db.query(models.StudyMaterial).filter(models.StudyMaterial.material_id == material_id).first()
    if db_material is None:
        raise HTTPException(status_code=404, detail="Study material not found")
    db.delete(db_material)
    db.commit()
    return db_material

# Расписание
@app.post("/schedules/", response_model=schemas.Schedule)
def create_schedule(schedule: schemas.ScheduleCreate, db: Session = Depends(get_db)):
    db_schedule = models.Schedule(**schedule.dict())
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

@app.get("/schedules/{schedule_id}", response_model=schemas.Schedule)
def read_schedule(schedule_id: int, db: Session = Depends(get_db)):
    db_schedule = db.query(models.Schedule).filter(models.Schedule.schedule_id == schedule_id).first()
    if db_schedule is None:
        raise HTTPException(status_code=404, detail="Schedule not found")
    return db_schedule

@app.get("/schedules/", response_model=list[schemas.Schedule])
def read_schedules(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    schedules = db.query(models.Schedule).offset(skip).limit(limit).all()
    return schedules

@app.put("/schedules/{schedule_id}", response_model=schemas.Schedule)
def update_schedule(schedule_id: int, schedule: schemas.ScheduleCreate, db: Session = Depends(get_db)):
    db_schedule = db.query(models.Schedule).filter(models.Schedule.schedule_id == schedule_id).first()
    if db_schedule is None:
        raise HTTPException(status_code=404, detail="Schedule not found")
    for key, value in schedule.dict().items():
        setattr(db_schedule, key, value)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

@app.delete("/schedules/{schedule_id}", response_model=schemas.Schedule)
def delete_schedule(schedule_id: int, db: Session = Depends(get_db)):
    db_schedule = db.query(models.Schedule).filter(models.Schedule.schedule_id == schedule_id).first()
    if db_schedule is None:
        raise HTTPException(status_code=404, detail="Schedule not found")
    db.delete(db_schedule)
    db.commit()
    return db_schedule

@app.post("/groups/", response_model=schemas.Group)
def create_group(group: schemas.GroupCreate, db: Session = Depends(get_db)):
    db_group = models.Group(**group.dict())
    db.add(db_group)
    db.commit()
    db.refresh(db_group)
    return db_group

@app.get("/groups/{group_number}", response_model=schemas.Group)
def read_group(group_number: int, db: Session = Depends(get_db)):
    db_group = db.query(models.Group).filter(models.Group.group_number == group_number).first()
    if db_group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    return db_group

@app.get("/groups/", response_model=list[schemas.Group])
def read_groups(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    groups = db.query(models.Group).offset(skip).limit(limit).all()
    return groups


@app.put("/groups/{group_number}", response_model=schemas.Group)
def update_group(group_number: int, group: schemas.GroupCreate, db: Session = Depends(get_db)):
    db_group = db.query(models.Group).filter(models.Group.group_number == group_number).first()
    if db_group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    for key, value in group.dict().items():
        setattr(db_group, key, value)
    db.commit()
    db.refresh(db_group)
    return db_group

@app.delete("/groups/{group_number}", response_model=schemas.Group)
def delete_group(group_number: int, db: Session = Depends(get_db)):
    db_group = db.query(models.Group).filter(models.Group.group_number == group_number).first()
    if db_group is None:
        raise HTTPException(status_code=404, detail="Group not found")
    db.delete(db_group)
    db.commit()
    return db_group

# Успеваемость
@app.post("/performances/", response_model=schemas.Performance)
def create_performance(performance: schemas.PerformanceCreate, db: Session = Depends(get_db)):
    db_performance = models.Performance(**performance.dict())
    db.add(db_performance)
    db.commit()
    db.refresh(db_performance)
    return db_performance

@app.get("/performances/{performance_id}", response_model=schemas.Performance)
def read_performance(performance_id: int, db: Session = Depends(get_db)):
    db_performance = db.query(models.Performance).filter(models.Performance.performance_id == performance_id).first()
    if db_performance is None:
        raise HTTPException(status_code=404, detail="Performance not found")
    return db_performance

@app.get("/performances/", response_model=list[schemas.Performance])
def read_performances(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    performances = db.query(models.Performance).offset(skip).limit(limit).all()
    return performances

@app.put("/performances/{performance_id}", response_model=schemas.Performance)
def update_performance(performance_id: int, performance: schemas.PerformanceCreate, db: Session = Depends(get_db)):
    db_performance = db.query(models.Performance).filter(models.Performance.performance_id == performance_id).first()
    if db_performance is None:
        raise HTTPException(status_code=404, detail="Performance not found")
    for key, value in performance.dict().items():
        setattr(db_performance, key, value)
    db.commit()
    db.refresh(db_performance)
    return db_performance

@app.delete("/performances/{performance_id}", response_model=schemas.Performance)
def delete_performance(performance_id: int, db: Session = Depends(get_db)):
    db_performance = db.query(models.Performance).filter(models.Performance.performance_id == performance_id).first()
    if db_performance is None:
        raise HTTPException(status_code=404, detail="Performance not found")
    db.delete(db_performance)
    db.commit()
    return db_performance

# Журнал посещений
@app.post("/attendance_logs/", response_model=schemas.AttendanceLog)
def create_attendance_log(attendance_log: schemas.AttendanceLogCreate, db: Session = Depends(get_db)):
    db_attendance_log = models.AttendanceLog(**attendance_log.dict())
    db.add(db_attendance_log)
    db.commit()
    db.refresh(db_attendance_log)
    return db_attendance_log

@app.get("/attendance_logs/{attendance_id}", response_model=schemas.AttendanceLog)
def read_attendance_log(attendance_id: int, db: Session = Depends(get_db)):
    db_attendance_log = db.query(models.AttendanceLog).filter(models.AttendanceLog.attendance_id == attendance_id).first()
    if db_attendance_log is None:
        raise HTTPException(status_code=404, detail="Attendance log not found")
    return db_attendance_log

@app.get("/attendance_logs/", response_model=list[schemas.AttendanceLog])
def read_attendance_logs(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    attendance_logs = db.query(models.AttendanceLog).offset(skip).limit(limit).all()
    return attendance_logs

@app.put("/attendance_logs/{attendance_id}", response_model=schemas.AttendanceLog)
def update_attendance_log(attendance_id: int, attendance_log: schemas.AttendanceLogCreate, db: Session = Depends(get_db)):
    db_attendance_log = db.query(models.AttendanceLog).filter(models.AttendanceLog.attendance_id == attendance_id).first()
    if db_attendance_log is None:
        raise HTTPException(status_code=404, detail="Attendance log not found")
    for key, value in attendance_log.dict().items():
        setattr(db_attendance_log, key, value)
    db.commit()
    db.refresh(db_attendance_log)
    return db_attendance_log

@app.delete("/attendance_logs/{attendance_id}", response_model=schemas.AttendanceLog)
def delete_attendance_log(attendance_id: int, db: Session = Depends(get_db)):
    db_attendance_log = db.query(models.AttendanceLog).filter(models.AttendanceLog.attendance_id == attendance_id).first()
    if db_attendance_log is None:
        raise HTTPException(status_code=404, detail="Attendance log not found")
    db.delete(db_attendance_log)
    db.commit()
    return db_attendance_log