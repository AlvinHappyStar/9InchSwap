import { useRef } from "react";
import styled from "styled-components";

const StyledTable = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  scroll-margin-top: 64px;

  // background-color: ${({ theme }) => theme.card.background};
  background: linear-gradient(90deg, rgb(10, 0, 8) 0%, rgb(9, 0, 8) 50%, rgb(8, 1, 8) 100%);
  border-radius: 16px;
  margin: 16px 20px;
  > div:not(:last-child) {
    //  ${({ theme }) => theme.colors.disabled};
    border-bottom: 2px solid rgb(37, 1, 31);
  }

  > div:last-child {
    border-bottom-left-radius: ${({ theme }) => theme.radii.card};
    border-bottom-right-radius: ${({ theme }) => theme.radii.card};
  }
`;

const StyledTableBorder = styled.div`
  border-radius: ${({ theme }) => theme.radii.card};
  // background-color: ${({ theme }) => theme.colors.cardBorder};
  // background-color: #060103;
  
  padding: 1px 1px 3px 1px;
  background-size: 400% 400%;
`;

export const PoolsTable: React.FC<React.PropsWithChildren> = ({ children }) => {
  const tableWrapperEl = useRef<HTMLDivElement>(null);

  return (
    <StyledTableBorder>
      <StyledTable id="pools-table" role="table" ref={tableWrapperEl}>
        {children}
      </StyledTable>
    </StyledTableBorder>
  );
};
