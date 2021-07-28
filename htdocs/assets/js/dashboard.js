// ()초에 한 번씩 데이터를 리프레시 시함
refreshData(60);

window.addEventListener('DOMContentLoaded', async function () {
    const {
        data: { token },
    } = await axios.post('https://dongsung.farota.com/api/auth/login', {
        username: 'manager@smarf.kr',
        password: 'uiop90-=',
    });

    const farota = axios.create({
        baseURL: 'https://dongsung.farota.com/api/',
        headers: { 'X-Authorization': 'Bearer ' + token },
    });

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

    const [
        { data: noise1 },
        { data: noise2 },
        { data: dust },
        { data: vibe },
        { data: weather },
        { data: sprinkler },
        { data: sprinklerBig },
        { data: sprinklerTrench },
        { data: fire1 },
        { data: fire2 },
        { data: fire3 },
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
    ]);

    // 소음센서1
    document.querySelector('#noise1-leq').innerText = noise1.leq[0].value;
    document.querySelector('#noise1-lmax').innerText = noise1.lmax[0].value;

    // 소음센서1
    document.querySelector('#noise2-leq').innerText = noise2.leq[0].value;
    document.querySelector('#noise2-lmax').innerText = noise2.lmax[0].value;

    // 미세먼지
    document.querySelector('#dust-ultra').innerText =
        dust.ultraFinedust[0].value;
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

    // 기상대
    let windDirValue = weather.windDir[0].value;
    windDirValue = Number(windDirValue);
    // 기상대 이미지 변경
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
                .classList.replace(
                    'sprinkler-status-off',
                    'sprinkler-status-on'
                );
        } else {
            document.querySelector('#sprinkler-1').innerText = '꺼짐';
            document
                .querySelector(`#sprinkler-${i}`)
                .classList.replace(
                    'sprinkler-status-on',
                    'sprinkler-status-off'
                );
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

    let now = new Date();

    const endTs = now.getTime();

    now.setHours(now.getHours() - 24);
    const startTs = now.getTime();

    var endDate = new Date(endTs);
    var startDate = new Date(startTs);

    // Chart drawing

    {
        const [
            { data: noise1 },
            { data: noise2 },
            { data: dust },
            { data: vibe },
        ] = await Promise.all([
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

        const noiseChart1 = document
            .getElementById('noiseChart1')
            .getContext('2d');
        const noiseChart2 = document
            .getElementById('noiseChart2')
            .getContext('2d');
        const dustChart = document.getElementById('dustChart').getContext('2d');
        const vibeChart1 = document
            .getElementById('vibeChart1')
            .getContext('2d');

        //배열 안에 있는 데이터의 평균값을 계산합니다.
        function calculateAverageValue(dataArray) {
            let sum = 0;
            let average = 0;
            console.log(dataArray[0]);
            for (let i = 0; i < dataArray.length; i++) {
                sum = sum + Number(dataArray[i].value);
            }
            average = sum / dataArray.length;
            average = average.toFixed(2);
            return average;
        }
        //범례 평균값 세팅
        // 노이즈 차트
        const averageLeq1 = calculateAverageValue(noise1.leq);
        document.querySelector('#noiseChart1LeqAverage').innerText =
            averageLeq1;
        const averagelmax1 = calculateAverageValue(noise1.lmax);
        document.querySelector('#noiseChart1LmaxAverage').innerText =
            averagelmax1;
        const averageLeq2 = calculateAverageValue(noise2.leq);
        document.querySelector('#noiseChart2LeqAverage').innerText =
            averageLeq2;
        const averagelmax2 = calculateAverageValue(noise2.lmax);
        document.querySelector('#noiseChart2LmaxAverage').innerText =
            averagelmax2;
        // 미세먼지 차트
        const averageuUltraFinedust = calculateAverageValue(dust.ultraFinedust);
        document.querySelector('#dustChartUFDustAverage').innerText =
            averageuUltraFinedust;
        const averageFinedust = calculateAverageValue(dust.finedust);
        document.querySelector('#dustChartFDustAverage').innerText =
            averageFinedust;

        // const averageX_1 = calculateAverageValue(vibe.x_1);
        // document.querySelector('#vibeCart1XAverage').innerText = averageX_1;
        // const averageY_1 = calculateAverageValue(vibe.y_1);
        // document.querySelector('#vibeCart1YAverage').innerText = averageY_1;
        // const averageZ_1 = calculateAverageValue(vibe.z_1);
        // document.querySelector('#vibeCart1ZAverage').innerText = averageZ_1;

        // const averageLeq = calculateAverageValue(noise.leq);
        // const averageLeq = calculateAverageValue(noise.leq);
        // const averageLeq = calculateAverageValue(noise.leq);

        //70 dB 가이드라인 표시를 위한 배열
        const noise1GuideLineArr = new Array(noise1.lmax.length);
        for (let i = 0; i < noise1GuideLineArr.length; i++) {
            noise1GuideLineArr[i] = 70;
        }

        const noise2GuideLineArr = new Array(noise2.lmax.length);
        for (let i = 0; i < noise2GuideLineArr.length; i++) {
            noise2GuideLineArr[i] = 70;
        }

        // 순서 반전
        var noise1LeqReverse = [];
        for (let i = noise1.leq.length - 1; i >= 0; i--) {
            noise1LeqReverse.push(noise1.leq[i]);
        }

        var noise1LmaxReverse = [];
        for (let i = noise1.lmax.length - 1; i >= 0; i--) {
            noise1LmaxReverse.push(noise1.lmax[i]);
        }

        var noise2LeqReverse = [];
        for (let i = noise2.leq.length - 1; i >= 0; i--) {
            noise2LeqReverse.push(noise2.leq[i]);
        }

        var noise2LmaxReverse = [];
        for (let i = noise2.lmax.length - 1; i >= 0; i--) {
            noise2LmaxReverse.push(noise2.lmax[i]);
        }

        new Chart(noiseChart1, {
            type: 'line',
            data: {
                labels: noise1LeqReverse.map(({ ts }) => {
                    let time = new Date(ts);
                    const hours = '' + time.getHours();
                    const mins = '' + time.getMinutes();
                    return hours.padStart(2, '0') + ':' + mins.padStart(2, '0');
                }),
                datasets: [
                    {
                        label: 'leq',
                        data: noise1LeqReverse.map(({ value }) => value),
                        backgroundColor: ['#4ED139'],
                        borderColor: ['#4ED139'],
                    },
                    {
                        label: 'lmax',
                        data: noise1LmaxReverse.map(({ value }) => value),
                        backgroundColor: ['#289CF4'],
                        borderColor: ['#289CF4'],
                    },
                    {
                        label: 'guideLine',
                        data: noise1GuideLineArr,
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

        new Chart(noiseChart2, {
            type: 'line',
            data: {
                labels: noise2LeqReverse.map(({ ts }) => {
                    let time = new Date(ts);
                    const hours = '' + time.getHours();
                    const mins = '' + time.getMinutes();
                    return hours.padStart(2, '0') + ':' + mins.padStart(2, '0');
                }),
                datasets: [
                    {
                        label: 'leq',
                        data: noise2LeqReverse.map(({ value }) => value),
                        backgroundColor: ['#4ED139'],
                        borderColor: ['#4ED139'],
                    },
                    {
                        label: 'lmax',
                        data: noise2LmaxReverse.map(({ value }) => value),
                        backgroundColor: ['#289CF4'],
                        borderColor: ['#289CF4'],
                    },
                    {
                        label: 'guideLine',
                        data: noise2GuideLineArr,
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

        var finedustReverse = [];
        for (let i = dust.finedust.length - 1; i >= 0; i--) {
            finedustReverse.push(dust.finedust[i]);
        }

        var ultraFinedustReverse = [];
        for (let i = dust.ultraFinedust.length - 1; i >= 0; i--) {
            ultraFinedustReverse.push(dust.ultraFinedust[i]);
        }

        new Chart(dustChart, {
            type: 'line',
            data: {
                labels: finedustReverse.map(({ ts }) => {
                    let time = new Date(ts);
                    const hours = '' + time.getHours();
                    const mins = '' + time.getMinutes();
                    return hours.padStart(2, '0') + ':' + mins.padStart(2, '0');
                }),
                datasets: [
                    {
                        label: '2.5pm',
                        data: ultraFinedustReverse.map(({ value }) => value),
                        backgroundColor: ['#4ED139'],
                        borderColor: ['#4ED139'],
                    },
                    {
                        label: '10pm',
                        data: finedustReverse.map(({ value }) => value),
                        backgroundColor: ['#289CF4'],
                        borderColor: ['#289CF4'],
                    },
                ],
            },
            options: {
                borderWidth: 1,
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

        const { x_1, y_1, z_1 } = vibe;
        const x1 = x_1 ? x_1.map(({ value }) => Number(value)) : [];
        const y1 = y_1 ? y_1.map(({ value }) => Number(value)) : [];
        const z1 = z_1 ? z_1.map(({ value }) => Number(value)) : [];

        const vibe1Labels = x_1.map(({ ts }) => {
            let time = new Date(ts);
            const hours = '' + time.getHours();
            const mins = '' + time.getMinutes();
            return hours.padStart(2, '0') + ':' + mins.padStart(2, '0');
        });

        var vibe1LabelsReverse = [];
        for (let i = x1.length - 1; i >= 0; i--) {
            vibe1LabelsReverse.push(vibe1Labels[i]);
        }

        var x1Reverse = [];
        for (let i = x1.length - 1; i >= 0; i--) {
            x1Reverse.push(x1[i]);
        }

        var y1Reverse = [];
        for (let i = y1.length - 1; i >= 0; i--) {
            y1Reverse.push(y1[i]);
        }

        var z1Reverse = [];
        for (let i = z1.length - 1; i >= 0; i--) {
            z1Reverse.push(z1[i]);
        }

        new Chart(vibeChart1, {
            type: 'line',
            data: {
                labels: vibe1LabelsReverse,
                datasets: [
                    {
                        label: 'X',
                        data: x1,
                        backgroundColor: ['#4ED139'],
                        borderColor: ['#4ED139'],
                    },
                    {
                        label: 'Y',
                        data: y1,
                        backgroundColor: ['#289CF4'],
                        borderColor: ['#289CF4'],
                    },
                    {
                        label: 'Z',
                        data: z1,
                        backgroundColor: ['#fdca57'],
                        borderColor: ['#fdca57'],
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        top: 20,
                    },
                },
                plugins: {
                    legend: { display: false },
                },
            },
        });
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
        document
            .querySelector('#trench-out-off')
            .addEventListener('click', () => {
                farota.post(`/plugins/rpc/oneway/${DEVICE_ID_TRENCH}`, {
                    method: 'setOnOff',
                    params: { onOff: 0, valveNo: 1, switchNo: 1 },
                });
                document.querySelector('#trench-out').innerText = '꺼짐';
            });
        document
            .querySelector('#trench-out-on')
            .addEventListener('click', () => {
                farota.post(`/plugins/rpc/oneway/${DEVICE_ID_TRENCH}`, {
                    method: 'setOnOff',
                    params: { onOff: 1, valveNo: 1, switchNo: 1 },
                });
                document.querySelector('#trench-out').innerText = '켜짐';
            });

        // 게이트 내부 살수 on/off
        document
            .querySelector('#trench-in-off')
            .addEventListener('click', () => {
                farota.post(`/plugins/rpc/oneway/${DEVICE_ID_TRENCH}`, {
                    method: 'setOnOff',
                    params: { onOff: 0, valveNo: 1, switchNo: 2 },
                });
                document.querySelector('#trench-in').innerText = '꺼짐';
            });
        document
            .querySelector('#trench-in-on')
            .addEventListener('click', () => {
                farota.post(`/plugins/rpc/oneway/${DEVICE_ID_TRENCH}`, {
                    method: 'setOnOff',
                    params: { onOff: 1, valveNo: 1, switchNo: 2 },
                });
                document.querySelector('#trench-in').innerText = '켜짐';
            });
    }
});
