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
    <View style={tw('p-4')}>
      <TextInput
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={tw('h-14 m-4')}
        placeholder="Search"
        placeholderTextColor="black"
      />

      <ScrollView
        horizontal
        contentContainerStyle={tw('gap-2')}
        style={tw('mt-4 -mx-4')}>
        {filturedResults.map(actor => (
          <TouchableOpacity
            key={actor.id}
            onPress={() => navigation.navigate('Actor', {id: actor.id})}>
            <View style={tw('flex flex-col gap-2 p-4 ')}>
              <Image
                style={[tw('w-40 rounded-full'), {aspectRatio: 1}]}
                source={{
                  uri: 'https://image.tmdb.org/t/p/w500/' + actor.profile_path,
                }}
              />
              <Text style={tw('text-center font-medium text-lg')}>
                {actor.name}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
