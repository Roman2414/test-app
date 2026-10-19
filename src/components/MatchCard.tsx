import { StyleSheet, Text, View } from 'react-native';
import { formatKickoff, formatScore, formatStatus, statusColor } from '../formatMatch';
import type { Club, Match } from '../types';
import { FavoriteButton } from './FavoriteButton';

type Props = {
  match: Match;
  favorite: boolean;
  onToggleFavorite: () => void;
};

export function MatchCard({ match, favorite, onToggleFavorite }: Props) {
  const score = formatScore(match.score);

  return (
    <View style={styles.card}>
      <View style={styles.top}>
        <ClubName club={match.home} align="left" />
        <Text style={score ? styles.score : styles.versus}>{score ?? 'vs'}</Text>
        <ClubName club={match.away} align="right" />
        <FavoriteButton active={favorite} onPress={onToggleFavorite} />
      </View>
      <View style={styles.meta}>
        <Text style={styles.kickoff}>{formatKickoff(match.startsAt)}</Text>
        <Text style={[styles.status, { color: statusColor(match.status) }]}>{formatStatus(match)}</Text>
      </View>
    </View>
  );
}

function ClubName({ club, align }: { club: Club; align: 'left' | 'right' }) {
  const right = align === 'right';

  return (
    <View style={styles.club}>
      <Text style={[styles.name, right && styles.right]} numberOfLines={2}>
        {club.name}
      </Text>
      <Text style={[styles.city, right && styles.right]} numberOfLines={1}>
        {club.city}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    marginBottom: 10,
  },
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  club: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  city: {
    marginTop: 2,
    fontSize: 12,
    color: '#6b7280',
  },
  right: {
    textAlign: 'right',
  },
  score: {
    minWidth: 52,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  versus: {
    minWidth: 52,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#9ca3af',
  },
  meta: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 8,
  },
  kickoff: {
    flex: 1,
    fontSize: 13,
    color: '#4b5563',
  },
  status: {
    fontSize: 13,
    fontWeight: '600',
  },
});
