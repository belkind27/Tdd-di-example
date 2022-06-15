export const REST_CLIENT_Symbol = Symbol("RestClient");

export interface RestClient {
  get: <T>(url: string) => Promise<T>;
}
