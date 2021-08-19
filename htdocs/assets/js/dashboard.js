//화면에 필요한 전역변수
//로그인 토큰
const userToken = localStorage.getItem('access_token');
//Farota Axios
const farota = getFarotaAxios();

//기기별 ID 값
const SENSOR_ID_NOISE_1 = 'e8a11380-bc2e-11eb-8551-4f4bb0e28011';
const SENSOR_ID_NOISE_2 = 'e8a11a40-e601-11eb-8e78-f7a9f6ae5a19';
const SENSOR_ID_DUST = 'c4cc4150-bc2e-11eb-8551-4f4bb0e28011';
const SENSOR_ID_VIBE = '26b984e0-b793-11eb-a7c7-c5ac42947b75';
const SENSOR_ID_WEATER = 'd737f5b0-b9da-11eb-a7c7-c5ac42947b75';
const SENSOR_ID_SPRIN = '446e8620-b923-11eb-a7c7-c5ac42947b75';
const SENSOR_ID_FIRE_1 = '6bf43210-e2f6-11eb-8692-193d8d39219e';
const SENSOR_ID_FIRE_2 = 'c8707450-e2f5-11eb-8692-193d8d39219e';
const SENSOR_ID_FIRE_3 = '72c11220-e2f6-11eb-8692-193d8d39219e';
const DEVICE_ID_BUZZ = 'f314d090-e2f3-11eb-8692-193d8d39219e';
const DEVICE_ID_TRENCH = '27351810-bd26-11eb-8551-4f4bb0e28011';
const DEVICE_ID_SPRIN_BIG = 'fd4dd1d0-c97e-11eb-8551-4f4bb0e28011';

//기기별 조회를 위한 API 호출을 위한 URL 생성
const URI_NOISE_1 = `/plugins/telemetry/DEVICE/${SENSOR_ID_NOISE_1}/values/timeseries`;
const URI_NOISE_2 = `/plugins/telemetry/DEVICE/${SENSOR_ID_NOISE_2}/values/timeseries`;
const URI_DUST = `/plugins/telemetry/DEVICE/${SENSOR_ID_DUST}/values/timeseries`;
const URI_VIBE = `/plugins/telemetry/DEVICE/${SENSOR_ID_VIBE}/values/timeseries`;
const URI_WEATHER = `/plugins/telemetry/DEVICE/${SENSOR_ID_WEATER}/values/timeseries`;
const URI_SPRINKLER = `/plugins/telemetry/DEVICE/${SENSOR_ID_SPRIN}/values/timeseries`;
const URI_SPRINKLER_BIG = `/plugins/telemetry/DEVICE/${DEVICE_ID_SPRIN_BIG}/values/timeseries`;
const URI_SPRINKLER_TRENCH = `/plugins/telemetry/DEVICE/${DEVICE_ID_TRENCH}/values/timeseries`;
const URI_FIRE_1 = `/plugins/telemetry/DEVICE/${SENSOR_ID_FIRE_1}/values/timeseries`;
const URI_FIRE_2 = `/plugins/telemetry/DEVICE/${SENSOR_ID_FIRE_2}/values/timeseries`;
const URI_FIRE_3 = `/plugins/telemetry/DEVICE/${SENSOR_ID_FIRE_3}/values/timeseries`;
const URI_SCHEDULER = '/scheduler';

//센서별 데이터 SET
let noise1 = null;
let noise2 = null;
let dust = null;
let vibe = null;
let weather = null;
let sprinkler = null;
let sprinklerBig = null;
let sprinklerTrench = null;
let fire1 = null;
let fire2 = null;
let fire3 = null;

// 로컬 스토리지 토큰 유무 체크
function checkToken() {
  const userToken = localStorage.getItem('access_token');

  if (userToken === undefined) {
    alert('로그인이 필요합니다');
    location.href = 'index.html';
  }
}
// 파로타 axios 인스턴스 생성
function getFarotaAxios() {
  const farota = axios.create({
    baseURL: 'https://dongsung.farota.com/api/',
    headers: { 'X-Authorization': 'Bearer ' + userToken },
  });
  return farota;
}

