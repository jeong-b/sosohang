import styles from "./styles";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";

import Tabs from "../../Components/Tabs/Tabs";
import Title from "../../Components/Title/Title";
import Line from "../../Components/Line/Line";
import SubTitle from "../../Components/SubTitle/SubTitle";
import CarouselItem from "../../Components/CarouselItem/CarouselItem";
import Carousel from "../../Components/Carousel/Carousel";
import Box from "../../Components/Box/Box";
import Gift from "../../Components/Gift/Gift";
import StampAfter from "../../Components/StampAfter/StampAfter";

import userDummy from "../../Dummys/MyPage/UserDummy";
import dibsDummy from "../../Dummys/MyPage/DibsDummy";
import buyDummy from "../../Dummys/MyPage/BuyDummy";

const user = userDummy;
const dibs = dibsDummy.map((data) => {
  return <CarouselItem props={data} />;
});
const buy = buyDummy.map((data) => {
  return <Gift data={data} />;
});

export default function MyPage({ navigation }) {
  return (
    <>
      <ScrollView style={styles.container}>
        <Title title={"나의 소소행"} />

        <View style={styles.section1}>
          <View style={styles.profile}>
            <Image
              style={styles.profileImage}
              source={require("assets/images/bread.png")}
            />
            <View style={styles.user}>
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.name}>{user.name}</Text>
                <Text
                  onPress={() => {
                    console.log("이름 수정");
                  }}
                >
                  {" "}
                  ✏️
                </Text>
              </View>
              <Text style={styles.phone}>{user.phone}</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("StampList");
            }}
          >
            <StampAfter />
          </TouchableOpacity>
        </View>

        <Line />

        <View style={styles.section2}>
          <View style={styles.header}>
            <SubTitle subTitle={"❤️ 찜 목록"} />
            <Text>상세보기 ＞ </Text>
          </View>
          <Carousel content={dibs} />
        </View>

        <Line />

        <View style={styles.section3}>
          <View style={styles.header}>
            <SubTitle subTitle={"💸 구매 내역"} />
          </View>
          <Box content={buy} />
        </View>
      </ScrollView>
      <Tabs navigation={navigation} />
    </>
  );
}
