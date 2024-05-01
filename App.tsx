import 'react-native-url-polyfill/auto';
import React from 'react';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {Genre} from './src/genre';
import {TailwindProvider} from 'tailwind-rn';
import utilities from './tailwind.json';
import {Home} from './src/home';
import {Search} from './src/search';
import {Actors} from './src/actors';
import {Menu} from './src/components/menu';

import {TMDB} from 'tmdb-ts';
import {Movie} from './src/movie';
import LinearGradient from 'react-native-linear-gradient';
import {Actor} from './src/actor';

const queryClient = new QueryClient();

export type RootStackList = {
  Home: undefined;
  Genre: {id: number};
  Search: undefined;
  Actors: undefined;
  Movie: {id: number};
  Actor: {id: number};
};

const Stack = createNativeStackNavigator<RootStackList>();

const InnerApp = () => {
  return (
    <LinearGradient colors={['#82e8a7', '#1DBD57']} style={{flex: 1}}>
      <NavigationContainer theme={{colors: {background: 'transparent'}}}>
        <Menu />
        <Stack.Navigator screenOptions={{headerShown: false}}>
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="Search" component={Search} />
          <Stack.Screen name="Actors" component={Actors} />
          <Stack.Screen name="Genre" component={Genre} />
          <Stack.Screen name="Movie" component={Movie} />
          <Stack.Screen name="Actor" component={Actor} />
        </Stack.Navigator>
      </NavigationContainer>
    </LinearGradient>
  );
};

function App(): JSX.Element {
  return (
    <TailwindProvider utilities={utilities}>
      <QueryClientProvider client={queryClient}>
        <InnerApp />
      </QueryClientProvider>
    </TailwindProvider>
  );
}

export default App;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackList {}
  }
}
