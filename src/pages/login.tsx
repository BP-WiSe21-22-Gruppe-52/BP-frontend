import { Button, Form, Input, Checkbox, Row, Col, Space, Alert } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import React from "react";
import api from "../util/api";
import Routes from "../util/routes";
import { useAppDispatch } from "../redux/hooks";
import {setRefreshToken, setToken} from "../redux/token/tokenSlice";

const Login = () : JSX.Element  => {
  const dispatch = useAppDispatch();
  const [error, setError] = React.useState<null | string>();

  const onFinish = async (values: any) => {
    const username = values["username"];
    const password = values["password"];
    const remember = values["remember"];
    setError(null);

    const response = await api.execute(Routes.login({
      username: username,
      password: password
    })).catch(() => {
      setError("Internal Server Error");
    });
    console.log(response);

    if (!response) return;

    if (!response.success) {
      setError(response.description ?? "Something went wrong.");
      return;
    }

    console.log("Logged in successfully!");
    const token = response.data["session_token"];
    const refreshToken = response.data["refresh_token"];

    if (remember) {
      dispatch(setRefreshToken(refreshToken));
    }
    dispatch(setToken(token));
  };

  const onFinishFailed = (errorInfo: unknown) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <Space size="large" style={{width: "100%", height: "100%", position: "absolute", display: "flex", flexDirection: "column", justifyContent: "center"}}>
      <Col>
        <Row justify="center" style={{fontSize: "30px", fontWeight: "bold"}}>
          Welcome!
        </Row>
        <Row justify="center">
          Please enter your credentials.
        </Row>
      </Col>
      <Row justify="center">
        <Col>
          <Form
            name="login"
            labelCol={{ span: 16 }}
            wrapperCol={{ span: 24  }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >

            {error && <Alert message={error} type="error" showIcon style={{marginBottom: "20px"}}/>}

            <Form.Item
              name="username"
              rules={[{ required: true, message: "Please enter your username!" }]}
            >
              <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username"/>
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please enter your password!" }]}
            >
              <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} placeholder="Password"/>
            </Form.Item>

            <Form.Item name="remember" valuePropName="checked" wrapperCol={{ offset: 8, span: 16 }}>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </Space>
  );
};

export default Login;
