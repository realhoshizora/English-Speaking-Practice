import { useProgress } from '../../app/ProgressContext';
import { scenarios } from '../../data/scenarios';
import { detectSpeechCapabilities } from '../../services/speech/SpeechCapabilityDetector';
import { isScenarioComplete } from '../../services/storage/progress';
import { DailyGoal, StatCards } from '../progress/ProgressPage';

export function Dashboard() {
  const { state } = useProgress();
  const caps = detectSpeechCapabilities();
  const next = scenarios.find((s) => !isScenarioComplete(state.records, s.id));
  const isNew = state.records.length === 0;

  return (
    <div className="page">
      <header className="page-head hero">
        <h1>English Speaking Coach</h1>
        <p>Luyện nói tiếng Anh giao tiếp qua các tình huống thực tế, trình độ A1–B1. Hãy nghe, nói và tự tin hơn mỗi ngày!</p>
      </header>

      <p className={`notice ${state.settings.provider === 'scripted' ? 'notice-info' : 'notice-ai'}`}>
        {state.settings.provider === 'scripted' ? (
          <>
            <strong>Chế độ hội thoại: theo kịch bản (scripted).</strong> Không cần Internet cho phần hội thoại, không dùng AI. Có thể bật AI cục bộ trong{' '}
            <a href="#/settings">Cài đặt</a>.
          </>
        ) : (
          <>
            <strong>Chế độ hội thoại: AI cục bộ (Ollama).</strong> Nếu không kết nối được, ứng dụng tự quay về chế độ kịch bản.
          </>
        )}
      </p>

      {(!caps.recognition || !caps.synthesis) && (
        <p className="notice notice-warn">
          {!caps.recognition && 'Trình duyệt này không hỗ trợ nhận diện giọng nói – bạn vẫn có thể luyện bằng cách gõ câu trả lời. '}
          {!caps.synthesis && 'Trình duyệt này không hỗ trợ đọc văn bản thành giọng nói. '}
          Nên dùng Chrome hoặc Edge bản mới. <a href="#/settings">Kiểm tra micro</a>
        </p>
      )}

      <section className="card">
        <DailyGoal />
        {next ? (
          <p>
            {isNew ? 'Bắt đầu với' : 'Tiếp tục với'}: <strong>{next.title}</strong> ({next.level}){' '}
            <a className="btn btn-primary btn-sm" href={`#/scenarios/${next.id}`}>
              Học ngay
            </a>
          </p>
        ) : (
          <p className="status status-ok">🎉 Bạn đã hoàn thành tất cả tình huống!</p>
        )}
      </section>

      {isNew ? (
        <p className="card empty">Bạn chưa có hoạt động nào. Số liệu bên dưới sẽ tăng khi bạn hoàn thành bài nói, bài nghe hoặc ôn từ vựng.</p>
      ) : null}
      <StatCards />

      <ul className="grid quick">
        <li className="card">
          <h2>🎤 Speaking Practice</h2>
          <p className="muted">Nghe và nhắc lại, hội thoại có hướng dẫn, nhập vai.</p>
          <a className="btn btn-primary btn-sm" href="#/speaking">
            Luyện nói
          </a>
        </li>
        <li className="card">
          <h2>🎧 Listening Practice</h2>
          <p className="muted">Nghe hội thoại, trả lời câu hỏi, xem giải thích.</p>
          <a className="btn btn-sm" href="#/listening">
            Luyện nghe
          </a>
        </li>
        <li className="card">
          <h2>📚 Vocabulary</h2>
          <p className="muted">Flashcards, nối từ, điền từ.</p>
          <a className="btn btn-sm" href="#/vocabulary">
            Ôn từ vựng
          </a>
        </li>
        <li className="card">
          <h2>🗺️ Real-Life Scenarios</h2>
          <p className="muted">{scenarios.length} tình huống với hội thoại mẫu và mẫu câu.</p>
          <a className="btn btn-sm" href="#/scenarios">
            Xem tình huống
          </a>
        </li>
      </ul>
    </div>
  );
}
