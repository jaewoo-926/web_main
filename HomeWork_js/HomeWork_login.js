const check_xss = (input) => {
    // DOMPurify 라이브러리 로드 (CDN 사용)
    const DOMPurify = window.DOMPurify;
    // 입력 값을 DOMPurify로 sanitize
    const sanitizedInput = DOMPurify.sanitize(input);
    // Sanitized된 값과 원본 입력 값 비교
    if (sanitizedInput !== input) {
        // XSS 공격 가능성 발견 시 에러 처리
        alert('XSS 공격 가능성이 있는 입력값을 발견했습니다.');
        return false;
    }
    // Sanitized된 값 반환
    return sanitizedInput;
};

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
        return false;
    }

    // 비밀번호에 반복되는 3글자가 있으면 호출
    if (threeCharRepeatPattern.test(passwordValue)) {
        alert('비밀번호에 같은 3글자 이상이 반복되면 안 됩니다.');
        return false;
    }

    // 숫자 두 자리가 반복되었는지 검사함
    const twoDigitRepeatPattern = /(\d{2})\D*.*\1/;

    // 아이디에 숫자 두 자리가 반복되면 호출
    if (twoDigitRepeatPattern.test(emailValue)) {
        alert('아이디에 같은 숫자 두 자리가 반복되면 안 됩니다.');
        return false;
    }

    // 비밀번호도 마찬가지로 검사
    if (twoDigitRepeatPattern.test(passwordValue)) {
    alert('비밀번호에 같은 숫자 두 자리가 반복되면 안 됩니다.');
    return false;
    }



    if (10 < emailValue.length < 5) {
        alert('아이디는 최소 5글자 이상 20글자 이하로 입력해야 합니다.');
        return false;
        }
    if (15 <passwordValue.length < 8) {
        alert('비밀번호는 반드시 8글자 이상 15글자 이하로 입력해야 합니다.');
        return false;
    }
    const hasSpecialChar = passwordValue.match(/[!,@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/) !== null;
    if (!hasSpecialChar) {
        alert('패스워드는 특수문자를 1개 이상 포함해야 합니다.');
        return false;
     }
     const hasUpperCase = passwordValue.match(/[A-Z]+/) !== null;
     const hasLowerCase = passwordValue.match(/[a-z]+/) !== null;
     if (!hasUpperCase || !hasLowerCase) {
        alert('패스워드는 대소문자를 1개 이상 포함해야 합니다.');
        return false;
     }
        

    if (emailValue === '') {
    alert('이메일을 입력하세요.');
    return false;
    }
    if (passwordValue === '') {
    alert('비밀번호를 입력하세요.');
    return false;
    }
    console.log('이메일:', emailValue);
    console.log('비밀번호:', passwordValue);
    loginForm.submit();
    };
    document.getElementById("login_btn").addEventListener('click', check_input);