// 차트를 제외한 데이터 로딩
async function getData() {
  // 1. 로컬스토리지에 토큰이 있는제 체크합니다
  checkToken();
  // 2. 생성된 파로타 Axios 인스턴스를 활용해 비동기 통신으로 데이터를 가져옵니다
  const [
    { data: noise1Data },
    { data: noise2Data },
    { data: dustData },
    { data: vibeData },
    { data: weatherData },
    { data: sprinklerData },
    { data: sprinklerBigData },
    { data: sprinklerTrenchData },
    { data: fire1Data },
    { data: fire2Data },
    { data: fire3Data },
    { data: scheduleData },
  ] = await Promise.all([
    farota.get(URI_NOISE_1, { params: { keys: 'leq,lmax' } }),
    farota.get(URI_NOISE_2, { params: { keys: 'leq,lmax' } }),
    farota.get(URI_DUST, { params: { keys: 'finedust,ultraFinedust' } }),
    farota.get(URI_VIBE, { params: { keys: 'x_1,y_1,z_1' } }),
    farota.get(URI_WEATHER, {
      params: {
        keys: 'windDir,outTemp,outHumidity,radiation,uv,windSpeed,pressure,dayRain,hourRain',
      },
    }),
    farota.get(URI_SPRINKLER, {
      params: { keys: 'switch1,switch2,switch3,switch4,switch5,switch6' },
    }),
    farota.get(URI_SPRINKLER_BIG, {
      params: { keys: 'switch1,switch2,switch3,switch4' },
    }),
    farota.get(URI_SPRINKLER_TRENCH, {
      params: { keys: 'switch1_1,switch1_2' },
    }),
    farota.get(URI_FIRE_1, { params: { keys: 'state' } }),
    farota.get(URI_FIRE_2, { params: { keys: 'state' } }),
    farota.get(URI_FIRE_3, { params: { keys: 'state' } }),
    farota.get(URI_SCHEDULER),
  ]);
  //3. 센서별 데이터 Set을 저장할 변수들에 데이터를 저장합니다
  noise1 = noise1Data;
  noise2 = noise2Data;
  dust = dustData;
  vibe = vibeData;
  weather = weatherData;
  sprinkler = sprinklerData;
  sprinklerBig = sprinklerBigData;
  sprinklerTrench = sprinklerTrenchData;
  fire1 = fire1Data;
  fire2 = fire2Data;
  fire3 = fire3Data;
  schedule = scheduleData.result;
}
// 차트를 제외한 데이터 세팅
function setCurrentData() {
  // 소음센서1
  document.querySelector('#noise1-leq').innerText = noise1.leq[0].value;
  document.querySelector('#noise1-lmax').innerText = noise1.lmax[0].value;

  // 소음센서1
  document.querySelector('#noise2-leq').innerText = noise2.leq[0].value;
  document.querySelector('#noise2-lmax').innerText = noise2.lmax[0].value;

  // 미세먼지
  document.querySelector('#dust-ultra').innerText = dust.ultraFinedust[0].value;
  document.querySelector('#dust-fine').innerText = dust.finedust[0].value;

  // 진동센서 1
  document.querySelector('#vibe-x1').innerText = vibe.x_1[0].value;
  document.querySelector('#vibe-y1').innerText = vibe.y_1[0].value;
  document.querySelector('#vibe-z1').innerText = vibe.z_1[0].value;

  let innerCheck = '<i class="fas fa-check-circle"></i> 정상';
  let innerCross = '<i class="fas fa-times-circle"></i> 비정상';

  const fireElem1 = document.querySelector('#fire-1');
  const fireElem2 = document.querySelector('#fire-2');
  const fireElem3 = document.querySelector('#fire-3');

  if (fire1.state[0].value == 0) {
    fireElem1.innerHTML = innerCheck;
  } else {
    fireElem1.innerHTML = innerCross;
    fireElem1.classList.add('bad');
  }

  if (fire2.state[0].value == 0) {
    fireElem2.innerHTML = innerCheck;
  } else {
    fireElem2.innerHTML = innerCross;
    fireElem2.classList.add('bad');
  }

  if (fire3.state[0].value == 0) {
    fireElem3.innerHTML = innerCheck;
  } else {
    fireElem3.innerHTML = innerCross;
    fireElem3.classList.add('bad');
  }

  // 기상대 풍향
  let windDirValue = weather.windDir[0].value;
  windDirValue = Number(windDirValue);
  if (
    (337.5 < windDirValue && windDirValue <= 360) ||
    (0 < windDirValue && windDirValue <= 22.5)
  ) {
    document.querySelector('#windDir').src = 'assets/img/windDirNN.png';
  } else if (22.5 < windDirValue && windDirValue <= 67.5) {
    document.querySelector('#windDir').src = 'assets/img/windDirNE.png';
  } else if (67.5 < windDirValue && windDirValue <= 112.5) {
    document.querySelector('#windDir').src = 'assets/img/windDirEE.png';
  } else if (112.5 < windDirValue && windDirValue <= 157.5) {
    document.querySelector('#windDir').src = 'assets/img/windDirSE.png';
  } else if (157.5 < windDirValue && windDirValue <= 202.5) {
    document.querySelector('#windDir').src = 'assets/img/windDirSS.png';
  } else if (202.5 < windDirValue && windDirValue <= 247.5) {
    document.querySelector('#windDir').src = 'assets/img/windDirSW.png';
  } else if (247.5 < windDirValue && windDirValue <= 292.5) {
    document.querySelector('#windDir').src = 'assets/img/windDirWW.png';
  } else {
    document.querySelector('#windDir').src = 'assets/img/windDirNW.png';
  }

  //기상대 나머지 데이터
  document.querySelector('#weather-temp').innerText = Number(
    weather.outTemp[0].value
  ).toFixed(2);
  document.querySelector('#weather-humid').innerText = Number(
    weather.outHumidity[0].value
  ).toFixed(1);
  document.querySelector('#weather-pressure').innerText = Number(
    weather.pressure[0].value
  ).toFixed(2);
  document.querySelector('#weather-uv').innerText = Number(
    weather.uv[0].value
  ).toFixed(2);
  document.querySelector('#weather-rain-day').innerText = Number(
    weather.dayRain[0].value
  ).toFixed(2);
  document.querySelector('#weather-rain-hour').innerText = Number(
    weather.hourRain[0].value
  ).toFixed(2);
  document.querySelector('#weather-rad').innerText = Number(
    weather.radiation[0].value
  ).toFixed(0);
  document.querySelector('#weather-windspeed').innerText = Number(
    weather.windSpeed[0].value
  ).toFixed(2);

  // 스프링클러
  for (let i = 1; i - 1 < sprinkler.length; i++) {
    if (sprinkler.switch1[0].value == '1') {
      document.querySelector('#sprinkler-1').innerText = '작동중';
      document
        .querySelector(`#sprinkler-${i}`)
        .classList.replace('sprinkler-status-off', 'sprinkler-status-on');
    } else {
      document.querySelector('#sprinkler-1').innerText = '꺼짐';
      document
        .querySelector(`#sprinkler-${i}`)
        .classList.replace('sprinkler-status-on', 'sprinkler-status-off');
    }
  }

  // 대형 스프링클러
  document.querySelector('#pump-toggle').innerText =
    sprinklerBig.switch1[0].value == '1' ? 'ON' : 'OFF';
  document.querySelector('#swing-toggle').innerText =
    sprinklerBig.switch2[0].value == '1' ? 'ON' : 'OFF';
  document.querySelector('#lift-toggle').innerText =
    sprinklerBig.switch3[0].value == '1' ? 'ON' : 'OFF';
  // document.querySelector("#sprinkler-5").innerText =
  //   sprinkler.switch5[0].value == "1" ? "작동중" : "꺼짐";
  // document.querySelector("#sprinkler-6").innerText =
  //   sprinkler.switch6[0].value == "1" ? "작동중" : "꺼짐";

  // 게이트 살수
  document.querySelector('#trench-out').innerText =
    sprinklerTrench.switch1_1[0].value == '1' ? '켜짐' : '꺼짐';
  document.querySelector('#trench-in').innerText =
    sprinklerTrench.switch1_2[0].value == '1' ? '켜짐' : '꺼짐';
}

// 차트 관련 변수 & 메소드
// 데이터 로딩
let noise1ChartData = null;
let noise2ChartData = null;
let dustChartData = null;
let vibeChartData = null;

// 차트 개별 데이터
let noise1Leq = null;
let noise1Lmax = null;
let noise2Leq = null;
let noise2Lmax = null;
let finedust = null;
let ultrafinedust = null;
let x = null;
let y = null;
let z = null;

// 차트 리버스 데이터
let noise1LeqReverse = null;
let noise1LmaxReverse = null;
let noise2LeqReverse = null;
let noise2LmaxReverse = null;
let finedustReverse = null;
let ultraFinedustReverse = null;
let xReverse = null;
let yReverse = null;
let zReverse = null;

// 각가의 차트를 담을 변수 선언
let charTempNoise1 = null;
let charTempNoise2 = null;
let charTempDust = null;
let charTempVibe = null;

// 차트 데이터 로딩
async function getChartData() {
  // 1. 토큰을 체크합니다
  checkToken();
  // 2. 데이터 조회를 위해 24시간 전에 타임스템프를 생성합니다
  let now = new Date();
  const endTs = now.getTime();
  now.setHours(now.getHours() - 24);
  const startTs = now.getTime();
  // 3. 차트에 활용할 데이터들을 Farota Axios 인스턴스를 통한 통신으로 받아옵니다.
  const [{ data: noise1 }, { data: noise2 }, { data: dust }, { data: vibe }] =
    await Promise.all([
      farota.get(URI_NOISE_1, {
        params: { startTs, endTs, limit: 1000, keys: 'leq,lmax' },
      }),
      farota.get(URI_NOISE_2, {
        params: { startTs, endTs, limit: 1000, keys: 'leq,lmax' },
      }),
      farota.get(URI_DUST, {
        params: {
          startTs,
          endTs,
          limit: 2000,
          keys: 'finedust,ultraFinedust',
        },
      }),
      farota.get(URI_VIBE, {
        params: {
          startTs,
          endTs,
          limit: 1000,
          keys: 'x_1,y_1,z_1',
        },
      }),
    ]);
  // 4. 받아온 데이터를 Chart DataSet을 저장할 변수에 저장합니다.
  noise1ChartData = noise1;
  noise2ChartData = noise2;
  dustChartData = dust;
  vibeChartData = vibe;
}
// 배열 안에 있는 데이터의 평균값을 계산
function calculateAverageValue(dataArray) {
  let sum = 0;
  let average = 0;
  for (let i = 0; i < dataArray.length; i++) {
    sum = sum + Number(dataArray[i].value);
  }
  average = sum / dataArray.length;
  average = average.toFixed(2);
  return average;
}
// 차트 엘레먼트 가져오기

