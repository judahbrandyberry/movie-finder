import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackList} from '../App';
import {
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {ReleaseDateType, TMDB} from 'tmdb-ts';
import {useTailwind} from 'tailwind-rn';
import {ActorCard} from './components/actor-card';
import {getItunesMovies} from './api/itunes';
import Video, {VideoRef} from 'react-native-video';
import {useCallback, useRef, useState} from 'react';
import {MovieList} from './components/movie_list';
import {getStreamingOptions} from './api/motn';
import {SvgUri} from 'react-native-svg';
import {uniqBy} from 'lodash';
import * as CloudStore from 'react-native-cloud-store';
import {useFocusEffect} from '@react-navigation/native';

const tmdb = new TMDB(
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMjA3MDU5ZDE4NGMzNDE4N2JiMGNkNDFiZGFlYWQ4NiIsInN1YiI6IjY1YTgzMmMxMGU1YWJhMDEyYzdkOWM4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vLk_0T3LjlZ71lu7f9TCdBM2X7vmSYI1MNm84TljmNk',
);

const getMovie = async (id: number) => {
  try {
    const genres = await tmdb.movies.details(id, [
      'reviews',
      'recommendations',
      'external_ids',
      'release_dates',
    ]);
    return genres;
  } catch (err) {
    console.log(err);
  }
  return null;
};

const getActors = async (id: number) => {
  try {
    const genres = await tmdb.movies.credits(id);
    return genres;
  } catch (err) {
    console.log(err);
  }
  return null;
};

export const Movie = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackList, 'Movie'>) => {
  const video = useRef<VideoRef>(null);
  const [fullScreenKey, setFullScreenKey] = useState(Math.random().toString());
  const movieId = route.params.id;
  const {data: movie} = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => getMovie(movieId),
  });
  const releaseYear = movie?.release_date.split('', 4).join('');

  const releaseDates = movie?.release_dates.results.find(
    release_date => release_date.iso_3166_1 === 'US',
  )?.release_dates;

  const ageRating = releaseDates?.find(
    result =>
      result.type === ReleaseDateType.Theatrical ||
      result.type === ReleaseDateType.Digital,
  )?.certification;

  const {data: itunesMovie} = useQuery({
    queryKey: ['itunes-movie', movieId],
    queryFn: () => getItunesMovies(movie?.title, releaseYear),
    enabled: !!movie?.title && !!releaseYear,
  });

  const {data: streamingOptions} = useQuery({
    queryKey: ['movie-streaming', movieId],
    queryFn: () => getStreamingOptions(movie?.external_ids.imdb_id),
    enabled: !!movie?.external_ids.imdb_id,
  });

  const hasTrailer = !!itunesMovie?.previewUrl;

  const {data: actors} = useQuery({
    queryKey: ['movie-actors', route.params.id],
    queryFn: () => getActors(route.params.id),
  });
  const tw = useTailwind();

  const [watchList, setWatchList] = useState<number[]>([]);
  console.log(watchList);

  useFocusEffect(
    useCallback(() => {
      const getMovieList = async () => {
        await CloudStore.kvSync();
        const json = await CloudStore.kvGetItem('movie_list');
        let movieList: number[] = [];
        try {
          if (json) {
            movieList = JSON.parse(json);
          }
        } catch (err) {
          console.log(err);
        }
        if (movieList) {
          setWatchList(movieList);
        }
      };
      getMovieList();
    }, []),
  );
  if (!movie || !actors) {
    return null;
  }

  const filledStars = Math.round(movie.vote_average / 2);

  const unfilledStars = 5 - filledStars;

  const isInWatchList = watchList.includes?.(movie.id);

  return (
    <ScrollView>
      <View style={tw('p-6 flex-row items-center gap-12')}>
        <View>
          <Video
            key={fullScreenKey}
            paused
            ref={video}
            source={{uri: itunesMovie?.previewUrl}}
            onFullscreenPlayerDidPresent={() => video.current?.resume()}
            onFullscreenPlayerDidDismiss={() =>
              setFullScreenKey(Math.random().toString())
            }
          />

          <Image
            style={[tw(`w-[55rem] rounded-t-lg`), {aspectRatio: 500 / 281}]}
            resizeMode="cover"
            source={{
              uri: 'https://image.tmdb.org/t/p/original/' + movie.backdrop_path,
            }}
          />
          <View style={tw('flex-row')}>
            <Pressable
              style={({focused}) => [
                tw('bg-black p-6 rounded-b-lg flex-1'),
                hasTrailer && tw('rounded-r-none'),
                focused && tw('bg-[#03396D]'),
              ]}
              onPress={() =>
                (async () => {
                  const updatedWatchList = isInWatchList
                    ? watchList.filter(movieId => movie.id !== movieId)
                    : [movie.id, ...watchList];
                  if (updatedWatchList) {
                    setWatchList(updatedWatchList);
                  }
                  await CloudStore.kvSetItem(
                    'movie_list',
                    JSON.stringify(updatedWatchList),
                  );
                })().catch(e => console.log(e.stac))
              }>
              <Text style={tw('font-bold text-2xl text-center text-white')}>
                {(isInWatchList && 'In ') || 'Add To '}Watch List
              </Text>
            </Pressable>

            {hasTrailer && (
              <Pressable
                style={({focused}) => [
                  tw('bg-black p-6 rounded-b-lg flex-1'),
                  hasTrailer && tw('rounded-l-none'),
                  focused && tw('bg-[#03396D]'),
                ]}
                onPress={() => {
                  video.current?.presentFullscreenPlayer();
                }}>
                <Text style={tw('font-bold text-2xl text-center text-white')}>
                  Play Trailer
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        <View style={tw('flex-1 gap-4')}>
          <Text
            style={[tw('text-center font-bold text-white'), {fontSize: 80}]}>
            {movie.title}
          </Text>
          <View style={tw('flex-row gap-2 justify-center')}>
            {movie.genres.map(genre => (
              <View
                style={tw('bg-white px-2 py-1 rounded-md mb-4 ')}
                key={genre.id}>
                <Text
                  style={tw('text-blue-950 text-xl uppercase font-semibold ')}>
                  {genre.name}
                </Text>
              </View>
            ))}
          </View>

          <Text
            style={tw('text-center font-bold text-xl flex-row  text-white')}>
            {releaseYear} •{' '}
            {[...Array(filledStars)].map((_, i) => (
              <Text key={i}>★</Text>
            ))}
            {[...Array(unfilledStars)].map((_, i) => (
              <Text key={i}>☆</Text>
            ))}{' '}
            {movie.vote_count} • {movie.runtime} minutes • $
            {movie.revenue.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}{' '}
            • {ageRating}
          </Text>

          <Text style={tw('font-medium text-3xl text-white')}>
            {movie.overview}
          </Text>

          <ScrollView
            horizontal
            contentContainerStyle={tw('gap-4 px-6')}
            style={tw('mt-4 flex-none -mx-6')}>
            {actors.cast
              .filter(actor => actor.profile_path)
              .map((actor, index) => (
                <ActorCard actor={actor} key={actor.id} />
              ))}
          </ScrollView>

          <ScrollView
            horizontal
            contentContainerStyle={tw('gap-6 items-center')}>
            {uniqBy(
              streamingOptions,
              option => `${option.service.id}-${option.type}`,
            )?.map(option => (
              <TouchableOpacity
                key={`${option.service.id}-${option.type}`}
                style={tw('bg-white rounded-lg p-4 items-center min-w-48')}
                onPress={() => Linking.openURL(option.link)}>
                <SvgUri
                  width={120}
                  height={80}
                  uri={option.service.imageSet.lightThemeImage}
                />
                <Text style={tw('text-xl text-center font-medium capitalize')}>
                  {option.type}
                  {option.price ? (
                    <Text
                      style={tw('text-xl text-center font-medium normal-case')}>
                      s - {option.price?.formatted}
                    </Text>
                  ) : null}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
      {movie.recommendations.results.length > 0 && (
        <View style={tw('p-6 gap-4')}>
          <Text style={tw('font-bold text-4xl text-white ')}>Related</Text>
          <MovieList movies={movie.recommendations.results} />
        </View>
      )}
    </ScrollView>
  );
};
