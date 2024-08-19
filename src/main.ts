import { Battery, Camera } from "./types.ts";

let brand: string;
let model: string;
let accesaryWattage: number;
let filteredModelOptions: string[] = [];

const batterys: Battery[] = [
  {
    batteryName: "WKL-78",
    capacityAh: 2.3,
    voltage: 14.4,
    maxDraw: 3.2,
    endVoltage: 10,
  },
  {
    batteryName: "WKL-140",
    capacityAh: 4.5,
    voltage: 14.4,
    maxDraw: 9.2,
    endVoltage: 5,
  },
  {
    batteryName: "Wmacro-78",
    capacityAh: 2.5,
    voltage: 14.5,
    maxDraw: 10,
    endVoltage: 5,
  },
  {
    batteryName: "Wmacro-140",
    capacityAh: 3.6,
    voltage: 14.4,
    maxDraw: 14,
    endVoltage: 5,
  },
  {
    batteryName: "IOP-E78",
    capacityAh: 6.6,
    voltage: 14.4,
    maxDraw: 10.5,
    endVoltage: 8,
  },
  {
    batteryName: "IOP-E140",
    capacityAh: 9.9,
    voltage: 14.4,
    maxDraw: 14,
    endVoltage: 10,
  },
  {
    batteryName: "IOP-E188",
    capacityAh: 13.2,
    voltage: 14.4,
    maxDraw: 14,
    endVoltage: 11,
  },
  {
    batteryName: "RYN-C65",
    capacityAh: 4.9,
    voltage: 14.8,
    maxDraw: 4.9,
    endVoltage: 11,
  },
  {
    batteryName: "RYN-C85",
    capacityAh: 6.3,
    voltage: 14.4,
    maxDraw: 6.3,
    endVoltage: 12,
  },
  {
    batteryName: "RYN-C140",
    capacityAh: 9.8,
    voltage: 14.8,
    maxDraw: 10,
    endVoltage: 12,
  },
  {
    batteryName: "RYN-C290",
    capacityAh: 19.8,
    voltage: 14.4,
    maxDraw: 14,
    endVoltage: 12,
  },
].sort((a, b) => a.batteryName.charCodeAt(0) - b.batteryName.charCodeAt(0));
const cameras: Camera[] = [
  {
    brand: "Cakon",
    model: "ABC 3000M",
    powerConsumptionWh: 35.5,
  },
  {
    brand: "Cakon",
    model: "ABC 5000M",
    powerConsumptionWh: 37.2,
  },
  {
    brand: "Cakon",
    model: "ABC 7000M",
    powerConsumptionWh: 39.7,
  },
  {
    brand: "Cakon",
    model: "ABC 9000M",
    powerConsumptionWh: 10.9,
  },
  {
    brand: "Cakon",
    model: "ABC 9900M",
    powerConsumptionWh: 15.7,
  },
  {
    brand: "Go MN",
    model: "UIK 110C",
    powerConsumptionWh: 62.3,
  },
  {
    brand: "Go MN",
    model: "UIK 210C",
    powerConsumptionWh: 64.3,
  },
  {
    brand: "Go MN",
    model: "UIK 230C",
    powerConsumptionWh: 26.3,
  },
  {
    brand: "Go MN",
    model: "UIK 250C",
    powerConsumptionWh: 15.3,
  },
  {
    brand: "Go MN",
    model: "UIK 270C",
    powerConsumptionWh: 20.3,
  },
  {
    brand: "VANY",
    model: "CEV 1100P",
    powerConsumptionWh: 22,
  },
  {
    brand: "VANY",
    model: "CEV 1300P",
    powerConsumptionWh: 23,
  },
  {
    brand: "VANY",
    model: "CEV 1500P",
    powerConsumptionWh: 24,
  },
  {
    brand: "VANY",
    model: "CEV 1700P",
    powerConsumptionWh: 25,
  },
  {
    brand: "VANY",
    model: "CEV 1900P",
    powerConsumptionWh: 26,
  },
];

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
<div class="flex-col w-10/12 m-auto">
  <div class="mb-3">
      <p class="pb-0 m-0">Step1: Select your brand</p>
      <select class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="brands" id="brand-select">
          
      </select>
  </div>
  <div class="mb-3">
      <p class="pb-0 m-0">Step2: Select your model</p>
      <select class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="models" id="model-select">
          
      </select>
  </div>
  <div class="mb-3">
      <p class="pb-0 m-0">Step3: Input accessory power consumption</p>
      <input class="shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="wattage" type="number" value="55" min="0" max="100"></input>
  </div>
  <div class="mb-3">
      <p class="pb-0 m-0">Step4: Choose your battery</p>
      <div id="battery-list" class="w-100 flex flex-col gap-2">
          
      </div>
  </div>
