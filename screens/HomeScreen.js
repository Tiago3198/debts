import { Text, View, TextInput, TouchableOpacity, FlatList, Vibration } from 'react-native';
import { useState } from 'react';
import { parseDebt } from '../utils/parseDebt';
import styles from './styles/HomeScreen.styles';
import SwipeableDebtCard from './components/SwipeableDebtCard';

export default function HomeScreen({ navigation }) {
  const [input, setInput] = useState('');
  const [debts, setDebts] = useState([]);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');


  const save = () => {
    setError('');
    setWarning('');

    if (!input.trim()) {
      setError('We need at least a name and an amount. e.g. "Pedro 20 mil"');
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
    if (errors.includes('amount_limit')) {
      setError("The maximum amount allowed is $1,000,000,000.");
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
  const deleteDebt = (id) => {
    setDebts(prev => prev.filter(d => d.id !== id));
  };
  const updateDebt = (updatedDebt) => {
    setDebts(prev => prev.map(d => d.id === updatedDebt.id ? updatedDebt : d));
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Cuánto te debo?</Text>

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
          <SwipeableDebtCard
            item={item}
            onDelete={deleteDebt}
            onEdit={(debt) => navigation.navigate('Edit', { debt, onUpdate: updateDebt })}
            onPress={() => navigation.navigate('Detail', { debt: item })}

          />
        )}
      />
    </View>
  );
}