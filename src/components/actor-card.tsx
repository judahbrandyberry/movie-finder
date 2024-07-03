import {useNavigation} from '@react-navigation/native';
import {
  Animated,
  Image,
  Pressable,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import {useTailwind} from 'tailwind-rn';
import {Cast, Person} from 'tmdb-ts';

interface ActorProps extends TouchableOpacityProps {
  actor: Person | Cast;
}

export const ActorCard = ({actor, ...props}: ActorProps) => {
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
      {...props}
      onFocus={fadeIn}
      onBlur={fadeOut}
      key={actor.id}
      onPress={() => navigation.navigate('Actor', {id: actor.id})}>
      <Animated.View
        style={[
          tw('flex flex-col p-4 max-w-48 items-center'),
          {transform: [{scale: animated}]},
        ]}>
        <Image
          style={[tw('w-48 rounded-full'), {aspectRatio: 1}]}
          source={{
            uri: 'https://image.tmdb.org/t/p/w500/' + actor.profile_path,
          }}
        />
        <View style={tw('w-full')}>
          <Text
            style={tw('text-center text-xl font-bold mt-3 text-white')}
            numberOfLines={1}>
            {actor.name}
          </Text>

          {'character' in actor ? (
            <Text
              numberOfLines={1}
              style={tw('text-center text-xl text-white')}>
              {`(${actor.character})`}
            </Text>
          ) : null}
        </View>
      </Animated.View>
    </Pressable>
  );
};
