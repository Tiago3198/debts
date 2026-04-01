import { StyleSheet } from 'react-native';

export default StyleSheet.create({
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