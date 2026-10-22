import { useCallback, useEffect, useId, useSyncExternalStore } from 'react';
import { useProgress } from '../app/ProgressContext';
import { tts } from '../services/speech/SpeechSynthesisService';

/** Text-to-speech bound to the user's voice/rate settings. Stops its own playback on unmount. */
export function useTts() {
  const { state } = useProgress();
  const { rate, voiceURI } = state.settings;
  const snap = useSyncExternalStore(tts.subscribe, tts.getSnapshot);
  const id = useId();

  useEffect(
    () => () => {
      if (tts.getSnapshot().key?.startsWith(id)) tts.stop();
    },
    [id],
  );

  const speak = useCallback((texts: string | string[], key = 'default') => tts.speak(texts, id + key, { rate, voiceURI }), [id, rate, voiceURI]);
  const active = (key = 'default') => snap.key === id + key && snap.status !== 'idle';

  return {
    supported: tts.isSupported(),
    status: snap.status,
    index: snap.index,
    speak,
    active,
    pause: () => tts.pause(),
    resume: () => tts.resume(),
    stop: () => tts.stop(),
  };
}
