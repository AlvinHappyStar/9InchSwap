import styled from "styled-components";
import { space, SpaceProps } from "styled-system";

export type CardFooterProps = SpaceProps;

const CardFooter = styled.div<CardFooterProps>`
  // border-top: 1px solid ${({ theme }) => theme.colors.cardBorder};
  ${space}
  background: linear-gradient(90deg, #180110 0%, #160110 50%, #140110 100%);
  // background: rgba(11, 5, 8, 0.2);
  // padding-top: 60px;
`;

CardFooter.defaultProps = {
  p: "24px",
};

export default CardFooter;
