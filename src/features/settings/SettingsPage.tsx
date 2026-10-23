import { useEffect, useState } from 'react';
import { useProgress } from '../../app/ProgressContext';
import { ResetDataButton } from '../../components/ResetDataButton';
import { remoteProvider } from '../../services/conversation';
import { playSound } from '../../services/sound/sfx';
import { createLocalAIProvider } from '../../services/conversation/LocalAIConversationProvider';
import { detectSpeechCapabilities } from '../../services/speech/SpeechCapabilityDetector';
import { queryMicPermission, requestMicAccess, type MicPermission, type MicRequestResult } from '../../services/speech/MicrophonePermissionManager';
import { tts } from '../../services/speech/SpeechSynthesisService';
import { readQueue, SHEET_URL } from '../../services/sync/teacherSync';

const LANGS = [
  { id: 'en-US', name: 'English (US)' },
  { id: 'en-GB', name: 'English (UK)' },
  { id: 'en-AU', name: 'English (Australia)' },
  { id: 'en-IN', name: 'English (India)' },
];

const MIC_TEXT: Record<MicRequestResult | MicPermission, string> = {
  granted: '✓ Micro đã được cho phép.',
  denied: '✗ Micro bị chặn. Bấm biểu tượng ổ khóa cạnh thanh địa chỉ → cho phép Micro → tải lại trang.',
  prompt: 'Trình duyệt sẽ hỏi quyền khi bạn bấm nút bên dưới hoặc nút micro.',
  unknown: 'Trình duyệt không cho biết trạng thái quyền micro. Hãy bấm “Kiểm tra micro”.',
  'no-device': '✗ Không tìm thấy micro. Hãy cắm hoặc bật micro.',
  unavailable: '✗ Trình duyệt không cho phép truy cập micro ở trang này (cần https hoặc localhost).',
  error: '✗ Có lỗi khi mở micro. Hãy kiểm tra micro có đang được ứng dụng khác dùng không.',
};

