import { useI18n } from "@/i18n";
import { ApiErrorCode } from "@/services";
import { useModalStore } from "@/store/useModalStore";
import { SMixinFlexRow } from "@/styles";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  ExclamationCircleFilled,
  InfoCircleFilled,
  QuestionCircleFilled,
} from "@ant-design/icons";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import { Button, Divider, Modal } from "antd";
import React, { useMemo } from "react";

export type DialogType = "info" | "success" | "error" | "warning" | "confirm";

export interface DialogRequest {
  type?: DialogType;
  className?: string;
  width?: string | number;
  title?: React.ReactNode;
  content: React.ReactNode;
  message?: string;
  data?: string;
  code?: number;
  keyboard?: boolean;
}

export interface DialogResponse {}

interface Props {
  open: boolean;
  onOk: (value: DialogResponse) => DialogResponse;
  onCancel: (reason?: any) => void;
  params?: DialogRequest;
  afterClose: () => void;
}

function Icon({ type }: { type?: DialogType }) {
  switch (type) {
    case "success":
      return <CheckCircleFilled />;
    case "error":
      return <CloseCircleFilled />;
    case "warning":
      return <ExclamationCircleFilled />;
    case "confirm":
      return <QuestionCircleFilled />;
    default:
      return <InfoCircleFilled />;
  }
}

export function DialogModal({ open, onCancel, onOk, afterClose, params }: Props) {
  const { t } = useI18n();
  const { title, content } = useMemo(() => {
    if (params?.type === "error") {
      const [errName] = Object.entries(ApiErrorCode).find(([_, v]) => v === "" + params?.code) ?? [];

      const errContents: string[] = [];
      if (params?.content) {
        errContents.push("" + params?.content);
      }
      if (params?.message) {
        errContents.push(params?.message);
      }
      if (params?.data) {
        errContents.push(params?.data);
      }

      return {
        title: params?.title ?? `${errName ?? params?.code}`,
        content: (
          <>
            {errContents.join("\n") || "Unknown error occurred"}
            <Divider style={{ margin: "10px 0" }} />
            {params?.code && `Code: ${params?.code}`}
          </>
        ),
      };
    } else if (params?.type === "confirm") {
      return {
        title: params?.title ?? "Confirm",
        content: params?.content,
      };
    }

    return {
      title: params?.title ?? "Alert",
      content: params?.content,
    };
  }, [params]);

  return (
    <Modal
      width={params?.width ?? 412}
      transitionName={"slide-down"}
      closable={false}
      maskClosable={false}
      keyboard={params?.keyboard ?? true}
      {...{ open, onOk: onOk as any, onCancel, afterClose }}
      onCancel={() => {
        onCancel("cancel");
      }}
      footer={null}
      styles={{
        body: {
          padding: 0,
        },
      }}
    >
      <Container>
        <Header type={params?.type ?? "info"}>
          <div role={"img"}>
            <Icon type={params?.type} />
          </div>
          {title}
        </Header>
        <Body>{content}</Body>
        <Footer>
          <Button type={"primary"} onClick={onOk}>
            {t("확인")}
          </Button>

          {params?.type === "confirm" && <Button onClick={() => onCancel("cancel")}>{t("취소")}</Button>}
        </Footer>
      </Container>
    </Modal>
  );
}

const Container = styled.div``;
const Header = styled.div<{ type: DialogType }>`
  ${SMixinFlexRow("flex-start", "center")};
  gap: 10px;
  font-size: 16px;
  font-weight: 600;

  div[role="img"] {
    width: 20px;

    font-size: 20px;

    ${({ type }) => {
      if (type === "error") {
        return css`
          color: var(--error-color);
        `;
      }
      return css`
        color: var(--primary-color);
      `;
    }}
  }
`;
const Body = styled.div`
  padding: 5px 0 0 30px;
`;
const Footer = styled.div`
  ${SMixinFlexRow("flex-end", "center")};
  margin-top: 1em;
  gap: 6px;
`;

export async function dialogModal(params?: DialogRequest) {
  const openModal = useModalStore.getState().openModal;
  return await openModal<DialogResponse>((open, resolve, reject, _onClose, afterClose) => (
    <DialogModal open={open} onOk={resolve} onCancel={reject} afterClose={afterClose} params={params} />
  ));
}
