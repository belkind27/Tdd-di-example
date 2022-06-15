import {
  ClassProvider,
  FactoryProvider,
  InjectionToken,
  ValueProvider,
} from "tsyringe";
import { constructor } from "tsyringe/dist/typings/types";

export type Providers<T> =
  | ValueProvider<T>
  | FactoryProvider<T>
  | ClassProvider<T>
  | constructor<T>;

export interface InjectionObject<T> {
  token: InjectionToken<T>;
  provider: Providers<T>;
}

export interface Config {
  get: <T>(setting: string) => T;
  has: (setting: string) => boolean;
}