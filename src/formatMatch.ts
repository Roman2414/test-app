import type { Match, Score } from './types';

const kickoffFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  hour: '2-digit',
  minute: '2-digit',
});

export function formatKickoff(startsAt: string | null): string {
  if (!startsAt) return 'Дата не назначена';

  const date = new Date(startsAt);
  if (Number.isNaN(date.getTime())) return 'Дата не назначена';

  // Без timeZone Intl берёт часовой пояс устройства.
  return kickoffFormatter.format(date);
}

export function formatScore(score: Score | null): string | null {
  if (!score) return null;
  return `${score.home}:${score.away}`;
}

export function formatStatus(match: Match): string {
  switch (match.status) {
    case 'finished':
      return 'Завершён';
    case 'scheduled':
      return 'Не начался';
    case 'live':
      return typeof match.minute === 'number' ? `Идёт · ${match.minute}′` : 'Идёт';
    case 'postponed':
      return 'Перенесён';
    default:
      return 'Статус неизвестен';
  }
}

export function statusColor(status: string): string {
  switch (status) {
    case 'live':
      return '#ef3124';
    case 'finished':
      return '#6b7280';
    case 'postponed':
      return '#b45309';
    case 'scheduled':
      return '#047857';
    default:
      return '#374151';
  }
}
