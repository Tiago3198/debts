import { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Alert } from 'react-native';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import styles from '../styles/HomeScreen.styles';
import { Feather } from '@expo/vector-icons';

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

  // Render the delete action when swiping left
  const renderRightActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0.5],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity style={styles.deleteAction} onPress={handleDelete}>
        <Animated.View style={{ transform: [{ scale }] }}>
          <Feather name="trash-2" size={22} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  // Render the edit action when swiping right
  const renderLeftActions = (progress, dragX) => {
    const scale = dragX.interpolate({
      inputRange: [0, 80],
      outputRange: [0.5, 1],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        style={styles.editAction}
        onPress={() => {
          swipeRef.current?.close();
          onEdit(item);
        }}
      >
        <Animated.View style={{ transform: [{ scale }] }}>
          <Feather name="edit-2" size={22} color="#fff" />
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <GestureHandlerRootView>
      <Swipeable
        ref={swipeRef}
        renderRightActions={renderRightActions}
        renderLeftActions={renderLeftActions}
        rightThreshold={40}
        leftThreshold={40}
        overshootRight={false}
        overshootLeft={false}
      >
        <TouchableOpacity style={styles.card} onPress={onPress}>
          <View style={styles.cardBody}>
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
      </Swipeable>
    </GestureHandlerRootView>
  );


}