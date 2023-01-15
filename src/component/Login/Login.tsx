import { Form, Input, Button } from "antd";
import React, { useState } from "react";
import Styled from '../css/login.module.css';
import img from '../../assets/images/logo192.png'
import { observer } from "mobx-react";


const Login: React.FC = observer((props: any) => {
  const [form] = Form.useForm(); // 使用 Form.useForm 创建表单实例
  const [formData, setFormData] = useState({});

  const login = () => {
    props.history.push('/home')
  }// 使用 useState 管理表单数据

  // 表单提交事件处理器
  const handleSubmit = (values: any) => {
    setFormData(values);
    // 进行其他处理，如验证或提交表单
  };

  return (
    <div id={Styled.myLogin}>
      <div className={Styled.login_container}>
        <div className={Styled.avatar_container}>
          <img src={img} alt=""></img>
        </div>
        <Form
          form={form}
          onFinish={handleSubmit}
          className={Styled.form_login}
        >
          <Form.Item label="Username" name="username">
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="password" />
          </Form.Item>
          <Form.Item className={Styled.btns}>
            <Button type="primary" htmlType="submit" onClick={() => {
              login()
            }}>
              登录
            </Button>
            <Button type="primary" htmlType="submit">
              重置
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
)
export default Login;
