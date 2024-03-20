import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Text, View} from 'react-native';
import {RootStackList} from '../App';
import {useTailwind} from 'tailwind-rn';
import {MovieList} from './components/movie_list';

export const Home = ({navigation}: NativeStackScreenProps<RootStackList>) => {
  const tw = useTailwind();
  return (
    <View style={tw('p-4 gap-4')}>
      <Text style={tw('text-center font-bold text-xl')}>
        Movies Of The Year
      </Text>
      <MovieList primary_release_year={2024} />
      <Text style={tw('text-center font-bold text-xl')}>Ryan Reynolds</Text>
      <MovieList with_cast={'10859'} />
      <Text style={tw('text-center font-bold text-xl')}> Recomended</Text>
      <MovieList sort_by="vote_count.desc" />
    </View>
  );
};
