import { useCallback, useEffect, useRef, useState } from 'react';
import { loadMatches } from '../loadMatches';
import type { Match } from '../types';

type Phase = 'loading' | 'ready' | 'error';

export function useMatches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [round, setRound] = useState<number | null>(null);
  const [phase, setPhase] = useState<Phase>('loading');
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);

  const requestId = useRef(0);
  const hasData = useRef(false);
  const mounted = useRef(true);

  const load = useCallback(async () => {
    const id = ++requestId.current;
    const firstLoad = !hasData.current;

    if (firstLoad) setPhase('loading');
    else setRefreshing(true);
    setError(null);

    try {
      const payload = await loadMatches();
      if (!mounted.current || id !== requestId.current) return;

      setMatches(payload.matches);
      setRound(payload.round);
      setUpdatedAt(new Date());
      setPhase('ready');
      hasData.current = true;
    } catch (cause) {
      if (!mounted.current || id !== requestId.current) return;

      const message = cause instanceof Error ? cause.message : 'Не удалось загрузить матчи';
      setError(message);
      if (!hasData.current) setPhase('error');
    } finally {
      if (mounted.current && id === requestId.current) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    void load();
    return () => {
      mounted.current = false;
    };
  }, [load]);

  return { matches, round, phase, error, refreshing, updatedAt, refresh: load };
}
