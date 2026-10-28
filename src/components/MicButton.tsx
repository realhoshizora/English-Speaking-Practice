import type { RecognitionSnapshot, RecognitionStatus } from '../services/speech/SpeechRecognitionService';
import { Icon } from './Icon';

const BUSY: RecognitionStatus[] = ['requesting', 'listening', 'processing'];

export function isBusy(status: RecognitionStatus) {
  return BUSY.includes(status);
}

interface MicButtonProps {
  status: RecognitionStatus;
  onStart(): void;
  onStop(): void;
  disabled?: boolean;
}

export function MicButton({ status, onStart, onStop, disabled }: MicButtonProps) {
  const busy = isBusy(status);
  const label = status === 'listening' ? 'Nói xong' : busy ? 'Đang chờ…' : 'Bấm để nói';
  return (
    <button
      type="button"
      className={`mic-btn mic-${status}`}
      aria-pressed={busy}
      aria-label={busy ? 'Nói xong, dừng nghe' : 'Bắt đầu nói bằng micro'}
      disabled={disabled || status === 'processing'}
      onClick={busy ? onStop : onStart}
    >
      <Icon name={status === 'listening' ? 'stop' : 'mic'} />
      <span>{label}</span>
    </button>
  );
}

export function statusMessage(snap: RecognitionSnapshot): { text: string; tone: 'info' | 'ok' | 'warn' | 'error' } {
  switch (snap.status) {
    case 'idle':
      return { text: 'Bấm nút micro rồi nói bằng tiếng Anh.', tone: 'info' };
    case 'requesting':
      return { text: 'Đang bật micro… Nếu trình duyệt hỏi quyền, hãy chọn “Cho phép”.', tone: 'info' };
    case 'listening':
      return {
        text: 'Đang nghe… Cứ nói từ từ, ngừng để nghĩ cũng được. Nói xong thì bấm “Nói xong”.',
        tone: 'info',
      };
    case 'processing':
      return { text: 'Đang xử lý lời nói…', tone: 'info' };
    case 'recognized':
      return { text: 'Đã nhận diện được lời nói.', tone: 'ok' };
    case 'no-speech':
      return { text: 'Không nghe thấy lời nói. Hãy nói to, rõ hơn, để micro gần hơn và thử lại.', tone: 'warn' };
    case 'denied':
      return {
        text: 'Micro bị từ chối. Bấm biểu tượng ổ khóa/micro cạnh thanh địa chỉ → cho phép micro → tải lại trang. Bạn vẫn có thể gõ câu trả lời.',
        tone: 'error',
      };
    case 'unsupported':
      return { text: 'Trình duyệt này không hỗ trợ nhận diện giọng nói. Hãy dùng Chrome hoặc Edge, hoặc gõ câu trả lời.', tone: 'error' };
    case 'network':
      return {
        text: 'Lỗi kết nối. Trình duyệt này cần Internet để nhận diện giọng nói. Kiểm tra mạng rồi thử lại, hoặc gõ câu trả lời.',
        tone: 'error',
      };
    case 'error':
      return {
        text:
          snap.error === 'audio-capture'
            ? 'Không tìm thấy micro. Hãy kiểm tra micro đã được cắm/bật chưa.'
            : `Có lỗi khi nhận diện giọng nói (${snap.error ?? 'không rõ'}). Hãy thử lại hoặc gõ câu trả lời.`,
        tone: 'error',
      };
  }
}
