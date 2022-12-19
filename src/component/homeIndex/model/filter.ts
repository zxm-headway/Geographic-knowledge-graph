import { action, makeObservable, observable } from "mobx";

interface IFilter {
  keyword: string;
  category: string;
}

class FilterModel {
  collapsed: boolean = false;
  loading: boolean = false;
  keyword: string = "";
  entities: string[] = [];

  constructor() {
    makeObservable(this, {
      collapsed: observable,
      loading: observable,
      keyword: observable,
      entities: observable,
      toggleCollapsed: action,
      toggleExpand: action,
    });
  }

  toggleCollapsed = () => {
    this.collapsed = true;
  };

  toggleExpand = () => {
    this.collapsed = false;
  };

  selectEntities = (v: string[]) => {
    this.entities = v;
  };

  updateKeyword = (v: string) => {
    this.keyword = v;
  };

  search = () => {
    console.log(`entites:${this.entities}`);
    console.log(`keyword:${this.keyword}`);
    this.toggleCollapsed();
  };
}

export default FilterModel;
