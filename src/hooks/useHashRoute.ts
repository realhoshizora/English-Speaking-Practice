import { useEffect, useState } from 'react';

const read = () => window.location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);

/** Tiny hash router: "#/speaking/ordering-coffee/guided" → ["speaking", "ordering-coffee", "guided"]. */
export function useHashRoute(): string[] {
  const [parts, setParts] = useState(read);
  useEffect(() => {
    const onChange = () => {
      setParts(read());
      window.scrollTo?.(0, 0);
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return parts;
}

export function navigate(path: string) {
  window.location.hash = path;
}
