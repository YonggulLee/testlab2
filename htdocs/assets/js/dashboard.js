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
  const SENSOR_ID_TRENCH = "27351810-bd26-11eb-8551-4f4bb0e28011";

  const URI_NOISE = `/plugins/telemetry/DEVICE/${SENSOR_ID_NOISE}/values/timeseries`;
  const URI_DUST = `/plugins/telemetry/DEVICE/${SENSOR_ID_DUST}/values/timeseries`;
  const URI_VIBE = `/plugins/telemetry/DEVICE/${SENSOR_ID_VIBE}/values/timeseries`;
  const URI_WEATHER = `/plugins/telemetry/DEVICE/${SENSOR_ID_WEATER}/values/timeseries`;
  const URI_SPRINKLER = `/plugins/telemetry/DEVICE/${SENSOR_ID_SPRIN}/values/timeseries`;
  const URI_SPRINKLER_TRENCH = `/plugins/telemetry/DEVICE/${SENSOR_ID_TRENCH}/values/timeseries`;

  const [
    { data: noise },
    { data: dust },
    { data: vibe },
    { data: weather },
    { data: sprinkler },
    { data: sprinklerTrench }
  ] = await Promise.all([
    farota.get(URI_NOISE, { params: { keys: "leq,lmax" } }),
    farota.get(URI_DUST, { params: { keys: "finedust,ultraFinedust" } }),
    farota.get(URI_VIBE, { params: { keys: "x_1,y_1,z_1,x_2,y_2,z_2" } }),
    farota.get(URI_WEATHER, {
      params: {
        keys:
          "outTemp,outHumidity,radiation,uv,windSpeed,pressure,dayRain,hourRain"
      }
    }),
    farota.get(URI_SPRINKLER, {
      params: { keys: "switch1,switch2,switch3,switch4,switch5,switch6" }
    }),
    farota.get(URI_SPRINKLER_TRENCH, {
      params: { keys: "switch1_1,switch1_2" }
    })
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

  // 기상대
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
  document.querySelector("#sprinkler-1").innerText =
    sprinkler.switch1[0].value == "1" ? "켜짐" : "꺼짐";
  document.querySelector("#sprinkler-2").innerText =
    sprinkler.switch2[0].value == "1" ? "켜짐" : "꺼짐";
  document.querySelector("#sprinkler-3").innerText =
    sprinkler.switch3[0].value == "1" ? "켜짐" : "꺼짐";
  document.querySelector("#sprinkler-4").innerText =
    sprinkler.switch4[0].value == "1" ? "켜짐" : "꺼짐";
  document.querySelector("#sprinkler-5").innerText =
    sprinkler.switch5[0].value == "1" ? "켜짐" : "꺼짐";
  document.querySelector("#sprinkler-6").innerText =
    sprinkler.switch6[0].value == "1" ? "켜짐" : "꺼짐";

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
    const array = new Array(100);
    for (let i = 0; i < array.length; i++) {
      array[i] = 70;
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
            label: "guird",
            data: array,
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

      await farota.post(
        "/plugins/rpc/oneway/446e8620-b923-11eb-a7c7-c5ac42947b75",
        body
      );

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
  }
});
