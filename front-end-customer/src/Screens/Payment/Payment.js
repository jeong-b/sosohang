import IMP from "iamport-react-native";
import styles from "./styles";
import { Image, View, Text, Alert } from "react-native";
import Loading from "../../Components/Loading/Loading";
import { EXPO_PG_USER_CODE } from "@env";
import { useEffect, useState } from "react";

export default function Payment({ navigation, route }) {
  const userCode = EXPO_PG_USER_CODE;
  const data = route.params.data;
  const productList = route.params.productList;
  const to = route.params.to;

  return (
    <View style={styles.container}>
      <IMP.Payment
        userCode={userCode}
        loading={<Loading />}
        data={data}
        callback={(response) => {
          if (response.error_code) {
            console.log(response);
            console.log("error_code : ", response.error_code);
            navigation.goBack(); // error_code가 있을 때 이전 페이지로 돌아갑니다.
            Alert.alert("알림", "사용자가 결제를 취소하셨습니다.", [
              {
                text: "OK",
                onPress: () => navigation.goBack(),
              },
            ]);
          } else {
            navigation.navigate("PaymentResult", {
              paymentData: data,
              productList: productList,
              to: to,
            });
          }
        }}
      />
    </View>
  );
}
