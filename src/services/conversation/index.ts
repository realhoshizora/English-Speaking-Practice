import type { Settings } from '../../types';
import type { ConversationProvider } from './ConversationProvider';
import { createLocalAIProvider } from './LocalAIConversationProvider';
import { scriptedProvider } from './ScriptedConversationProvider';

export * from './ConversationProvider';
export { scriptedProvider } from './ScriptedConversationProvider';
export { remoteProvider } from './RemoteAIConversationProvider';

/** The provider chosen in Settings. Callers must still check availability and fall back to scripted. */
export function getProvider(settings: Settings): ConversationProvider {
  return settings.provider === 'local-ai' ? createLocalAIProvider(settings.ollamaUrl, settings.ollamaModel) : scriptedProvider;
}
