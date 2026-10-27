# English Speaking Coach

Ứng dụng web luyện nói tiếng Anh giao tiếp theo tình huống thực tế, dành cho học sinh trình độ A1–B1.
Ứng dụng **không cần API trả phí, tài khoản hay máy chủ**: mọi thứ chạy trong trình duyệt.

## Tính năng (Phase 1 + Phase 2 đã có)

| Phần | Nội dung |
|---|---|
| Home | Mục tiêu hôm nay, thống kê thật, gợi ý bài tiếp theo, cảnh báo nếu trình duyệt thiếu tính năng giọng nói |
| Speaking Practice | 3 chế độ: **Listen and Repeat** (so sánh transcript từng từ), **Guided Speaking** (có nhiệm vụ, gợi ý, câu mẫu), **Free Role-play** (ẩn gợi ý, nhiều nhánh hội thoại) |
| Listening Practice | Bối cảnh, từ vựng chuẩn bị, nghe cả bài / từng câu, trắc nghiệm, điền từ, sắp xếp lượt hội thoại, transcript và giải thích tiếng Việt sau khi nộp |
| Real-Life Scenarios | 10 tình huống đầy đủ (từ vựng, mẫu câu, hội thoại mẫu có bản dịch, nhiệm vụ, tiêu chí hoàn thành) |
| Vocabulary | 80 từ/cụm từ: danh sách, Flashcards, Match, Fill in the blank, Complete the sentence, Từ khó |
| My Progress | Tình huống đã hoàn thành, phiên luyện nói, bài nghe, từ đã học, câu cần luyện lại, lịch sử, xóa dữ liệu |
| Settings | Giọng đọc, tốc độ, ngôn ngữ nhận diện, kiểm tra micro, mục tiêu ngày, bật/tắt âm thanh hiệu ứng, chọn chế độ hội thoại (kịch bản / Ollama) |
| Linh vật Quạc | Vịt pixel-art đeo tai nghe, phản ứng theo từng câu trả lời: đang nghe, vui khi máy nghe được, bối rối khi máy chưa hiểu, ăn mừng (pháo giấy) khi xong bài. Kèm thanh tiến độ bài, nút bấm kiểu Duolingo và âm thanh 8-bit (tạo bằng code, không tải file, không phát khi micro đang nghe). Người dùng chọn “giảm chuyển động” trong hệ điều hành thì app không chạy animation |

Muốn vẽ lại Quạc: sửa các lưới chữ cái trong `src/components/mascot/sprites.ts` (mỗi chữ là một màu, `.` là trong suốt).

## Yêu cầu môi trường

- **Node.js 20 trở lên** (đã thử với Node 24) và npm.
- Trình duyệt khuyên dùng: **Google Chrome** hoặc **Microsoft Edge** bản mới trên máy tính hoặc Android.

## Cài đặt và chạy

```bash
npm install
```

```bash
npm run dev
```

