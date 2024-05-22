import {useNavigation} from '@react-navigation/native';
import {Animated, Image, Pressable, TouchableOpacity, View} from 'react-native';
import {useTailwind} from 'tailwind-rn';
import {Movie} from 'tmdb-ts';

interface MovieProps {
  movie: Movie;
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

  const navigation = useNavigation();
  return (
    <Pressable
      onFocus={fadeIn}
      onBlur={fadeOut}
      onPress={() => navigation.navigate('Movie', {id: movie.id})}
      style={tw('relative')}
      key={movie.id}>
      <Animated.View
        style={[tw('flex flex-col'), {transform: [{scale: animated}]}]}>
        <Image
          style={[tw('w-40 rounded-md'), {aspectRatio: 500 / 750}]}
          source={{
            uri: 'https://image.tmdb.org/t/p/w500/' + movie.poster_path,
          }}></Image>
      </Animated.View>
    </Pressable>
  );
};
