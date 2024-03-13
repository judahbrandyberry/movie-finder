import {useTailwind} from 'tailwind-rn';
import {Tab} from './tab';
import {View} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useRoute} from '@react-navigation/native';
import {useQuery} from '@tanstack/react-query';
import {TMDB} from 'tmdb-ts';

interface MenuProps {
  typeof: string;
}

const tmdb = new TMDB(
  'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJkMjA3MDU5ZDE4NGMzNDE4N2JiMGNkNDFiZGFlYWQ4NiIsInN1YiI6IjY1YTgzMmMxMGU1YWJhMDEyYzdkOWM4MSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.vLk_0T3LjlZ71lu7f9TCdBM2X7vmSYI1MNm84TljmNk',
);

const getGenres = async () => {
  try {
    const genres = await tmdb.genres.movies();
    return genres;
  } catch (err) {
    console.log(err);
  }
  return null;
};

export const Menu = () => {
  const tw = useTailwind();
  const navigation = useNavigation();
  const route = useRoute();

  const query = useQuery({queryKey: ['genres'], queryFn: getGenres});

  return (
    <View style={tw('flex-row justify-between p-4 items-center')}>
      <Tab
        onPress={() => navigation.navigate('Home')}
        selectedName={route.name}
        name={'Home'}></Tab>
      <Tab
        onPress={() =>
          navigation.navigate('Genre', {id: query.data?.genres[0].id || 0})
        }
        selectedName={route.name}
        name={'Genre'}></Tab>
      <Tab
        onPress={() => navigation.navigate('Actors')}
        selectedName={route.name}
        name={'Actors'}></Tab>
      <Tab
        onPress={() => navigation.navigate('Search')}
        selectedName={route.name}
        name={'Search'}></Tab>
    </View>
  );
};
