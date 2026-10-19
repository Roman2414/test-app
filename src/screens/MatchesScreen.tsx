import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { MatchCard } from '../components/MatchCard';
import { useMatches } from '../hooks/useMatches';
import { emptyMessage, MATCH_FILTERS, matchesFilter, type MatchFilter } from '../matchFilters';

export function MatchesScreen() {
  const { matches, round, phase, error, refresh } = useMatches();
  const [filter, setFilter] = useState<MatchFilter>('all');
  const visible = matches.filter((match) => matchesFilter(match, filter));

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Матчи тура</Text>
        {round != null ? <Text style={styles.subtitle}>Тур {round}</Text> : null}
        {phase === 'ready' ? (
          <View style={styles.filters}>
            {MATCH_FILTERS.map((item) => {
              const selected = item.id === filter;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => setFilter(item.id)}
                  style={[styles.chip, selected && styles.chipSelected]}
                  accessibilityRole="button"
                  accessibilityState={{ selected }}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextSelected]}>{item.label}</Text>
                </Pressable>
              );
            })}
          </View>
        ) : null}
      </View>

      {phase === 'loading' ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#111827" />
          <Text style={styles.message}>Загружаем матчи…</Text>
        </View>
      ) : null}

      {phase === 'error' ? (
        <View style={styles.center}>
          <Text style={styles.message}>{error ?? 'Не удалось загрузить матчи'}</Text>
          <Pressable
            onPress={() => void refresh()}
            style={({ pressed }) => [styles.retry, pressed && styles.pressed]}
            accessibilityRole="button"
            accessibilityLabel="Повторить"
          >
            <Text style={styles.retryText}>Повторить</Text>
          </Pressable>
        </View>
      ) : null}

      {phase === 'ready' ? (
        <FlatList
          data={visible}
          keyExtractor={(item) => item.id}
          style={styles.listView}
          contentContainerStyle={visible.length === 0 ? styles.emptyList : styles.list}
          renderItem={({ item }) => <MatchCard match={item} />}
          ListEmptyComponent={<Text style={styles.message}>{emptyMessage(filter, matches.length)}</Text>}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f3f4f6',
  },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    marginTop: 2,
    fontSize: 14,
    color: '#6b7280',
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 12,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
  },
  chipSelected: {
    backgroundColor: '#111827',
  },
  chipText: {
    fontSize: 14,
    color: '#111827',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  listView: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  emptyList: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  message: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
  },
  retry: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#111827',
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  pressed: {
    opacity: 0.8,
  },
});
