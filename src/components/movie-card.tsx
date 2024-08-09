import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Animated, Image, Pressable, Text, View} from 'react-native';
import {useTailwind} from 'tailwind-rn';
import {Movie, MovieDetails, Recommendation} from 'tmdb-ts';
import {RootStackList} from '../../App';

interface MovieProps {
  movie: Movie | Recommendation | MovieDetails;
}

export const MovieCard = ({movie}: MovieProps) => {
  const animated = new Animated.Value(1);
  const tw = useTailwind();
  const fadeIn = () => {
    Animated.timing(animated, {
      toValue: 1.1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };
  const fadeOut = () => {
    Animated.timing(animated, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const navigation = useNavigation<NativeStackNavigationProp<RootStackList>>();
  return (
    <Pressable
      onFocus={fadeIn}
      onBlur={fadeOut}
      onPress={() => navigation.push('Movie', {id: movie.id})}
      style={tw('relative')}
      key={movie.id}>
      <Animated.View
        style={[tw('flex flex-col'), {transform: [{scale: animated}]}]}>
        {movie.poster_path ? (
          <Image
            style={[tw('w-56 rounded-lg'), {aspectRatio: 500 / 750}]}
            source={{
              uri: 'https://image.tmdb.org/t/p/w500/' + movie.poster_path,
            }}></Image>
        ) : (
          <View
            style={[
              tw('w-56 rounded-md bg-white items-center justify-center p-4'),
              {aspectRatio: 500 / 750},
            ]}>
            <Text style={tw('text-center text-lg')}>{movie.title}</Text>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
};
