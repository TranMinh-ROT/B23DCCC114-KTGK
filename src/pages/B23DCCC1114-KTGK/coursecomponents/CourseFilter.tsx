// components/CourseFilter.tsx
import React from 'react';
import { Input, Select, Form, Button, Space } from 'antd';
import { CourseStatus, instructors } from '../Coursemodel/Course';

interface CourseFilterProps {
  onFilter: (values: any) => void;
  onReset: () => void;
  onSort: (ascending: boolean) => void;
}

const CourseFilter: React.FC<CourseFilterProps> = ({ onFilter, onReset, onSort }) => {
  const [form] = Form.useForm();

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  return (
    <Form form={form} layout="inline" onFinish={onFilter} className="mb-4">
      <Form.Item name="name" className="mb-2">
        <Input placeholder="Tìm theo tên khóa học" style={{ width: 200 }} />
      </Form.Item>
      
      <Form.Item name="instructorId" className="mb-2">
        <Select 
          placeholder="Lọc theo giảng viên" 
          style={{ width: 180 }}
          allowClear
        >
          {instructors.map(instructor => (
            <Select.Option key={instructor.id} value={instructor.id}>
              {instructor.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      
      <Form.Item name="status" className="mb-2">
        <Select 
          placeholder="Lọc theo trạng thái" 
          style={{ width: 150 }}
          allowClear
        >
          {Object.values(CourseStatus).map(status => (
            <Select.Option key={status} value={status}>
              {status}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      
      <Form.Item className="mb-2">
        <Space>
          <Button type="primary" htmlType="submit">
            Lọc
          </Button>
          <Button onClick={handleReset}>
            Xóa bộ lọc
          </Button>
          <Button onClick={() => onSort(true)}>
            Sắp xếp học viên ▲
          </Button>
          <Button onClick={() => onSort(false)}>
            Sắp xếp học viên ▼
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default CourseFilter;