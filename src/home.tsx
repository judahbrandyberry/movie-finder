import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {ScrollView, Text, View} from 'react-native';
import {RootStackList} from '../App';
import {useTailwind} from 'tailwind-rn';
import {MovieList} from './components/movie_list';
import * as CloudStore from 'react-native-cloud-store';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useState} from 'react';
import {Movie, MovieDetails, TMDB} from 'tmdb-ts';

const tmdb = new TMDB(
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMjA3MDU5ZDE4NGMzNDE4N2JiMGNkNDFiZGFlYWQ4NiIsInN1YiI6IjY1YTgzMmMxMGU1YWJhMDEyYzdkOWM4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vLk_0T3LjlZ71lu7f9TCdBM2X7vmSYI1MNm84TljmNk',
);

export const Home = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackList>) => {
  const [watchList, setWatchList] = useState<MovieDetails[]>([]);
  const tw = useTailwind();
  useFocusEffect(
    useCallback(() => {
      const getMovieList = async () => {
        await CloudStore.kvSync();
        const val = await CloudStore.kvGetItem('movie_list');
        if (val) {
          const movieIds: number[] = JSON.parse(val);
          const movies = await Promise.all(
            movieIds.map(movieId => {
              return tmdb.movies.details(movieId);
            }),
          );

          setWatchList(movies);
        }
      };
      getMovieList();
    }, []),
  );
  return (
    <View style={tw('p-6 gap-12')}>
      <ScrollView
        contentContainerStyle={tw('gap-4')}
        style={tw('overflow-visible')}>
        {watchList.length > 0 ? (
          <>
            <Text style={tw('text-center font-bold text-4xl text-white')}>
              Watch List
            </Text>
            <MovieList movies={watchList} />
          </>
        ) : null}

        <Text style={tw('text-center font-bold text-4xl text-white')}>
          Movies of the Year
        </Text>
        <MovieList primary_release_year={2024} />

        <Text style={tw('text-center font-bold text-4xl  text-white')}>
          Ryan Reynolds
        </Text>
        <MovieList with_cast={'10859'} />

        <Text style={tw('text-center font-bold text-4xl  text-white')}>
          All Time Best
        </Text>
        <MovieList sort_by="vote_count.desc" />
      </ScrollView>
    </View>
  );
};
