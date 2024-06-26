import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

export default function HomeIcon({ color, fill }: { color?: string; fill?: string }) {
  return (
    <View>
      <Svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <Path
          d="M21 19V12.267C21 11.7244 20.8896 11.1876 20.6756 10.689C20.4616 10.1905 20.1483 9.74068 19.755 9.367L13.378 3.31C13.0063 2.95688 12.5132 2.75999 12.0005 2.75999C11.4878 2.75999 10.9947 2.95688 10.623 3.31L4.245 9.367C3.85165 9.74068 3.53844 10.1905 3.3244 10.689C3.11037 11.1876 3 11.7244 3 12.267V19C3 19.5304 3.21071 20.0391 3.58579 20.4142C3.96086 20.7893 4.46957 21 5 21H19C19.5304 21 20.0391 20.7893 20.4142 20.4142C20.7893 20.0391 21 19.5304 21 19Z"
          fill={fill ? fill : color ? color : '#17CE4A'}
          stroke={color ? color : '#17CE4A'}
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </Svg>
    </View>
  );
}
