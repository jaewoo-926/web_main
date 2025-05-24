function logout() {
    // 로그아웃 카운트 증가
    logout_count();

    // 세션 삭제
    sessionStorage.clear();

    // 로컬스토리지에서 jwt_token 삭제
    localStorage.removeItem("jwt_token");

    // 쿠키 삭제
    setCookie("id", "", 0);
    setCookie("login_cnt", "", 0);
    setCookie("logout_cnt", "", 0);
    setCookie("login_fail_cnt", "", 0);

    alert("로그아웃이 완료되었습니다.");

    // 메인 페이지로 이동
    window.location.href = "../HomeWork_Index.html";
}