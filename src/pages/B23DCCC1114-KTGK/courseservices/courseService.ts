// services/courseService.ts
import { Course, CourseStatus } from "../Coursemodel/Course";
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = "online_courses";

// Get all courses
export const getCourses = (): Course[] => {
  const coursesJSON = localStorage.getItem(STORAGE_KEY);
  if (!coursesJSON) {
    // Initialize with sample data if empty
    const initialCourses: Course[] = [
      {
        id: uuidv4(),
        name: "React Fundamentals",
        instructorId: "1",
        studentCount: 45,
        description: "<p>Learn the basics of React</p>",
        status: CourseStatus.OPEN
      },
      {
        id: uuidv4(),
        name: "Advanced TypeScript",
        instructorId: "2",
        studentCount: 30,
        description: "<p>Master TypeScript programming</p>",
        status: CourseStatus.OPEN
      },
      {
        id: uuidv4(),
        name: "UX Design Principles",
        instructorId: "3",
        studentCount: 0,
        description: "<p>Learn about user experience design</p>",
        status: CourseStatus.PAUSED
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialCourses));
    return initialCourses;
  }
  return JSON.parse(coursesJSON);
};

// Add a new course
export const addCourse = (course: Omit<Course, "id">): Course => {
  const courses = getCourses();
  
  // Check for duplicate course name
  const isDuplicate = courses.some(c => c.name.toLowerCase() === course.name.toLowerCase());
  if (isDuplicate) {
    throw new Error("Tên khóa học đã tồn tại");
  }
  
  const newCourse = {
    ...course,
    id: uuidv4()
  };
  
  courses.push(newCourse);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(courses));
  return newCourse;
};

// Update an existing course
export const updateCourse = (course: Course): Course => {
  const courses = getCourses();
  
  // Check for duplicate course name (excluding the current course)
  const isDuplicate = courses.some(c => 
    c.name.toLowerCase() === course.name.toLowerCase() && c.id !== course.id
  );
  
  if (isDuplicate) {
    throw new Error("Tên khóa học đã tồn tại");
  }
  
  const updatedCourses = courses.map(c => c.id === course.id ? course : c);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCourses));
  return course;
};

// Delete a course
export const deleteCourse = (id: string): boolean => {
  const courses = getCourses();
  const courseToDelete = courses.find(c => c.id === id);
  
  // Check if course exists and has no students
  if (!courseToDelete) {
    throw new Error("Khóa học không tồn tại");
  }
  
  if (courseToDelete.studentCount > 0) {
    throw new Error("Không thể xóa khóa học có học viên");
  }
  
  const updatedCourses = courses.filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCourses));
  return true;
};