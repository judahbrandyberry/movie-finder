import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackList} from '../App';
import {useTailwind} from 'tailwind-rn';
import {Text, View} from 'react-native';
import {Tab} from './components/tab';
import {Menu} from './components/menu';

export const Search = ({navigation}: NativeStackScreenProps<RootStackList>) => {
  const tw = useTailwind();
  return <Text>Search </Text>;
};
