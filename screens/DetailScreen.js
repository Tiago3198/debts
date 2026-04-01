import { StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';
import styles from './styles/DetailScreen.styles';

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