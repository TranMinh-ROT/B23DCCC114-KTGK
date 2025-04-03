// components/CourseForm.tsx
import React, { useEffect } from 'react';
import { Form, Input, Select, InputNumber, Button, Modal } from 'antd';
import { Course, CourseStatus, instructors } from '../Coursemodel/Course';
// Assuming TinyEditor is available in the project
import TinyEditor from '../../coursecomponents/TinyEditor';

interface CourseFormProps {
  visible: boolean;
  initialValues?: Course;
  onSave: (course: Omit<Course, 'id'> & { id?: string }) => void;
  onCancel: () => void;
}

const CourseForm: React.FC<CourseFormProps> = ({ 
  visible, 
  initialValues, 
  onSave, 
  onCancel 
}) => {
  const [form] = Form.useForm();
  const isEditing = !!initialValues;

  useEffect(() => {
    if (visible && initialValues) {
      form.setFieldsValue(initialValues);
    } else if (visible) {
      form.resetFields();
    }
  }, [visible, initialValues, form]);

  const handleSubmit = (values: any) => {
    const course = {
      ...values,
      id: initialValues?.id
    };
    onSave(course);
  };

  return (
    <Modal
      title={isEditing ? "Chỉnh sửa khóa học" : "Thêm khóa học mới"}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={initialValues || { status: CourseStatus.OPEN, studentCount: 0 }}
      >
        <Form.Item
          name="name"
          label="Tên khóa học"
          rules={[
            { required: true, message: "Vui lòng nhập tên khóa học" },
            { max: 100, message: "Tên khóa học không được vượt quá 100 ký tự" }
          ]}
        >
          <Input placeholder="Nhập tên khóa học" />
        </Form.Item>

        <Form.Item
          name="instructorId"
          label="Giảng viên"
          rules={[{ required: true, message: "Vui lòng chọn giảng viên" }]}
        >
          <Select placeholder="Chọn giảng viên">
            {instructors.map(instructor => (
              <Select.Option key={instructor.id} value={instructor.id}>
                {instructor.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="studentCount"
          label="Số lượng học viên"
          rules={[
            { required: true, message: "Vui lòng nhập số lượng học viên" },
            { type: 'number', min: 0, message: "Số lượng học viên không được âm" }
          ]}
        >
          <InputNumber min={0} style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
        >
          <Select placeholder="Chọn trạng thái">
            {Object.values(CourseStatus).map(status => (
              <Select.Option key={status} value={status}>
                {status}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="description"
          label="Mô tả khóa học"
          rules={[{ required: true, message: "Vui lòng nhập mô tả khóa học" }]}
        >
          <TinyEditor />
        </Form.Item>

        <Form.Item className="text-right">
          <Button type="default" onClick={onCancel} style={{ marginRight: 8 }}>
            Hủy
          </Button>
          <Button type="primary" htmlType="submit">
            {isEditing ? "Cập nhật" : "Thêm mới"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CourseForm;