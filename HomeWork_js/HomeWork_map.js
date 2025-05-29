// Kakao Map 통합 스크립트

// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

// 장소 검색 객체를 생성합니다
var ps = new kakao.maps.services.Places();

// 지도를 표시할 div와 옵션 설정
var mapContainer = document.getElementById('map');
var mapOption = {
    center: new kakao.maps.LatLng(37.380924, 126.928421), // 지도의 중심좌표
    level: 3 // 지도의 확대 레벨
};

// 지도를 생성합니다
var map = new kakao.maps.Map(mapContainer, mapOption);

// 지도 타입 및 컨트롤 추가
var mapTypeControl = new kakao.maps.MapTypeControl();
map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

// 지도 확대 축소 컨트롤을 생성하여 추가합니다
var zoomControl = new kakao.maps.ZoomControl();
map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);

// 지도에 지형정보를 표시하도록 지도타입을 추가합니다
map.addOverlayMapTypeId(kakao.maps.MapTypeId.TERRAIN);

// 클릭한 위치를 표시할 마커와 인포윈도우를 생성합니다
var marker = new kakao.maps.Marker();
var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

// 장소 검색 결과 마커를 저장할 배열을 생성합니다
var markers = [];

// 현재 지도 중심좌표로 주소를 검색해서 지도 좌측 상단에 표시합니다
searchAddrFromCoords(map.getCenter(), displayCenterInfo);

// 지도 중심 좌표나 확대 수준이 변경됐을 때 주소 정보를 표시하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map, 'idle', function () {
    searchAddrFromCoords(map.getCenter(), displayCenterInfo);
});

// 지도를 클릭했을 때 클릭 위치 좌표에 대한 주소정보를 표시하도록 이벤트를 등록합니다
kakao.maps.event.addListener(map, 'click', function (mouseEvent) {
    var latlng = mouseEvent.latLng;

    marker.setPosition(latlng);
    marker.setMap(map);

    // 먼저 위도·경도만 보여주고
    document.getElementById('clickLatlng').innerHTML =
        '<strong>위도:</strong> ' + latlng.getLat().toFixed(6) + '<br>' +
        '<strong>경도:</strong> ' + latlng.getLng().toFixed(6) + '<br>' +
        '<em>주소를 불러오는 중...</em>';

    // 주소 정보 가져오기
    searchDetailAddrFromCoords(latlng, function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
            var detailAddr = result[0].road_address ? result[0].road_address.address_name : result[0].address.address_name;
            document.getElementById('clickLatlng').innerHTML =
                '<strong>위도:</strong> ' + latlng.getLat().toFixed(6) + '<br>' +
                '<strong>경도:</strong> ' + latlng.getLng().toFixed(6) + '<br>' +
                '<strong>주소:</strong> ' + detailAddr;

            // 인포윈도우 내용도 동일하게 유지
            var content = '<div class="bAddr">' +
                '<span class="title">주소정보</span>' +
                (result[0].road_address ? '<div>도로명주소 : ' + result[0].road_address.address_name + '</div>' : '') +
                '<div>지번 주소 : ' + result[0].address.address_name + '</div>' +
                '</div>';

            infowindow.setContent(content);
            infowindow.open(map, marker);
        }
    });
});

// 좌표로 행정동 주소 정보를 요청합니다
function searchAddrFromCoords(coords, callback) {
    geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
}

// 좌표로 법정동 상세 주소 정보를 요청합니다
function searchDetailAddrFromCoords(coords, callback) {
    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}

// 지도 좌측상단에 지도 중심좌표에 대한 주소정보를 표출합니다
function displayCenterInfo(result, status) {
    if (status === kakao.maps.services.Status.OK) {
        var infoDiv = document.getElementById('centerAddr');
        for (var i = 0; i < result.length; i++) {
            if (result[i].region_type === 'H') {
                infoDiv.innerHTML = result[i].address_name;
                break;
            }
        }
    }
}