function getChartElement(strElementId, strChartType) {
  const chartElemant = document
    .getElementById(strElementId)
    .getContext(strChartType);
  return chartElemant;
}
// 차트 범례에 평균값을 세팅
function setChartAverageData() {
  // 소음 차트
  const averageLeq1 = calculateAverageValue(noise1.leq);
  document.querySelector('#noiseChart1LeqAverage').innerText = averageLeq1;
  const averagelmax1 = calculateAverageValue(noise1.lmax);
  document.querySelector('#noiseChart1LmaxAverage').innerText = averagelmax1;
  const averageLeq2 = calculateAverageValue(noise2.leq);
  document.querySelector('#noiseChart2LeqAverage').innerText = averageLeq2;
  const averagelmax2 = calculateAverageValue(noise2.lmax);
  document.querySelector('#noiseChart2LmaxAverage').innerText = averagelmax2;

  // 미세먼지 차트
  const averageuUltraFinedust = calculateAverageValue(dust.ultraFinedust);
  document.querySelector('#dustChartUFDustAverage').innerText =
    averageuUltraFinedust;
  const averageFinedust = calculateAverageValue(dust.finedust);
  document.querySelector('#dustChartFDustAverage').innerText = averageFinedust;

  //진동센서 차트
  const averageX_1 = calculateAverageValue(vibe.x_1);
  document.querySelector('#vibeCart1XAverage').innerText = averageX_1;
  const averageY_1 = calculateAverageValue(vibe.y_1);
  document.querySelector('#vibeCart1YAverage').innerText = averageY_1;
  const averageZ_1 = calculateAverageValue(vibe.z_1);
  document.querySelector('#vibeCart1ZAverage').innerText = averageZ_1;
}
// 차트 가이드라인 배열 생성
function getGuideLineArray(numGuidePoint, objOriginData) {
  const guideLineArr = new Array(objOriginData.lmax.length);
  for (let i = 0; i < guideLineArr.length; i++) {
    guideLineArr[i] = numGuidePoint;
  }
  return guideLineArr;
}
// 배열 순서를 거꾸로 변경
function reverseArrayOrder(targetArray) {
  let reverseArray = [];
  for (let i = targetArray.length - 1; i >= 0; i--) {
    reverseArray.push(targetArray[i]);
  }
  return reverseArray;
}

