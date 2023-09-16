import styles from "./styles";
import { View, Text } from "react-native";

import Tabs from "../../Components/Tabs/Tabs";

export default function MyPage({navigation}) {
    return (
      <View style={styles.container}>
        <Text>나의 소소행</Text>
        
      <Tabs navigation={navigation}/>
      </View>
    );
  }
  
  