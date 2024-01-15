import "@/styles/globals.css";
import "@/styles/ant-modal.css";
import { Modals } from "@/components/Modals";
import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ConfigProvider>
        <StyleProvider hashPriority='high'>
          <Component {...pageProps} />
          <Modals />
        </StyleProvider>
      </ConfigProvider>
    </>
  );
}
