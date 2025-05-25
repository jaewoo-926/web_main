document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("search_button_msg");
  if (searchBtn) {
    searchBtn.addEventListener("click", () => {
      const c = '검색을 수행합니다';
      alert(c);
    });
  }

  // 검색 함수도 DOMContentLoaded 이후에만 동작하게
  const searchInput = document.getElementById("search_input");
  const searchForm = document.querySelector("form[role='search']");
  if (searchForm && searchInput) {
    searchForm.onsubmit = () => {
      const badWords = ['바보', '멍청이', '똥개', '땅딸보', '대가리'];
      const searchTerm = searchInput.value;

      if (searchTerm.length > 0) {
        for (let i = 0; i < badWords.length; i++) {
          if (searchTerm.includes(badWords[i])) {
            alert("비속어는 검색할 수 없습니다.");
            return false;
          }
        }

        const googleSearchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchTerm)}`;
        window.open(googleSearchUrl, "_blank");
        return false;
      }
    };
  }
});
