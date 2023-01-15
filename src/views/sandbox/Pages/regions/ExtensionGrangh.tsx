import React from 'react';
import { Row, Col, Card, Collapse } from 'antd';

import Graphin, { Utils } from '@antv/graphin';
import { ContextMenu } from '@antv/graphin-components';
import { EntitySelector } from '../../../../component/homeIndex/Search/EntitySelector';
import { TagFilled, DeleteFilled, ExpandAltOutlined } from '@ant-design/icons';

// 引入Graphin CSS
const { Panel } = Collapse;
const { Menu } = ContextMenu;
const defSpreingLen = (_edge: any, source: any, target: any) => {
  // NOTE: 固定200还是效果好
  // return 200;
  /** 默认返回的是 200 的弹簧长度 */
  /** 如果你要想要产生聚类的效果，可以考虑 根据边两边节点的度数来动态设置边的初始化长度：度数越小，则边越短 */
  const nodeSize = 30;
  const Sdegree = source.data.layout.degree;
  const Tdegree = target.data.layout.degree;
  const minDegree = Math.min(Sdegree, Tdegree);
  console.log(minDegree < 3 ? nodeSize * 5 : minDegree * nodeSize);
  return minDegree < 3 ? nodeSize * 5 : minDegree * nodeSize;
};

const ExtensionGrangh = () => {
  const [state, setState] = React.useState({
    selected: [],
    data: Utils.mock(5).circle().graphin(),
  });

  const handleChange = (menuItem: any, menuData: any) => {
    console.log(menuItem, menuData);
    const count = 4;
    const expandData = Utils.mock(count).expand([menuData]).type('company').graphin();

    setState({
      ...state,
      data: {
        // 还需要对Node和Edge去重，这里暂不考虑
        nodes: [...state.data.nodes, ...expandData.nodes],
        edges: [...state.data.edges, ...expandData.edges],
      },
    });
  };

  const onChange = (key: string | string[]) => {
    console.log(key);
  };
  const { data } = state;
  return (
    <div className="App">
      <Row gutter={16}>

        <Col span={12}>
          <Card title="地点知识图扩展">
            <EntitySelector />
            <Graphin
              data={data}
              layout={{
                type: 'graphin-force',
                preset: {
                  type: 'concentric',
                },
                animation: true,
                defSpringLen: defSpreingLen,
              }}
            >
              <ContextMenu bindType="node" style={{ width: 100 }}>
                <Menu
                  bindType="node"
                  options={[
                    {
                      key: 'expand',
                      icon: <ExpandAltOutlined />,
                      name: '一度扩散',
                    },
                    {
                      key: 'tag',
                      icon: <TagFilled />,
                      name: '节点打标',
                    },
                    {
                      key: 'delete',
                      icon: <DeleteFilled />,
                      name: '节点删除',
                    },
                  ]}
                  onChange={handleChange}
                />
              </ContextMenu>
            </Graphin>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="地点信息">
            <Collapse defaultActiveKey={['1']} onChange={onChange}>
              <Panel header="Information" key="1">
                <p>
                  西南大学（Southwest University），主体位于重庆市北碚区，是中华人民共和国教育部直属，农业农村部、重庆市共建的全国重点大学。位列国家“双一流”、“211工程”、“985工程优势学科创新平台”建设高校、“双一流”农科联盟成员高校。入选“111计划”、“2011计划”、“百校工程”、卓越农林人才教育培养计划、卓越教师培养计划、国家大学生创新性实验计划、国家级大学生创新创业训练计划、国家建设高水平大学公派研究生项目、国家大学生文化素质教育基地、中国政府奖学金来华留学生接收院校。
                  学校溯源于1906年建立的川东师范学堂，1936年更名为四川省立教育学院。1950年四川省立教育学院与国立女子师范学院合并建立西南师范学院，农艺、园艺和农产制造等系与1946年创办的私立相辉学院等合并建立西南农学院。1985年两校分别更名为西南师范大学、西南农业大学。2000年重庆市轻工业职业大学并入西南师范大学；2001年西南农业大学、四川畜牧兽医学院、中国农业科学院柑桔研究所合并组建为新的西南农业大学。2005年西南师范大学、西南农业大学合并组建为西南大学。
                  截至2022年3月，学校占地约8295亩，校舍面积187万平方米；设有43个教学单位，开设102个本科专业；拥有29个一级学科博士学位授权点、54个一级学科硕士学位授权点、2种专业博士学位、27种专业硕士学位、博士后科研流动站（工作站）27个；有专任教师3162人，普通本科生近40000人，硕士、博士研究生14000余人，留学生近2000人。
                </p>
              </Panel>
            </Collapse>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ExtensionGrangh;