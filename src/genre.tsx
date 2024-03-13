import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  Button,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {TMDB} from 'tmdb-ts';
import {RootStackList} from '../App';
import {useTailwind} from 'tailwind-rn';
import {MovieList} from './components/movie_list';

export const Genre = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackList, 'Genre'>) => {
  const tw = useTailwind();

  return (
    <View>
      <Text style={tw('text-blue-600')}>Genres</Text>
      <MovieList with_genres={route.params.id.toString()} />
    </View>
  );
};
``;
