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
import {MovieWithMediaType, PersonWithMediaType, TMDB} from 'tmdb-ts';
import {useQuery} from '@tanstack/react-query';
import {Movie} from './movie';
import {useState} from 'react';

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
        contentContainerStyle={tw('gap-2 px-4')}
        style={tw('mt-4 -mx-4')}>
        {filturedResults.map(result =>
          result.media_type === 'person' ? (
            <TouchableOpacity
              key={result.id}
              onPress={() => navigation.navigate('Actor', {id: result.id})}>
              <View style={tw('flex flex-col gap-2 p-4 ')}>
                <Image
                  style={[tw('w-40 rounded-full'), {aspectRatio: 1}]}
                  source={{
                    uri:
                      'https://image.tmdb.org/t/p/w500/' + result.profile_path,
                  }}
                />
                <Text style={tw('text-center font-medium text-lg')}>
                  {result.name}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => navigation.navigate('Movie', {id: result.id})}
              style={tw('relative')}
              key={result.id}>
              <View style={tw('flex flex-col')}>
                <Image
                  style={[tw('w-40 rounded-md'), {aspectRatio: 500 / 750}]}
                  source={{
                    uri:
                      'https://image.tmdb.org/t/p/w500/' + result.poster_path,
                  }}></Image>
              </View>
            </TouchableOpacity>
          ),
        )}
      </ScrollView>
    </View>
  );
};
