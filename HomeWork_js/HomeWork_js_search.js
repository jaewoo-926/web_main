document.getElementById("search_button_msg ").addEventListener('click', search_message);
const search_message = () => {
  const c = '검색을 수행합니다';
  alert(c);
  };
  
 function googleSearch() {
    const badWords = ['바보', '멍청이', '똥개', '땅딸보', '대가리'];         // 검사할 비속어 리스트 (5개)
    const searchTerm = document.getElementById("search_input").value; // 검색어로 설정
    
    if (searchTerm.length > 0) {  // 검색어가 0보다 크면 실행
        // 비속어 배열을 반복하면서 하나씩 확인
        for (let i = 0; i < badWords.length; i++) {
          // 현재 비속어가 입력 문자열에 포함되어 있는지 확인
          if (searchTerm.includes(badWords[i])) {
            
            return; // 비속어가 있으면 함수 중단
          }
        }
          const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`; // 새 창에서 구글 검색을 수행
          window.open(googleSearchUrl, "_blank"); // 새로운 창에서 열기.
        return false;
      }
    

   
    }
// function search_message(){
// alert("검색을 수행합니다!");
// }

// function search_message(){
// alert("검색을 수행합니다!");
// }  밑에 있는 함수에 우선순위가 생김



