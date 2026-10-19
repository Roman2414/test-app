import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';

type Props = {
  // Момент последней успешной загрузки данных.
  since: Date;
};

function elapsedSeconds(sinceMs: number): number {
  const diff = Date.now() - sinceMs;
  if (!Number.isFinite(diff)) return 0;
  return Math.max(0, Math.floor(diff / 1000));
}

// Подпись «Обновлено N сек назад».
export function UpdatedAgo({ since }: Props) {
  const sinceMs = since.getTime();
  const [seconds, setSeconds] = useState(() => elapsedSeconds(sinceMs));

  useEffect(() => {
    setSeconds(elapsedSeconds(sinceMs));
    const timer = setInterval(() => {
      setSeconds(elapsedSeconds(sinceMs));
    }, 1000);

    return () => clearInterval(timer);
  }, [sinceMs]);

  return <Text style={styles.text}>Обновлено {seconds} сек назад</Text>;
}

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    color: '#6b7280',
  },
});
