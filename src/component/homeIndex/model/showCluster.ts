import { action, observable } from 'mobx';

class MyShow {
  @observable showCluters:Boolean =false ;
  @observable showGragh:Boolean = false

  @action setShowCluters() {
    this.showCluters = !this.showCluters
  }
  @action setShowGragh(){
    this.showGragh = !this.showGragh
  }
}

const MyShowInfo = new MyShow()

export default MyShowInfo