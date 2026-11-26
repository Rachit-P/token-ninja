import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { api, ApiError, Currency, Vendor } from './src/api/client';
import { BuyTokens } from './src/BuyTokens';
import { RedeemTokens } from './src/RedeemTokens';

type Catalog = { currencies: Currency[]; vendors: Vendor[] };

export default function App() {
  const [catalog, setCatalog] = useState<Catalog>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    Promise.all([api.listCurrencies(), api.listVendors()])
      .then(([currencies, vendors]) => setCatalog({ currencies, vendors }))
      .catch((e) => setError(e instanceof ApiError ? e.message : String(e)));
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safe}>
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>token-ninja</Text>
          <Text style={styles.subtitle}>Turn currency into compute tokens.</Text>
          {error && (
            <Text testID="catalog-error" style={styles.error}>
              {error}
            </Text>
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
});
