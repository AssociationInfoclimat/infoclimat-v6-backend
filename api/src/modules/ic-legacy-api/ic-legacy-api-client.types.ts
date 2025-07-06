// Get ticket for weather forecast API:
export type ApiTicketDataEntropy = string; // "d41d8cd98f00b204e9800998ecf8427e"
export type ApiTicketData = string; // "UDMLaQR4UDJdMgYsBWBUb1JpBXJQNgY9A2JWMAI1BGEHNVA7VWQBMAtoUm4AMgAyAThXbABmAD9aPFUyBT8CblA2C2gEb1A8XT8GZwUyVDBSYwVoUDYGPgM0VhQCSAQTBxFQNlU2AXoLZFJ6AHkAMgEmVz8AZwBPWkFVFAVGAmNQNwt2BGNQRV1OBkEFEVR7UmsFclA1Bjo="

/* https://www.infoclimat.fr/api/previ/undefined;undefined;undefined/ticket */
export type GetOpenDataApiTicketResponse = {
  payload: {};
  responseData: {
    '0': string; // "51.5,-0.13"
    '1': number; // 51.5
    '2': number; // -0.12999999999999545
    '3': ApiTicketData;
    '4': ApiTicketDataEntropy;
  };
};

export type ForecastWeatherType = 'averse' | string; // TODO: type this

/* https://www.infoclimat.fr/api/previ/{<ApiTicketData>}/get?u={<ApiTicketDataEntropy>} */
type ForecastDay = {
  // Day of the week:
  day: string; // "Jeudi",
  // Temperature max:
  tmax: number; // 24.5,
  // Temperature min:
  tmin: number; // 18.2,
  // Rain (mm):
  rr: number; // 1.6875,
  // Snow:
  snow: number; // 0,
  // Pressure:
  press: number; // 1015,
  // Wind speed (km/h):
  raf: number; // 40,
  // Wind direction Letter to render icon:
  dir: string; // "N",
  // Wind direction Letter:
  vdir: string; // "N",
  p: {
    // To build the day icon:
    k: ForecastWeatherType; // "averse",
    // Day description: (was named "dc")
    v: string; // "Faible risque de pluie"
  };
};
export type GetOpenDataApiForecastResponse = {
  payload: {};
  reponseData: {
    state: 'ok' | string; // "ok",
    updated: string; // "08", // hour of the day it's been updated
    now: string; // "22:17:09",
    name: string; // "51.5,-0.13",
    dy: 'demain' | string; // "demain",
    // Coming days weather forecast:
    '0': ForecastDay;
    '1': ForecastDay;
    '2': ForecastDay;
    '3': ForecastDay;
    // To show the right image graph:
    b64: string; // b64 string
    f64: 'png';
    // To redirect user: `/previsions-meteo/details/${d.vkey}/${d.seo}.html`
    seo: string; // "515-013",
    vkey: string; // "3017393",
  };
};
