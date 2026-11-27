import { useState } from 'react';
import { Text } from 'react-native';

import { api, Vendor } from './api/client';
import { AmountInput, Card, Chips, Result } from './components/ui';
import { sanitizeAmount, trimDecimal } from './format';
import { useQuote } from './useQuote';

export function RedeemTokens({ vendors }: { vendors: Vendor[] }) {
  const [vendorId, setVendorId] = useState(vendors[0]?.id);
  const [tokens, setTokens] = useState('');
  const vendor = vendors.find((v) => v.id === vendorId);

  const ready = vendorId && Number(tokens) > 0;
  const { data, error } = useQuote(ready ? () => api.quoteRedemption(vendorId, tokens) : null, [
    vendorId,
    tokens,
  ]);

  return (
    <Card title="Spend tokens on compute">
      <Chips
        options={vendors.map((v) => ({ value: v.id, label: v.name }))}
        selected={vendorId}
        testIDPrefix="vendor"
        onSelect={setVendorId}
      />
      {vendor && (
        <Text>
          {trimDecimal(vendor.tokens_per_unit)} tokens per {vendor.unit}
        </Text>
      )}
      <AmountInput
        testID="redeem-tokens"
        value={tokens}
        onChangeText={(t) => setTokens(sanitizeAmount(t))}
        placeholder="Tokens to spend"
      />
      <Result
        testID="redeem-result"
        error={error}
        text={data && `${trimDecimal(data.tokens)} tokens = ${trimDecimal(data.units)} ${data.unit}`}
      />
    </Card>
  );
}
