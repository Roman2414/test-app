import { MATCHES_URL } from './config';
import type { Club, Match, MatchesPayload, Score } from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parseClub(value: unknown): Club | null {
  if (!isRecord(value)) return null;
  if (typeof value.id !== 'string' || typeof value.name !== 'string' || typeof value.city !== 'string') {
    return null;
  }
  return { id: value.id, name: value.name, city: value.city };
}

function parseScore(value: unknown): Score | null {
  if (value == null) return null;
  if (!isRecord(value)) return null;
  if (typeof value.home !== 'number' || typeof value.away !== 'number') return null;
  return { home: value.home, away: value.away };
}

function parseMatch(value: unknown): Match | null {
  if (!isRecord(value)) return null;
  if (typeof value.id !== 'string' || value.id.length === 0) return null;

  const home = parseClub(value.home);
  const away = parseClub(value.away);
  if (!home || !away) return null;

  const startsAt = typeof value.startsAt === 'string' && value.startsAt.length > 0 ? value.startsAt : null;
  const status = typeof value.status === 'string' && value.status.length > 0 ? value.status : 'unknown';
  const minute = typeof value.minute === 'number' ? value.minute : undefined;

  return {
    id: value.id,
    startsAt,
    status,
    minute,
    home,
    away,
    score: parseScore(value.score),
  };
}

function parsePayload(data: unknown): MatchesPayload {
  if (!isRecord(data) || !Array.isArray(data.matches)) {
    throw new Error('Сервер прислал ответ в неожиданном формате');
  }

  const parsed = data.matches.map(parseMatch);
  const matches = parsed.filter((match): match is Match => match !== null);
  if (data.matches.length > 0 && matches.length === 0) {
    throw new Error('Сервер прислал ответ в неожиданном формате');
  }

  return {
    round: typeof data.round === 'number' ? data.round : null,
    matches,
  };
}

export async function loadMatches(): Promise<MatchesPayload> {
  let response: Response;
  try {
    response = await fetch(MATCHES_URL, { cache: 'no-store' });
  } catch {
    throw new Error('Нет соединения с сервером');
  }

  if (!response.ok) {
    throw new Error(`Не удалось загрузить матчи (${response.status})`);
  }

  let data: unknown;
  try {
    data = await response.json();
  } catch {
    throw new Error('Сервер прислал ответ в неожиданном формате');
  }

  return parsePayload(data);
}
