import { useMemo, useState } from 'react';
import { Text } from 'react-native';

import { api, Vendor } from './api/client';
import { AmountInput, Card, Chips, Result } from './components/ui';
import { isPositiveAmount, sanitizeAmount, trimDecimal } from './format';
import { useQuote } from './useQuote';

export function RedeemTokens({ vendors }: { vendors: Vendor[] }) {
  const [vendorId, setVendorId] = useState(vendors[0]?.id);
  const [tokens, setTokens] = useState('');
  const vendor = vendors.find((v) => v.id === vendorId);

  const key = vendorId && isPositiveAmount(tokens) ? `${vendorId}|${tokens}` : null;
  const { data, error, pending } = useQuote(key, (signal) =>
    api.quoteRedemption(vendorId!, tokens, signal),
  );
  const options = useMemo(() => vendors.map((v) => ({ value: v.id, label: v.name })), [vendors]);

  return (
    <Card title="Spend tokens on compute">
      <Chips
        options={options}
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
        pending={pending}
        error={error}
        text={data && `${trimDecimal(data.tokens)} tokens = ${trimDecimal(data.units)} ${data.unit}`}
      />
    </Card>
  );
}