// 2라인 차트를 생성합니다.
function creatTwoLineChart(
  dom_elemntOfChart,
  str_ChartType,
  obj_chartData1,
  obj_chartData2,
  obj_guideLineArray,
  str_legend1,
  str_legend2
) {
  //check order
  // let lastTime = obj_chartData1.map(({ ts }) => {
  //   let timeA = new Date(ts);
  //   const yearA = '' + timeA.getFullYear();
  //   const monthA = '' + timeA.getMonth();
  //   const dateA = '' + timeA.getDate();
  //   const hoursA = '' + timeA.getHours();
  //   const minsA = '' + timeA.getMinutes();
  //   return (
  //     yearA +
  //     '.' +
  //     monthA.padStart(2, '0') +
  //     '.' +
  //     dateA.padStart(2, '0') +
  //     '_' +
  //     hoursA.padStart(2, '0') +
  //     ':' +
  //     minsA.padStart(2, '0')
  //   );
  // });
  // console.log(lastTime);

  // charTempNoise1 = new Chart(noiseChart1, {
  if (obj_guideLineArray == null) {
    chart = new Chart(dom_elemntOfChart, {
      type: str_ChartType,
      data: {
        labels: obj_chartData1.map(({ ts }) => {
          let time = new Date(ts);
          // const year = '' + time.getFullYear();
          // const month = '' + time.getMonth();
          const day = '' + time.getDate();
          const hours = '' + time.getHours();
          const mins = '' + time.getMinutes();
          return (
            // year +
            // '.' +
            // month.padStart(2, '0') +
            // '.' +
            day.padStart(2, '0') +
            '_' +
            hours.padStart(2, '0') +
            ':' +
            mins.padStart(2, '0')
          );
        }),
        datasets: [
          {
            label: str_legend1,
            data: obj_chartData1.map(({ value }) => value),
            backgroundColor: ['#4ED139'],
            borderColor: ['#4ED139'],
          },
          {
            label: str_legend2,
            data: obj_chartData2.map(({ value }) => value),
            backgroundColor: ['#289CF4'],
            borderColor: ['#289CF4'],
          },
        ],
      },
      options: {
        borderWidth: 2,
        elements: {
          point: {
            pointStyle: 'line',
            hoverBorderWidth: 0,
            borderWidth: 0,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 20,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  } else {
    chart = new Chart(dom_elemntOfChart, {
      type: str_ChartType,
      data: {
        labels: obj_chartData1.map(({ ts }) => {
          let time = new Date(ts);
          // const year = '' + time.getFullYear();
          // const month = '' + time.getMonth();
          const day = '' + time.getDate();
          const hours = '' + time.getHours();
          const mins = '' + time.getMinutes();
          return (
            // year +
            // '.' +
            // month.padStart(2, '0') +
            // '.' +
            day.padStart(2, '0') +
            '_' +
            hours.padStart(2, '0') +
            ':' +
            mins.padStart(2, '0')
          );
        }),
        datasets: [
          {
            label: str_legend1,
            data: obj_chartData1.map(({ value }) => value),
            backgroundColor: ['#4ED139'],
            borderColor: ['#4ED139'],
          },
          {
            label: str_legend2,
            data: obj_chartData2.map(({ value }) => value),
            backgroundColor: ['#289CF4'],
            borderColor: ['#289CF4'],
          },
          {
            label: 'guideLine',
            data: obj_guideLineArray,
            backgroundColor: ['red'],
            borderColor: ['red'],
          },
        ],
      },
      options: {
        borderWidth: 2,
        elements: {
          point: {
            pointStyle: 'line',
            hoverBorderWidth: 0,
            borderWidth: 0,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 20,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  return chart;
}
// 3라인 차트를 생성합니다
function creatThreeLineChart(
  dom_elemntOfChart,
  str_ChartType,
  obj_chartData1,
  obj_chartData2,
  obj_chartData3,
  obj_guideLineArray,
  str_legend1,
  str_legend2,
  str_legend3
) {
  // charTempNoise1 = new Chart(noiseChart1, {
  //check order
  // let lastTime = obj_chartData1.map(({ ts }) => {
  //   let timeA = new Date(ts);
  //   const yearA = '' + timeA.getFullYear();
  //   const monthA = '' + timeA.getMonth();
  //   const dateA = '' + timeA.getDate();
  //   const hoursA = '' + timeA.getHours();
  //   const minsA = '' + timeA.getMinutes();
  //   return (
  //     yearA +
  //     '.' +
  //     monthA.padStart(2, '0') +
  //     '.' +
  //     dateA.padStart(2, '0') +
  //     '_' +
  //     hoursA.padStart(2, '0') +
  //     ':' +
  //     minsA.padStart(2, '0')
  //   );
  // });
  // console.log(lastTime);
  if (obj_guideLineArray == null) {
    chart = new Chart(dom_elemntOfChart, {
      type: str_ChartType,
      data: {
        labels: obj_chartData1.map(({ ts }) => {
          let time = new Date(ts);
          const day = '' + time.getDate();
          const hours = '' + time.getHours();
          const mins = '' + time.getMinutes();
          return (
            day.padStart(2, '0') +
            '_' +
            hours.padStart(2, '0') +
            ':' +
            mins.padStart(2, '0')
          );
        }),
        datasets: [
          {
            label: str_legend1,
            data: obj_chartData1.map(({ value }) => value),
            backgroundColor: ['#4ED139'],
            borderColor: ['#4ED139'],
          },
          {
            label: str_legend2,
            data: obj_chartData2.map(({ value }) => value),
            backgroundColor: ['#289CF4'],
            borderColor: ['#289CF4'],
          },
          {
            label: str_legend3,
            data: obj_chartData3.map(({ value }) => value),
            backgroundColor: ['#FDCA58'],
            borderColor: ['#FDCA58'],
          },
        ],
      },
      options: {
        borderWidth: 2,
        elements: {
          point: {
            pointStyle: 'line',
            hoverBorderWidth: 0,
            borderWidth: 0,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 20,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  } else {
    chart = new Chart(dom_elemntOfChart, {
      type: str_ChartType,
      data: {
        labels: obj_chartData1.map(({ ts }) => {
          let time = new Date(ts);
          const day = '' + time.getDate();
          const hours = '' + time.getHours();
          const mins = '' + time.getMinutes();
          return (
            day.padStart(2, '0') +
            '_' +
            hours.padStart(2, '0') +
            ':' +
            mins.padStart(2, '0')
          );
        }),
        datasets: [
          {
            label: str_legend1,
            data: obj_chartData1.map(({ value }) => value),
            backgroundColor: ['#4ED139'],
            borderColor: ['#4ED139'],
          },
          {
            label: str_legend2,
            data: obj_chartData2.map(({ value }) => value),
            backgroundColor: ['#289CF4'],
            borderColor: ['#289CF4'],
          },
          {
            label: str_legend3,
            data: obj_chartData3.map(({ value }) => value),
            backgroundColor: ['#FDCA58'],
            borderColor: ['#FDCA58'],
          },
          {
            label: 'guideLine',
            data: obj_guideLineArray,
            backgroundColor: ['red'],
            borderColor: ['red'],
          },
        ],
      },
      options: {
        borderWidth: 2,
        elements: {
          point: {
            pointStyle: 'line',
            hoverBorderWidth: 0,
            borderWidth: 0,
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 20,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    });
  }

  return chart;
}

// 2라인 차트를 업데이트 합니다
function updateTwoLineChart(charTemp, obj_chartData1, obj_chartData2) {
  charTemp.data.datasets.data = obj_chartData1.map(({ value }) => value);
  charTemp.data.datasets.data = obj_chartData2.map(({ value }) => value);
  // console.log('chart update!');
  return chart;
}
// 3라인 차트를 업데이트 합니다
function updateThreeLineChart(
  charTemp,
  obj_chartData1,
  obj_chartData2,
  obj_chartData3
) {
  charTemp.data.datasets.data = obj_chartData1.map(({ value }) => value);
  charTemp.data.datasets.data = obj_chartData2.map(({ value }) => value);
  charTemp.data.datasets.data = obj_chartData3.map(({ value }) => value);
  // console.log('chart update!');
  return chart;
}

// 타임스템프에서 시간을 가져옵니다
function getTimeFromTs(timestemp) {
  let targetTimeStamp = timestemp;
  let date = new Data(targetTimeStamp);
  return date.getTime();
}

// 화면 초기화
window.addEventListener('DOMContentLoaded', async function () {
  if (userToken === undefined) {
    alert('로그인이 필요합니다');
    location.href = 'index.html';
  }

  const farota = getFarotaAxios();
  // 서버에서 돔요소가 로딩되는 시점에 최초의 데이터를 로딩합니다
  await getData();
  // 차트를 제외한 데이터들을 삽압합니다
  setCurrentData();

  // Chart 그리기
  {
    // 차트 데이들을 서버에서 불럽옵니다
    await getChartData();
    // 차트 엘리먼트 가져오기
    const noiseChart1 = getChartElement('noiseChart1', '2d');
    const noiseChart2 = getChartElement('noiseChart2', '2d');
    const dustChart = getChartElement('dustChart', '2d');
    const vibeChart = getChartElement('vibeChart', '2d');

    // 전체 Chart 범례 평균값 세팅
    setChartAverageData();

    //70 dB 가이드라인 표시를 위한 배열
    const noise1GuideLineArr = getGuideLineArray(70, noise1ChartData);
    const noise2GuideLineArr = getGuideLineArray(70, noise2ChartData);

    // API에서 꺼꾸로 넘어오고 있는 데이터의 순서 반전
    noise1Leq = noise1ChartData.leq;
    noise1LeqReverse = reverseArrayOrder(noise1Leq);

    noise1Lmax = noise1ChartData.lmax;
    noise1LmaxReverse = reverseArrayOrder(noise1Lmax);

    noise2Leq = noise2ChartData.leq;
    noise2LeqReverse = reverseArrayOrder(noise2Leq);

    noise2Lmax = noise2ChartData.lmax;
    noise2LmaxReverse = reverseArrayOrder(noise2Lmax);

    // 노이즈 1 차트 생성
    charTempNoise1 = creatTwoLineChart(
      noiseChart1,
      'line',
      noise1LeqReverse,
      noise1LmaxReverse,
      noise1GuideLineArr,
      'leq',
      'lmax'
    );

    // 노이즈 2 차트 생성
    charTempNoise2 = creatTwoLineChart(
      noiseChart2,
      'line',
      noise2LeqReverse,
      noise2LmaxReverse,
      noise2GuideLineArr,
      'leq',
      'lmax'
    );

    // API에서 꺼꾸로 넘어오고 있는 데이터의 순서 반전
    finedust = dustChartData.finedust;
    finedustReverse = reverseArrayOrder(finedust);

    ultrafinedust = dustChartData.ultraFinedust;
    ultraFinedustReverse = reverseArrayOrder(ultrafinedust);

    // 미세먼지 차트 생성
    charTempDust = creatTwoLineChart(
      dustChart,
      'line',
      finedustReverse,
      ultraFinedustReverse,
      '2.5pm',
      '10pm'
    );

    // // API에서 꺼꾸로 넘어오고 있는 데이터의 순서 반전
    // x = vibeChartData.x_1;
    // xReverse = reverseArrayOrder(x);
    // y = vibeChartData.y_1;
    // yReverse = reverseArrayOrder(y);
    // z = vibeChartData.z_1;
    // zReverse = reverseArrayOrder(z);

    // charTempVibe = creatThreeLineChart(
    //   vibeChart,
    //   'line',
    //   xReverse,
    //   yReverse,
    //   zReverse,
    //   'x',
    //   'y',
    //   'z'
    // );
  }

  // RPC Call
  {
    const sprinklerCtrl = async (valveNo, onOff) => {
      const body = {
        method: 'setOnOff',
        params: { valveNo, onOff: onOff ? 1 : 0 },
      };

      await farota.post(`/plugins/rpc/oneway/${SENSOR_ID_SPRIN}`, body);

      document.querySelector('#sprinkler-' + valveNo).innerText =
        onOff == '1' ? '켜짐' : '꺼짐';
      console.log(body);
    };

    document
      .querySelector('#ctrl-1 .sprinkler-btn-on')
      .addEventListener('click', () => {
        sprinklerCtrl(1, true);
      });
    document
      .querySelector('#ctrl-1 .sprinkler-btn-off')
      .addEventListener('click', () => {
        sprinklerCtrl(1, false);
      });
    document
      .querySelector('#ctrl-2 .sprinkler-btn-on')
      .addEventListener('click', () => {
        sprinklerCtrl(2, true);
      });
    document
      .querySelector('#ctrl-2 .sprinkler-btn-off')
      .addEventListener('click', () => {
        sprinklerCtrl(2, false);
      });
    document
      .querySelector('#ctrl-3 .sprinkler-btn-on')
      .addEventListener('click', () => {
        sprinklerCtrl(3, true);
      });
    document
      .querySelector('#ctrl-3 .sprinkler-btn-off')
      .addEventListener('click', () => {
        sprinklerCtrl(3, false);
      });
    document
      .querySelector('#ctrl-4 .sprinkler-btn-on')
      .addEventListener('click', () => {
        sprinklerCtrl(4, true);
      });
    document
      .querySelector('#ctrl-4 .sprinkler-btn-off')
      .addEventListener('click', () => {
        sprinklerCtrl(4, false);
      });
    document
      .querySelector('#ctrl-5 .sprinkler-btn-on')
      .addEventListener('click', () => {
        sprinklerCtrl(5, true);
      });
    document
      .querySelector('#ctrl-5 .sprinkler-btn-off')
      .addEventListener('click', () => {
        sprinklerCtrl(5, false);
      });
    document
      .querySelector('#ctrl-6 .sprinkler-btn-on')
      .addEventListener('click', () => {
        sprinklerCtrl(6, true);
      });
    document
      .querySelector('#ctrl-6 .sprinkler-btn-off')
      .addEventListener('click', () => {
        sprinklerCtrl(6, false);
      });
    document.querySelector('#alarm-1').addEventListener('click', () => {
      farota.post(`/plugins/rpc/oneway/${DEVICE_ID_BUZZ}`, {
        method: 'setOnOff',
        params: { valveNo: 1, onOff: 1 },
      });
    });
    document.querySelector('#alarm-2').addEventListener('click', () => {
      farota.post(`/plugins/rpc/oneway/${DEVICE_ID_BUZZ}`, {
        method: 'setOnOff',
        params: { valveNo: 2, onOff: 1 },
      });
    });
    document.querySelector('#alarm-3').addEventListener('click', () => {
      farota.post(`/plugins/rpc/oneway/${DEVICE_ID_BUZZ}`, {
        method: 'setOnOff',
        params: { valveNo: 3, onOff: 1 },
      });
    });
    document.querySelector('#alarm-4').addEventListener('click', () => {
      farota.post(`/plugins/rpc/oneway/${DEVICE_ID_BUZZ}`, {
        method: 'setOnOff',
        params: { valveNo: 4, onOff: 1 },
      });
    });

    // 대형 살수기 펌프 on/off
    const BigSpringklerPumpBtn = document.querySelector(
      '.big-sprinkler #pump-toggle'
    );
    BigSpringklerPumpBtn.addEventListener('click', () => {
      let className = BigSpringklerPumpBtn.className;
      switch (className) {
        case 'sprinkler-btn-on':
          BigSpringklerPumpBtn.className = 'sprinkler-btn-off';
          BigSpringklerPumpBtn.innerHTML = 'OFF';
          farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
            method: 'setOnOff',
            params: { onOff: 0, valveNo: 1, switchNo: 2 },
          });
          break;
        case 'sprinkler-btn-off':
          BigSpringklerPumpBtn.className = 'sprinkler-btn-on';
          BigSpringklerPumpBtn.innerHTML = 'ON';
          farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
            method: 'setOnOff',
            params: { onOff: 1, valveNo: 1, switchNo: 2 },
          });
          break;
        default:
      }
    });

    // document
    //   .querySelector(".big-sprinkler #pump-off")
    //   .addEventListener("click", () => {
    //     farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
    //       method: "setOnOff",
    //       params: { onOff: 0, valveNo: 1, switchNo: 2 }
    //     });
    //     document.querySelector(".big-sprinkler-status").innerText = "꺼짐";
    //   });
    // document
    //   .querySelector(".big-sprinkler #pump-on")
    //   .addEventListener("click", () => {
    //     farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
    //       method: "setOnOff",
    //       params: { onOff: 1, valveNo: 1, switchNo: 2 }
    //     });
    //     document.querySelector(".big-sprinkler-status").innerText = "켜짐";
    //   });

    // 대형 살수기 스윙 on/off
    const BigSpringklerSwingBtn = document.querySelector(
      '.big-sprinkler #swing-toggle'
    );
    BigSpringklerSwingBtn.addEventListener('click', () => {
      let className = BigSpringklerSwingBtn.className;
      switch (className) {
        case 'sprinkler-btn-on':
          BigSpringklerSwingBtn.className = 'sprinkler-btn-off';
          BigSpringklerSwingBtn.innerHTML = 'OFF';
          farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
            method: 'setOnOff',
            params: { onOff: 0, valveNo: 1, switchNo: 4 },
          });
          break;
        case 'sprinkler-btn-off':
          BigSpringklerSwingBtn.className = 'sprinkler-btn-on';
          BigSpringklerSwingBtn.innerHTML = 'ON';
          farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
            method: 'setOnOff',
            params: { onOff: 1, valveNo: 1, switchNo: 4 },
          });
          break;
        default:
      }
    });
    // document
    //   .querySelector(".big-sprinkler #swing-off")
    //   .addEventListener("click", () => {
    //     farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
    //       method: "setOnOff",
    //       params: { onOff: 0, valveNo: 1, switchNo: 4 }
    //     });
    //   });
    // document
    //   .querySelector(".big-sprinkler #swing-on")
    //   .addEventListener("click", () => {
    //     farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
    //       method: "setOnOff",
    //       params: { onOff: 1, valveNo: 1, switchNo: 4 }
    //     });
    //   });

    // 대형 살수기 리프트 on/off
    const BigSpringklerLiftBtn = document.querySelector(
      '.big-sprinkler #lift-toggle'
    );
    BigSpringklerLiftBtn.addEventListener('click', () => {
      let className = BigSpringklerLiftBtn.className;
      switch (className) {
        case 'sprinkler-btn-on':
          BigSpringklerLiftBtn.className = 'sprinkler-btn-off';
          BigSpringklerLiftBtn.innerHTML = 'OFF';
          farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
            method: 'setOnOff',
            params: { onOff: 0, valveNo: 1, switchNo: 3 },
          });
          break;
        case 'sprinkler-btn-off':
          BigSpringklerLiftBtn.className = 'sprinkler-btn-on';
          BigSpringklerLiftBtn.innerHTML = 'ON';
          farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
            method: 'setOnOff',
            params: { onOff: 1, valveNo: 1, switchNo: 3 },
          });
          break;
        default:
      }
    });
    // document
    //   .querySelector(".big-sprinkler #lift-off")
    //   .addEventListener("click", () => {
    //     farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
    //       method: "setOnOff",
    //       params: { onOff: 0, valveNo: 1, switchNo: 3 }
    //     });
    //   });
    // document
    //   .querySelector(".big-sprinkler #lift-on")
    //   .addEventListener("click", () => {
    //     farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
    //       method: "setOnOff",
    //       params: { onOff: 1, valveNo: 1, switchNo: 3 }
    //     });
    //   });

    // 게이트 외부 살수 on/off
    document.querySelector('#trench-out-off').addEventListener('click', () => {
      farota.post(`/plugins/rpc/oneway/${DEVICE_ID_TRENCH}`, {
        method: 'setOnOff',
        params: { onOff: 0, valveNo: 1, switchNo: 1 },
      });
      document.querySelector('#trench-out').innerText = '꺼짐';
    });
    document.querySelector('#trench-out-on').addEventListener('click', () => {
      farota.post(`/plugins/rpc/oneway/${DEVICE_ID_TRENCH}`, {
        method: 'setOnOff',
        params: { onOff: 1, valveNo: 1, switchNo: 1 },
      });
      document.querySelector('#trench-out').innerText = '켜짐';
    });

    // 게이트 내부 살수 on/off
    document.querySelector('#trench-in-off').addEventListener('click', () => {
      farota.post(`/plugins/rpc/oneway/${DEVICE_ID_TRENCH}`, {
        method: 'setOnOff',
        params: { onOff: 0, valveNo: 1, switchNo: 2 },
      });
      document.querySelector('#trench-in').innerText = '꺼짐';
    });
    document.querySelector('#trench-in-on').addEventListener('click', () => {
      farota.post(`/plugins/rpc/oneway/${DEVICE_ID_TRENCH}`, {
        method: 'setOnOff',
        params: { onOff: 1, valveNo: 1, switchNo: 2 },
      });
      document.querySelector('#trench-in').innerText = '켜짐';
    });
  }

  // 스케줄러 설정
  {
    const slct = document.querySelector('#preset-list');
    const btn_start = document.querySelector('.preset-start');
    const btn_stop = document.querySelector('.preset-stop');

    for (const {
      scheduler_idx: _idx,
      scheduler_name: _name,
      status,
    } of schedule) {
      const _elem = document.createElement('option');
      _elem.value = _idx;
      _elem.innerText = _name;
      _elem.selected = status === '10';
      slct.appendChild(_elem);
    }

    /**
     * 진행 상태에 따라서 <select>를 disable 시키고 시작/종료 <button>을 감춘다.
     * @param {Bolean} on 진행중인 스케줄 유무
     */
    const toggleElements = (on) => {
      btn_start.style.display = on ? 'none' : '';
      btn_stop.style.display = on ? '' : 'none';
      slct.disabled = on;
    };

    toggleElements(slct.value);

    btn_start.addEventListener('click', async () => {
      const _idx = slct.value;
      if (_idx.length == 0) return;
      await farota.post(`/scheduler/${_idx}/status`, { status: '10' });
      toggleElements(true);
    });
    btn_stop.addEventListener('click', async () => {
      const _idx = slct.value;
      await farota.post(`/scheduler/${_idx}/status`, { status: '00' });
      toggleElements(false);
    });
  }
});

// 화면 비동기 리프레시
setInterval(async function () {
  if (userToken === undefined) {
    alert('로그인이 필요합니다');
    location.href = 'index.html';
  }

  const farota = getFarotaAxios();
  // 서버에서 돔요소가 로딩되는 시점에 최초의 데이터를 로딩합니다
  await getData();
  // 차트를 제외한 데이터들을 삽압합니다
  setCurrentData();

  // Chart 그리기
  {
    // 차트 데이들을 서버에서 불럽옵니다
    await getChartData();

    // 전체 Chart 범례 평균값 세팅
    setChartAverageData();

    // Noise Chart
    // API에서 꺼꾸로 넘어오고 있는 데이터의 순서 반전
    noise1Leq = noise1ChartData.leq;
    noise1LeqReverse = reverseArrayOrder(noise1Leq);

    noise1Lmax = noise1ChartData.lmax;
    noise1LmaxReverse = reverseArrayOrder(noise1Lmax);

    noise2Leq = noise2ChartData.leq;
    noise2LeqReverse = reverseArrayOrder(noise2Leq);

    noise2Lmax = noise2ChartData.lmax;
    noise2LmaxReverse = reverseArrayOrder(noise2Lmax);

    // 노이즈 1 차트 업데이트
    charTempNoise1 = updateTwoLineChart(
      charTempNoise1,
      noise1LeqReverse,
      noise1LmaxReverse
    );

    // 노이즈 2 차트 생성
    charTempNoise2 = updateTwoLineChart(
      charTempNoise2,
      noise2LeqReverse,
      noise2LmaxReverse
    );

    // Dust Chart
    // API에서 꺼꾸로 넘어오고 있는 데이터의 순서 반전
    finedust = dustChartData.finedust;
    finedustReverse = reverseArrayOrder(finedust);

    ultrafinedust = dustChartData.ultraFinedust;
    ultraFinedustReverse = reverseArrayOrder(ultrafinedust);

    // 더스트 차트 업데이트
    charTempDust = updateTwoLineChart(
      charTempDust,
      finedustReverse,
      ultraFinedustReverse
    );

    // Vibe Chart
    // API에서 꺼꾸로 넘어오고 있는 데이터의 순서 반전
    // x = vibeChartData.x_1;
    // xReverse = reverseArrayOrder(x);
    // y = vibeChartData.y_1;
    // yReverse = reverseArrayOrder(y);
    // z = vibeChartData.z_1;
    // zReverse = reverseArrayOrder(z);

    // // 진동 차트 업데이트
    // charTempVibe = updateTwoLineChart(
    //   charTempVibe,
    //   xReverse,
    //   yReverse,
    //   zReverse
    // );
  }

  // RPC Call
  {
    const sprinklerCtrl = async (valveNo, onOff) => {
      const body = {
        method: 'setOnOff',
        params: { valveNo, onOff: onOff ? 1 : 0 },
      };

      await farota.post(`/plugins/rpc/oneway/${SENSOR_ID_SPRIN}`, body);

      document.querySelector('#sprinkler-' + valveNo).innerText =
        onOff == '1' ? '켜짐' : '꺼짐';
      // console.log('good!');
    };

    document
      .querySelector('#ctrl-1 .sprinkler-btn-on')
      .addEventListener('click', () => {
        sprinklerCtrl(1, true);
      });
    document
      .querySelector('#ctrl-1 .sprinkler-btn-off')
      .addEventListener('click', () => {
        sprinklerCtrl(1, false);
      });
    document
      .querySelector('#ctrl-2 .sprinkler-btn-on')
      .addEventListener('click', () => {
        sprinklerCtrl(2, true);
      });
    document
      .querySelector('#ctrl-2 .sprinkler-btn-off')
      .addEventListener('click', () => {
        sprinklerCtrl(2, false);
      });
    document
      .querySelector('#ctrl-3 .sprinkler-btn-on')
      .addEventListener('click', () => {
        sprinklerCtrl(3, true);
      });
    document
      .querySelector('#ctrl-3 .sprinkler-btn-off')
      .addEventListener('click', () => {
        sprinklerCtrl(3, false);
      });
    document
      .querySelector('#ctrl-4 .sprinkler-btn-on')
      .addEventListener('click', () => {
        sprinklerCtrl(4, true);
      });
    document
      .querySelector('#ctrl-4 .sprinkler-btn-off')
      .addEventListener('click', () => {
        sprinklerCtrl(4, false);
      });
    document
      .querySelector('#ctrl-5 .sprinkler-btn-on')
      .addEventListener('click', () => {
        sprinklerCtrl(5, true);
      });
    document
      .querySelector('#ctrl-5 .sprinkler-btn-off')
      .addEventListener('click', () => {
        sprinklerCtrl(5, false);
      });
    document
      .querySelector('#ctrl-6 .sprinkler-btn-on')
      .addEventListener('click', () => {
        sprinklerCtrl(6, true);
      });
    document
      .querySelector('#ctrl-6 .sprinkler-btn-off')
      .addEventListener('click', () => {
        sprinklerCtrl(6, false);
      });
    document.querySelector('#alarm-1').addEventListener('click', () => {
      farota.post(`/plugins/rpc/oneway/${DEVICE_ID_BUZZ}`, {
        method: 'setOnOff',
        params: { valveNo: 1, onOff: 1 },
      });
    });

    document.querySelector('#alarm-2').addEventListener('click', () => {
      farota.post(`/plugins/rpc/oneway/${DEVICE_ID_BUZZ}`, {
        method: 'setOnOff',
        params: { valveNo: 2, onOff: 1 },
      });
    });

    document.querySelector('#alarm-3').addEventListener('click', () => {
      farota.post(`/plugins/rpc/oneway/${DEVICE_ID_BUZZ}`, {
        method: 'setOnOff',
        params: { valveNo: 3, onOff: 1 },
      });
    });

    document.querySelector('#alarm-4').addEventListener('click', () => {
      farota.post(`/plugins/rpc/oneway/${DEVICE_ID_BUZZ}`, {
        method: 'setOnOff',
        params: { valveNo: 4, onOff: 1 },
      });
    });

    // 대형 살수기 펌프 on/off
    const BigSpringklerPumpBtn = document.querySelector(
      '.big-sprinkler #pump-toggle'
    );
    BigSpringklerPumpBtn.addEventListener('click', () => {
      let className = BigSpringklerPumpBtn.className;
      switch (className) {
        case 'sprinkler-btn-on':
          BigSpringklerPumpBtn.className = 'sprinkler-btn-off';
          BigSpringklerPumpBtn.innerHTML = 'OFF';
          farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
            method: 'setOnOff',
            params: { onOff: 0, valveNo: 1, switchNo: 2 },
          });
          break;
        case 'sprinkler-btn-off':
          BigSpringklerPumpBtn.className = 'sprinkler-btn-on';
          BigSpringklerPumpBtn.innerHTML = 'ON';
          farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
            method: 'setOnOff',
            params: { onOff: 1, valveNo: 1, switchNo: 2 },
          });
          break;
        default:
      }
    });

    // document
    //   .querySelector(".big-sprinkler #pump-off")
    //   .addEventListener("click", () => {
    //     farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
    //       method: "setOnOff",
    //       params: { onOff: 0, valveNo: 1, switchNo: 2 }
    //     });
    //     document.querySelector(".big-sprinkler-status").innerText = "꺼짐";
    //   });
    // document
    //   .querySelector(".big-sprinkler #pump-on")
    //   .addEventListener("click", () => {
    //     farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
    //       method: "setOnOff",
    //       params: { onOff: 1, valveNo: 1, switchNo: 2 }
    //     });
    //     document.querySelector(".big-sprinkler-status").innerText = "켜짐";
    //   });

    // 대형 살수기 스윙 on/off
    const BigSpringklerSwingBtn = document.querySelector(
      '.big-sprinkler #swing-toggle'
    );
    BigSpringklerSwingBtn.addEventListener('click', () => {
      let className = BigSpringklerSwingBtn.className;
      switch (className) {
        case 'sprinkler-btn-on':
          BigSpringklerSwingBtn.className = 'sprinkler-btn-off';
          BigSpringklerSwingBtn.innerHTML = 'OFF';
          farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
            method: 'setOnOff',
            params: { onOff: 0, valveNo: 1, switchNo: 4 },
          });
          break;
        case 'sprinkler-btn-off':
          BigSpringklerSwingBtn.className = 'sprinkler-btn-on';
          BigSpringklerSwingBtn.innerHTML = 'ON';
          farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
            method: 'setOnOff',
            params: { onOff: 1, valveNo: 1, switchNo: 4 },
          });
          break;
        default:
      }
    });
    // document
    //   .querySelector(".big-sprinkler #swing-off")
    //   .addEventListener("click", () => {
    //     farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
    //       method: "setOnOff",
    //       params: { onOff: 0, valveNo: 1, switchNo: 4 }
    //     });
    //   });
    // document
    //   .querySelector(".big-sprinkler #swing-on")
    //   .addEventListener("click", () => {
    //     farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
    //       method: "setOnOff",
    //       params: { onOff: 1, valveNo: 1, switchNo: 4 }
    //     });
    //   });

    // 대형 살수기 리프트 on/off
    const BigSpringklerLiftBtn = document.querySelector(
      '.big-sprinkler #lift-toggle'
    );
    BigSpringklerLiftBtn.addEventListener('click', () => {
      let className = BigSpringklerLiftBtn.className;
      switch (className) {
        case 'sprinkler-btn-on':
          BigSpringklerLiftBtn.className = 'sprinkler-btn-off';
          BigSpringklerLiftBtn.innerHTML = 'OFF';
          farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
            method: 'setOnOff',
            params: { onOff: 0, valveNo: 1, switchNo: 3 },
          });
          break;
        case 'sprinkler-btn-off':
          BigSpringklerLiftBtn.className = 'sprinkler-btn-on';
          BigSpringklerLiftBtn.innerHTML = 'ON';
          farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
            method: 'setOnOff',
            params: { onOff: 1, valveNo: 1, switchNo: 3 },
          });
          break;
        default:
      }
    });
    // document
    //   .querySelector(".big-sprinkler #lift-off")
    //   .addEventListener("click", () => {
    //     farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
    //       method: "setOnOff",
    //       params: { onOff: 0, valveNo: 1, switchNo: 3 }
    //     });
    //   });
    // document
    //   .querySelector(".big-sprinkler #lift-on")
    //   .addEventListener("click", () => {
    //     farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
    //       method: "setOnOff",
    //       params: { onOff: 1, valveNo: 1, switchNo: 3 }
    //     });
    //   });

    // 게이트 외부 살수 on/off
    document.querySelector('#trench-out-off').addEventListener('click', () => {
      farota.post(`/plugins/rpc/oneway/${DEVICE_ID_TRENCH}`, {
        method: 'setOnOff',
        params: { onOff: 0, valveNo: 1, switchNo: 1 },
      });
      document.querySelector('#trench-out').innerText = '꺼짐';
    });
    document.querySelector('#trench-out-on').addEventListener('click', () => {
      farota.post(`/plugins/rpc/oneway/${DEVICE_ID_TRENCH}`, {
        method: 'setOnOff',
        params: { onOff: 1, valveNo: 1, switchNo: 1 },
      });
      document.querySelector('#trench-out').innerText = '켜짐';
    });

    // 게이트 내부 살수 on/off
    document.querySelector('#trench-in-off').addEventListener('click', () => {
      farota.post(`/plugins/rpc/oneway/${DEVICE_ID_TRENCH}`, {
        method: 'setOnOff',
        params: { onOff: 0, valveNo: 1, switchNo: 2 },
      });
      document.querySelector('#trench-in').innerText = '꺼짐';
    });
    document.querySelector('#trench-in-on').addEventListener('click', () => {
      farota.post(`/plugins/rpc/oneway/${DEVICE_ID_TRENCH}`, {
        method: 'setOnOff',
        params: { onOff: 1, valveNo: 1, switchNo: 2 },
      });
      document.querySelector('#trench-in').innerText = '켜짐';
    });
  }
  console.log('data update!');
}, 10 * 1000);

