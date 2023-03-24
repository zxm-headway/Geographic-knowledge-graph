import { BackTop, Empty, Layout } from "antd";
import { useMemo } from "react";
import { DetailSider } from "../../../../component/homeIndex/DetailSider";
import { CustomGraph } from "../../../../component/homeIndex/Graph/index";
import { Filter } from "../../../../component/homeIndex/Search/index";
import FilterModel from "../../../../component/homeIndex/model/filter";

import { FilterStore } from "../../../../component/homeIndex/context/MobxStore";

import { GraphModelContext } from "../../../../component/homeIndex/context/GraphModelContext";
import GraphModel from "../../../../component/homeIndex/model/graph";

import { observer } from "mobx-react";
import MyShowInfo from "../../../../component/homeIndex/model/showCluster";
import KgSearch from "./KgSearch";
const { Header, Content } = Layout;


const style: React.CSSProperties = {
  height: 40,
  width: 40,
  lineHeight: '40px',
  borderRadius: 4,
  backgroundColor: '#1088e9',
  color: '#fff',
  textAlign: 'center',
  fontSize: 14,
};


const KgPages: React.FC = observer(() => {
  const graphModel = useMemo(() => new GraphModel(), []);
  const model = useMemo(() => new FilterModel(), []);
  return (
    <GraphModelContext.Provider value={graphModel}>

      <Layout>
        <Filter />
        <Layout >

          <Content >
          
           {FilterStore.keyword?<KgSearch></KgSearch>:<Empty description={"请在搜索框中输入关键词进行检索！"}></Empty>}
          </Content>

        </Layout>
          
       
      </Layout>

    </GraphModelContext.Provider>
  );
});
export default KgPages;
