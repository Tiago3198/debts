import { Text, View, TextInput, TouchableOpacity, FlatList, Vibration, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import { parseDebt } from '../utils/parseDebt';
import styles from './styles/HomeScreen.styles';
import SwipeableDebtCard from './components/SwipeableDebtCard';
import { getPendingUpdate } from '../utils/pendingUpdate';
import { Feather } from '@expo/vector-icons';

export default function HomeScreen({ navigation, route }) {
  const [input, setInput] = useState('');
  const [debts, setDebts] = useState([]);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      const updated = getPendingUpdate();
      if (updated) updateDebt(updated);
    });
    return unsubscribe;
  }, [navigation]);

  // Handle saving a new debt
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
      setError('We couldn\'t detect a name. e.g. "Pedro 20 mil"');
      return;
    }
    if (errors.includes('amount')) {
      setError('We couldn\'t detect an amount. e.g. "Pedro 20 mil"');
      return;
    }
    if (errors.includes('amount_limit')) {
      setError('The maximum amount allowed is $1,000,000,000.');
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
    Vibration.vibrate(25);

    if (!note) {
      setWarning('Tip: adding a reason (e.g. "pizza") helps you remember later.');
    }
  };

  // Handle deleting a debt
  const deleteDebt = (id) => {
    setDebts(prev => prev.filter(d => d.id !== id));
  };

  // Handle updating a debt after editing
  const updateDebt = (updatedDebt) => {
    setDebts(prev => prev.map(d => d.id === updatedDebt.id ? updatedDebt : d));
  };

  // Calculate total amount
  //const total = debts.reduce((sum, d) => sum + d.amount, 0);

  const [selectedPerson, setSelectedPerson] = useState(null);

  // Agrupar deudas por persona
  const peopleGroups = debts.reduce((acc, debt) => {
    if (!acc[debt.person]) acc[debt.person] = 0;
    acc[debt.person] += debt.amount;
    return acc;
  }, {});

  // Filtrar lista según selección
  const filteredDebts = selectedPerson
    ? debts.filter(d => d.person === selectedPerson)
    : debts;

  // Total según filtro activo
  const total = filteredDebts.reduce((sum, d) => sum + d.amount, 0);

  return (
    <View style={styles.container}>

      <View style={styles.header}>
        <Text style={styles.title}>¿Cuánto te debo?</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[styles.input, error ? styles.inputError : null]}
            placeholder="e.g. Pedro 20 mil pizza"
            placeholderTextColor="#aaa"
            value={input}
            onChangeText={(text) => {
              const clean = text.replace(/[.']/g, '');
              setInput(clean);
              setError('');
              setWarning('');
            }}
          />
          <TouchableOpacity style={styles.saveButton} onPress={save}>
            <Feather name="plus" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {error ? <Text style={styles.errorText}>⚠️ {error}</Text> : null}
        {warning ? <Text style={styles.warningText}>💡 {warning}</Text> : null}

        {Object.keys(peopleGroups).length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterBar}
            contentContainerStyle={styles.filterBarContent}
          >
            <TouchableOpacity
              style={[styles.filterChip, !selectedPerson && styles.filterChipActive]}
              onPress={() => setSelectedPerson(null)}
            >
              <Text style={[styles.filterChipText, !selectedPerson && styles.filterChipTextActive]}>
                All
              </Text>
            </TouchableOpacity>

            {Object.entries(peopleGroups).map(([person, amount]) => (
              <TouchableOpacity
                key={person}
                style={[styles.filterChip, selectedPerson === person && styles.filterChipActive]}
                onPress={() => setSelectedPerson(prev => prev === person ? null : person)}
              >
                <Text style={[styles.filterChipText, selectedPerson === person && styles.filterChipTextActive]}>
                  {person} ${amount.toLocaleString('en-US')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>

      <FlatList
        data={filteredDebts}
        keyExtractor={item => item.id}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Feather name="inbox" size={40} color="#ddd" />
            <Text style={styles.emptyText}>No debts yet</Text>
            <Text style={styles.emptySubtext}>Type above to add your first one</Text>
          </View>
        }
        renderItem={({ item }) => (
          <SwipeableDebtCard
            item={item}
            onDelete={deleteDebt}
            onEdit={(debt) => navigation.navigate('Edit', { debt })}
            onPress={() => navigation.navigate('Detail', { debt: item })}
          />
        )}
      />

      {debts.length > 0 && (
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalAmount}>${total.toLocaleString('en-US')}</Text>
        </View>
      )}

    </View>
  );
}