Mở địa chỉ hiện trong terminal (thường là http://localhost:5173).

Các lệnh khác:

```bash
npm test
```

```bash
npm run typecheck
```

```bash
npm run build
```

`npm run build` tạo thư mục `dist/` gồm các file tĩnh. Bạn có thể đưa thư mục này lên bất kỳ dịch vụ hosting tĩnh nào (GitHub Pages, Netlify, Vercel, Cloudflare Pages…). Lưu ý: micro chỉ hoạt động khi trang chạy trên **https** hoặc **localhost**. Xem bản build trên máy bằng `npm run preview`.

## Cấu trúc dự án

```
src/
  app/            App.tsx (khung, điều hướng), ProgressContext.tsx (trạng thái + lưu tiến độ)
  components/     Thành phần dùng chung: nút micro, ô trả lời, nút nghe, trình phát hội thoại
  features/       Mỗi trang một thư mục: dashboard, speaking, listening, scenarios, vocabulary, progress, settings
  services/
    speech/       SpeechRecognitionService, SpeechSynthesisService, SpeechCapabilityDetector, MicrophonePermissionManager
    conversation/ ConversationProvider (interface), Scripted / LocalAI (Ollama) / RemoteAI (chưa có)
    storage/      Lưu LocalStorage có phiên bản, tính thống kê và lịch ôn từ vựng
  data/scenarios/ Mỗi tình huống một file .ts — thêm tình huống mới bằng cách sao chép một file và thêm vào index.ts
  hooks/          useTts, useSpeechRecognition, useHashRoute
  utils/text.ts   Chuẩn hóa văn bản và so sánh transcript
  tests/          Unit test và component test (Vitest + Testing Library)
```

## Cách dùng micro

1. Vào **Speaking Practice**, chọn một tình huống và chế độ.
2. Bấm nút micro tròn lớn. Lần đầu trình duyệt sẽ hỏi quyền → chọn **Cho phép (Allow)**.
3. Nói câu tiếng Anh, cứ từ từ: ngừng giữa câu để nghĩ cũng không sao. Nói xong thì bấm **“Nói xong”**, hoặc im lặng 5 giây, ứng dụng sẽ tự dừng và hiện transcript (những gì máy nghe được) cùng phản hồi. Bạn có 10 giây để nghĩ trước khi bắt đầu nói, mỗi lần nói tối đa 45 giây (đổi các số này ở `DEFAULT_TIMING` trong `src/services/speech/SpeechRecognitionService.ts`).
4. Nếu không muốn nói hoặc micro lỗi, bấm **“Gõ câu trả lời thay vì nói”**.

Có thể kiểm tra micro trước ở **Settings → Kiểm tra micro**.

### Khắc phục lỗi micro

| Hiện tượng | Cách xử lý |
|---|---|
| “Micro bị từ chối” | Bấm biểu tượng ổ khóa cạnh thanh địa chỉ → Micro → Cho phép → tải lại trang. Trên Windows, kiểm tra thêm *Settings → Privacy & security → Microphone*. |
| “Không nghe thấy lời nói” | Nói to và gần micro hơn, kiểm tra đúng micro đang được chọn trong hệ điều hành. |
| “Lỗi kết nối” | Chrome gửi âm thanh tới dịch vụ của Google để nhận diện, nên cần Internet. Kiểm tra mạng. |
| “Không tìm thấy micro” | Cắm/bật micro, đóng các ứng dụng khác đang dùng micro (Zoom, Meet…). |
| Không có nút micro | Trình duyệt không hỗ trợ nhận diện giọng nói (ví dụ Firefox). Dùng Chrome/Edge hoặc gõ câu trả lời. |
| Không nghe thấy giọng đọc | Kiểm tra âm lượng; vào Settings chọn giọng khác và bấm “Nghe thử”. |

## Hạn chế của trình duyệt

- **Đọc văn bản (text-to-speech)** dùng `speechSynthesis` của trình duyệt. Giọng đọc phụ thuộc hệ điều hành; mỗi máy có thể khác nhau.
- **Nhận diện giọng nói (speech-to-text)** dùng Web Speech API (`SpeechRecognition` / `webkitSpeechRecognition`). Chrome và Edge hỗ trợ; Firefox chưa hỗ trợ; Safari hỗ trợ một phần. Chrome thường **cần Internet** vì xử lý trên máy chủ của Google.
- Ứng dụng **không chấm điểm phát âm**. “Mức khớp transcript” chỉ cho biết máy nghe được những từ nào so với câu mẫu; không đánh giá được trọng âm, âm vị hay ngữ điệu.

## Giới hạn của chế độ kịch bản (scripted)

Đây là chế độ mặc định. Nó **không phải AI**:

- Mỗi lượt hội thoại có danh sách các ý định (intent) và từ khóa được chấp nhận. Nếu câu trả lời chứa một từ khóa phù hợp, câu đó được chấp nhận; nếu không, ứng dụng gợi ý và cho thử lại.
- Hội thoại có rẽ nhánh (ví dụ: gọi thêm bánh, hỏi Wi-Fi hay bữa sáng…), nhưng chỉ trong phạm vi đã viết sẵn.
- Bộ so khớp từ khóa có thể chấp nhận một câu sai ngữ pháp nhưng có từ khóa đúng, hoặc chưa nhận ra một cách nói hợp lý nhưng chưa có trong dữ liệu. Có thể bổ sung từ khóa trong `src/data/scenarios/*.ts` (trường `anyOf`).
- Gợi ý ngữ pháp dựa trên vài luật đơn giản (`src/services/conversation/intentMatcher.ts`).

## Bật AI provider (tùy chọn)

### AI cục bộ với Ollama

Mô hình chạy trên máy tính của bạn, không tốn phí API, **nhưng** cần máy đủ mạnh (khuyến nghị RAM ≥ 8 GB), tốn điện và dung lượng ổ đĩa (mô hình nhỏ khoảng 2 GB). Chất lượng hội thoại của mô hình nhỏ thấp hơn các AI trực tuyến lớn.

1. Cài Ollama từ https://ollama.com.
2. Tải một mô hình nhỏ (khoảng 2 GB, chỉ chạy khi bạn đồng ý tải):
   ```bash
   ollama pull llama3.2
   ```
3. Đảm bảo Ollama đang chạy (ứng dụng Ollama mở, hoặc chạy `ollama serve`).
4. Trong app: **Settings → Chế độ hội thoại → AI cục bộ (Ollama)** → **Kiểm tra kết nối**.

Nếu Ollama không chạy hoặc chưa có mô hình, trang luyện nói tự quay lại chế độ kịch bản và hiện thông báo. Chỉ 12 tin nhắn gần nhất được gửi cho mô hình. Nếu trình duyệt báo lỗi CORS, đặt biến môi trường `OLLAMA_ORIGINS` cho Ollama (ví dụ `http://localhost:5173`) rồi khởi động lại Ollama.

### AI trực tuyến (giai đoạn sau)

Chưa được triển khai. Khi làm, cần một **backend riêng** giữ API key (xem `.env.example`), có giới hạn số lượt, xử lý timeout và rate limit. **Không bao giờ** đặt API key trong frontend hoặc trong biến `VITE_*`. Giao diện `ConversationProvider` (`src/services/conversation/ConversationProvider.ts`) đã sẵn sàng để thêm provider mới mà không phải sửa trang luyện nói.

## Theo dõi tiến độ học sinh (tùy chọn)

Giáo viên có thể nhận nhật ký hoạt động của học sinh vào một Google Sheet (miễn phí, không cần máy chủ). Xem hướng dẫn: [docs/teacher-sheet.md](docs/teacher-sheet.md). Khi chưa đặt biến `VITE_TEACHER_SHEET_URL`, tính năng này tắt và không gửi gì.

## Quyền riêng tư và dữ liệu lưu cục bộ

- Tiến độ, từ vựng và cài đặt được lưu trong **LocalStorage của trình duyệt** trên thiết bị đang dùng (khóa `esc.progress`). Không có tài khoản, không đồng bộ giữa các máy.
- Dữ liệu **sẽ mất** nếu xóa dữ liệu trình duyệt, dùng chế độ ẩn danh hoặc đổi trình duyệt.
- Nếu dữ liệu bị lỗi, ứng dụng bắt đầu lại và sao lưu bản cũ vào khóa `esc.progress.corrupt-backup`.
- Xóa toàn bộ dữ liệu: **My Progress** hoặc **Settings → Xóa dữ liệu học tập** (có bước xác nhận).
- Ứng dụng **không ghi âm, không lưu và không tự gửi giọng nói** lên máy chủ nào. Tuy nhiên, chức năng nhận diện giọng nói là của trình duyệt: Chrome có thể gửi âm thanh tới dịch vụ trực tuyến của Google để xử lý.

## Kiểm thử

- `npm test` chạy 46 test: chuẩn hóa transcript, so sánh câu, intent matching, nhánh hội thoại, chấm bài nghe, lưu/khôi phục tiến độ, dữ liệu lỗi, dịch vụ nhận diện giọng nói (giả lập), Ollama (giả lập fetch), và component test cho speaking workspace, trạng thái micro, bài nghe, từ vựng, trang tiến độ.
- Test kiểm tra luôn dữ liệu: đủ 10 tình huống, các nhánh role-play trỏ đúng, và câu mẫu của mọi lượt đều được bộ so khớp chấp nhận.
- Test không dùng micro thật, Internet hay AI.

## Còn thiếu / dự kiến

- Remote AI qua backend (chỉ có giao diện và thông báo “chưa cấu hình”).
- Chưa thử LocalAI với một máy chủ Ollama thật (mới test bằng dữ liệu giả lập).
- Chưa có PWA / chế độ cài đặt ngoại tuyến, chưa có ESLint.
- Chưa có tài khoản, đồng bộ cloud, quản lý lớp học (không nằm trong MVP).
