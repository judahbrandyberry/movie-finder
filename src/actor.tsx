import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackList} from '../App';
import {Image, Text, View} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {TMDB} from 'tmdb-ts';
import {useTailwind} from 'tailwind-rn';
import {MovieList} from './components/movie_list';

const tmdb = new TMDB(
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMjA3MDU5ZDE4NGMzNDE4N2JiMGNkNDFiZGFlYWQ4NiIsInN1YiI6IjY1YTgzMmMxMGU1YWJhMDEyYzdkOWM4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vLk_0T3LjlZ71lu7f9TCdBM2X7vmSYI1MNm84TljmNk',
);

const getActor = async (id: number) => {
  try {
    const genres = await tmdb.people.details(id);
    return genres;
  } catch (err) {
    console.log(err);
  }
  return null;
};

export const Actor = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackList, 'Actor'>) => {
  const {data: actor} = useQuery({
    queryKey: ['actor', route.params.id],
    queryFn: () => getActor(route.params.id),
  });
  const tw = useTailwind();

  return (
    <View style={tw('p-4')}>
      <View style={tw('flex-row gap-4 text-center')}>
        <Image
          style={[tw('w-40 rounded-full'), {aspectRatio: 1}]}
          source={{
            uri: 'https://image.tmdb.org/t/p/w500/' + actor?.profile_path,
          }}
        />
        <Text style={tw(' text-lg p-4 flex-1')}>
          {actor?.name} {actor?.biography}
        </Text>
      </View>
      <Text style={tw('text-center font-bold text-xl p-2')}>Movies</Text>
      {actor && <MovieList with_cast={actor.id.toString()} />}
    </View>
  );
};