// 키워드로 장소를 검색합니다
function searchPlaces() {
    var keyword = document.getElementById('keyword').value;
    if (!keyword.trim()) {
        alert('키워드를 입력해주세요!');
        return;
    }
    ps.keywordSearch(keyword, placesSearchCB);
}

// 장소검색이 완료됐을 때 호출되는 콜백함수입니다
function placesSearchCB(data, status, pagination) {
    if (status === kakao.maps.services.Status.OK) {
        displayPlaces(data);
        displayPagination(pagination);
    } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
        alert('검색 결과가 없습니다.');
    } else if (status === kakao.maps.services.Status.ERROR) {
        alert('검색 중 오류가 발생했습니다.');
    }
}

// 검색 결과 목록과 마커를 표출하는 함수입니다
function displayPlaces(places) {
    var listEl = document.getElementById('placesList'),
        menuEl = document.getElementById('menu_wrap'),
        fragment = document.createDocumentFragment(),
        bounds = new kakao.maps.LatLngBounds();

    removeAllChildNods(listEl);
    removeMarker();

    for (var i = 0; i < places.length; i++) {
        var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x),
            marker = addMarker(placePosition, i),
            itemEl = getListItem(i, places[i]);

        bounds.extend(placePosition);

        (function (marker, title) {
            kakao.maps.event.addListener(marker, 'mouseover', function () {
                displayInfowindow(marker, title);
            });
            kakao.maps.event.addListener(marker, 'mouseout', function () {
                infowindow.close();
            });
            itemEl.onmouseover = function () {
                displayInfowindow(marker, title);
            };
            itemEl.onmouseout = function () {
                infowindow.close();
            };
        })(marker, places[i].place_name);

        fragment.appendChild(itemEl);
    }

    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;
    map.setBounds(bounds);
}

// 검색결과 항목을 Element로 반환하는 함수입니다
function getListItem(index, place) {
    var el = document.createElement('li'),
        itemStr = '<span class="markerbg marker_' + (index + 1) + '"></span>' +
            '<div class="info">' +
            '   <h5>' + place.place_name + '</h5>';

    if (place.road_address_name) {
        itemStr += '    <span>' + place.road_address_name + '</span>' +
            '   <span class="jibun gray">' + place.address_name + '</span>';
    } else {
        itemStr += '    <span>' + place.address_name + '</span>';
    }

    itemStr += '  <span class="tel">' + place.phone + '</span>' +
        '</div>';

    el.innerHTML = itemStr;
    el.className = 'item';
    return el;
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addMarker(position, idx) {
    var imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png',
        imageSize = new kakao.maps.Size(36, 37),
        imgOptions = {
            spriteSize: new kakao.maps.Size(36, 691),
            spriteOrigin: new kakao.maps.Point(0, (idx * 46) + 10),
            offset: new kakao.maps.Point(13, 37)
        },
        markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize, imgOptions),
        marker = new kakao.maps.Marker({
            position: position,
            image: markerImage
        });

    marker.setMap(map);
    markers.push(marker);
    return marker;
}

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeMarker() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

// 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
function displayPagination(pagination) {
    var paginationEl = document.getElementById('pagination'),
        fragment = document.createDocumentFragment();

    while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild(paginationEl.lastChild);
    }

    for (var i = 1; i <= pagination.last; i++) {
        var el = document.createElement('a');
        el.href = "#";
        el.innerHTML = i;

        if (i === pagination.current) {
            el.className = 'on';
        } else {
            el.onclick = (function (i) {
                return function () {
                    pagination.gotoPage(i);
                }
            })(i);
        }
        fragment.appendChild(el);
    }
    paginationEl.appendChild(fragment);
}

// 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
function displayInfowindow(marker, title) {
    var content = '<div style="padding:5px;z-index:1;">' + title + '</div>';
    infowindow.setContent(content);
    infowindow.open(map, marker);
}

// 검색결과 목록의 자식 Element를 제거하는 함수입니다
function removeAllChildNods(el) {
    while (el.hasChildNodes()) {
        el.removeChild(el.lastChild);
    }
}

// 페이지 로드 후 기본 장소를 검색합니다
window.onload = function () {
    searchPlaces();
};