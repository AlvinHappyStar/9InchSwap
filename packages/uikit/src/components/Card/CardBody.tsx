import styled from "styled-components";
import { space, SpaceProps } from "styled-system";

export type CardBodyProps = SpaceProps;

const CardBody = styled.div<CardBodyProps>`
  ${space}
  // background: rgba(11, 5, 8, 0.2);
  background: linear-gradient(90deg, #180110 0%, #160110 50%, #140110 100%);
`;

CardBody.defaultProps = {
  p: "24px",
};

export default CardBody;
