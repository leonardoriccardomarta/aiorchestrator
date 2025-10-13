import { ToastType } from '../components/Toast';

export interface ToastMessage {
  id: number;
  message: string;
  type: ToastType;
}