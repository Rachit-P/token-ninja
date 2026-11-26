import { useState } from 'react';

import { api, Currency } from './api/client';
import { AmountInput, Card, Chips, Result } from './components/ui';
import { sanitizeAmount, trimDecimal } from './format';
import { useQuote } from './useQuote';

export function BuyTokens({ currencies }: { currencies: Currency[] }) {
  const [code, setCode] = useState(currencies[0]?.code);
  const [amount, setAmount] = useState('');

  const ready = code && Number(amount) > 0;
  const { data, error } = useQuote(ready ? () => api.quotePurchase(code, amount) : null, [
    code,
    amount,
  ]);

  return (
    <Card title="Buy tokens">
      <Chips
        options={currencies.map((c) => ({ value: c.code, label: c.code }))}
        selected={code}
        onSelect={setCode}
      />
      <AmountInput
        value={amount}
        onChangeText={(t) => setAmount(sanitizeAmount(t))}
        placeholder={`Amount in ${code ?? 'currency'}`}
      />
      <Result
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
