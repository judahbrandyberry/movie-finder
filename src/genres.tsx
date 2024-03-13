import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useQuery} from '@tanstack/react-query';
import {Button, Text, View} from 'react-native';
import {TMDB} from 'tmdb-ts';
import {RootStackList} from '../App';
import {useTailwind} from 'tailwind-rn';
import {Tab} from './components/tab';
import {Menu} from './components/menu';

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

export const Genres = ({navigation}: NativeStackScreenProps<RootStackList>) => {
  const query = useQuery({queryKey: ['genres'], queryFn: getGenres});
  const tw = useTailwind();

  return (
    <View>
      {query.data?.genres?.map(genre => (
        <Button
          key={genre.id}
          title={genre.name}
          onPress={() => navigation.navigate('Genre', {id: genre.id})}
        />
      ))}
    </View>
  );
};
