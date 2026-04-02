import { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Alert } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import styles from '../styles/HomeScreen.styles';

export default function SwipeableDebtCard({ item, onPress, onDelete, onEdit }) {
  const swipeRef = useRef(null);

  const handleDelete = () => {
    Alert.alert(
      'Delete debt',
      `Are you sure you want to delete ${item.person}'s debt?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => swipeRef.current?.close(),
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(item.id),
        },
      ]
    );
  };

  const renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0.5],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity style={styles.deleteAction} onPress={handleDelete}>
        <Animated.Text style={[styles.deleteActionText, { transform: [{ scale }] }]}>
          🗑️
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        ref={swipeRef}
        renderRightActions={renderRightActions}
        rightThreshold={40}
        overshootRight={false}
      >
        <TouchableOpacity style={styles.card} onPress={onPress}>
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
            <TouchableOpacity onPress={() => onEdit(item)} style={styles.editIcon}>
              <Text style={styles.editIconText}>✏️</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Swipeable>
    </GestureHandlerRootView>
  );
}