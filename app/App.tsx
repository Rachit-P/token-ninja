import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { AbortedError, api, ApiError, Currency, Vendor } from './src/api/client';
import { BuyTokens } from './src/BuyTokens';
import { RedeemTokens } from './src/RedeemTokens';

type Catalog = { currencies: Currency[]; vendors: Vendor[] };

export default function App() {
  const [catalog, setCatalog] = useState<Catalog>();
  const [error, setError] = useState<string>();
  // Bumped by "Try again" to reload the catalog after a failure, instead of needing an app restart.
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setError(undefined);
    Promise.all([api.listCurrencies(controller.signal), api.listVendors(controller.signal)])
      .then(([currencies, vendors]) => setCatalog({ currencies, vendors }))
      .catch((e) => {
        if (e instanceof AbortedError || controller.signal.aborted) return;
        setError(e instanceof ApiError ? e.message : String(e));
      });
    return () => controller.abort();
  }, [attempt]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>token-ninja</Text>
          <Text style={styles.subtitle}>Turn currency into compute tokens.</Text>
          {error && (
            <>
              <Text testID="catalog-error" style={styles.error}>
                {error}
              </Text>
              <Pressable
                testID="catalog-retry"
                accessibilityRole="button"
                onPress={retry}
                style={styles.retry}
              >
                <Text style={styles.retryText}>Try again</Text>
              </Pressable>
            </>
          )}
          {!catalog && !error && <ActivityIndicator />}
          {catalog && (
            <>
              <BuyTokens currencies={catalog.currencies} />
              <RedeemTokens vendors={catalog.vendors} />
            </>
          )}
        </ScrollView>
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f4f5f7' },
  content: { padding: 20, gap: 16, maxWidth: 640, width: '100%', alignSelf: 'center' },
  title: { fontSize: 32, fontWeight: '700' },
  subtitle: { fontSize: 16, color: '#475467' },
  error: { color: '#b42318' },
  retry: {
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#111827',
  },
  retryText: { color: '#fff', fontWeight: '600' },
});
