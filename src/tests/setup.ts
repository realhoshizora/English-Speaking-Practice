import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

window.scrollTo = () => {}; // jsdom does not implement scrolling

afterEach(() => {
  cleanup();
  localStorage.clear();
  window.location.hash = '';
  delete (window as unknown as Record<string, unknown>).SpeechRecognition;
  delete (window as unknown as Record<string, unknown>).webkitSpeechRecognition;
});
