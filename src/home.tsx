import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScrollView, Text, View} from 'react-native';
import {RootStackList} from '../App';
import {useTailwind} from 'tailwind-rn';
import {MovieList} from './components/movie_list';

export const Home = ({navigation}: NativeStackScreenProps<RootStackList>) => {
  const tw = useTailwind();
  return (
    <View style={tw('p-6 gap-12')}>
      <ScrollView
        contentContainerStyle={tw('gap-4')}
        style={tw('overflow-visible')}>
        <Text style={tw('text-center font-bold text-4xl text-white')}>
          Movies Of The Year
        </Text>
        <MovieList primary_release_year={2024} />
        <Text style={tw('text-center font-bold text-4xl  text-white')}>
          Ryan Reynolds
        </Text>
        <MovieList with_cast={'10859'} />
        <Text style={tw('text-center font-bold text-4xl  text-white')}>
          Recomended
        </Text>
        <MovieList sort_by="vote_count.desc" />
      </ScrollView>
    </View>
  );
};
