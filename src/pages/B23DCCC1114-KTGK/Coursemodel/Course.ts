// Coursemodels/Course.ts
export enum CourseStatus {
    OPEN = "Đang mở",
    CLOSED = "Đã kết thúc",
    PAUSED = "Tạm dừng"
  }
  
  export interface Instructor {
    id: string;
    name: string;
  }
  
  export interface Course {
    id: string;
    name: string;
    instructorId: string;
    studentCount: number;
    description: string;
    status: CourseStatus;
  }
  
  // Sample instructors
  export const instructors: Instructor[] = [
    { id: "1", name: "Nguyễn Văn A" },
    { id: "2", name: "Trần Thị B" },
    { id: "3", name: "Lê Văn C" },
    { id: "4", name: "Phạm Thị D" }
  ];