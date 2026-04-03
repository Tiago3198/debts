import { View, Text, TextInput, TouchableOpacity, Vibration, StyleSheet } from 'react-native';
import { useState } from 'react';
import { parseDebt } from '../utils/parseDebt';
import styles from './styles/EditScreen.styles';
import { setPendingUpdate } from '../utils/pendingUpdate';
import { Feather } from '@expo/vector-icons';

export default function EditScreen({ route, navigation }) {
  const { debt } = route.params;
  const [input, setInput] = useState(
    `${debt.person} ${debt.amount} ${debt.note}`.trim()
  );
  const [error, setError] = useState('');

  const save = () => {
    setError('');

    if (!input.trim()) {
      setError('Please enter who owes you and how much.');
      return;
    }

    if (input.includes('.') || input.includes("'")) {
      setError("Don't use dots or apostrophes for amounts.");
      return;
    }

    const { person, amount, note, errors } = parseDebt(input);

    if (errors.includes('amount_limit')) {
      setError('The maximum amount allowed is $1,000,000,000.');
      return;
    }
    if (errors.includes('person') && errors.includes('amount')) {
      setError('We need at least a name and an amount.');
      return;
    }
    if (errors.includes('person')) {
      setError("We couldn't detect a name.");
      return;
    }
    if (errors.includes('amount')) {
      setError("We couldn't detect an amount.");
      return;
    }

    setPendingUpdate({
      ...debt,
      person: person.charAt(0).toUpperCase() + person.slice(1),
      amount,
      note,
    });

    Vibration.vibrate(50);
    navigation.popToTop();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit debt</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          placeholder="e.g. Pedro 20 mil pizza"
          placeholderTextColor="#aaa"
          value={input}
          onChangeText={(text) => {
            setInput(text.replace(/[.']/g, ''));
            setError('');
          }}
          autoFocus
        />
        <TouchableOpacity style={styles.saveButton} onPress={save}>
          <Feather name="check" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.errorText}>⚠️ {error}</Text> : null}
    </View>
  );
}
