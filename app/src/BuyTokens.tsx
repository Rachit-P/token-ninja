import { useMemo, useState } from 'react';

import { api, Currency } from './api/client';
import { AmountInput, Card, Chips, Result } from './components/ui';
import { isPositiveAmount, sanitizeAmount, trimDecimal } from './format';
import { useQuote } from './useQuote';

export function BuyTokens({ currencies }: { currencies: Currency[] }) {
  const [code, setCode] = useState(currencies[0]?.code);
  const [amount, setAmount] = useState('');

  const key = code && isPositiveAmount(amount) ? `${code}|${amount}` : null;
  const { data, error, pending } = useQuote(key, (signal) =>
    api.quotePurchase(code!, amount, signal),
  );
  const options = useMemo(
    () => currencies.map((c) => ({ value: c.code, label: c.code })),
    [currencies],
  );

  return (
    <Card title="Buy tokens">
      <Chips
        options={options}
        selected={code}
        testIDPrefix="currency"
        onSelect={setCode}
      />
      <AmountInput
        testID="purchase-amount"
        value={amount}
        onChangeText={(t) => setAmount(sanitizeAmount(t))}
        placeholder={`Amount in ${code ?? 'currency'}`}
      />
      <Result
        testID="purchase-result"
        pending={pending}
        error={error}
        text={
          data &&
          `${trimDecimal(data.amount)} ${data.currency} = ${trimDecimal(data.tokens)} tokens ` +
            `(1 ${data.currency} = ${trimDecimal(data.tokens_per_unit)} tokens)`
        }
      />
    </Card>
  );
}
