import { StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';

export default function DetailScreen({ route }) {
  const { debt } = route.params;

  const sendWhatsApp = () => {
    const message = `Hey ${debt.person}, just leaving this here so we don't forget 👍 You owe me $${debt.amount.toLocaleString('en-US')}${debt.note ? ` (${debt.note})` : ''}`;
    const url = `whatsapp://send?text=${encodeURIComponent(message)}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.person}>{debt.person}</Text>
      <Text style={styles.amount}>${debt.amount.toLocaleString('en-US')}</Text>
      {debt.note ? <Text style={styles.note}>{debt.note}</Text> : null}
      <Text style={styles.date}>{debt.date}</Text>

      <TouchableOpacity style={styles.whatsappButton} onPress={sendWhatsApp}>
        <Text style={styles.buttonText}>🔔 Remind via WhatsApp</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.paidButton}>
        <Text style={styles.buttonText}>✅ Mark as paid</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  person: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  amount: {
    fontSize: 48,
    fontWeight: '800',
    color: '#111',
    marginBottom: 8,
  },
  note: {
    fontSize: 18,
    color: '#666',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#999',
    marginBottom: 48,
  },
  whatsappButton: {
    width: '100%',
    backgroundColor: '#25D366',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  paidButton: {
    width: '100%',
    backgroundColor: '#111',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});