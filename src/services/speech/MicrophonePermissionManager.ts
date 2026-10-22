// Microphone permission helpers. We only check/request access; audio is never recorded or stored.

export type MicPermission = 'granted' | 'denied' | 'prompt' | 'unknown';

export async function queryMicPermission(): Promise<MicPermission> {
  try {
    const status = await navigator.permissions.query({ name: 'microphone' as PermissionName });
    return status.state;
  } catch {
    return 'unknown'; // Firefox/Safari may not support querying the microphone permission
  }
}

export type MicRequestResult = 'granted' | 'denied' | 'no-device' | 'unavailable' | 'error';

/** Asks the browser for microphone access, then immediately releases the microphone. */
export async function requestMicAccess(): Promise<MicRequestResult> {
  if (!navigator.mediaDevices?.getUserMedia) return 'unavailable';
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((t) => t.stop());
    return 'granted';
  } catch (err) {
    const name = (err as DOMException)?.name;
    if (name === 'NotAllowedError' || name === 'SecurityError') return 'denied';
    if (name === 'NotFoundError' || name === 'OverconstrainedError') return 'no-device';
    return 'error';
  }
}
