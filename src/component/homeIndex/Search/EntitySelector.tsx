import { Tag, TreeSelect, TreeSelectProps } from "antd";
import styled from "styled-components";
import { geoEntities } from "./config";
interface EntitySelectorProps extends TreeSelectProps {
  value?: string[];
  onChange?: (v: string[]) => void;
}
export const EntitySelector: React.FC<EntitySelectorProps> = (props) => {
  return (
    <TreeSelect
      {...props}
      placeholder={"请选择实体类别"}
      treeData={geoEntities}
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
        borderRadius: 6,
        marginLeft: -8,
      }}
      dropdownRender={(menuNode) => (
        <DropdownContainer>{menuNode}</DropdownContainer>
      )}
      maxTagCount={1}
      bordered={false}
      multiple
    />
  );
};

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
