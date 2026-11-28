import { memo, ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </View>
  );
}

function ChipsInner<T extends string>({
  options,
  selected,
  onSelect,
  testIDPrefix,
}: {
  options: { value: T; label: string }[];
  selected: T | undefined;
  onSelect: (value: T) => void;
  testIDPrefix: string;
}) {
  return (
    <View style={styles.chips}>
      {options.map((option) => {
        const active = option.value === selected;
        return (
          <Pressable
            key={option.value}
            testID={`${testIDPrefix}-${option.value}`}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            onPress={() => onSelect(option.value)}
            style={[styles.chip, active && styles.chipActive]}
          >
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{option.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function AmountInput({
  value,
  onChangeText,
  placeholder,
  testID,
}: {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  testID: string;
}) {
  return (
    <TextInput
      testID={testID}
      style={styles.input}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      keyboardType="decimal-pad"
      inputMode="decimal"
      autoCorrect={false}
      maxLength={21}
    />
  );
}

export function Result({
  text,
  error,
  pending,
  testID,
}: {
  text?: string;
  error?: string;
  pending?: boolean;
  testID: string;
}) {
  if (error)
    return (
      <Text testID={testID} style={styles.error}>
        {error}
      </Text>
    );
  if (text)
    return (
      <Text testID={testID} style={[styles.result, pending && styles.stale]}>
        {text}
      </Text>
    );
  return null;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardTitle: { fontSize: 18, fontWeight: '600' },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d0d5dd',
  },
  chipActive: { backgroundColor: '#111827', borderColor: '#111827' },
  chipText: { color: '#111827' },
  chipTextActive: { color: '#fff' },
  input: {
    borderWidth: 1,
    borderColor: '#d0d5dd',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  result: { fontSize: 16, fontWeight: '500' },
  // A result for older inputs, shown dimmed while the new quote loads.
  stale: { opacity: 0.4 },
  error: { color: '#b42318' },
});

/** Re-renders only when its options or selection change, not on every keystroke. */
export const Chips = memo(ChipsInner) as typeof ChipsInner;
