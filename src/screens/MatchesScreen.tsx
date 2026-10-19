import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { MatchCard } from '../components/MatchCard';
import { useMatches } from '../hooks/useMatches';

export function MatchesScreen() {
  const { matches, round, phase, error, refresh } = useMatches();

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Text style={styles.title}>Матчи тура</Text>
        {round != null ? <Text style={styles.subtitle}>Тур {round}</Text> : null}
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
          data={matches}
          keyExtractor={(item) => item.id}
          style={styles.listView}
          contentContainerStyle={matches.length === 0 ? styles.emptyList : styles.list}
          renderItem={({ item }) => <MatchCard match={item} />}
          ListEmptyComponent={<Text style={styles.message}>Матчей тура пока нет</Text>}
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
