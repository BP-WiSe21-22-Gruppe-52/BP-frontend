import React from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import Container from "../shared/container";
import helper from "../util/helper";
import { Alert, Button, Col, Divider, Modal, Row, Select, Space } from "antd";
import Api from "../util/api";
import Routes from "../util/routes";
import {unsetRefreshToken, unsetToken} from "../redux/token/tokenSlice";
import ExclamationCircleOutlined from "@ant-design/icons/lib/icons/ExclamationCircleOutlined";
import Translations from "../localization/translations";
import { useTranslation } from "react-i18next";

const Settings = () : JSX.Element => {
  const [error, setError] = React.useState<null | string>();
  const [success, setSuccess] = React.useState<null | string>();

  const dispatch = useAppDispatch();
  const { t, i18n } = useTranslation();
  const token = useAppSelector(state => state.token.token)!;

  const logout = () => {
    dispatch(unsetRefreshToken());
    dispatch(unsetToken());
  };

  const changeLanguage = (lng: string) => i18n.changeLanguage(lng).catch(console.error);

  function showDeleteConfirm() {
    Modal.confirm({
      title: Translations.settings.deleteModalTitel,
      icon: <ExclamationCircleOutlined />,
      content: Translations.settings.deleteModalMSG,
      okText: Translations.settings.deleteModalConfirm,
      okType: "danger",
      cancelText: Translations.settings.deleteModalCancel,
      onOk() {
        onConfirmDeleteAccount();
      },
      onCancel() {
        console.log("Cancelled Account Deletion");
      },
    });
  }

  
  const onConfirmDeleteAccount = async () => {
    setError(null);
    const response = await Api.execute(Routes.deleteAccount());
    console.log(response);

    if (!response) return;

    if (!response.success) {
      setError(response.description ?? Translations.errors.unknownError);
      return;
    }
    setSuccess(response.description ?? Translations.settings.successfullyDeletedAccount);

    setTimeout(() => setSuccess(null), 5000);

    await new Promise((resolve) => setTimeout(resolve, 5000)); // sleep for 5 Seconds

    dispatch(unsetRefreshToken());
    dispatch(unsetToken());
  };

  return (
    <Container
      currentPage="settings"
      color="blue"
    >
      <Col>
        <Row justify="center" style={{width: "100%", fontSize: "30px", fontWeight: "bold"}}>
          {t(Translations.settings.accountSettings)}
        </Row>
        <br />
        <br />
        <Space
          size="large"
          style={{
            width: "100%",
            position: "absolute",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
        
          <Col>
            <Divider plain style={{fontSize: "20px", fontWeight: "bold"}}>
              {t(Translations.settings.changeLanguage)}
            </Divider>
            
            <Row justify="center">
              <Select defaultValue={i18n.language} onChange={changeLanguage}>
                <Select.Option value="de" key="de">
              Deutsch
                </Select.Option>
                <Select.Option value="en" key="en">
              English
                </Select.Option>
              </Select>
            </Row>

            <Divider plain style={{fontSize: "20px", fontWeight: "bold"}}>
              {t(Translations.settings.logout)}
            </Divider>

            <Row justify="center">
              <Button onClick={logout}>{t(Translations.home.logout)}</Button>
            </Row>
        
            <Divider plain style={{fontSize: "20px", fontWeight: "bold"}}>
              {t(Translations.settings.dangerZone)}
            </Divider>

            <Row justify="center">
              {success && <Alert message={success} type="success" showIcon style={{marginBottom: "20px"}}/>}
              {error && <Alert message={error} type="error" showIcon style={{marginBottom: "20px"}}/>}
            </Row>
            <Row justify="center">
              <Button onClick={showDeleteConfirm} danger disabled={helper.getAccountType(token) == "admin"}>{t(Translations.settings.deleteAccount)}</Button>
            </Row>
        
          </Col>
        </Space>
      </Col>
    </Container>
  );
};

export default Settings;
