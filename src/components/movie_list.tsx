import {useQuery, useQueryClient} from '@tanstack/react-query';
import {FlatList} from 'react-native';
import {useTailwind} from 'tailwind-rn';
import {Movie, MovieDiscoverResult, Recommendation, TMDB} from 'tmdb-ts';
import {DiscoverEndpoint} from 'tmdb-ts/dist/endpoints';
import {MovieCard} from './movie-card';
import {uniqBy} from 'lodash';

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

  const queryClient = useQueryClient();

  return (
    <FlatList
      horizontal={true}
      contentContainerStyle={tw('gap-4 p-6')}
      onEndReached={async () => {
        if (
          !movies &&
          query.data &&
          query.data.total_pages > query.data.page &&
          query.data.page <= 5
        ) {
          const newMovies = await getMovies({
            ...keys,
            page: query.data.page + 1,
          });
          queryClient.setQueryData<MovieDiscoverResult | null>(
            ['movies', keys],
            newMovies
              ? {
                  ...newMovies,
                  results: uniqBy(
                    [...query.data.results, ...newMovies.results],
                    'id',
                  ),
                }
              : query.data,
          );
        }
      }}
      data={movies || query.data?.results}
      style={tw('-m-6 mb-0')}
      renderItem={({item: movie}) => <MovieCard movie={movie} key={movie.id} />}
    />
  );
};
