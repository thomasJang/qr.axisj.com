import styled from "@emotion/styled";
import { Button, Segmented, Space } from "antd";
import { usePathname, useRouter } from "next/navigation";

interface Props {}

export function Nav({}: Props) {
  const router = useRouter();
  const path = usePathname();

  return (
    <Div>
      <Wrap>
        <Segmented
          options={[
            { label: "Home", value: "/" },
            { label: "dialogTest", value: "/dialogTest" },
            { label: "mediaQuery", value: "/mediaQuery" },
          ]}
          value={path}
          onChange={(value) => {
            router.push(value as string);
          }}
        />
      </Wrap>
    </Div>
  );
}

const Div = styled.nav`
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
`;
const Wrap = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;
