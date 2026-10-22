import { useState } from 'react';
import { useProgress } from '../app/ProgressContext';

/** Deletes all local progress after an explicit confirmation step. */
export function ResetDataButton() {
  const { resetAll } = useProgress();
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);
  if (done) return <p className="status status-ok" role="status">Đã xóa toàn bộ dữ liệu học tập trên thiết bị này.</p>;
  return confirming ? (
    <div className="notice notice-error" role="alertdialog" aria-label="Xác nhận xóa dữ liệu">
      <p>Bạn chắc chắn muốn xóa toàn bộ tiến độ, từ vựng và cài đặt? Không thể hoàn tác.</p>
      <div className="actions">
        <button
          type="button"
          className="btn btn-danger"
          onClick={() => {
            resetAll();
            setDone(true);
          }}
        >
          Xóa vĩnh viễn
        </button>
        <button type="button" className="btn" onClick={() => setConfirming(false)}>
          Hủy
        </button>
      </div>
    </div>
  ) : (
    <button type="button" className="btn btn-danger-ghost" onClick={() => setConfirming(true)}>
      Xóa dữ liệu học tập…
    </button>
  );
}
