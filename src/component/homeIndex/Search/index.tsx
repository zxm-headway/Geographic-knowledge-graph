import { Button, Col, Drawer, Input, Row, Select, TreeSelect } from "antd";
// import { useMemo } from "react";
import { FilterStore } from "../context/MobxStore";
// import { FilterFilterStoreContext } from "../context/SearchFilterStoreContext";
import { observer } from "mobx-react";
import { EntitySelector } from "./EntitySelector";
import { DownOutlined, SearchOutlined, UpOutlined } from "@ant-design/icons";
import * as S from "./styles";
import MyShowInfo from "../model/showCluster";
import styled from "styled-components";

interface FilterProps { }

export const Filter: React.FC<FilterProps> = observer(() => {


  const showGraghTF = () => {
    FilterStore.toggleExpand()
    console.log(MyShowInfo.showGragh)
    MyShowInfo.setShowGragh()
    console.log(MyShowInfo.showGragh)
  }

  const hiddenGragh = () => {
    FilterStore.toggleCollapsed()
    console.log(MyShowInfo.showGragh)
    MyShowInfo.setShowGragh()
    console.log(MyShowInfo.showGragh)
  }

  const onChangeKey = (e: any) => {
    FilterStore.updateKeyword(e.target.value);
  }
  return (
    <S.Container collapsed={FilterStore.collapsed}>
      <S.Center>
        <S.SearchContainer>
          <EntitySelector
            border={false}
            style={{
              width: "30%",
            }}
            size="large"
          />
          <Input
            style={{
              width: "70%",

            }}
            size={"large"}
            placeholder={"请输入关键词"}
            onFocus={FilterStore.toggleExpand}
            value={FilterStore.keyword}
            suffix={<SearchOutlined />}
            bordered={false}
            onChange={(e) => {
              onChangeKey(e)
            }}
            onPressEnter={FilterStore.search}
          />
        </S.SearchContainer>
      </S.Center>
      <CollapseButton
        type="default"
        icon={FilterStore.collapsed ? <DownOutlined /> : <UpOutlined />}
        onClick={FilterStore.collapsed ? showGraghTF : hiddenGragh}
      />
    </S.Container>
  );
});

const CollapseButton = styled(Button)`
  position: absolute;
  bottom: 20px;
  right: 10%;
`;
