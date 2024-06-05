import {useNavigation} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useTailwind} from 'tailwind-rn';
import {Movie, Recommendation, TMDB} from 'tmdb-ts';
import {DiscoverEndpoint} from 'tmdb-ts/dist/endpoints';
import {MovieCard} from './movie-card';

export type MovieKeys = Parameters<DiscoverEndpoint['movie']>[0];

export type MovieListProps = {movies?: Movie[] | Recommendation[]} & MovieKeys;

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

export const MovieList = ({movies, ...keys}: MovieListProps) => {
  const tw = useTailwind();
  const query = useQuery({
    queryKey: ['movies', keys],
    queryFn: () => getMovies(keys),
  });
  const navigation = useNavigation();

  return (
    <ScrollView
      horizontal={true}
      contentContainerStyle={tw('gap-4 px-6')}
      style={tw('mb-6 -mx-6')}>
      {(movies || query.data?.results)?.map(movie => (
        <MovieCard movie={movie} key={movie.id} />
      ))}
    </ScrollView>
  );
};
