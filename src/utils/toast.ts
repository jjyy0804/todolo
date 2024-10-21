//여기
// @ts-ignore
import { toast } from 'react-toastify';

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    position: 'top-right', // 문자열로 위치 지정
    autoClose: 3000,
  });
};

export const showErrorToast = (message: string) => {
  toast.error(message, {
    position: 'top-right', // 문자열로 위치 지정
    autoClose: 3000,
  });
};
