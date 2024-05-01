import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackList} from '../App';
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {TMDB} from 'tmdb-ts';
import {useTailwind} from 'tailwind-rn';

const tmdb = new TMDB(
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMjA3MDU5ZDE4NGMzNDE4N2JiMGNkNDFiZGFlYWQ4NiIsInN1YiI6IjY1YTgzMmMxMGU1YWJhMDEyYzdkOWM4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vLk_0T3LjlZ71lu7f9TCdBM2X7vmSYI1MNm84TljmNk',
);

const getMovie = async (id: number) => {
  try {
    const genres = await tmdb.movies.details(id);
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
  const {data: movie} = useQuery({
    queryKey: ['movie', route.params.id],
    queryFn: () => getMovie(route.params.id),
  });

  const {data: actors} = useQuery({
    queryKey: ['movie-actors', route.params.id],
    queryFn: () => getActors(route.params.id),
  });
  const tw = useTailwind();

  if (!movie || !actors) {
    return null;
  }

  return (
    <View style={tw('p-4')}>
      <View style={tw('flex-row gap-4')}>
        <Image
          style={[tw('w-[60rem] rounded-lg'), {aspectRatio: 500 / 281}]}
          source={{
            uri: 'https://image.tmdb.org/t/p/original/' + movie.backdrop_path,
          }}></Image>
        <View style={tw('flex-1 gap-4')}>
          <Text style={tw('text-center font-bold text-2xl')}>
            {movie.title}
          </Text>
          <Text style={tw('font-medium text-lg')}>{movie.overview}</Text>

          <ScrollView
            horizontal
            contentContainerStyle={tw('gap-4')}
            style={tw('mt-4')}>
            {actors.cast
              .filter(actor => actor.profile_path)
              .map(actor => (
                <TouchableOpacity
                  key={actor.id}
                  onPress={() => navigation.navigate('Actor', {id: actor.id})}>
                  <View style={tw('flex flex-col gap-2 items-center')}>
                    <Image
                      style={[tw('w-40 rounded-full'), {aspectRatio: 1}]}
                      source={{
                        uri:
                          'https://image.tmdb.org/t/p/w500/' +
                          actor.profile_path,
                      }}
                    />
                    <Text style={tw('text-center font-medium text-lg')}>
                      {actor.name}
                    </Text>

                    <Text style={tw('text-center font-medium text-lg')}>
                      {`(${actor.character})`}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};