</div>
`;

const brandSelect: HTMLSelectElement = document.querySelector("#brand-select")!;
const modelSelect: HTMLSelectElement = document.querySelector("#model-select")!;
const accesoryWattageInput: HTMLInputElement =
  document.querySelector("#wattage")!;

const batteryList = document.querySelector("#battery-list")!;

accesaryWattage = parseInt(accesoryWattageInput.value);

const inputOptions = (select: Element, options: string[]) => {
  const optionsHtml = [
    "<option value=''>選択</option>",
    ...options.map((option) => `<option value="${option}">${option}</option>`),
  ].join("");
  select.innerHTML = `${optionsHtml}`;
};

// 電池の電力容量は 電圧 * 容量 となります。この電池を消費電力が  のカメラで使うと、電力容量 / カメラの消費電力 時間使用できる
// バッテリーの終止電圧時の電池の電力がカメラとアクセサリーの合計消費電力を上回らなければいけない。合計消費電力: カメラのpowerConsumptionW + アクセサリーwatt, 終止電圧時の電池の電力: envVoltage * maxDraw
const inputBatterys = (
  cameraWattage: number | null,
  accesoryWattage: number
) => {
  const filterdBatterys = cameraWattage
    ? batterys.filter(({ endVoltage, maxDraw }) => {
        const sumCameraAcceWatt = cameraWattage + accesoryWattage;
        const batteryEndMaxVoltage = endVoltage * maxDraw;

        return batteryEndMaxVoltage > sumCameraAcceWatt;
      })
    : [];

  const batterysHtml = filterdBatterys
    .map(({ batteryName, voltage, capacityAh }) => {
      const batteryVoltCapacity = voltage * capacityAh;
      const sumCameraAcceWatt = cameraWattage! + accesoryWattage;
      const canUseHours = (batteryVoltCapacity / sumCameraAcceWatt).toFixed(1);
      return `
      <div class="flex shadow appearance-none border rounded py-3 px-5 justify-between">
        <p>${batteryName}</p>
        <p>Estimate ${canUseHours} hours</p>
      </div>
    `;
    })
    .join("");
  batteryList.innerHTML = `${batterysHtml}`;
};

const setCameraInputBatterys = (
  brand: string,
  model: string,
  accesaryWattage: number
) => {
  if (brand && model && accesaryWattage) {
    const camera = cameras.find(
      (camera) => camera.brand === brand && camera.model === model
    )!;
    inputBatterys(camera?.powerConsumptionWh, accesaryWattage);
  } else {
    inputBatterys(null, accesaryWattage);
  }
};

const selectOptions: { select: HTMLSelectElement; options: string[] }[] = [
  {
    select: brandSelect,
    options: Array.from(new Set(cameras.map((camera) => camera.brand))),
  },
  {
    select: modelSelect,
    options: [],
  },
];

selectOptions.forEach(({ select, options }) => {
  const selectId = select.id as "brand-select" | "model-select";
  inputOptions(select, options);

  const setSelectValue = (brandValue: string, modelValue: string) => {
    if (selectId === "brand-select") {
      brand = brandValue;
    } else {
      model = modelValue;
    }
  };

  setSelectValue(brand, model);

  select.addEventListener("change", (e) => {
    const value = (e.target as HTMLSelectElement).value;
    setSelectValue(value, value);

    filteredModelOptions = Array.from(
      new Set(
        cameras
          .filter((camera) => camera.brand === brand)
          .map((camera) => camera.model)
      )
    );

    if (selectId === "brand-select") {
      inputOptions(modelSelect, filteredModelOptions);
    }

    setCameraInputBatterys(brand, model, accesaryWattage);
  });
});

accesoryWattageInput.addEventListener("change", (e) => {
  const value = (e.target as HTMLInputElement).value;
  accesaryWattage = parseInt(value);

  setCameraInputBatterys(brand, model, accesaryWattage);
});
