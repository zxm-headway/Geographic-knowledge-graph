import { Tag, TreeSelect, TreeSelectProps } from "antd";
import styled from "styled-components";
import { geoEntities } from "./config";

import { FilterStore } from '../context/MobxStore'
import { observer } from "mobx-react";

interface EntitySelectorProps extends TreeSelectProps {
  value?: string[];
  border?: boolean;
  onChange1?: (v: string[]) => void;
}
export const EntitySelector: React.FC<EntitySelectorProps> = observer((props) => {

  const onChange = (value: any, label: any) => {
    FilterStore.selectEntities(label)
    console.log(value, label)
  }
  return (
    <TreeSelect
      {...props}
      placeholder={"请选择实体类别"}
      treeData={geoEntities}

      onChange={onChange}
      showCheckedStrategy={TreeSelect.SHOW_CHILD}
      tagRender={(props) => (
        <CustomTag {...props} color="#2db7f5">
          {props.label}
        </CustomTag>
      )}

      maxTagPlaceholder={(omittedValues) => (
        <CustomTag color="#2db7f5">{omittedValues.length}</CustomTag>
      )}
      dropdownStyle={{
        background: "rgba(0,0,0,0.9)",

      }}
      dropdownRender={(menuNode) => (
        <DropdownContainer>{menuNode}</DropdownContainer>
      )}
      maxTagCount={1}
      bordered={props.border}
      multiple
    />
  );
});

const DropdownContainer = styled.div`
  .ant-select-tree {
    color: #fff;
    background: inherit;
    .ant-select-tree-node-selected {
      color: #000;
    }
  }
`;
const CustomTag = styled(Tag)``;
