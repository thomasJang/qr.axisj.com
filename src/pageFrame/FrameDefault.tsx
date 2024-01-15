import { Nav } from "@/components/Nav";
import styled from "@emotion/styled";

interface Props {
  children: React.ReactNode;
}

export function FrameDefault({ children }: Props) {
  return (
    <Main>
      <Wrap>{children}</Wrap>
    </Main>
  );
}

const Main = styled.main``;
const Wrap = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;
