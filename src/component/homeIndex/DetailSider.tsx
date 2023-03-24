import { AlignLeftOutlined } from "@ant-design/icons";
import { Layout } from "antd";
// import { toJS } from "mobx";
import { observer } from "mobx-react";
// import MyShowInfo from "./model/showCluster";
// import { useContext, useMemo } from "react";
import styled from "styled-components";
// import { GraphModelContext } from "./context/GraphModelContext";

// interface DetailProps {}

export const DetailSider: React.FC= observer((props:any) => {
  // const model = useContext(GraphModelContext);
  // const clone = toJS(model.selectedNode);

  const {isOpenProps,} = props
 
  return (
    <Layout.Sider
      
      
    theme="light"
    collapsedWidth={0}
    width={isOpenProps ? "55%" : 0}
    reverseArrow
    collapsible={!!isOpenProps}
    trigger={<AlignLeftOutlined />}
    style={{position:'relative',zIndex:'100',}}
    onClick={()=>{

    }}
      
     
    >
      <DetailContainer>
        <div>
        已选中节点
          {/* {`已选中节点`} */}
          {/* {model.selectedNode?.id} */}
        </div>
        {/* <p>{JSON.stringify(clone)}</p> */}
      </DetailContainer>
    </Layout.Sider>
  );
});
const DetailContainer = styled.div`

  padding: 24px;
 
`;
