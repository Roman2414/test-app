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

export function visibleMatches(matches: Match[], filter: MatchFilter, query: string): Match[] {
  const needle = query.trim().toLocaleLowerCase('ru');

  return matches.filter((match) => {
    if (!matchesFilter(match, filter)) return false;
    if (!needle) return true;

    const home = match.home.name.toLocaleLowerCase('ru');
    const away = match.away.name.toLocaleLowerCase('ru');
    return home.includes(needle) || away.includes(needle);
  });
}

export function emptyMessage(filter: MatchFilter, query: string, total: number): string {
  if (total === 0) return 'Матчей тура пока нет';
  if (query.trim()) return 'Нет матчей с таким клубом';
  if (filter === 'upcoming') return 'Предстоящих матчей нет';
  if (filter === 'finished') return 'Завершённых матчей нет';
  return 'Матчей нет';
}
