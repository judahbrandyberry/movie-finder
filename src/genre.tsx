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
import {Tab} from './components/tab';
import {useQuery} from '@tanstack/react-query';
import {getGenres} from './components/menu';

export const Genre = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackList, 'Genre'>) => {
  const tw = useTailwind();

  const query = useQuery({queryKey: ['genres'], queryFn: getGenres});
  const activeGenre = query.data?.genres.find(
    genre => genre.id === route.params.id,
  );
  return (
    <View style={tw('flex-row p-6 gap-12')}>
      <View>
        <ScrollView>
          {query.data?.genres?.map(genre => (
            <Tab
              key={genre.id}
              selectedName={activeGenre?.name ?? ''}
              onPress={() => navigation.navigate('Genre', {id: genre.id})}
              name={genre.name}
            />
          ))}
        </ScrollView>
      </View>

      <View style={tw('flex-1')}>
        <ScrollView
          contentContainerStyle={tw('gap-4')}
          style={tw('overflow-visible')}>
          <Text style={tw('text-center font-bold text-4xl text-white')}>
            {activeGenre?.name} of the Year
          </Text>
          <MovieList
            primary_release_year={2024}
            with_genres={route.params.id.toString()}
          />

          <Text style={tw('text-center font-bold text-4xl text-white')}>
            All Time Best {activeGenre?.name}
          </Text>
          <MovieList
            with_genres={route.params.id.toString()}
            sort_by="vote_count.desc"
          />
        </ScrollView>
      </View>
    </View>
  );
};
