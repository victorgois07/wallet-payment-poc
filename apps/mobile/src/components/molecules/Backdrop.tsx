import { ActivityIndicator, Modal, StyleSheet, View } from 'react-native';
import { useBackdropStore } from '../../stores/backdrop.store';

const BACKDROP_OPACITY = 0.5;
const BACKDROP_BG = '#000000';

export function Backdrop() {
  const isOpen = useBackdropStore((state) => state.isOpen);

  if (!isOpen) return null;

  return (
    <Modal
      visible={isOpen}
      transparent
      statusBarTranslucent
      animationType="fade"
      accessibilityRole="progressbar"
      accessibilityLabel="Carregando"
    >
      <View style={styles.container}>
        <View style={[styles.dim, { backgroundColor: BACKDROP_BG, opacity: BACKDROP_OPACITY }]} />
        <View style={styles.content}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dim: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
