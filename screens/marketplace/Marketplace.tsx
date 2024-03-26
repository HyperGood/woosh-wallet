import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Platform, ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Button from '../../components/UI/Button';

const images = [
  require('../../assets/images/marketplace/01.jpg'),
  require('../../assets/images/marketplace/02.jpg'),
  require('../../assets/images/marketplace/03.jpg'),
];

export const LINEAR_GRADIENT_COLORS = [
  'rgba(255,255,255,0)',
  'rgba(0,0,0,0.1)',
  'rgba(0,0,0,0.5)',
  'rgba(0,0,0,0.8)',
];

export const Marketplace = () => {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  return (
    <>
      <View
        style={{
          position: 'absolute',
          width,
          height,
          top: 0,
          zIndex: 1,
        }}>
        <LinearGradient
          colors={['rgba( 102, 102, 102, 0)', 'black']}
          style={styles.gradientOverlay}
        />
        <View style={{ paddingTop: insets.top, paddingHorizontal: 16 }}>
          <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
            {/* <LinearGradient
                colors={LINEAR_GRADIENT_COLORS}
                style={{
                  position: 'absolute',
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              /> */}
            <View
              style={{
                borderRadius: 30,
                borderCurve: 'continuous',
                overflow: 'hidden',
                borderWidth: 1,
                borderColor: 'rgb(216, 216, 216)',
              }}>
              <BlurView
                intensity={Platform.OS === 'android' ? 20 : 40}
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  flex: 1,
                  flexDirection: 'row',
                  paddingHorizontal: 15,
                }}>
                <Text>u</Text>
              </BlurView>
            </View>
          </View>
        </View>
      </View>
      <ScrollView
        pagingEnabled
        decelerationRate="fast"
        style={{ backgroundColor: 'black', width, height, position: 'relative' }}>
        {images.map((item, i) => {
          return (
            <View
              key={i}
              style={{
                backgroundColor: `rgba(0, 0, 255, 0.${i + 2})`,
                height,
                width,
              }}>
              <Image
                contentFit="cover"
                source={item}
                style={{
                  width,
                  height,
                }}
              />
            </View>
          );
        })}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  gradientOverlay: {
    position: 'absolute',
    height: '40%',
    width: '100%',
    bottom: 0,
    borderTopRightRadius: 8,
    borderTopLeftRadius: 8,
    pointerEvents: 'none',
  },
});
