// Placeholder for a future remote AI provider. A real one must call YOUR backend
// (which holds the API key on the server), never an AI vendor directly from the browser.
import type { ConversationProvider } from './ConversationProvider';

export const remoteProvider: ConversationProvider = {
  kind: 'remote-ai',
  label: 'AI trực tuyến (qua backend)',
  generative: true,
  checkAvailability: async () => ({
    ok: false,
    message: 'Chưa có backend AI. Tính năng này dành cho giai đoạn sau, xem README mục "Bật AI provider".',
  }),
  createSession: () => {
    throw new Error('Remote AI provider chưa được cấu hình.');
  },
};
