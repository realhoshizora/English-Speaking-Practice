import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { ProgressProvider } from '../app/ProgressContext';
import { getScenario } from '../data/scenarios';
import { ListeningQuiz } from '../features/listening/ListeningQuiz';
import { Dashboard } from '../features/dashboard/Dashboard';
import { ProgressPage } from '../features/progress/ProgressPage';
import { ConversationPractice } from '../features/speaking/ConversationPractice';
import { RepeatPractice } from '../features/speaking/RepeatPractice';
import { VocabularyPage } from '../features/vocabulary/VocabularyPage';
import { STORAGE_KEY, loadState } from '../services/storage/progressStorage';
import { FakeRecognition } from './fakes';

const renderApp = (ui: ReactElement) => render(<ProgressProvider storage={localStorage}>{ui}</ProgressProvider>);
const stored = () => loadState(localStorage).state;
const coffee = getScenario('ordering-coffee')!;

describe('Speaking workspace – guided scripted conversation (typed fallback)', () => {
  it('runs a full conversation, gives feedback and saves the session', async () => {
    const user = userEvent.setup();
    renderApp(<ConversationPractice scenario={coffee} mode="guided" />);

    expect(await screen.findByText(/không phải AI/)).toBeInTheDocument();
    expect(screen.getByText(/không hỗ trợ nhận diện giọng nói/)).toBeInTheDocument();
    expect(screen.getByText('Hi! What can I get for you today?')).toBeInTheDocument();

    const answer = async (text: string) => {
      await user.type(screen.getByRole('textbox'), text);
      await user.click(screen.getByRole('button', { name: 'Gửi' }));
    };

    await answer('I like dogs');
    expect(screen.getByText(/chưa nhận ra ý/)).toBeInTheDocument();
    expect(screen.getByText('Quạc chưa hiểu ý bạn.')).toBeInTheDocument(); // the mascot is confused, not the learner wrong
    await user.click(screen.getByRole('button', { name: /Gợi ý/ }));
    expect(screen.getByText(/I'd like a …, please/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Thử lại/ }));

    await answer('I want a latte');
    expect(screen.getByText(/Câu trả lời phù hợp/)).toBeInTheDocument();
    expect(screen.getByText('Tuyệt vời!')).toBeInTheDocument();
    expect(screen.getByText(/lịch sự hơn/)).toBeInTheDocument(); // grammar tip for "I want"
    await user.click(screen.getByRole('button', { name: /Tiếp tục/ }));
    expect(screen.getByText(/What size would you like/)).toBeInTheDocument();

    for (const a of ['Medium please', 'For here', "No, that's all", 'Here you are']) {
      await answer(a);
      await user.click(screen.getByRole('button', { name: /Tiếp tục/ }));
    }
    expect(await screen.findByText('Tổng kết phiên luyện nói')).toBeInTheDocument();
    expect(within(screen.getByText('Hoàn thành nhiệm vụ').closest('div')!).getByText('100%')).toBeInTheDocument();
    expect(screen.getByText(/không phải điểm phát âm/)).toBeInTheDocument();
    expect(document.querySelector('.mascot-cheer')).not.toBeNull(); // celebration at the end
    await waitFor(() => expect(stored().records).toMatchObject([{ type: 'guided', scenarioId: 'ordering-coffee', score: 1 }]));
  });

  it('hides the task in role-play mode and labels it as scripted', async () => {
    renderApp(<ConversationPractice scenario={coffee} mode="roleplay" />);
    expect(await screen.findByText(/Guided scripted role-play/)).toBeInTheDocument();
    expect(screen.queryByText(/Nhiệm vụ:/)).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Hiện nhiệm vụ' }));
    expect(screen.getByText(/Nhiệm vụ:/)).toBeInTheDocument();
  });
});

describe('Microphone states (mocked SpeechRecognition)', () => {
  it('shows listening, then the transcript comparison', async () => {
    FakeRecognition.install();
    const user = userEvent.setup();
    renderApp(<RepeatPractice scenario={coffee} />);

    await user.click(screen.getByRole('button', { name: 'Bắt đầu nói bằng micro' }));
    expect(screen.getByRole('status')).toHaveTextContent('Đang bật micro');
    act(() => FakeRecognition.last.onstart?.());
    expect(screen.getByRole('status')).toHaveTextContent('Đang nghe');
    expect(screen.getByRole('button', { name: /Nói xong/ })).toHaveAttribute('aria-pressed', 'true');

    act(() => FakeRecognition.last.say('I would like latte'));
    expect(screen.getByText(/Máy nghe được/)).toBeInTheDocument();
    expect(screen.getByText(/Mức khớp transcript: 60%/)).toBeInTheDocument();
    expect(screen.getByText(/không phải điểm\s+phát âm/)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Kết thúc phiên' }));
    expect(stored().records[0]).toMatchObject({ type: 'repeat', score: 0.6 });
    expect(Object.keys(stored().retry)).toEqual(["I'd like a latte, please."]);
  });

  it('explains how to fix a denied microphone', async () => {
    FakeRecognition.install();
    renderApp(<RepeatPractice scenario={coffee} />);
    await userEvent.click(screen.getByRole('button', { name: 'Bắt đầu nói bằng micro' }));
    act(() => FakeRecognition.last.fail('not-allowed'));
    expect(screen.getByRole('status')).toHaveTextContent('Micro bị từ chối');
    expect(screen.getByRole('textbox')).toBeInTheDocument(); // typed fallback opens automatically
  });

  it('offers honest self-practice when recognition is unsupported', async () => {
    renderApp(<RepeatPractice scenario={coffee} />);
    expect(screen.getByText(/ứng dụng không nghe được giọng của bạn/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /Tôi đã tự đọc câu này/ }));
    await userEvent.click(screen.getByRole('button', { name: 'Kết thúc phiên' }));
    expect(stored().records[0]).toMatchObject({ type: 'repeat', score: null });
  });
});

describe('Listening quiz', () => {
  it('grades answers, reveals transcript and saves the result', async () => {
    const user = userEvent.setup();
    renderApp(<ListeningQuiz scenario={coffee} />);
    expect(screen.queryByText('I\'d like a latte, please.', { selector: '.en' })).not.toBeInTheDocument();
    const submit = screen.getByRole('button', { name: 'Nộp bài' });
    expect(submit).toBeDisabled();

    await user.click(screen.getByLabelText('A latte'));
    await user.click(screen.getByLabelText('For here'));
    const [fill1, fill2] = screen.getAllByRole('textbox');
    await user.type(fill1, 'medium');
    await user.type(fill2, 'four');
    await user.click(submit);

    expect(screen.getByText(/Kết quả: 3\/5 câu đúng/)).toBeInTheDocument();
    expect(screen.getByText(/Đáp án:/)).toBeInTheDocument();
    expect(screen.getByText("I'd like a latte, please.", { selector: '.en' })).toBeInTheDocument();
    expect(stored().records[0]).toMatchObject({ type: 'listening', score: 0.6 });
  });
});

describe('Vocabulary review', () => {
  it('flashcards update review progress', async () => {
    const user = userEvent.setup();
    renderApp(<VocabularyPage />);
    await user.click(screen.getByRole('tab', { name: 'Flashcards' }));
    await user.click(screen.getByRole('button', { name: /Lật thẻ/ }));
    await user.click(screen.getByRole('button', { name: /Cần ôn lại/ }));
    expect(screen.getByText('Thẻ 2/8')).toBeInTheDocument();
    const vocab = stored().vocab;
    expect(Object.values(vocab)).toMatchObject([{ correct: 0, wrong: 1 }]);
    await user.click(screen.getByRole('tab', { name: /Từ khó \(1\)/ }));
    expect(screen.getByText('Thẻ 1/1')).toBeInTheDocument();
  });
});

describe('Progress dashboard', () => {
  it('shows real stored data and resets only after confirmation', async () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        records: [
          { id: '1', type: 'guided', scenarioId: 'ordering-coffee', date: new Date().toISOString(), score: 0.8 },
          { id: '2', type: 'listening', scenarioId: 'ordering-coffee', date: new Date().toISOString(), score: 1 },
        ],
        vocab: {},
        retry: { 'A medium, please.': { scenarioId: 'ordering-coffee', score: 0.5, date: new Date().toISOString() } },
        settings: {},
      }),
    );
    const user = userEvent.setup();
    renderApp(<ProgressPage />);
    const completed = screen.getByText('Tình huống hoàn thành').closest('div')!;
    expect(within(completed).getByText('1/3')).toBeInTheDocument();
    expect(screen.getByText('A medium, please.')).toBeInTheDocument();
    expect(screen.getByText(/Mục tiêu hôm nay:/).closest('p')).toHaveTextContent('2/3 hoạt động');

    await user.click(screen.getByRole('button', { name: /Xóa dữ liệu học tập/ }));
    await user.click(screen.getByRole('button', { name: 'Hủy' }));
    expect(stored().records).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: /Xóa dữ liệu học tập/ }));
    await user.click(screen.getByRole('button', { name: 'Xóa vĩnh viễn' }));
    await waitFor(() => expect(stored().records).toHaveLength(0));
  });
});

describe('Home dashboard', () => {
  const seed = (records: object[]) =>
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, records, vocab: {}, retry: {}, settings: {} }));
  const now = () => new Date().toISOString();

  it('sends a new learner to Listen and Repeat of the first scenario, with how-to steps', () => {
    renderApp(<Dashboard />);
    expect(screen.getByRole('link', { name: 'Bắt đầu luyện nói' })).toHaveAttribute('href', expect.stringMatching(/\/repeat$/));
    expect(screen.getByText('Một buổi luyện diễn ra thế nào')).toBeInTheDocument();
  });

  it('resumes the last scenario at the next missing step', () => {
    seed([
      { id: '1', type: 'repeat', scenarioId: 'ordering-coffee', date: now(), score: 0.9 },
      { id: '2', type: 'guided', scenarioId: 'ordering-coffee', date: now(), score: 0.8 },
    ]);
    renderApp(<Dashboard />);
    expect(screen.getByRole('heading', { name: coffee.title })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Làm bài nghe' })).toHaveAttribute('href', '#/listening/ordering-coffee');
    expect(screen.getByText(/Tuần này bạn đã luyện nói 2 lần/)).toBeInTheDocument();
  });
});
