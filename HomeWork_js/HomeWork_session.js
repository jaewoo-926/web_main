import { encrypt_text, decrypt_text } from './HomeWork_crypto.js';
export function session_set(){ //세션 저장(객체)
    let id = document.querySelector("#typeEmailX");
    let password = document.querySelector("#typePasswordX");
    let random = new Date(); // 랜덤 타임스탬프
    const obj = { // 객체 선언
    id : id.value,
    otp : random
    }
    if (sessionStorage) {
    const objString = JSON.stringify(obj); // 객체 -> JSON 문자열 변환
    let en_text = encrypt_text(objString); // 암호화
    sessionStorage.setItem("Session_Storage_id", id.value);
    sessionStorage.setItem("Session_Storage_object", objString);
    sessionStorage.setItem("Session_Storage_pass", en_text);
    } else {
    alert("세션 스토리지 지원 x");
    }
}

export function session_set2(obj) {
    if (sessionStorage) {
        const objString = JSON.stringify(obj); // 객체를 문자열로 변환
        const encrypted = encrypt_text(objString); // 🔐 암호화
        sessionStorage.setItem("Session_Storage_join", encrypted); // 암호화된 문자열 저장
    } else {
        alert("세션 스토리지 지원 x");
    }
}

export function session_get() { //세션 읽기
    if (sessionStorage) {
    return sessionStorage.getItem("Session_Storage_pass");
    } else {
    alert("세션 스토리지 지원 x");
    }
}

export function session_get2() {
    if (!sessionStorage) {
        alert("세션 스토리지 지원 안 됨");
        return;
    }

    const encrypted = sessionStorage.getItem("Session_Storage_join");

    if (!encrypted || encrypted === "null" || encrypted.trim() === "") {
        console.warn("❗ 회원가입 세션이 비어 있음 → 복호화 생략");
        return;
    }

    try {
        const k = "key";
        const rk = k.padEnd(32, " ");
        const decrypted = CryptoJS.AES.decrypt(encrypted, CryptoJS.enc.Utf8.parse(rk), {
            iv: CryptoJS.enc.Utf8.parse(""),
            padding: CryptoJS.pad.Pkcs7,
            mode: CryptoJS.mode.CBC
        }).toString(CryptoJS.enc.Utf8);

        const parsed = JSON.parse(decrypted);
        console.log("🔓 복호화된 회원가입 정보:", parsed);
    } catch (e) {
        console.error("❗ 복호화 오류:", e.message);
    }
}

export function session_check() { //세션 검사
    if (sessionStorage.getItem("Session_Storage_id")) {
    alert("이미 로그인 되었습니다.");
    location.href='../login/index_login.html'; // 로그인된 페이지로 이동
    }
}

    function session_del() {//세션 삭제
        if (sessionStorage) {
        sessionStorage.removeItem("Session_Storage_test");
        alert('로그아웃 버튼 클릭 확인 : 세션 스토리지를 삭제합니다.');
        } else {
        alert("세션 스토리지 지원 x");
        }
        }
        
