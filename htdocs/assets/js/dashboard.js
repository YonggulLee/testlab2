window.addEventListener("DOMContentLoaded", async function() {
  const {
    data: { token }
  } = await axios.post("https://dongsung.farota.com/api/auth/login", {
    username: "manager@smarf.kr",
    password: "uiop90-="
  });

  const farota = axios.create({
    baseURL: "https://dongsung.farota.com/api/",
    headers: { "X-Authorization": "Bearer " + token }
  });

  const SENSOR_ID_NOISE = "e8a11380-bc2e-11eb-8551-4f4bb0e28011";
  const SENSOR_ID_DUST = "c4cc4150-bc2e-11eb-8551-4f4bb0e28011";
  const SENSOR_ID_VIBE = "26b984e0-b793-11eb-a7c7-c5ac42947b75";
  const SENSOR_ID_WEATER = "d737f5b0-b9da-11eb-a7c7-c5ac42947b75";
  const SENSOR_ID_SPRIN = "446e8620-b923-11eb-a7c7-c5ac42947b75";
  const SENSOR_ID_FIRE_1 = "6bf43210-e2f6-11eb-8692-193d8d39219e";
  const SENSOR_ID_FIRE_2 = "c8707450-e2f5-11eb-8692-193d8d39219e";
  const SENSOR_ID_FIRE_3 = "72c11220-e2f6-11eb-8692-193d8d39219e";
  const DEVICE_ID_BUZZ = "f314d090-e2f3-11eb-8692-193d8d39219e";
  const DEVICE_ID_TRENCH = "27351810-bd26-11eb-8551-4f4bb0e28011";
  const DEVICE_ID_SPRIN_BIG = "fd4dd1d0-c97e-11eb-8551-4f4bb0e28011";

  const URI_NOISE = `/plugins/telemetry/DEVICE/${SENSOR_ID_NOISE}/values/timeseries`;
  const URI_DUST = `/plugins/telemetry/DEVICE/${SENSOR_ID_DUST}/values/timeseries`;
  const URI_VIBE = `/plugins/telemetry/DEVICE/${SENSOR_ID_VIBE}/values/timeseries`;
  const URI_WEATHER = `/plugins/telemetry/DEVICE/${SENSOR_ID_WEATER}/values/timeseries`;
  const URI_SPRINKLER = `/plugins/telemetry/DEVICE/${SENSOR_ID_SPRIN}/values/timeseries`;
  const URI_SPRINKLER_TRENCH = `/plugins/telemetry/DEVICE/${DEVICE_ID_TRENCH}/values/timeseries`;
  const URI_FIRE_1 = `/plugins/telemetry/DEVICE/${SENSOR_ID_FIRE_1}/values/timeseries`;
  const URI_FIRE_2 = `/plugins/telemetry/DEVICE/${SENSOR_ID_FIRE_2}/values/timeseries`;
  const URI_FIRE_3 = `/plugins/telemetry/DEVICE/${SENSOR_ID_FIRE_3}/values/timeseries`;

  const [
    { data: noise },
    { data: dust },
    { data: vibe },
    { data: weather },
    { data: sprinkler },
    { data: sprinklerTrench },
    { data: fire1 },
    { data: fire2 },
    { data: fire3 }
  ] = await Promise.all([
    farota.get(URI_NOISE, { params: { keys: "leq,lmax" } }),
    farota.get(URI_DUST, { params: { keys: "finedust,ultraFinedust" } }),
    farota.get(URI_VIBE, { params: { keys: "x_1,y_1,z_1,x_2,y_2,z_2" } }),
    farota.get(URI_WEATHER, {
      params: {
        keys:
          "windDir,outTemp,outHumidity,radiation,uv,windSpeed,pressure,dayRain,hourRain"
      }
    }),
    farota.get(URI_SPRINKLER, {
      params: { keys: "switch1,switch2,switch3,switch4,switch5,switch6" }
    }),
    farota.get(URI_SPRINKLER_TRENCH, {
      params: { keys: "switch1_1,switch1_2" }
    }),
    farota.get(URI_FIRE_1, { params: { keys: "state" } }),
    farota.get(URI_FIRE_2, { params: { keys: "state" } }),
    farota.get(URI_FIRE_3, { params: { keys: "state" } })
  ]);

  // 소음센서
  document.querySelector("#noise-leq").innerText = noise.leq[0].value;
  document.querySelector("#noise-lmax").innerText = noise.lmax[0].value;

  // 미세먼지
  document.querySelector("#dust-ultra").innerText = dust.ultraFinedust[0].value;
  document.querySelector("#dust-fine").innerText = dust.finedust[0].value;

  // 진동센서 1
  document.querySelector("#vibe-x1").innerText = vibe.x_1[0].value;
  document.querySelector("#vibe-y1").innerText = vibe.y_1[0].value;
  document.querySelector("#vibe-z1").innerText = vibe.z_1[0].value;

  // 진동센서 2
  document.querySelector("#vibe-x2").innerText = vibe.x_2[0].value;
  document.querySelector("#vibe-y2").innerText = vibe.y_2[0].value;
  document.querySelector("#vibe-z2").innerText = vibe.z_2[0].value;

  let innerCheck = '<i class="fas fa-check-circle"></i> 정상';
  let innerCross = '<i class="fas fa-times-circle"></i> 비정상';

  const fireElem1 = document.querySelector("#fire-1");
  const fireElem2 = document.querySelector("#fire-2");
  const fireElem3 = document.querySelector("#fire-3");

  if (fire1.state[0].value == 0) {
    fireElem1.innerHTML = innerCheck;
  } else {
    fireElem1.innerHTML = innerCross;
    fireElem1.classList.add("bad");
  }

  if (fire2.state[0].value == 0) {
    fireElem2.innerHTML = innerCheck;
  } else {
    fireElem2.innerHTML = innerCross;
    fireElem2.classList.add("bad");
  }

  if (fire3.state[0].value == 0) {
    fireElem3.innerHTML = innerCheck;
  } else {
    fireElem3.innerHTML = innerCross;
    fireElem3.classList.add("bad");
  }

  // 기상대
  let windDirValue = weather.windDir[0].value;
  windDirValue = Number(windDirValue);
  // 기상대 이미지 변경
  if (
    (337.5 < windDirValue && windDirValue <= 360) ||
    (0 < windDirValue && windDirValue <= 22.5)
  ) {
    document.querySelector("#windDir").src = "assets/img/windDirNN.png";
  } else if (22.5 < windDirValue && windDirValue <= 67.5) {
    document.querySelector("#windDir").src = "assets/img/windDirNE.png";
  } else if (67.5 < windDirValue && windDirValue <= 112.5) {
    document.querySelector("#windDir").src = "assets/img/windDirEE.png";
  } else if (112.5 < windDirValue && windDirValue <= 157.5) {
    document.querySelector("#windDir").src = "assets/img/windDirSE.png";
  } else if (157.5 < windDirValue && windDirValue <= 202.5) {
    document.querySelector("#windDir").src = "assets/img/windDirSS.png";
  } else if (202.5 < windDirValue && windDirValue <= 247.5) {
    document.querySelector("#windDir").src = "assets/img/windDirSW.png";
  } else if (247.5 < windDirValue && windDirValue <= 292.5) {
    document.querySelector("#windDir").src = "assets/img/windDirWW.png";
  } else {
    document.querySelector("#windDir").src = "assets/img/windDirNW.png";
  }

  document.querySelector("#weather-temp").innerText = Number(
    weather.outTemp[0].value
  ).toFixed(2);
  document.querySelector("#weather-humid").innerText = Number(
    weather.outHumidity[0].value
  ).toFixed(1);
  document.querySelector("#weather-pressure").innerText = Number(
    weather.pressure[0].value
  ).toFixed(2);
  document.querySelector("#weather-uv").innerText = Number(
    weather.uv[0].value
  ).toFixed(2);
  document.querySelector("#weather-rain-day").innerText = Number(
    weather.dayRain[0].value
  ).toFixed(2);
  document.querySelector("#weather-rain-hour").innerText = Number(
    weather.hourRain[0].value
  ).toFixed(2);
  document.querySelector("#weather-rad").innerText = Number(
    weather.radiation[0].value
  ).toFixed(0);
  document.querySelector("#weather-windspeed").innerText = Number(
    weather.windSpeed[0].value
  ).toFixed(2);

  // 스프링클러
  for (let i = 1; i - 1 < sprinkler.length; i++) {
    if (sprinkler.switch1[0].value == "1") {
      document.querySelector("#sprinkler-1").innerText = "작동중";
      document
        .querySelector(`#sprinkler-${i}`)
        .classList.replace("sprinkler-status-off", "sprinkler-status-on");
    } else {
      document.querySelector("#sprinkler-1").innerText = "꺼짐";
      document
        .querySelector(`#sprinkler-${i}`)
        .classList.replace("sprinkler-status-on", "sprinkler-status-off");
    }
  }
  // document.querySelector("#sprinkler-2").innerText =
  //   sprinkler.switch2[0].value == "1" ? "작동중" : "꺼짐";
  // document.querySelector("#sprinkler-3").innerText =
  //   sprinkler.switch3[0].value == "1" ? "작동중" : "꺼짐";
  // document.querySelector("#sprinkler-4").innerText =
  //   sprinkler.switch4[0].value == "1" ? "작동중" : "꺼짐";
  // document.querySelector("#sprinkler-5").innerText =
  //   sprinkler.switch5[0].value == "1" ? "작동중" : "꺼짐";
  // document.querySelector("#sprinkler-6").innerText =
  //   sprinkler.switch6[0].value == "1" ? "작동중" : "꺼짐";

  // 게이트 살수
  document.querySelector("#trench-out").innerText =
    sprinklerTrench.switch1_1[0].value == "1" ? "켜짐" : "꺼짐";
  document.querySelector("#trench-in").innerText =
    sprinklerTrench.switch1_2[0].value == "1" ? "켜짐" : "꺼짐";

  let now = new Date();

  now.setMinutes(0);
  now.setSeconds(0, 0);

  const endTs = now.getTime();

  now.setHours(now.getHours() - 10);
  const startTs = now.getTime();

  // Chart drawing

  {
    const [{ data: noise }, { data: dust }, { data: vibe }] = await Promise.all(
      [
        farota.get(URI_NOISE, {
          params: { startTs, endTs, limits: 1000, keys: "leq,lmax" }
        }),
        farota.get(URI_DUST, {
          params: {
            startTs,
            endTs,
            limits: 1000,
            keys: "finedust,ultraFinedust"
          }
        }),
        farota.get(URI_VIBE, {
          params: {
            startTs,
            endTs,
            limits: 1000,
            keys: "x_1,y_1,z_1,x_2,y_2,z_2"
          }
        })
      ]
    );

    const noiseChart = document.getElementById("noiseChart").getContext("2d");
    const dustChart = document.getElementById("dustChart").getContext("2d");
    const vibeChart1 = document.getElementById("vibeChart1").getContext("2d");
    const vibeChart2 = document.getElementById("vibeChart2").getContext("2d");

    //노이즈 차트

    //평균값 계산
    function calculateAverageValue(array) {
      const dataArray = array;
      let sum = 0;
      let average = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum = sum + Number(dataArray[i].value);
      }
      average = sum / dataArray.length;
      average = average.toFixed(2);
      return average;
    }
    //범례 평균값 세팅
    // 노이즈 차트
    const averageLeq = calculateAverageValue(noise.leq);
    document.querySelector("#noiseChartLeqAverage").innerText = averageLeq;
    const averagelmax = calculateAverageValue(noise.lmax);
    document.querySelector("#noiseChartLmaxAverage").innerText = averagelmax;
    // 미세먼지 차트
    const averageuUltraFinedust = calculateAverageValue(dust.ultraFinedust);
    document.querySelector(
      "#dustChartUFDustAverage"
    ).innerText = averageuUltraFinedust;
    const averageFinedust = calculateAverageValue(dust.finedust);
    document.querySelector(
      "#dustChartFDustAverage"
    ).innerText = averageFinedust;

    const averageX_1 = calculateAverageValue(vibe.x_1);
    document.querySelector("#vibeCart1XAverage").innerText = averageX_1;
    const averageY_1 = calculateAverageValue(vibe.y_1);
    document.querySelector("#vibeCart1YAverage").innerText = averageY_1;
    const averageZ_1 = calculateAverageValue(vibe.z_1);
    document.querySelector("#vibeCart1ZAverage").innerText = averageZ_1;

    // const averageLeq = calculateAverageValue(noise.leq);
    // const averageLeq = calculateAverageValue(noise.leq);
    // const averageLeq = calculateAverageValue(noise.leq);

    //70 dB 가이드라인 표시를 위한 배열
    const guideLineArr = new Array(100);
    for (let i = 0; i < guideLineArr.length; i++) {
      guideLineArr[i] = 70;
    }

    new Chart(noiseChart, {
      type: "line",
      data: {
        labels: noise.leq.map(({ ts }) => {
          let time = new Date(ts);
          const hours = "" + time.getHours();
          const mins = "" + time.getMinutes();
          return hours.padStart(2, "0") + ":" + mins.padStart(2, "0");
        }),
        datasets: [
          {
            label: "leq",
            data: noise.leq.map(({ value }) => value),
            backgroundColor: ["#4ED139"],
            borderColor: ["#4ED139"]
          },
          {
            label: "lmax",
            data: noise.lmax.map(({ value }) => value),
            backgroundColor: ["#289CF4"],
            borderColor: ["#289CF4"]
          },
          {
            label: "guideLine",
            data: guideLineArr,
            backgroundColor: ["red"],
            borderColor: ["red"]
          }
        ]
      },
      options: {
        elements: {
          point: {
            pointStyle: "line",
            hoverBorderWidth: 0,
            borderWidth: 0
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 20
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });

    new Chart(dustChart, {
      type: "line",
      data: {
        labels: dust.finedust.map(({ ts }) => {
          let time = new Date(ts);
          const hours = "" + time.getHours();
          const mins = "" + time.getMinutes();
          return hours.padStart(2, "0") + ":" + mins.padStart(2, "0");
        }),
        datasets: [
          {
            label: "2.5pm",
            data: dust.ultraFinedust.map(({ value }) => value),
            backgroundColor: ["#4ED139"],
            borderColor: ["#4ED139"]
          },
          {
            label: "10pm",
            data: dust.finedust.map(({ value }) => value),
            backgroundColor: ["#289CF4"],
            borderColor: ["#289CF4"]
          }
        ]
      },
      options: {
        elements: {
          point: {
            pointStyle: "line",
            hoverBorderWidth: 0,
            borderWidth: 0
          }
        },
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 20
          }
        },
        plugins: {
          legend: {
            display: false
          }
        }
      }
    });

    const { x_1, y_1, z_1, x_2, y_2, z_2 } = vibe;
    const x1 = x_1 ? x_1.map(({ value }) => Number(value)) : [];
    const y1 = y_1 ? y_1.map(({ value }) => Number(value)) : [];
    const z1 = z_1 ? z_1.map(({ value }) => Number(value)) : [];
    const x2 = x_2 ? x_2.map(({ value }) => Number(value)) : [];
    const y2 = y_2 ? y_2.map(({ value }) => Number(value)) : [];
    const z2 = z_2 ? z_2.map(({ value }) => Number(value)) : [];

    const vibeLabels = x_1.map(({ ts }) => {
      let time = new Date(ts);
      const hours = "" + time.getHours();
      const mins = "" + time.getMinutes();
      return hours.padStart(2, "0") + ":" + mins.padStart(2, "0");
    });

    new Chart(vibeChart1, {
      type: "line",
      data: {
        labels: vibeLabels,
        datasets: [
          {
            label: "X",
            data: x1,
            backgroundColor: ["#4ED139"],
            borderColor: ["#4ED139"]
          },
          {
            label: "Y",
            data: y1,
            backgroundColor: ["#289CF4"],
            borderColor: ["#289CF4"]
          },
          {
            label: "Z",
            data: z1,
            backgroundColor: ["#fdca57"],
            borderColor: ["#fdca57"]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 20
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });

    new Chart(vibeChart2, {
      type: "line",
      data: {
        labels: vibeLabels,
        datasets: [
          {
            label: "X",
            data: x2,
            backgroundColor: ["#4ED139"],
            borderColor: ["#4ED139"]
          },
          {
            label: "Y",
            data: y2,
            backgroundColor: ["#289CF4"],
            borderColor: ["#289CF4"]
          },
          {
            label: "Z",
            data: z2,
            backgroundColor: ["#fdca57"],
            borderColor: ["#fdca57"]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 20
          }
        },
        plugins: {
          legend: { display: false }
        }
      }
    });
  }

  // RPC Call
  {
    const sprinklerCtrl = async (valveNo, onOff) => {
      const body = {
        method: "setOnOff",
        params: { valveNo, onOff: onOff ? 1 : 0 }
      };

      await farota.post(`/plugins/rpc/oneway/${SENSOR_ID_SPRIN}`, body);

      document.querySelector("#sprinkler-" + valveNo).innerText =
        onOff == "1" ? "켜짐" : "꺼짐";
    };

    document
      .querySelector("#ctrl-1 .sprinkler-btn-on")
      .addEventListener("click", () => {
        sprinklerCtrl(1, true);
      });
    document
      .querySelector("#ctrl-1 .sprinkler-btn-off")
      .addEventListener("click", () => {
        sprinklerCtrl(1, false);
      });
    document
      .querySelector("#ctrl-2 .sprinkler-btn-on")
      .addEventListener("click", () => {
        sprinklerCtrl(2, true);
      });
    document
      .querySelector("#ctrl-2 .sprinkler-btn-off")
      .addEventListener("click", () => {
        sprinklerCtrl(2, false);
      });
    document
      .querySelector("#ctrl-3 .sprinkler-btn-on")
      .addEventListener("click", () => {
        sprinklerCtrl(3, true);
      });
    document
      .querySelector("#ctrl-3 .sprinkler-btn-off")
      .addEventListener("click", () => {
        sprinklerCtrl(3, false);
      });
    document
      .querySelector("#ctrl-4 .sprinkler-btn-on")
      .addEventListener("click", () => {
        sprinklerCtrl(4, true);
      });
    document
      .querySelector("#ctrl-4 .sprinkler-btn-off")
      .addEventListener("click", () => {
        sprinklerCtrl(4, false);
      });
    document
      .querySelector("#ctrl-5 .sprinkler-btn-on")
      .addEventListener("click", () => {
        sprinklerCtrl(5, true);
      });
    document
      .querySelector("#ctrl-5 .sprinkler-btn-off")
      .addEventListener("click", () => {
        sprinklerCtrl(5, false);
      });
    document
      .querySelector("#ctrl-6 .sprinkler-btn-on")
      .addEventListener("click", () => {
        sprinklerCtrl(6, true);
      });
    document
      .querySelector("#ctrl-6 .sprinkler-btn-off")
      .addEventListener("click", () => {
        sprinklerCtrl(6, false);
      });
    document.querySelector("#alarm-1").addEventListener("click", () => {
      farota.post(`/plugins/rpc/oneway/${DEVICE_ID_BUZZ}`, {
        method: "setOnOff",
        params: { valveNo: 1, onOff: 1 }
      });
    });

    document.querySelector("#alarm-2").addEventListener("click", () => {
      farota.post(`/plugins/rpc/oneway/${DEVICE_ID_BUZZ}`, {
        method: "setOnOff",
        params: { valveNo: 2, onOff: 1 }
      });
    });

    // 대형 살수기 펌프 on/off
    document
      .querySelector(".big-sprinkler #pump-off")
      .addEventListener("click", () => {
        farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
          method: "setOnOff",
          params: { onOff: 0, valveNo: 1, switchNo: 2 }
        });
        document.querySelector(".big-sprinkler-status").innerText = "꺼짐";
      });
    document
      .querySelector(".big-sprinkler #pump-on")
      .addEventListener("click", () => {
        farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
          method: "setOnOff",
          params: { onOff: 1, valveNo: 1, switchNo: 2 }
        });
        document.querySelector(".big-sprinkler-status").innerText = "켜짐";
      });

    // 대형 살수기 스윙 on/off
    document
      .querySelector(".big-sprinkler #swing-off")
      .addEventListener("click", () => {
        farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
          method: "setOnOff",
          params: { onOff: 0, valveNo: 1, switchNo: 4 }
        });
      });
    document
      .querySelector(".big-sprinkler #swing-on")
      .addEventListener("click", () => {
        farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
          method: "setOnOff",
          params: { onOff: 1, valveNo: 1, switchNo: 4 }
        });
      });

    // 대형 살수기 리프트 on/off
    document
      .querySelector(".big-sprinkler #lift-off")
      .addEventListener("click", () => {
        farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
          method: "setOnOff",
          params: { onOff: 0, valveNo: 1, switchNo: 3 }
        });
      });
    document
      .querySelector(".big-sprinkler #lift-on")
      .addEventListener("click", () => {
        farota.post(`/plugins/rpc/oneway/${DEVICE_ID_SPRIN_BIG}`, {
          method: "setOnOff",
          params: { onOff: 1, valveNo: 1, switchNo: 3 }
        });
      });

    // 게이트 외부 살수 on/off
    document.querySelector("#trench-out-off").addEventListener("click", () => {
      farota.post(`/plugins/rpc/oneway/${DEVICE_ID_TRENCH}`, {
        method: "setOnOff",
        params: { onOff: 0, valveNo: 1, switchNo: 1 }
      });
      document.querySelector("#trench-out").innerText = "꺼짐";
    });
    document.querySelector("#trench-out-on").addEventListener("click", () => {
      farota.post(`/plugins/rpc/oneway/${DEVICE_ID_TRENCH}`, {
        method: "setOnOff",
        params: { onOff: 1, valveNo: 1, switchNo: 1 }
      });
      document.querySelector("#trench-out").innerText = "켜짐";
    });

    // 게이트 내부 살수 on/off
    document.querySelector("#trench-in-off").addEventListener("click", () => {
      farota.post(`/plugins/rpc/oneway/${DEVICE_ID_TRENCH}`, {
        method: "setOnOff",
        params: { onOff: 0, valveNo: 1, switchNo: 2 }
      });
      document.querySelector("#trench-in").innerText = "꺼짐";
    });
    document.querySelector("#trench-in-on").addEventListener("click", () => {
      farota.post(`/plugins/rpc/oneway/${DEVICE_ID_TRENCH}`, {
        method: "setOnOff",
        params: { onOff: 1, valveNo: 1, switchNo: 2 }
      });
      document.querySelector("#trench-in").innerText = "켜짐";
    });
  }
});
