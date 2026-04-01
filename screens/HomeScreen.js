import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Vibration } from 'react-native';
import { useState } from 'react';

function parseDebt(text) {
  const amountMatch = text.match(/(\d+\.?\d*)\s*k?/i);
  const isK = text.match(/\d+k/i);
  let amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
  if (isK) amount *= 1000;

  const words = text.split(' ').filter(w => !w.match(/\d/) && w.length > 1);
  const person = words[0] || 'Unknown';
  const note = words.slice(1).join(' ') || '';

  return { person, amount, note };
}

export default function HomeScreen({ navigation }) {
  const [input, setInput] = useState('');
  const [debts, setDebts] = useState([]);

  const save = () => {
    if (!input.trim()) return;
    const { person, amount, note } = parseDebt(input);
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
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Who owes you and how much?</Text>

      <TextInput
        style={styles.input}
        placeholder="e.g. john 20k pizza"
        placeholderTextColor="#999"
        value={input}
        onChangeText={setInput}
        autoFocus
      />

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
              {item.note ? <Text style={styles.note}>{item.note}</Text> : null}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingTop: 80,
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 24,
    textAlign: 'center',
    color: '#111',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#111',
    marginBottom: 16,
  },
  button: {
    width: '100%',
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: { width: '100%' },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
    marginBottom: 10,
  },
  person: { fontSize: 16, fontWeight: '600', color: '#111' },
  note: { fontSize: 13, color: '#666', marginTop: 2 },
  amount: { fontSize: 16, fontWeight: '700', color: '#111', textAlign: 'right' },
  date: { fontSize: 12, color: '#999', textAlign: 'right', marginTop: 2 },
  right: { alignItems: 'flex-end' },
});