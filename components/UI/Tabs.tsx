import { StyleSheet, Text, View, Pressable } from 'react-native';

import { COLORS } from '../../constants/global-styles';

export type TabOption = {
  title: string;
  value: string;
};

type TabsProps = {
  options: TabOption[];
  activeTab: TabOption;
  onTabPress: (tab: TabOption) => void;
};
const Tab = ({
  title,
  onPress,
  isActive,
}: {
  title: string;
  onPress: () => void;
  isActive: boolean;
}) => {
  return (
    <Pressable onPress={onPress} style={[styles.tab, isActive && styles.activeTab]}>
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>{title}</Text>
    </Pressable>
  );
};

const Tabs: React.FC<TabsProps> = ({ options, activeTab, onTabPress }) => {
  return (
    <View style={styles.tabsContainer}>
      {options.map((option) => (
        <Tab
          key={option.value}
          title={option.title}
          onPress={() => onTabPress(option)}
          isActive={activeTab.value === option.value}
        />
      ))}
    </View>
  );
};
export default Tabs;

const styles = StyleSheet.create({
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#2C2C2E',
    borderRadius: 100,
  },
  tab: {
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 12,
    minWidth: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#09EE49',
  },
  tabText: {
    color: '#EBEBEB',
    fontFamily: 'Satoshi-Bold',
    fontSize: 18,
    textTransform: 'capitalize',
  },
  activeTabText: {
    color: COLORS.dark,
  },
});
