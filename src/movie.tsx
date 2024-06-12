import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackList} from '../App';
import {
  Button,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {TMDB} from 'tmdb-ts';
import {useTailwind} from 'tailwind-rn';
import {MovieCard} from './components/movie-card';
import {ActorCard} from './components/actor-card';
import {getItunesMovies} from './api/itunes';
import Video, {VideoRef} from 'react-native-video';
import {useEffect, useRef, useState} from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import {MovieList} from './components/movie_list';

const tmdb = new TMDB(
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMjA3MDU5ZDE4NGMzNDE4N2JiMGNkNDFiZGFlYWQ4NiIsInN1YiI6IjY1YTgzMmMxMGU1YWJhMDEyYzdkOWM4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vLk_0T3LjlZ71lu7f9TCdBM2X7vmSYI1MNm84TljmNk',
);

const getMovie = async (id: number) => {
  try {
    const genres = await tmdb.movies.details(id, [
      'reviews',
      'recommendations',
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
  const {data: movie} = useQuery({
    queryKey: ['movie', route.params.id],
    queryFn: () => getMovie(route.params.id),
  });

  const {data: itunesMovie} = useQuery({
    queryKey: ['itunes-movie', movie?.title],
    queryFn: () => getItunesMovies(movie?.title),
    enabled: !!movie?.title,
  });

  const {data: actors} = useQuery({
    queryKey: ['movie-actors', route.params.id],
    queryFn: () => getActors(route.params.id),
  });
  const tw = useTailwind();

  if (!movie || !actors) {
    return null;
  }

  const filledStars = Math.round(movie.vote_average / 2);

  const unfilledStars = 5 - filledStars;

  return (
    <ScrollView>
      <View style={tw('p-6 flex-row items-center gap-12')}>
        <View>
          <Image
            style={[tw('w-[55rem] rounded-t-lg'), {aspectRatio: 500 / 281}]}
            source={{
              uri: 'https://image.tmdb.org/t/p/original/' + movie.backdrop_path,
            }}
          />
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
          <Pressable
            style={({focused}) => [
              tw('bg-black p-6 rounded-b-lg'),
              focused && tw('bg-[#03396D]'),
            ]}
            onPress={() => {
              video.current?.presentFullscreenPlayer();
            }}>
            <Text style={tw('font-bold text-2xl text-center text-white')}>
              Play Trailer
            </Text>
          </Pressable>
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
            {movie.release_date.split('', 4)} •{' '}
            {[...Array(filledStars)].map((_, i) => (
              <Text key={i}>★</Text>
            ))}
            {[...Array(unfilledStars)].map((_, i) => (
              <Text key={i}>☆</Text>
            ))}{' '}
            {movie.vote_count} • {movie.runtime} minutes • $
            {movie.revenue.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')}
          </Text>

          <Text style={tw('font-medium text-3xl text-white')}>
            {movie.overview}
          </Text>

          <ScrollView
            horizontal
            contentContainerStyle={tw('gap-4')}
            style={tw('mt-4 flex-none ')}>
            {actors.cast
              .filter(actor => actor.profile_path)
              .map(actor => (
                <ActorCard actor={actor} key={actor.id} />
              ))}
          </ScrollView>

          <View style={tw('flex-row gap-6 items-center')}>
            <TouchableOpacity
              style={tw('bg-white rounded-lg')}
              onPress={() =>
                Linking.openURL(
                  `https://tv.apple.com/us/movie/${itunesMovie?.trackId}`,
                )
              }>
              <Image
                style={{height: 100, width: 150}}
                source={require('../assets/apple-tv.png')}></Image>
            </TouchableOpacity>

            <Text style={tw('text-3xl text-center text-white')}>
              <Text style={tw('font-bold')}>Rental</Text>
              {'\n'}${itunesMovie?.trackRentalPrice}
            </Text>
            <Text style={tw('text-3xl text-center text-white')}>
              <Text style={tw('font-bold')}>Purchase</Text>
              {'\n'}${itunesMovie?.trackPrice}
            </Text>
          </View>
        </View>
      </View>
      <View style={tw('p-6 gap-4')}>
        <Text style={tw('font-bold text-4xl text-white ')}>Related</Text>
        <MovieList movies={movie.recommendations.results} />
      </View>
    </ScrollView>
  );
};
