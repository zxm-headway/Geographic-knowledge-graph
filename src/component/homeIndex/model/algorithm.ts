import { makeObservable, observable, observe } from "mobx";

type AlgorithmType = "type1" | "type2";
interface AlgorithmParams {
  type1: Partial<{}>;
  type2: Partial<{}>;
}
class AlgorithmSettingModel {
  algorithmParams: AlgorithmParams = {
    type1: {
      level: 1,
    },
    type2: {
      key1: "1123",
      key2: "1234",
    },
  };
  constructor() {
    makeObservable(this, {
      algorithmParams: observable,
    });
  }
}

export default AlgorithmSettingModel;