// 각가의 차트를 수행할 변수
let charModalNoise1 = null;
let charModalNoise2 = null;
let charModalDust = null;
let charModalVibe = null;

/* 
그리프 모달 구현 
*/

// 모달 테이블 해더를 세팅합니다
function setTableHeaderBox(index1, index2, index3, index4) {
  let tableHeaderBox = ` <div id="graph-table-col-01-title">${index1}</div>
      <div id="graph-table-col-02-title">${index2}</div>
      <div id="graph-table-col-03-title">${index3}</div>
      <div id="graph-table-col-04-title">${index4}</div>`;
  document.querySelector('#table-header-box').innerHTML = tableHeaderBox;
}

// 모달 테이블을 세팅합니다.
function setTableLineItem(targetData1, targetData2) {
  let modalTableData = '';

  for (let i = 0; i < 24; i++) {
    let a = targetData1[i].ts;
    let time = new Date(a);
    const hours = '' + time.getHours();
    const mins = '' + time.getMinutes();
    const seconds = '' + time.getSeconds();
    let finalTime =
      hours.padStart(2, '0') +
      ':' +
      mins.padStart(2, '0') +
      ':' +
      seconds.padStart(2, '0');

    const element = `<div id="graph-table-col-01-item">${finalTime}</div>
    <div id="graph-table-col-02-item">${targetData1[i].value}</div>
    <div id="graph-table-col-03-item">${targetData2[i].value}</div>
    <div id="graph-table-col-04-item">-</div>`;
    modalTableData = modalTableData + element;
  }
  document.querySelector('#table-item-box').innerHTML = modalTableData;
}

