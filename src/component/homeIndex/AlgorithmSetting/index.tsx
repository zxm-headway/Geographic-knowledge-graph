import AlgorithmSettingModel from "../model/algorithm";
import { InputNumber, Modal, Select, Space } from "antd";
import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import styled from "styled-components";

export const AlgorithmSetting = observer(() => {
  const model = useMemo(() => new AlgorithmSettingModel(), []);
  const [activateModal, setActivateModal] = useState<boolean>(false);
  const [currentAlgo, setCurrentAlgo] = useState<string>("");
  const reset = () => setActivateModal(false);
  return (
    <SettingContainer>
      <Space size={8}>
        <Field>
          <Label>算法分类1</Label>
          <Select
            placeholder={"请选择算法"}
            onSelect={(v: string) => {
              setCurrentAlgo(v);
              setActivateModal(true);
            }}
            options={[
              {
                label: "算法1",
                value: "type1-1",
              },
              {
                label: "算法2",
                value: "type1-2",
              },
              {
                label: "算法3",
                value: "type1-3",
              },
            ]}
          />
        </Field>
        <Field>
          <Label>算法分类2</Label>
          <Select
            placeholder={"请选择算法"}
            onSelect={(v: string) => {
              setCurrentAlgo(v);
              setActivateModal(true);
            }}
            options={[
              {
                label: "算法1",
                value: "type2-1",
              },
              {
                label: "算法2",
                value: "type2-2",
              },
              {
                label: "算法3",
                value: "type2-3",
              },
            ]}
          />
        </Field>
        <Field>
          <Label>算法分类3</Label>
          <Select
            placeholder={"请选择算法"}
            onSelect={(v: string) => {
              setCurrentAlgo(v);
              setActivateModal(true);
            }}
            options={[
              {
                label: "算法1",
                value: "type3-1",
              },
              {
                label: "算法2",
                value: "type3-2",
              },
              {
                label: "算法3",
                value: "type3-3",
              },
            ]}
          />
        </Field>
      </Space>
      <Modal
        open={activateModal}
        title={`算法${currentAlgo}参数`}
        onOk={reset}
        onCancel={reset}
      >
        <span>层级:</span>
        <InputNumber />
      </Modal>
    </SettingContainer>
  );
});

const SettingContainer = styled.div`
  width: 100%;
  background-color: #fff;
  padding: 10px;
`;

const Label = styled.span`
  margin-right: 4px;
`;
const Field = styled.div`
  div:nth-child(0n + 2) {
    width: 100px;
  }
`;
