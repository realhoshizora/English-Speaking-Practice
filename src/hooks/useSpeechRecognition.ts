import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { getRecognitionCtor } from '../services/speech/SpeechCapabilityDetector';
import { SpeechRecognitionService } from '../services/speech/SpeechRecognitionService';

/** One recognition service per component. Calls onResult once per recognised utterance. */
export function useSpeechRecognition(onResult?: (transcript: string) => void) {
  const [svc] = useState(() => new SpeechRecognitionService());
  const snap = useSyncExternalStore(svc.subscribe, svc.getSnapshot);
  const cb = useRef(onResult);
  cb.current = onResult;

  useEffect(() => () => svc.abort(), [svc]);

  useEffect(() => {
    if (snap.status === 'recognized') cb.current?.(snap.transcript);
  }, [snap]);

  return {
    snap,
    supported: getRecognitionCtor() !== null,
    start: (lang: string) => svc.start(lang),
    stop: () => svc.stop(),
    reset: () => svc.abort(),
  };
}
