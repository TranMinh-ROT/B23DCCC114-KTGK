// components/CourseList.tsx
import React from 'react';
import { Table, Button, Tag, Space, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { Course, CourseStatus, instructors } from '../Coursemodel/Course';

interface CourseListProps {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (courseId: string) => void;
  onView: (course: Course) => void;
}

const CourseList: React.FC<CourseListProps> = ({ 
  courses, 
  onEdit, 
  onDelete, 
  onView 
}) => {
  const getInstructorName = (instructorId: string) => {
    const instructor = instructors.find(i => i.id === instructorId);
    return instructor ? instructor.name : 'Unknown';
  };

  const getStatusColor = (status: CourseStatus) => {
    switch(status) {
      case CourseStatus.OPEN:
        return 'green';
      case CourseStatus.CLOSED:
        return 'red';
      case CourseStatus.PAUSED:
        return 'orange';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      ellipsis: true,
    },
    {
      title: 'Tên khóa học',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: 'Giảng viên',
      dataIndex: 'instructorId',
      key: 'instructorId',
      render: (instructorId: string) => getInstructorName(instructorId),
    },
    {
      title: 'Số lượng học viên',
      dataIndex: 'studentCount',
      key: 'studentCount',
      sorter: (a: Course, b: Course) => a.studentCount - b.studentCount,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: CourseStatus) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Course) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => onView(record)} 
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => onEdit(record)} 
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button 
              type="text" 
              danger
              icon={<DeleteOutlined />} 
              onClick={() => onDelete(record.id)}
              disabled={record.studentCount > 0}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table 
      columns={columns} 
      dataSource={courses.map(course => ({ ...course, key: course.id }))} 
      pagination={{ pageSize: 10 }}
      scroll={{ x: 800 }}
    />
  );
};

export default CourseList;