export function SettingsPage() {
  const { state, updateSettings } = useProgress();
  const st = state.settings;
  const caps = detectSpeechCapabilities();
  const [voices, setVoices] = useState(() => tts.getEnglishVoices());
  const [mic, setMic] = useState<MicPermission | MicRequestResult | null>(null);
  const [aiStatus, setAiStatus] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    const refresh = () => setVoices(tts.getEnglishVoices());
    refresh();
    return tts.onVoicesChanged(refresh); // voices often load asynchronously
  }, []);

  useEffect(() => {
    void queryMicPermission().then(setMic);
  }, []);

  const testAi = async () => {
    setChecking(true);
    const a = await createLocalAIProvider(st.ollamaUrl, st.ollamaModel).checkAvailability();
    setAiStatus(a.message);
    setChecking(false);
  };

  return (
    <div className="page">
      <header className="page-head">
        <h1>Settings</h1>
        <p>Cài đặt được lưu trên thiết bị này.</p>
      </header>

      <section className="card" aria-labelledby="s-voice">
        <h2 id="s-voice">Giọng đọc (text-to-speech)</h2>
        {!caps.synthesis ? (
          <p className="notice notice-warn">Trình duyệt không hỗ trợ đọc văn bản. Bạn vẫn có thể đọc nội dung bài học.</p>
        ) : (
          <>
            {voices.length === 0 && (
              <p className="notice notice-warn">Chưa tìm thấy giọng tiếng Anh trên thiết bị. Trình duyệt sẽ dùng giọng mặc định nếu có.</p>
            )}
            <label className="field">
              <span>Giọng đọc</span>
              <select value={st.voiceURI ?? ''} onChange={(e) => updateSettings({ voiceURI: e.target.value || null })}>
                <option value="">Tự chọn (ưu tiên en-US)</option>
                {voices.map((v) => (
                  <option key={v.voiceURI} value={v.voiceURI}>
                    {v.name} ({v.lang})
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Tốc độ đọc: {st.rate.toFixed(2)}</span>
              <input type="range" min={0.6} max={1.3} step={0.05} value={st.rate} onChange={(e) => updateSettings({ rate: Number(e.target.value) })} />
            </label>
            <button type="button" className="btn" onClick={() => tts.speak('Hello! Nice to meet you. How are you today?', 'settings-test', { rate: st.rate, voiceURI: st.voiceURI })}>
              🔊 Nghe thử
            </button>
            <p className="muted small">Giọng đọc phụ thuộc trình duyệt và hệ điều hành, mỗi máy có thể khác nhau.</p>
          </>
        )}
      </section>

      <section className="card" aria-labelledby="s-mic">
        <h2 id="s-mic">Micro và nhận diện giọng nói</h2>
        <ul className="checklist">
          <li>{caps.recognition ? '✓ Trình duyệt hỗ trợ nhận diện giọng nói.' : '✗ Trình duyệt không hỗ trợ nhận diện giọng nói (hãy dùng Chrome hoặc Edge). Bạn vẫn có thể gõ câu trả lời.'}</li>
          <li>{caps.secureContext ? '✓ Trang chạy ở môi trường an toàn (https/localhost).' : '✗ Micro chỉ hoạt động trên https hoặc localhost.'}</li>
          {mic && <li role="status">{MIC_TEXT[mic]}</li>}
        </ul>
        <button type="button" className="btn" onClick={() => void requestMicAccess().then(setMic)}>
          🎤 Kiểm tra micro
        </button>
        <p className="muted small">Nút này chỉ xin quyền rồi tắt micro ngay. Ứng dụng không ghi âm và không lưu giọng nói.</p>
        <label className="field">
          <span>Ngôn ngữ nhận diện</span>
          <select value={st.recognitionLang} onChange={(e) => updateSettings({ recognitionLang: e.target.value })}>
            {LANGS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="card" aria-labelledby="s-learn">
        <h2 id="s-learn">Học tập</h2>
        <label className="field">
          <span>Mục tiêu mỗi ngày (số hoạt động)</span>
          <input
            type="number"
            min={1}
            max={50}
            value={st.dailyGoal}
            onChange={(e) => {
              const n = Math.round(Number(e.target.value));
              if (n >= 1 && n <= 50) updateSettings({ dailyGoal: n });
            }}
          />
        </label>
        <label className="toggle">
          <input type="checkbox" checked={st.showTranslation} onChange={(e) => updateSettings({ showTranslation: e.target.checked })} /> Mặc định hiện bản dịch
          tiếng Việt trong hội thoại mẫu
        </label>
        <div className="row">
          <label className="toggle">
            <input type="checkbox" checked={st.soundEffects} onChange={(e) => updateSettings({ soundEffects: e.target.checked })} /> Âm thanh hiệu ứng
            (“ting” khi trả lời đúng, nhạc ngắn khi xong bài)
          </label>
          <button type="button" className="btn btn-sm" onClick={() => playSound('complete')}>
            Nghe thử âm thanh
          </button>
        </div>
        <p className="muted small">Âm thanh không bao giờ phát khi micro đang nghe, nên không lẫn vào câu bạn nói.</p>
      </section>

      {SHEET_URL && <TeacherSection />}

      <section className="card" aria-labelledby="s-ai">
        <h2 id="s-ai">Chế độ hội thoại</h2>
        <fieldset>
          <legend className="sr-only">Chọn chế độ hội thoại</legend>
          <label className="option">
            <input type="radio" name="provider" checked={st.provider === 'scripted'} onChange={() => updateSettings({ provider: 'scripted' })} />{' '}
            <strong>Theo kịch bản (mặc định)</strong> – không cần Internet hay API key. Câu trả lời được kiểm tra bằng từ khóa và intent, không phải AI.
          </label>
          <label className="option">
            <input type="radio" name="provider" checked={st.provider === 'local-ai'} onChange={() => updateSettings({ provider: 'local-ai' })} />{' '}
            <strong>AI cục bộ (Ollama)</strong> – mô hình chạy trên máy tính của bạn. Cần cài Ollama và tải mô hình trước (xem README). Cần máy đủ mạnh.
          </label>
          <label className="option is-disabled">
            <input type="radio" name="provider" disabled /> <strong>{remoteProvider.label}</strong> – chưa có. Cần backend riêng giữ API key.
          </label>
        </fieldset>
        {st.provider === 'local-ai' && (
          <div className="sub">
            <label className="field">
              <span>Địa chỉ Ollama</span>
              <input value={st.ollamaUrl} onChange={(e) => updateSettings({ ollamaUrl: e.target.value })} />
            </label>
            <label className="field">
              <span>Tên mô hình</span>
              <input value={st.ollamaModel} onChange={(e) => updateSettings({ ollamaModel: e.target.value })} />
            </label>
            <button type="button" className="btn" onClick={() => void testAi()} disabled={checking}>
              {checking ? 'Đang kiểm tra…' : 'Kiểm tra kết nối'}
            </button>
            {aiStatus && (
              <p className="status" role="status">
                {aiStatus}
              </p>
            )}
            <p className="muted small">Nếu không kết nối được, trang luyện nói tự quay về chế độ kịch bản.</p>
          </div>
        )}
      </section>

      <section className="card" aria-labelledby="s-privacy">
        <h2 id="s-privacy">Quyền riêng tư và dữ liệu</h2>
        <ul>
          <li>Tiến độ, từ vựng và cài đặt được lưu trong trình duyệt của thiết bị này (LocalStorage). Xóa dữ liệu trình duyệt sẽ làm mất tiến độ.</li>
          <li>Ứng dụng không ghi âm, không lưu và không tự gửi giọng nói của bạn lên máy chủ nào.</li>
          <li>
            Tuy nhiên, chức năng nhận diện giọng nói là của trình duyệt. Một số trình duyệt (ví dụ Chrome) có thể gửi âm thanh tới dịch vụ trực tuyến của họ để
            xử lý. Không có đảm bảo âm thanh luôn được xử lý trên thiết bị.
          </li>
          {SHEET_URL && (
            <li>
              Khi bạn đã nhập tên ở mục “Gửi tiến độ cho giáo viên”, mỗi hoạt động hoàn thành (loại bài, tình huống, điểm, thời gian) được gửi vào bảng
              tính của giáo viên. Giọng nói và câu trả lời của bạn không được gửi.
            </li>
          )}
          <li>Ở chế độ AI cục bộ, câu trả lời của bạn được gửi tới địa chỉ Ollama bạn nhập ở trên (thường là máy của bạn).</li>
        </ul>
        <ResetDataButton />
      </section>
    </div>
  );
}

function TeacherSection() {
  const { state, updateSettings } = useProgress();
  const saved = state.settings.studentName;
  const [name, setName] = useState(saved);
  const pending = readQueue(localStorage).length;
  return (
    <section className="card" aria-labelledby="s-teacher">
      <h2 id="s-teacher">Gửi tiến độ cho giáo viên</h2>
      <p className="muted">Nhập tên của bạn một lần. Sau đó mỗi bài bạn làm xong sẽ tự động được gửi cho giáo viên.</p>
      <form
        className="text-answer field"
        onSubmit={(e) => {
          e.preventDefault();
          updateSettings({ studentName: name.trim().slice(0, 60) });
        }}
      >
        <label className="sr-only" htmlFor="student-name">
          Tên của bạn
        </label>
        <input id="student-name" value={name} maxLength={60} placeholder="Ví dụ: Lan Anh" autoComplete="name" onChange={(e) => setName(e.target.value)} />
        <button type="submit" className="btn btn-primary" disabled={name.trim() === saved}>
          Lưu
        </button>
      </form>
      <p className="status" role="status">
        {!saved
          ? 'Chưa nhập tên: tiến độ chưa được gửi.'
          : pending > 0
            ? `Đang gửi dưới tên “${saved}”. Còn ${pending} hoạt động chờ gửi (sẽ gửi khi có Internet).`
            : `Đang gửi dưới tên “${saved}”. Mọi hoạt động đã được gửi.`}
      </p>
    </section>
  );
}
