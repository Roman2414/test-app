import type { Match } from './types';

export type MatchFilter = 'all' | 'upcoming' | 'finished';

export const MATCH_FILTERS: { id: MatchFilter; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'upcoming', label: 'Предстоящие' },
  { id: 'finished', label: 'Завершённые' },
];

// live ещё не сыгран до конца, поэтому он рядом с scheduled.
// postponed и неизвестные статусы остаются только во «Все».
const UPCOMING_STATUSES = new Set(['scheduled', 'live']);

export function matchesFilter(match: Match, filter: MatchFilter): boolean {
  if (filter === 'all') return true;
  if (filter === 'finished') return match.status === 'finished';
  return UPCOMING_STATUSES.has(match.status);
}

export function emptyMessage(filter: MatchFilter, total: number): string {
  if (total === 0) return 'Матчей тура пока нет';
  if (filter === 'upcoming') return 'Предстоящих матчей нет';
  if (filter === 'finished') return 'Завершённых матчей нет';
  return 'Матчей нет';
}
