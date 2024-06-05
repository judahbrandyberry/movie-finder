import {
  Pressable,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
  useColorScheme,
} from 'react-native';
import {useTailwind} from 'tailwind-rn';

interface Tab {
  name: string;
  selectedName: string;
  onPress: () => void;
  style?: ViewStyle;
}

export const Tab = ({name, selectedName, onPress, style}: Tab) => {
  const tw = useTailwind();
  const theme = useColorScheme();

  return (
    <Pressable style={style} onPress={onPress}>
      {({pressed, focused}) => (
        <View
          style={[
            tw(' py-4 px-6 rounded-lg'),
            selectedName === name ? tw('bg-[#03396D]') : null,
            focused && tw('bg-white'),
          ]}>
          <Text
            style={[
              tw('text-4xl font-semibold  text-white'),
              selectedName === name ? tw('text-white') : null,
              focused && tw('text-[#03396D]'),
            ]}>
            {name}
          </Text>
        </View>
      )}
    </Pressable>
  );
};
