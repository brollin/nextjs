import { makeAutoObservable } from "mobx";

export default class Store {
  initialized = true;

  constructor() {
    makeAutoObservable(this);
  }
}
