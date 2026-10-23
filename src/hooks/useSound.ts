import { useCallback } from 'react';
import { useProgress } from '../app/ProgressContext';
import { playSound, type SoundName } from '../services/sound/sfx';
import { isRecognitionActive } from '../services/speech/SpeechRecognitionService';

/** Plays a sound effect if the learner has them on, and never while the microphone is listening. */
export function useSound() {
  const on = useProgress().state.settings.soundEffects;
  return useCallback(
    (name: SoundName) => {
      if (on && !isRecognitionActive()) playSound(name);
    },
    [on],
  );
}
