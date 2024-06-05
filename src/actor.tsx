import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackList} from '../App';
import {Image, Modal, Text, TouchableOpacity, View} from 'react-native';
import {useQuery} from '@tanstack/react-query';
import {TMDB} from 'tmdb-ts';
import {useTailwind} from 'tailwind-rn';
import {MovieList} from './components/movie_list';
import {useState} from 'react';

const tmdb = new TMDB(
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMjA3MDU5ZDE4NGMzNDE4N2JiMGNkNDFiZGFlYWQ4NiIsInN1YiI6IjY1YTgzMmMxMGU1YWJhMDEyYzdkOWM4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vLk_0T3LjlZ71lu7f9TCdBM2X7vmSYI1MNm84TljmNk',
);

const getActor = async (id: number) => {
  try {
    const genres = await tmdb.people.details(id);
    return genres;
  } catch (err) {
    console.log(err);
  }
  return null;
};

export const Actor = ({
  navigation,
  route,
}: NativeStackScreenProps<RootStackList, 'Actor'>) => {
  const {data: actor} = useQuery({
    queryKey: ['actor', route.params.id],
    queryFn: () => getActor(route.params.id),
  });
  const tw = useTailwind();
  const [visible, setVisible] = useState(false);

  return (
    <View style={tw('p-6 gap-12')}>
      <Text style={tw('font-bold text-4xl text-white')}>{actor?.name}</Text>
      <View style={tw('flex-row gap-4 text-center')}>
        <Image
          style={[tw('w-40 rounded-full'), {aspectRatio: 1}]}
          source={{
            uri: 'https://image.tmdb.org/t/p/w500/' + actor?.profile_path,
          }}
        />
        <TouchableOpacity
          onPress={() => setVisible(true)}
          style={tw(' flex-1 p-4  ')}>
          <Text style={tw(' text-3xl pb-4 text-white')} numberOfLines={3}>
            {actor?.biography}
          </Text>
          <Text style={tw('  font-bold text-2xl text-white')}>READ MORE</Text>
        </TouchableOpacity>
        <Modal
          transparent
          visible={visible}
          onRequestClose={() => setVisible(false)}
          animationType="fade">
          <View style={tw('bg-black/95 flex-1')}>
            <Text style={tw('text-white text-3xl p-24 flex-1')}>
              {actor?.biography}
            </Text>
          </View>
        </Modal>
      </View>
      <Text style={tw('text-center font-bold text-4xl p-2 text-white')}>
        Movies
      </Text>
      {actor && <MovieList with_cast={actor.id.toString()} />}
    </View>
  );
};
