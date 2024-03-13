import {useQuery} from '@tanstack/react-query';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useTailwind} from 'tailwind-rn';
import {TMDB} from 'tmdb-ts';
import {DiscoverEndpoint} from 'tmdb-ts/dist/endpoints';

export type MovieKeys = Parameters<DiscoverEndpoint['movie']>[0];

export type MovieListProps = {} & MovieKeys;

const tmdb = new TMDB(
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMjA3MDU5ZDE4NGMzNDE4N2JiMGNkNDFiZGFlYWQ4NiIsInN1YiI6IjY1YTgzMmMxMGU1YWJhMDEyYzdkOWM4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vLk_0T3LjlZ71lu7f9TCdBM2X7vmSYI1MNm84TljmNk',
);

const getMovies = async (keys: MovieKeys) => {
  try {
    const genres = await tmdb.discover.movie(keys);
    return genres;
  } catch (err) {
    console.log(err);
  }
  return null;
};

export const MovieList = (keys: MovieListProps) => {
  const tw = useTailwind();
  const query = useQuery({
    queryKey: ['movies', keys],
    queryFn: () => getMovies(keys),
  });

  return (
    <ScrollView horizontal={true} contentContainerStyle={tw('gap-2')}>
      {query.data?.results?.map(movie => (
        <TouchableOpacity style={tw('relative')} key={movie.id}>
          <View style={tw('flex flex-col')}>
            <Image
              style={[tw('w-40 rounded-md'), {aspectRatio: 500 / 750}]}
              source={{
                uri: 'https://image.tmdb.org/t/p/w500/' + movie.poster_path,
              }}></Image>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
