import React, { useState, useEffect } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import axios from "axios";
import ModalStorePostcode from "../../components/ModalStorePostcode";
import ModalStoreRegNum from "../../components/ModalStoreRegNum";

function InputStoreInfo({ onChange }) {
  const [confirmStoreInfo, setConfirmStoreInfo] = useState(false); // StoreInfo 유효성여부

  const [storeName, setStoreName] = useState(""); // 상점 이름

  const [storeRegNum, setStoreRegNum] = useState(""); // 사업자 등록번호
  const [regNumWarnig, setRegNumWarning] = useState(""); // 사업자등록번호 유효성 검사 경고문구
  const [isValidRegNum, setIsValidRegNum] = useState(false); // 사업자등록번호 유효성 검사 결과
  const [isOpenRegNum, setIsOpenRegNum] = useState(false); // 사업자등록번호 인증 모달창 여부
  const [isVerifiedRegNum, setIsVerifiedRegNum] = useState(false); // 사업자 등록번호 인증여부

  // 사업자등록번호 형식 - 숫자 10자리
  const storeRegNumEx = /^[0-9]{10}$/;

  // 사업자등록번호 유효성 검사
  const regNumCheck = (regNum) => {
    const isValidRegNum = storeRegNumEx.test(regNum);

    if (!isValidRegNum && regNum !== "") {
      setRegNumWarning("사업자등록번호는 10자리 숫자만 입력해주세요.");
    } else {
      setRegNumWarning("");
    }

    setIsValidRegNum(isValidRegNum);
  };

  // 사업자등록번호 인증 모달 띄우기
  const onChangeOpenRegNum = (e) => {
    // e.preventDefault(); // 새로고침 방지
    axios
      .post(
        "https://api.odcloud.kr/api/nts-businessman/v1/status?serviceKey=ULFR0UF6ByTGjclsNKrqQLC0L3GItE%2FRZev%2FKQ%2FE5A0YMnGuDqdYpi00CYrvWXVPxz8hxJq4h9M92hUvCUAKhQ%3D%3D",
        {
          b_no: [storeRegNum],
        }
      )
      .then((res) => {
        if (
          res.data.data[0].b_stt_cd === "01" ||
          res.data.data[0].b_stt_cd === "02"
        ) {
          setIsOpenRegNum(!isOpenRegNum);
        } else {
          return alert("존재하지 않는 사업자 입니다. 사업자 번호를 확인해 주세요.");
        }
      })
      .catch((err) => {
        return console.log(err);
      });
  };

  const [storeAddress, setStoreAddres] = useState(""); // 상점 전체 주소
  const [mainAddress, setMainAddress] = useState(""); // 상점 대표 주소
  const [extraAddress, setExtraAddress] = useState(""); // 상점 상세 주소
  const [isOpenPost, setIsOpenPost] = useState(false); //  주소 검색창 열렸는지

  // 우편번호찾기 모달 띄우기
  const onChangeOpenPost = (e) => {
    e.preventDefault(); // 새로고침 방지
    setIsOpenPost(!isOpenPost);
  };

  // 찾은 주소 입력하기
  const onCompletePost = (data) => {
    setMainAddress(data.address);
    setExtraAddress(data.buildingName);
    setStoreAddres(data.address + data.buildingName);
    setIsOpenPost(false);
  };

  const [storeCategory, setStoreCategory] = useState(""); // 상점 카테고리

  useEffect(() => {
    if (
      storeName !== "" &&
      storeRegNum !== "" &&
      storeAddress !== "" &&
      storeCategory !== "" &&
      isVerifiedRegNum
    ) {
      setConfirmStoreInfo(true);
    }
    onChange({
      storeName,
      storeRegNum,
      storeAddress,
      storeCategory,
      confirmStoreInfo,
    });
  }, [
    storeName,
    storeRegNum,
    storeAddress,
    storeCategory,
    confirmStoreInfo,
    isVerifiedRegNum,
    onChange,
  ]);

  return (
    <div>
      <h4>상점 정보</h4>
      <div style={{ outline: "none" }}>
        <Form.Label>상점 이름*</Form.Label>
        <InputGroup>
          <Form.Control
            placeholder="상점 이름"
            aria-label="상점이름을 입력하세요."
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
        </InputGroup>
      </div>

      <div style={{ height: "70px" }}>
        <Form.Label>사업자등록번호*</Form.Label>
        <InputGroup>
          <Form.Control
            placeholder="사업자등록번호(- 없이 숫자만 입력하세요)"
            aria-label="사업자등록번호를 입력하세요."
            maxLength={10}
            onChange={(e) => {
              const numExp = /[^0-9]/g;
              if (numExp.test(e.target.value)) {
                e.target.value = e.target.value.replace(numExp, "");
              }
              regNumCheck(e.target.value);
              setStoreRegNum(e.target.value);
            }}
          />
          <Button
            id="regNum-button-addon2"
            onClick={onChangeOpenRegNum}
            disabled={!isValidRegNum}>
            인증하기
          </Button>
        </InputGroup>
        <Form.Label className="waringMessage">{regNumWarnig}</Form.Label>
      </div>

      <div>
        <Form.Label>상점 위치*</Form.Label>
        <InputGroup>
          <Form.Control
            placeholder="우편번호 조회"
            aria-label="우측버튼을 눌러 우편번호를 조회하세요"
            readOnly={true}
            value={mainAddress}
          />
          <Button id="postcode-button-addon2" onClick={onChangeOpenPost}>
            검색하기
          </Button>
        </InputGroup>
        <InputGroup style={{ marginTop: "15px" }}>
          <Form.Control
            placeholder="상세주소"
            aria-label="상점의 상세주소를 입력하세요"
            value={extraAddress}
            onChange={(e) => {
              setExtraAddress(e.target.value);
              setStoreAddres(mainAddress + e.target.value);
            }}
          />
        </InputGroup>
      </div>

      <div>
        <Form.Label>상점 카테고리*</Form.Label>
        <Form.Select
          aria-label="상점 카테고리를 선택해 주세요."
          onChange={(e) => setStoreCategory(e.target.value)}>
          <option>상점카테고리</option>
          <option value="1">One</option>
          <option value="2">two</option>
          <option value="3">three</option>
        </Form.Select>
      </div>
      {isOpenPost ? (
        <ModalStorePostcode
          onCompletePost={onCompletePost}
          setIsOpenPost={setIsOpenPost}
        />
      ) : null}
      {isOpenRegNum ? (
        <ModalStoreRegNum
          regNum={storeRegNum}
          setIsOpenRegNum={setIsOpenRegNum}
          setIsVerifiedRegNum={setIsVerifiedRegNum}
        />
      ) : null}
    </div>
  );
}

export default InputStoreInfo;
