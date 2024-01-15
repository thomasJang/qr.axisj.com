import { ApiErrorCode } from "@/services/error";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { getAppData, setAppData } from "@/store/appData";
import { ApiError } from "./ApiError";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const API_URL = process.env.API_URL ?? "http://localhost:8080";

//
console.table({
  API_URL,
});

const _axios = axios.create({
  baseURL: API_URL,
});

const prepareRequest = async (config: AxiosRequestConfig) => {
  config.headers ??= {
    "Content-Type": "application/json; charset=utf-8",
    Accept: "application/json",
  };
};

export interface ApiRequestConfig extends AxiosRequestConfig {
  tryTime?: number;
  ignoreError?: boolean;
}

export const apiWrapper = async <P>(
  method: string,
  route: string,
  body?: any,
  config: ApiRequestConfig = {},
): Promise<AxiosResponse<P>> => {
  await prepareRequest(config);

  // remove undefined | null
  for (const key in body) {
    if (body[key] === undefined) {
      delete body[key];
    }
  }

  let bodyArr: any[] = [];
  let searchParams: string = "";
  switch (method) {
    case "request":
      bodyArr = [config];
      break;
    case "get":
    case "delete":
    case "head":
      if (body?.pageNumber !== undefined) {
        body.pageNumber = Math.max(body.pageNumber - 1, 0);
      }
      searchParams = new URLSearchParams(body).toString();
      bodyArr = [route + `${searchParams ? "?" + searchParams : ""}`, config];
      break;
    case "post":
    case "put":
    case "patch":
      bodyArr = [route, body, config];
      break;
    default:
      break;
  }

  if (!bodyArr.length) {
    throw { code: "ERR" };
  }

  const { data, ...rest } = await (_axios as any)[method](...bodyArr);

  if (!config.ignoreError && data.error && data.error.code) {
    const tryTime = config.tryTime ?? 0;

    if (data.error.code === ApiErrorCode.EXPIRED_TOKEN && tryTime < 1) {
      const appData = getAppData();
      if (appData) {
        const { data: _data } = await _axios["post"]("/v2/refresh", null, {
          headers: {
            token: appData.token,
          },
        });
        if (_data.error && _data.error.code) {
          await delay(10);
          if (_data.error.code === ApiErrorCode.INVALID_TOKEN) {
            // await useUserStore.getState().signOut();
          }
          config.tryTime = tryTime + 1;
          throw new ApiError(_data.error.code, _data.error.message, _data.error.data);
        }

        if (_data && _data.rs.Authorization && _data.rs.Token) {
          setApiHeader(_data.rs.Authorization);
          setAppData({
            ...appData,
            authorization: _data.rs.Authorization,
            token: _data.rs.Token,
          });
        }

        return await apiWrapper(method, route, body, config);
      }
    }
    throw new ApiError(data.error.code, data.error.message, data.error.data);
  }

  return { data: data as P, ...rest };
};
export const setApiHeader = (token: string) => {
  _axios.defaults.headers.common["Authorization"] = token;
};
