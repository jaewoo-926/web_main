import { session_set, session_get, session_check } from './HomeWork_session.js';
import { encrypt_text, decrypt_text } from './HomeWork_crypto.js';
import { generateJWT, checkAuth } from './HomeWork_jwt_token.js';



const check_xss = (input) => {
    // DOMPurify 라이브러리 로드 (CDN 사용)
    const DOMPurify = window.DOMPurify;
    // 입력 값을 DOMPurify로 sanitize
    const sanitizedInput = DOMPurify.sanitize(input);
    // Sanitized된 값과 원본 입력 값 비교
    if (sanitizedInput !== input) {
        // XSS 공격 가능성 발견 시 에러 처리
        alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
        login_failed();
        return false;
    }
    // Sanitized된 값 반환
    return sanitizedInput;
};

function setCookie(name, value, expiredays) {
    const date = new Date();
    date.setDate(date.getDate() + expiredays);
    const encodedName = encodeURIComponent(name);
    const encodedValue = encodeURIComponent(value);
    document.cookie = `${encodedName}=${encodedValue}; expires=${date.toUTCString()}; path=/`;
}
function getCookie(name) {
    const decodedName = encodeURIComponent(name);
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
        const [key, value] = cookies[i].split("=");
        if (key === decodedName) {
            return decodeURIComponent(value);
        }
    }
    return null; // 못 찾으면 null 반환
}

function init(){ // 로그인 폼에 쿠키에서 가져온 아이디 입력
    const emailInput = document.getElementById('typeEmailX');
    const idsave_check = document.getElementById('idSaveCheck');
    let get_id = getCookie("id");
    if(get_id) {
    emailInput.value = get_id;
    idsave_check.checked = true;
    }
    session_check(); // 세션 유무 검사
    checkLoginStatus();
}

document.addEventListener('DOMContentLoaded', () => {
checkAuth();
init_logined();
});

     
function init_logined(){
    if(sessionStorage){
    decrypt_text(); // 복호화 함수
    }
    else{
    alert("세션 스토리지 지원 x");
    }
}

