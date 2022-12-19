import { Layout } from "antd";
import { useMemo } from "react";
import { DetailSider} from "../../../../component/homeIndex/DetailSider";
import { CustomGraph } from "../../../../component/homeIndex/Graph/index";
import { Filter } from "../../../../component/homeIndex/Search/index";
import FilterModel from "../../../../component/homeIndex/model/filter";

import { GraphModelContext } from "../../../../component/homeIndex/context/GraphModelContext";
import GraphModel from "../../../../component/homeIndex/model/graph";
import { AlgorithmSetting } from "../../../../component/homeIndex/AlgorithmSetting";
import { observer } from "mobx-react";
import MyShowInfo from "../../../../component/homeIndex/model/showCluster";
const { Header, Content } = Layout;



const KgPages: React.FC = observer(() => {
  const graphModel = useMemo(() => new GraphModel(), []);
  const model = useMemo(() => new FilterModel(), []); return (
    <GraphModelContext.Provider value={graphModel}>
    
        <Layout>
          <Filter />
          <Layout >

            <Content >
              <AlgorithmSetting />
              <CustomGraph />
            </Content>

            <DetailSider/>
            
          </Layout>
        </Layout>
     
    </GraphModelContext.Provider>
  );
});
export default KgPages;
