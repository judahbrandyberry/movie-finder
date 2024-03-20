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
    <View style={tw('flex-row p-4 gap-4')}>
      <View>
        {query.data?.genres?.map(genre => (
          <Tab
            key={genre.id}
            selectedName={activeGenre?.name ?? ''}
            onPress={() => navigation.navigate('Genre', {id: genre.id})}
            name={genre.name}
          />
        ))}
      </View>

      <View style={tw('gap-4')}>
        <Text style={tw('text-center font-bold text-xl')}>
          {activeGenre?.name} Of The Year
        </Text>
        <MovieList
          primary_release_year={2024}
          with_genres={route.params.id.toString()}
        />

        <Text style={tw('text-center font-bold text-xl')}>
          All Time Best {activeGenre?.name}
        </Text>
        <MovieList
          with_genres={route.params.id.toString()}
          sort_by="vote_count.desc"
        />
      </View>
    </View>
  );
};
