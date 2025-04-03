// coursecomponents/DeleteConfirmation.tsx
import React from 'react';
import { Modal } from 'antd';

interface DeleteConfirmationProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ 
  visible, 
  onConfirm, 
  onCancel 
}) => {
  return (
    <Modal
      title="Xác nhận xóa"
      visible={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Xóa"
      cancelText="Hủy"
    >
      <p>Bạn có chắc chắn muốn xóa khóa học này không?</p>
      <p>Lưu ý: Chỉ khóa học không có học viên mới có thể xóa.</p>
    </Modal>
  );
};

export default DeleteConfirmation;