// courseindex.tsx
import React, { useState, useEffect } from 'react';
import { Button, message, Descriptions, Drawer, Typography, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CourseList from './coursecomponents/CourseList';
import CourseFilter from './coursecomponents/CourseFilter';
import CourseForm from './coursecomponents/CourseForm';
import DeleteConfirmation from './coursecomponents/DeleteConfirmation';
import { Course, CourseStatus, instructors } from './Coursemodel/Course';
import { getCourses, addCourse, updateCourse, deleteCourse } from './courseservices/courseService';
// Thêm vào sau dòng imports và trước khi định nghĩa component
interface CourseFilters {
  name?: string;
  instructorId?: string;
  status?: CourseStatus;
}
const { Title } = Typography;

const CoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [filters, setFilters] = useState<CourseFilters>({});
  const [formVisible, setFormVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | undefined>(undefined);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);

  // Load courses from localStorage
  useEffect(() => {
    const loadedCourses = getCourses();
    setCourses(loadedCourses);
    setFilteredCourses(loadedCourses);
  }, []);

  // Apply filters
  const handleFilter = (values: CourseFilters) => {
    setFilters(values);
    let filtered = [...courses];
    
    if (values.name) {
      filtered = filtered.filter(course => 
        course.name.toLowerCase().includes((values.name ?? '').toLowerCase())
      );
    }
    
    if (values.instructorId) {
      filtered = filtered.filter(course => course.instructorId === values.instructorId);
    }
    
    if (values.status) {
      filtered = filtered.filter(course => course.status === values.status);
    }
    
    setFilteredCourses(filtered);
  };

  // Reset filters
  const handleResetFilters = () => {
    setFilters({});
    setFilteredCourses(courses);
  };

  // Sort by student count
  const handleSort = (ascending: boolean) => {
    const sorted = [...filteredCourses].sort((a, b) => {
      return ascending 
        ? a.studentCount - b.studentCount
        : b.studentCount - a.studentCount;
    });
    setFilteredCourses(sorted);
  };

  // Add or edit course
  const handleSaveCourse = (courseData: Omit<Course, 'id'> & { id?: string }) => {
    try {
      if (courseData.id) {
        // Update existing course
        const updated = updateCourse(courseData as Course);
        setCourses(prev => prev.map(c => c.id === updated.id ? updated : c));
        message.success('Cập nhật khóa học thành công!');
      } else {
        // Add new course
        const newCourse = addCourse(courseData);
        setCourses(prev => [...prev, newCourse]);
        message.success('Thêm khóa học thành công!');
      }
      
      setFormVisible(false);
      handleFilter(filters); // Reapply filters
    } catch (error: any) {
      message.error(error.message);
    }
  };

  // Show edit form
  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setFormVisible(true);
  };

  // Show delete confirmation
  const handleDeleteClick = (courseId: string) => {
    setCourseToDelete(courseId);
    setDeleteModalVisible(true);
  };

  // Perform delete
  const handleConfirmDelete = () => {
    if (courseToDelete) {
      try {
        deleteCourse(courseToDelete);
        setCourses(prev => prev.filter(c => c.id !== courseToDelete));
        setFilteredCourses(prev => prev.filter(c => c.id !== courseToDelete));
        message.success('Xóa khóa học thành công!');
      } catch (error: any) {
        message.error(error.message);
      }
      setDeleteModalVisible(false);
      setCourseToDelete(null);
    }
  };

  // Show course details
  const handleViewDetails = (course: Course) => {
    setSelectedCourse(course);
    setDetailsVisible(true);
  };

  // Get instructor name by ID
  const getInstructorName = (instructorId: string) => {
    const instructor = instructors.find((i: { id: string; }) => i.id === instructorId);
    return instructor ? instructor.name : 'Unknown';
  };

  return (
    <div className="container mx-auto p-4">
      <Title level={2}>Quản lý khóa học online</Title>
      
      <div className="mb-4 flex justify-between items-center">
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={() => {
            setSelectedCourse(undefined);
            setFormVisible(true);
          }}
        >
          Thêm khóa học mới
        </Button>
      </div>
      
      <CourseFilter 
        onFilter={handleFilter}
        onReset={handleResetFilters}
        onSort={handleSort}
      />
      
      <CourseList 
        courses={filteredCourses}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onView={handleViewDetails}
      />
      
      <CourseForm 
        visible={formVisible}
        initialValues={selectedCourse}
        onSave={handleSaveCourse}
        onCancel={() => setFormVisible(false)}
      />
      
      <DeleteConfirmation 
        visible={deleteModalVisible}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalVisible(false)}
      />
      
      <Drawer
        title="Chi tiết khóa học"
        placement="right"
        width={600}
        onClose={() => setDetailsVisible(false)}
        visible={detailsVisible}
      >
        {selectedCourse && (
          <div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="Tên khóa học">{selectedCourse.name}</Descriptions.Item>
              <Descriptions.Item label="Giảng viên">
                {getInstructorName(selectedCourse.instructorId)}
              </Descriptions.Item>
              <Descriptions.Item label="Số lượng học viên">{selectedCourse.studentCount}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">{selectedCourse.status}</Descriptions.Item>
            </Descriptions>
            
            <div className="mt-4">
              <Title level={5}>Mô tả khóa học:</Title>
              <div dangerouslySetInnerHTML={{ __html: selectedCourse.description }} />
            </div>
            
            <div className="mt-6 text-right">
              <Space>
                <Button onClick={() => setDetailsVisible(false)}>Đóng</Button>
                <Button type="primary" onClick={() => {
                  setDetailsVisible(false);
                  handleEdit(selectedCourse);
                }}>
                  Chỉnh sửa
                </Button>
              </Space>
            </div>
          </div>
        )}
      </Drawer>
    </div>
  );
};

export default CoursesPage;