// 모달 테이블을 세팅합니다.
function setTableLineItemThree(targetData1, targetData2, targetData3) {
  let modalTableData = '';

  for (let i = 0; i < 24; i++) {
    let a = targetData1[i].ts;
    let time = new Date(a);
    const hours = '' + time.getHours();
    const mins = '' + time.getMinutes();
    const seconds = '' + time.getSeconds();
    let finalTime =
      hours.padStart(2, '0') +
      ':' +
      mins.padStart(2, '0') +
      ':' +
      seconds.padStart(2, '0');

    const element = `<div id="graph-table-col-01-item">${finalTime}</div>
    <div id="graph-table-col-02-item">${targetData1[i].value}</div>
    <div id="graph-table-col-03-item">${targetData2[i].value}</div>
    <div id="graph-table-col-04-item">${targetData3[i].value}</div>`;
    modalTableData = modalTableData + element;
  }
  document.querySelector('#table-item-box').innerHTML = modalTableData;
}

//모달 푸터에 금일의 시간을 세팅합니다
function getTodayTime() {
  // 모달 푸터 시간 체우기
  let today = new Date();
  let year = today.getFullYear(); // 년도
  let month = today.getMonth() + 1; // 월
  let date = today.getDate(); // 날짜

  return `${year}/${month}/${date}`;
}

