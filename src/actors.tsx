import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackList} from '../App';
import {useTailwind} from 'tailwind-rn';
import {
  Image,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {TMDB} from 'tmdb-ts';
import {useQuery} from '@tanstack/react-query';
import {Movie} from './movie';
import {useState} from 'react';
import {ActorCard} from './components/actor-card';

const tmdb = new TMDB(
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMjA3MDU5ZDE4NGMzNDE4N2JiMGNkNDFiZGFlYWQ4NiIsInN1YiI6IjY1YTgzMmMxMGU1YWJhMDEyYzdkOWM4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vLk_0T3LjlZ71lu7f9TCdBM2X7vmSYI1MNm84TljmNk',
);

const getActors = async () => {
  try {
    const genres = await tmdb.people.popular();
    return genres;
  } catch (err) {}
  return null;
};

const getSearch = async (query: string) => {
  try {
    const search = await tmdb.search.people({query});
    return search;
  } catch (err) {}
  return null;
};

export const Actors = ({
  navigation,
}: NativeStackScreenProps<RootStackList, 'Actors'>) => {
  const [searchQuery, setSearchQuery] = useState('');
  const {data: actors} = useQuery({
    queryKey: ['movie-actors'],
    queryFn: () => getActors(),
  });

  const {data: search} = useQuery({
    queryKey: ['search-actors', searchQuery],
    queryFn: () => getSearch(searchQuery),
  });

  const results = (searchQuery ? search?.results : actors?.results) ?? [];
  const filturedResults = results.filter(actor => actor.profile_path);

  const tw = useTailwind();

  if (!actors) {
    return null;
  }

  return (
    <View style={tw('p-6')}>
      <TextInput
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={[tw('h-20 m-4 rounded-lg text-white'), {fontSize: 24}]}
        placeholder="Search"
        placeholderTextColor="white"
      />

      <ScrollView
        horizontal
        contentContainerStyle={tw('gap-4 px-6')}
        style={tw('mt-4 -mx-6')}>
        {filturedResults.map(actor => (
          <ActorCard actor={actor} key={actor.id} />
        ))}
      </ScrollView>
    </View>
  );
};
