function setCookie(name, value, expiredays) {
    const date = new Date();
    date.setDate(date.getDate() + expiredays);
    const encodedName = encodeURIComponent(name);
    const encodedValue = encodeURIComponent(value);
    document.cookie = `${encodedName}=${encodedValue}; expires=${date.toUTCString()}; path=/`;
}

// 로그아웃 카운트 증가용 함수
function logout_count() {
    let count = parseInt(getCookie("logout_cnt")) || 0;
    count += 1;
    setCookie("logout_cnt", count, 1);
}

// 쿠키 가져오기 함수
function getCookie(name) {
    const decodedName = encodeURIComponent(name);
    const cookies = document.cookie.split("; ");
    for (let i = 0; i < cookies.length; i++) {
        const [key, value] = cookies[i].split("=");
        if (key === decodedName) {
            return decodeURIComponent(value);
        }
    }
    return null;
}

function logout() {
    logout_count();  // ✅ 의존성 없이 로그아웃 카운트 증가

    // 로그인 관련 세션만 삭제 (회원가입 정보는 유지)
    sessionStorage.removeItem("Session_Storage_id");
    sessionStorage.removeItem("Session_Storage_pass");
    sessionStorage.removeItem("Session_Storage_pass2");
    sessionStorage.removeItem("Session_Storage_object");

    // 로컬스토리지에서 jwt_token 삭제
    localStorage.removeItem("jwt_token");

    // 쿠키 삭제
    setCookie("id", "", 0);
    setCookie("login_cnt", "", 0);
    setCookie("logout_cnt", "", 0);
    setCookie("login_fail_cnt", "", 0);

    alert("로그아웃이 완료되었습니다.");
    window.location.href = "../HomeWork_Index.html";
}