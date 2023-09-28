import styles from "./styles";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Linking,
} from "react-native";
import React, { useState } from "react";
import * as Contacts from "expo-contacts";
import { Ionicons } from "@expo/vector-icons";

import CartGift from "../../Components/CartGift/CartGift";
import SelectImage from "../../Components/SelectImage/SelectImage";

export default function MakeCard({ route, navigation }) {
  const { selectedProducts, totalPrice } = route.params;
  console.log(selectedProducts)
  const selectedProductsArray = Array.from(selectedProducts);

  const [selectedButton, setSelectedButton] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // 선택된 카드 이미지
  const [message, setMessage] = useState(""); // 입력된 텍스트를 관리
  const [contacts, setContacts] = useState([]); // 연락처 데이터를 저장
  const [contactName, setContactName] = useState("");
  const [contactPhoneNumber, setContactPhoneNumber] = useState("");

  
  // 연락처 가져오기 함수
  const getContacts = async () => {
    // 연락처 액세스 권한 요청
    const { status } = await Contacts.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "연락처 접근 권한이 필요합니다.",
        "앱 설정에서 권한을 허용해주세요."
      );
      return;
    }
    const { data } = await Contacts.getContactsAsync();

    if (data.length > 0) {
      console.log(data);
      setContacts(data);
    } else {
      Alert.alert("연락처가 없습니다.");
    }
  };

  // 연락처 가져오기 버튼을 눌렀을 때 호출
  const handleGetContacts = () => {
    // getContacts();
    Linking.openURL("content://contacts/people/");
  };

  // 연락처 목록 보여주고 선택한 연락처 처리
  const handleContactSelection = (selectedContact) => {
    if (selectedContact) {
      const { name, phoneNumbers } = selectedContact;
      const phoneNumber = phoneNumbers[0]?.number || "";

      setContactName(name);
      setContactPhoneNumber(phoneNumber);
    }
  };

  // 상품을 상점 이름을 기준으로 그룹화
  const groupedProducts = selectedProductsArray.reduce((groups, product) => {
    const shopName = product.shopName;
    if (!groups[shopName]) {
      groups[shopName] = [];
    }
    groups[shopName].push(product);
    return groups;
  }, {});

  // 그룹화된 상품을 렌더링
  const renderGroupedProducts = () => {
    return Object.keys(groupedProducts).map((shopName) => {
      const productsInShop = groupedProducts[shopName];
      return (
        <View key={shopName}>
          <Text style={styles.shopName}>
            {shopName} <Ionicons style={styles.shopIcon} name="home-outline" />
          </Text>
          <View style={styles.box}>
            {productsInShop.map((product, index) => (
              <CartGift
                key={index}
                product={product}
                updateTotalPrice={(priceChange) => {
                  // 총 결제 금액을 업데이트하는 함수
                }}
                totalPrice={totalPrice}
                setSelectedProducts={(newSelectedProducts) => {
                  // 선택한 상품을 업데이트하는 함수
                }}
                shopName={product.shopName}
              />
            ))}
          </View>
        </View>
      );
    });
  };

  return (
    <>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>선물포장하기</Text>

          <SelectImage
            selectedButton={selectedButton}
            setSelectedButton={setSelectedButton}
            setSelectedImage={setSelectedImage}
            setMessage={setMessage}
          />

          <View style={styles.subcontainer}>
            <Text style={styles.subtitle}>😊 보내는 사람 👉</Text>
            <TextInput
              style={[styles.input, { marginHorizontal: 40 }]}
              placeholder="상대방에게 표시되는 이름이에요."
            />
          </View>

          <View style={styles.subcontainer}>
            <Text style={styles.subtitle}>😍 받는 사람 🖐</Text>
            <TouchableOpacity
              style={[
                styles.button,
                { marginHorizontal: 40, marginBottom: 20 },
              ]}
              onPress={getContacts}
            >
              <Text style={styles.buttonText}>+ 연락처 가져오기</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", marginHorizontal: 40 }}>
              <TextInput
                style={[styles.input, { width: 100 }]}
                placeholder="이름"
                value={contactName}
                onChangeText={(text) => {
                  setContactName(text); // 이름 입력 시 상태 업데이트
                }}
              />
              <TextInput
                style={[styles.input, { width: 220, marginLeft: 10 }]}
                placeholder="전화번호"
                keyboardType="numeric"
                maxLength={13}
                value={contactPhoneNumber}
                onChangeText={(text) => {
                  setContactPhoneNumber(text); // 전화번호 입력 시 상태 업데이트
                }}
              />
            </View>
            <ScrollView style={{ marginLeft: 53, marginTop: 10 }}>
              {contacts.map((contact, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleContactSelection(contact)}
                >
                  <Text style={{ marginVertical: 5, fontSize: 20 }}>
                    {contact.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View style={styles.subcontainer}>
            <Text style={styles.subtitle}>🎁 상품 내역</Text>
            {renderGroupedProducts()}

            <View style={styles.total}>
              <View style={styles.price}>
                <Text style={styles.priceText}> 총 결제 금액</Text>
                <Text style={styles.priceText}>{totalPrice} 원</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.okay}
            onPress={() => {
              if (contactName === "" || contactPhoneNumber === "") {
                Alert.alert("받는 사람을 선택해주세요.");
              } else {
                navigation.navigate("WaitingPayment", {
                  groupedProducts,
                  totalPrice,
                  result: false,
                  to: contactName,
                });
              }
            }}
          >
            <Text style={[styles.priceText, { color: "white" }]}>결제하기</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </>
  );
}
