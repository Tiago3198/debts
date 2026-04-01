import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Vibration } from 'react-native';
import { useState } from 'react';
import { parseDebt } from '../utils/parseDebt';
import styles from './styles/HomeScreen.styles';

export default function HomeScreen({ navigation }) {
  const [input, setInput] = useState('');
  const [debts, setDebts] = useState([]);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');

  const save = () => {
    setError('');
    setWarning('');

    if (!input.trim()) {
      setError('¿Cuánto te debo?.');
      return;
    }

    const { person, amount, note, errors } = parseDebt(input);

    if (errors.includes('person') && errors.includes('amount')) {
      setError('We need at least a name and an amount. e.g. "Pedro 20 mil"');
      return;
    }
    if (errors.includes('person')) {
      setError("We couldn't detect a name. e.g. \"Pedro 20 mil\"");
      return;
    }
    if (errors.includes('amount')) {
      setError("We couldn't detect an amount. e.g. \"Pedro 20 mil\"");
      return;
    }

    const newDebt = {
      id: Date.now().toString(),
      person: person.charAt(0).toUpperCase() + person.slice(1),
      amount,
      note,
      date: new Date().toLocaleDateString('en-US'),
    };

    setDebts([newDebt, ...debts]);
    setInput('');
    Vibration.vibrate(50);

    if (!note) {
      setWarning('Tip: adding a reason (e.g. "pizza") helps you remember later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Who owes you and how much?</Text>

      <TextInput
        style={[styles.input, error ? styles.inputError : null]}
        placeholder="e.g. Pedro 20 mil"
        placeholderTextColor="#999"
        value={input}
        onChangeText={(text) => {
          const clean = text.replace(/[.']/g, '');
          setInput(clean);
          setError('');
          setWarning('');
        }}
        autoFocus
      />

      {error ? (
        <Text style={styles.errorText}>⚠️ {error}</Text>
      ) : null}

      {warning ? (
        <Text style={styles.warningText}>💡 {warning}</Text>
      ) : null}

      <TouchableOpacity style={styles.button} onPress={save}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

      <FlatList
        data={debts}
        keyExtractor={item => item.id}
        style={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('Detail', { debt: item })}
          >
            <View>
              <Text style={styles.person}>{item.person}</Text>
              {item.note
                ? <Text style={styles.note}>{item.note}</Text>
                : <Text style={styles.noNote}>No reason added</Text>
              }
            </View>
            <View style={styles.right}>
              <Text style={styles.amount}>${item.amount.toLocaleString('en-US')}</Text>
              <Text style={styles.date}>{item.date}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}