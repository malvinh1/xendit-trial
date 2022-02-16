import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  Download: undefined;
};

export type NavigationProp<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;
