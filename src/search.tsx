import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackList} from '../App';
import {useTailwind} from 'tailwind-rn';
import {ScrollView, TextInput, View} from 'react-native';
import {MovieWithMediaType, PersonWithMediaType, TMDB} from 'tmdb-ts';
import {useQuery} from '@tanstack/react-query';
import {useState} from 'react';
import {MovieCard} from './components/movie-card';
import {ActorCard} from './components/actor-card';

const tmdb = new TMDB(
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMjA3MDU5ZDE4NGMzNDE4N2JiMGNkNDFiZGFlYWQ4NiIsInN1YiI6IjY1YTgzMmMxMGU1YWJhMDEyYzdkOWM4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vLk_0T3LjlZ71lu7f9TCdBM2X7vmSYI1MNm84TljmNk',
);

const getSearch = async (query: string) => {
  try {
    const search = await tmdb.search.multi({query});
    return search;
  } catch (err) {}
  return null;
};

export const Search = ({
  navigation,
}: NativeStackScreenProps<RootStackList, 'Search'>) => {
  const [searchQuery, setSearchQuery] = useState('');

  const {data: search} = useQuery({
    queryKey: ['search', searchQuery],
    queryFn: () => getSearch(searchQuery),
  });

  const results = search?.results ?? [];
  const filturedResults = results.filter(
    result =>
      (result.media_type === 'person' && result.profile_path) ||
      result.media_type === 'movie',
  ) as MovieWithMediaType[] | PersonWithMediaType[];

  const tw = useTailwind();

  if (!results) {
    return null;
  }

  return (
    <View style={tw('p-6 gap-12')}>
      <TextInput
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={[tw('h-20 m-4 rounded-lg text-white'), {fontSize: 24}]}
        placeholder="Search"
        placeholderTextColor="white"
      />
      <ScrollView
        horizontal
        contentContainerStyle={tw('gap-4 px-4')}
        style={tw('mt-4 -mx-4')}>
        {filturedResults.map(result =>
          result.media_type === 'person' ? (
            <ActorCard actor={result} key={result.id} />
          ) : (
            <MovieCard movie={result} key={result.id} />
          ),
        )}
      </ScrollView>
    </View>
  );
};
