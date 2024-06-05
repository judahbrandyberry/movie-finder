import {useNavigation} from '@react-navigation/native';
import {
  Animated,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useTailwind} from 'tailwind-rn';
import {Cast, Person} from 'tmdb-ts';

interface ActorProps {
  actor: Person | Cast;
}

export const ActorCard = ({actor}: ActorProps) => {
  const animated = new Animated.Value(1);

  const navigation = useNavigation();
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
  return (
    <Pressable
      onFocus={fadeIn}
      onBlur={fadeOut}
      key={actor.id}
      onPress={() => navigation.navigate('Actor', {id: actor.id})}>
      <Animated.View
        style={[
          tw('flex flex-col p-4 max-w-40 items-center'),
          {transform: [{scale: animated}]},
        ]}>
        <Image
          style={[tw('w-40 rounded-full'), {aspectRatio: 1}]}
          source={{
            uri: 'https://image.tmdb.org/t/p/w500/' + actor.profile_path,
          }}
        />
        <Text
          style={tw('text-center text-2xl font-bold mt-3 text-white')}
          numberOfLines={1}>
          {actor.name}
        </Text>

        {'character' in actor ? (
          <Text numberOfLines={1} style={tw('text-center text-2xl text-white')}>
            {`(${actor.character})`}
          </Text>
        ) : null}
      </Animated.View>
    </Pressable>
  );
};