// 그래프 큰 창에서 보기 구현
function openGraphModal(clicked_id) {
  document.querySelector('#graph-modal-container').className =
    'graph-modal-container-on';
  // 분기 만들기
  if (clicked_id == 'graph-expend-btn-noise-01') {
    // 모달 제목 체우기
    document.querySelector('#modal-title').innerHTML = '소음센서01';
    // 테이블 해드 체우기
    setTableHeaderBox('Time', 'leq', 'lmax', '-');
    // 테이블 라인 체우기
    setTableLineItem(noise1Leq, noise1Lmax);
    // 그래프 체우기
    const GuideLineArr = getGuideLineArray(70, noise1ChartData);

    // const modalCart = document.querySelector('#modal-chart');
    const ctx = getChartElement('modalchart', '2d');
    charModalNoise1 = creatTwoLineChart(
      ctx,
      'line',
      noise1LeqReverse,
      noise1LmaxReverse,
      GuideLineArr,
      'leq',
      'lmax'
    );
    const todayDate = getTodayTime();
    document.querySelector('#modal-footer').innerHTML = todayDate;
    const downLoadBtnBox = document.getElementById('excel-download-btn-box');
    downLoadBtnBox.innerHTML =
      '<button onclick="exprotDataToExcel(this.id)" id="xlsx-download-btn-noise-01">엑셀 다운로드</button>';
  } else if (clicked_id == 'graph-expend-btn-noise-02') {
    // 모달 제목 체우기
    document.querySelector('#modal-title').innerHTML = '소음센서02';
    // 테이블 해드 체우기
    setTableHeaderBox('Time', 'leq', 'lmax', '-');
    // 테이블 라인 체우기
    setTableLineItem(noise2Leq, noise2Lmax);
    // 그래프 체우기
    const GuideLineArr = getGuideLineArray(70, noise2ChartData);

    // const modalCart = document.querySelector('#modal-chart');
    const ctx = getChartElement('modalchart', '2d');
    charModalNoise2 = creatTwoLineChart(
      ctx,
      'line',
      noise2LeqReverse,
      noise2LmaxReverse,
      GuideLineArr,
      'leq',
      'lmax'
    );
    const todayDate = getTodayTime();
    document.querySelector('#modal-footer').innerHTML = todayDate;
    const downLoadBtnBox = document.getElementById('excel-download-btn-box');
    downLoadBtnBox.innerHTML =
      '<button onclick="exprotDataToExcel(this.id)" id="xlsx-download-btn-noise-02">엑셀 다운로드</button>';
  } else if (clicked_id == 'graph-expend-btn-dust') {
    // 모달 제목 체우기
    document.querySelector('#modal-title').innerHTML = '미세먼지';
    // 테이블 해드 체우기
    setTableHeaderBox('Time', 'pm 2.5', 'pm 10', '-');
    // 테이블 라인 체우기
    setTableLineItem(finedust, ultrafinedust);

    const ctx = getChartElement('modalchart', '2d');
    charModalDust = creatTwoLineChart(
      ctx,
      'line',
      finedustReverse,
      ultraFinedustReverse,
      'finedust',
      'ultrafinedust'
    );
    const todayDate = getTodayTime();
    document.querySelector('#modal-footer').innerHTML = todayDate;
    const downLoadBtnBox = document.getElementById('excel-download-btn-box');
    downLoadBtnBox.innerHTML =
      '<button onclick="exprotDataToExcel(this.id)" id="xlsx-download-btn-dust">엑셀 다운로드</button>';
  } else if (clicked_id == 'graph-expend-btn-vibe') {
    // 모달 제목 체우기
    document.querySelector('#modal-title').innerHTML = '진동센서';
    // 테이블 해드 체우기
    setTableHeaderBox('Time', ' x', 'y', 'z');
    // 테이블 라인 체우기
    setTableLineItemThree(x, y, z);

    const ctx = getChartElement('modalchart', '2d');
    charModalVibe = creatThreeLineChart(
      ctx,
      'line',
      xReverse,
      yReverse,
      zReverse,
      'x',
      'y',
      'z'
    );
    const todayDate = getTodayTime();
    document.querySelector('#modal-footer').innerHTML = todayDate;
    const downLoadBtnBox = document.getElementById('excel-download-btn-box');
    downLoadBtnBox.innerHTML =
      '<button onclick="exprotDataToExcel(this.id)" id="xlsx-download-btn-vibe">엑셀 다운로드</button>';
  }
}

// 모달창 닫기
function closeGraphModal() {
  document.querySelector('#graph-modal-container').className =
    'graph-modal-container-off';
  charModalNoise1 = null;
  charModalNoise2 = null;
  charModalDust = null;
  charModalVibe = null;
  location.reload();
}

/* 
엑셀 데이터 다운로드 구현
*/

function exprotDataToExcel(clicked_id) {
  switch (clicked_id) {
    case 'xlsx-download-btn-noise-01':
      downlaodExcelTwoColumn('Noise01', 'leq', 'lmax', noise1Leq, noise1Lmax);
      break;
    case 'xlsx-download-btn-noise-02':
      downlaodExcelTwoColumn('Noise02', 'leq', 'lmax', noise2Leq, noise2Lmax);
      break;
    case 'xlsx-download-btn-dust':
      downlaodExcelTwoColumn(
        'Dust',
        'pm 2.5',
        'pm 10',
        finedust,
        ultrafinedust
      );
      break;
    case 'xlsx-download-btn-vibe':
      downlaodExcelThreeColumn('Vibe', 'x', 'y', 'z', x, y, z);
      break;

    default:
      break;
  }
}
