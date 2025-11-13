import BottomTabsNavigator from '@/src/navigation/BottomTabNavigation';
import { View } from 'react-native';

export default function TabLayout() {

  
  return (
    <View style={{ flex: 1 }}>
      <BottomTabsNavigator />
    </View>
  );
}