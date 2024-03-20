import {Text, TouchableOpacity, useColorScheme} from 'react-native';
import {useTailwind} from 'tailwind-rn';

interface Tab {
  name: string;
  selectedName: string;
  onPress: () => void;
}

export const Tab = ({name, selectedName, onPress}: Tab) => {
  const tw = useTailwind();
  const theme = useColorScheme();

  return (
    <TouchableOpacity
      style={
        selectedName === name ? tw('bg-[#03396D] p-2 rounded-md') : tw('p-2')
      }
      onPress={onPress}>
      <Text
        style={[
          tw('font-medium uppercase'),
          selectedName === name ? tw('text-white') : null,
        ]}>
        {name}
      </Text>
    </TouchableOpacity>
  );
};
