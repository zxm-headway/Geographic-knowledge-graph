import React ,{useState}from "react";
import { Button, Row, Col,  } from "antd";

// import { Button, } from 'antd';

import data from "../../../../mockDate/realdatacertify.json";

const JsonInOut: React.FC = () => {

  //将上传的文件数据保存在这个变量中
  const [myData, setMyData] = useState([]);

  const [isJsonData, setIsJsonData] = useState(false);

  const handleExport = () => {
    const jsonString = JSON.stringify(data);
    const blob = new Blob([jsonString], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "myData.json";

    document.body.appendChild(link);
    link.click();

    URL.revokeObjectURL(url);
  };

  const handleFileInputChange = (event: any) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (event: any) => {
      try {
        const myData = JSON.parse(event.target.result);
        setMyData(myData);
        setIsJsonData(true);
      } catch (error) {
        setIsJsonData(false);
      }
    };
    reader.readAsText(file);
    };
   
  return (
    <>
      <Row justify="center">
        <Col span={4}>
          <Button onClick={handleExport}>导出数据</Button>
        </Col>
        <Col span={4}>
          <input type="file" onChange={handleFileInputChange} multiple/>

          {myData.map((item: any) => (
            <p>{item.name}</p>
          ))}
        </Col>
        <Col span={4}>
        {isJsonData ? <p>JSON data uploaded</p> : <p>Not a JSON data</p>}
        </Col>
        {/* <Col span={4}>col-4</Col> */}
      </Row>
    </>
  );
};

export default JsonInOut;
