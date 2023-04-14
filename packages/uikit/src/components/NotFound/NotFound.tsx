import styled from "styled-components";
import { NextSeo } from "next-seo";
import { Button, Heading, Text, LogoIcon, LogoRoundIcon } from "@pancakeswap/uikit";
import { useTranslation } from "@pancakeswap/localization";
import Link from "next/link";

const StyledNotFound = styled.div`
  align-items: center;
  display: flex;
  flex-direction: column;
  height: calc(40vh);
  justify-content: center;
`;

const NotFound = ({ statusCode = 404 }: { statusCode?: number }) => {
  const { t } = useTranslation();

  return (
    <>
      <NextSeo title="404" />
      <StyledNotFound>
        <img style={{
          width: '80px',
          marginRight: '10px',
        }}
          alt=''
          src='/images/coin.png' />
        <Heading scale="xxl">{statusCode}</Heading>
        <Text mb="16px">{t("Oops, page not found.")}</Text>
        <Link href="/" passHref>
          <Button as="a" scale="sm">
            {t("Back Home")}
          </Button>
        </Link>
      </StyledNotFound>
    </>
  );
};

export default NotFound;
