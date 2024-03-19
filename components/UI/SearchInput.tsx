import type { FC } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import Input from './Input';
import { COLORS } from '../../constants/global-styles';

type SearchInputProps = {
  searchInput: string;
  setSearchInput: React.Dispatch<React.SetStateAction<string>>;
  isSearching: boolean;
};

const SearchInput: FC<SearchInputProps> = ({ searchInput, setSearchInput, isSearching }) => {
  return (
    <View style={{ position: 'relative', justifyContent: 'center' }}>
      <Input
        placeholder="Username, ETH address, or ENS"
        value={searchInput}
        onChangeText={setSearchInput}
      />
      <ActivityIndicator
        style={styles.activityIndicator}
        size="small"
        color={COLORS.light}
        animating={isSearching}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  activityIndicator: {
    position: 'absolute',
    right: 16,
  },
});

export default SearchInput;
