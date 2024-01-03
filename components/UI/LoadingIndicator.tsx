import { MotiView } from 'moti';
import { StyleSheet, View } from 'react-native';
import { COLORS } from '../../constants/global-styles';

interface LoadingIndicatorProps {
  isLoading: boolean;
}

const LoadingIndicator = ({ isLoading }: LoadingIndicatorProps) => {
  return (
    <View>
      <MotiView
        style={styles.loading}
        from={{ rotate: '0deg' }}
        animate={{
          rotate: isLoading ? '361deg' : '0deg',
          opacity: isLoading ? 1 : 0,
        }}
        transition={{
          loop: true,
          type: 'timing',
          duration: 1000,
          repeatReverse: false,
        }}>
        <MotiView style={styles.loadingContainer}>
          <MotiView style={styles.spinner} />
        </MotiView>
      </MotiView>
      <MotiView
        style={[styles.loading, { position: 'absolute', top: 0, left: 0 }]}
        from={{ rotate: '0deg' }}
        animate={{
          rotate: isLoading ? '361deg' : '0deg',
          opacity: isLoading ? 1 : 0,
        }}
        transition={{
          loop: true,
          type: 'timing',
          duration: 1000,
          repeatReverse: false,
          delay: 400,
        }}>
        <MotiView style={styles.loadingContainerFull}>
          <MotiView style={styles.spinnerLight} />
        </MotiView>
      </MotiView>
      <MotiView
        style={[styles.loading, { position: 'absolute', top: 0, left: 0 }]}
        from={{ rotate: '180deg' }}
        animate={{
          rotate: isLoading ? '541deg' : '180deg',
          opacity: isLoading ? 1 : 0,
        }}
        transition={{
          loop: true,
          type: 'timing',
          duration: 2000,
          repeatReverse: false,
          delay: 400,
        }}>
        <MotiView style={styles.loadingContainer}>
          <MotiView style={styles.spinner} />
        </MotiView>
      </MotiView>
    </View>
  );
};
export default LoadingIndicator;
const styles = StyleSheet.create({
  loading: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderColor: 'white',
    borderWidth: 0,
  },
  loadingContainer: {
    width: 37.5,
    height: 37.5,
    overflow: 'hidden',
  },
  loadingContainerFull: {
    width: 40,
    height: 40,
    overflow: 'hidden',
  },
  spinner: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderColor: COLORS.primary[400],
    borderWidth: 3,
    shadowColor: COLORS.primary[400],
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
  spinnerLight: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderColor: COLORS.gray[600],
    borderWidth: 1,
    shadowColor: COLORS.gray[600],
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.8,
    shadowRadius: 1,
  },
});
