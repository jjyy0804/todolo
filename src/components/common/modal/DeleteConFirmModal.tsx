import React from 'react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[320px]">
        <h2 className="text-center text-lg font-semibold mb-6">
          정말 삭제 하시겠습니까?
        </h2>
        <div className="flex justify-center space-x-4">
          <button
            className="px-6 py-2 border border-primary text-primary rounded-md hover:bg-blue-50 transition"
            onClick={onClose}
          >
            취소
          </button>
          <button
            className="px-6 py-2 bg-primary text-white rounded-md hover:bg-hoverprimary transition"
            onClick={onConfirm}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