const check_input = () => {
    const loginForm = document.getElementById('login_form');
    const loginBtn = document.getElementById('login_btn');
    const emailInput = document.getElementById('typeEmailX');
    const passwordInput = document.getElementById('typePasswordX');
    const c = '아이디, 패스워드를 체크합니다';
    alert(c);
    const emailValue = emailInput.value.trim();
    const passwordValue = passwordInput.value.trim();

    const sanitizedPassword = check_xss(passwordValue);
    // check_xss 함수로 비밀번호 Sanitize
    const sanitizedEmail = check_xss(emailValue);
    // check_xss 함수로 비밀번호 Sanitize
    const idsave_check = document.getElementById('idSaveCheck');
    const payload = {
    id: emailValue,
    exp: Math.floor(Date.now() / 1000) + 3600 // 1시간 (3600초)
    };
    const jwtToken = generateJWT(payload);


    if (!sanitizedEmail) {
        // Sanitize된 비밀번호 사용
        return false;
    }
    if (!sanitizedPassword) {
        // Sanitize된 비밀번호 사용
        return false;
    }

    // 3글자 이상이 두 번 반복되는지 검사하는 규칙
    const threeCharRepeatPattern = /(.{3,})\1/;

    // 이메일에 반복되는 3글자가 있으면 호출
    if (threeCharRepeatPattern.test(emailValue)) {
        alert('아이디에 같은 3글자 이상이 반복되면 안 됩니다.');
        login_failed();
        return false;
    }

    // 비밀번호에 반복되는 3글자가 있으면 호출
    if (threeCharRepeatPattern.test(passwordValue)) {
        alert('비밀번호에 같은 3글자 이상이 반복되면 안 됩니다.');
        login_failed();
        return false;
    }

    // 숫자 두 자리가 반복되었는지 검사함
    const twoDigitRepeatPattern = /(\d{2})\D*.*\1/;

    // 아이디에 숫자 두 자리가 반복되면 호출
    if (twoDigitRepeatPattern.test(emailValue)) {
        alert('아이디에 같은 숫자 두 자리가 반복되면 안 됩니다.');
        login_failed();
        return false;
    }

    // 비밀번호도 마찬가지로 검사
    if (twoDigitRepeatPattern.test(passwordValue)) {
    alert('비밀번호에 같은 숫자 두 자리가 반복되면 안 됩니다.');
    login_failed();
    return false;
    }



    if (5 > emailValue.length || emailValue.length > 20) {
        alert('아이디는 최소 5글자 이상 20글자 이하로 입력해야 합니다.');
        login_failed();
        return false;
        }
    if (8 < passwordValue.length || passwordValue.length > 15) {
        alert('비밀번호는 반드시 8글자 이상 15글자 이하로 입력해야 합니다.');
        login_failed();
        return false;
    }
    const hasSpecialChar = passwordValue.match(/[!,@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/) !== null;
    if (!hasSpecialChar) {
        alert('패스워드는 특수문자를 1개 이상 포함해야 합니다.');
        login_failed();
        return false;
     }
     const hasUpperCase = passwordValue.match(/[A-Z]+/) !== null;
     const hasLowerCase = passwordValue.match(/[a-z]+/) !== null;
     if (!hasUpperCase || !hasLowerCase) {
        alert('패스워드는 대소문자를 1개 이상 포함해야 합니다.');
        login_failed();
        return false;
     }
        

    if (emailValue === '') {
    alert('이메일을 입력하세요.');
    login_failed();
    return false;
    }
    if (passwordValue === '') {
    alert('비밀번호를 입력하세요.');
    login_failed();
    return false;
    }
    console.log('이메일:', emailValue);
    console.log('비밀번호:', passwordValue);
    localStorage.setItem('jwt_token', jwtToken);

    if(idsave_check.checked == true) { // 아이디 체크 o
        alert("쿠키를 저장합니다.", emailValue);
        setCookie("id", emailValue, 1); // 1일 저장
        alert("쿠키 값 :" + emailValue);
        }
        else{ // 아이디 체크 x
        setCookie("id", emailValue.value, 0); //날짜를 0 - 쿠키 삭제
        }
    encryptAESGCM(passwordValue, passwordValue).then((encrypted) => {
        sessionStorage.setItem("Session_Storage_pass2", encrypted);
        console.log("Session_Storage_pass2 저장 완료:", encrypted);
        session_set(); // 세션 생성
        loginForm.submit();
    });
    };
    
//10주차 로그인 / 로그아웃 횟수 쿠키


// 로그인 횟수 증가 함수
function login_count() {
    let count = parseInt(getCookie("login_cnt")) || 0;
    count += 1;
    setCookie("login_cnt", count, 1); // 1일간 저장
    // alert("로그인 횟수: " + count);
}

// 로그아웃 횟수 증가 함수
function logout_count() {
    let count = parseInt(getCookie("logout_cnt")) || 0;
    count += 1;
    setCookie("logout_cnt", count, 1); // 1일간 저장
    // alert("로그아웃 횟수: " + count);
}

function login_failed() {
    let failCount = parseInt(getCookie("login_fail_cnt")) || 0;
    failCount += 1;
    setCookie("login_fail_cnt", failCount, 1); // 1일 저장

    const status = document.getElementById("login_status");
    if (failCount >= 3) {
        status.innerText = `❌ 로그인 3회 이상 실패 - 로그인이 제한되었습니다.`;
        document.getElementById("login_btn").disabled = true;
    } else {
        status.innerText = `❌ 로그인 실패 횟수: ${failCount}회`;
    }
}

function checkLoginStatus() {
    const failCount = parseInt(getCookie("login_fail_cnt")) || 0;
    const status = document.getElementById("login_status");

    if (failCount >= 3) {
        status.innerText = `❌ 로그인 3회 이상 실패 - 로그인이 제한되었습니다.`;
        document.getElementById("login_btn").disabled = true;
    } else {
        status.innerText = `현재 로그인 실패 횟수: ${failCount}회`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
  const loginBtn = document.getElementById("login_btn");
  if (loginBtn) {
    loginBtn.addEventListener('click', check_input);
  }
});