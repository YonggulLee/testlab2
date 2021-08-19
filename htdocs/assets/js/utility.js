// Utility Class & Function Here
// 화면을 리프레시 합니다.
function refreshData(seconds) {
  setTimeout(function () {
    location.reload();
  }, seconds * 1000);
}
// 날짜 데이터
function makeDateYYYYMMDDHHMM(timeStamp) {
  const year = timeStamp.getFullYear() + '.';
  const month = (timeStamp.getMonth() + 1 + '').padStart(2, '0') + '.';
  const date = (timeStamp.getDate() + '').padStart(2, '0') + ' ';
  const hours = (timeStamp.getHours() + '').padStart(2, '0') + ':';
  const mins = (timeStamp.getMinutes() + '').padStart(2, '0');
  const YYYYMMDDHHMM = year + month + date + hours + mins;
  return YYYYMMDDHHMM;
}
// 엑셀 다운로드
// 컬럼이 2+1(시간)인 데이터를 내보내기 위한 함수
function downlaodExcelTwoColumn(
  str_dataTitle,
  str_columnTitle01,
  str_columnTitle02,
  obj_data01,
  obj_data02
) {
  // 0. ArrayBuffer 만들어주는 함수 생성
  function s2ab(s) {
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf); //create uint8array as viewer
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
    return buf;
  }

  // 1. workbook 생성
  let wb = XLSX.utils.book_new();

  // 3. 문서 속성세팅 ( 윈도우에서 엑셀 오른쪽 클릭 속성 -> 자세히에 있는 값들 )
  // 필요 없으면 안써도 괜찮다.
  // wb.Props = {
  //   Title: 'title',
  //   Subject: 'subject',
  //   Author: 'programmer93',
  //   Manager: 'Manager',
  //   Company: 'Company',
  //   Category: 'Category',
  //   Keywords: 'Keywords',
  //   Comments: 'Comments',
  //   LastAuthor: 'programmer93',
  //   CreatedDate: new Date(),
  // };
  // 4. sheet명 생성
  wb.SheetNames.push(`${str_dataTitle} Data`);
  // 5. 데이터 어레이 생성
  let wsData = [];
  // 5.1 타이틀 어레이 생성
  const titleArray = [
    'dateTime',
    `${str_columnTitle01}`,
    `${str_columnTitle02}`,
  ];
  // 5.2 타이틀 어레이 푸시
  wsData[0] = titleArray;

  for (let i = 0; i < obj_data01.length; i++) {
    // 데이터 어레이를 생성한다
    let dataArray = [];
    // 타임 스템프 값을 가지고 온다
    let timestemp = obj_data01[i].ts;
    let date = new Date(timestemp);
    let dateTime =
      'Date: ' +
      date.getFullYear() +
      '/' +
      date.getMonth() +
      '/' +
      date.getDate() +
      '_' +
      date.getHours() +
      ':' +
      date.getMinutes() +
      ':' +
      date.getSeconds();
    dataArray[0] = dateTime;
    dataArray[1] = obj_data01[i].value;
    dataArray[2] = obj_data02[i].value;
    let e = i + 1;
    wsData[e] = dataArray;
  }

  // 배열 데이터로 시트 데이터 생성
  var ws = XLSX.utils.aoa_to_sheet(wsData);

  // 시트 데이터를 시트에 넣기 ( 시트 명이 없는 시트인경우 첫번째 시트에 데이터가 들어감 )
  wb.Sheets[`${str_dataTitle} Data`] = ws;

  // 엑셀 파일 쓰기
  var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

  //파일 다운로드
  saveAs(
    new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
    `${str_dataTitle} Data.xlsx`
  );
}
// 컬럼이 3+1(시간)인 데이터를 내보내기 위한 함수
function downlaodExcelThreeColumn(
  str_dataTitle,
  str_columnTitle01,
  str_columnTitle02,
  str_columnTitle03,
  obj_data01,
  obj_data02,
  obj_data03
) {
  // 0. ArrayBuffer 만들어주는 함수 생성
  function s2ab(s) {
    var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
    var view = new Uint8Array(buf); //create uint8array as viewer
    for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
    return buf;
  }

  // 1. workbook 생성
  let wb = XLSX.utils.book_new();

  // 3. 문서 속성세팅 ( 윈도우에서 엑셀 오른쪽 클릭 속성 -> 자세히에 있는 값들 )
  // 필요 없으면 안써도 괜찮다.
  // wb.Props = {
  //   Title: 'title',
  //   Subject: 'subject',
  //   Author: 'programmer93',
  //   Manager: 'Manager',
  //   Company: 'Company',
  //   Category: 'Category',
  //   Keywords: 'Keywords',
  //   Comments: 'Comments',
  //   LastAuthor: 'programmer93',
  //   CreatedDate: new Date(),
  // };
  // 4. sheet명 생성
  wb.SheetNames.push(`${str_dataTitle} Data`);
  // 5. 데이터 어레이 생성
  let wsData = [];
  // 5.1 타이틀 어레이 생성
  const titleArray = [
    'dateTime',
    `${str_columnTitle01}`,
    `${str_columnTitle02}`,
    `${str_columnTitle03}`,
  ];
  // 5.2 타이틀 어레이 푸시
  wsData[0] = titleArray;

  for (let i = 0; i < obj_data01.length; i++) {
    // 데이터 어레이를 생성한다
    let dataArray = [];
    // 타임 스템프 값을 가지고 온다
    let timestemp = obj_data01[i].ts;
    let date = new Date(timestemp);
    let dateTime =
      'Date: ' +
      date.getFullYear() +
      '/' +
      date.getMonth() +
      '/' +
      date.getDate() +
      '_' +
      date.getHours() +
      ':' +
      date.getMinutes() +
      ':' +
      date.getSeconds();
    dataArray[0] = dateTime;
    dataArray[1] = obj_data01[i].value;
    dataArray[2] = obj_data02[i].value;
    dataArray[3] = obj_data03[i].value;
    let e = i + 1;
    wsData[e] = dataArray;
  }

  // 배열 데이터로 시트 데이터 생성
  var ws = XLSX.utils.aoa_to_sheet(wsData);

  // 시트 데이터를 시트에 넣기 ( 시트 명이 없는 시트인경우 첫번째 시트에 데이터가 들어감 )
  wb.Sheets[`${str_dataTitle} Data`] = ws;

  // 엑셀 파일 쓰기
  var wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

  //파일 다운로드
  saveAs(
    new Blob([s2ab(wbout)], { type: 'application/octet-stream' }),
    `${str_dataTitle} Data.xlsx`
  );
}

// id : skec7@sk.com
// password : skec7@pw
