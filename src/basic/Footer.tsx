import React from "react";
import styled from "styled-components";

const Footer: React.FC = () => {
  return (
    <FooterBlock>
      <Container>
        <Text>
          <a href="mailto:notice.rokgg@gmail.com">Contact Us</a>
        </Text>
      </Container>
    </FooterBlock>
  );
};

export default Footer;

const FooterBlock = styled.footer`
  background-color: #1e2024;
  min-height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
`;

const Container = styled.div`
  padding: 20px;
`;

const Text = styled.p`
  color: #fff;

  & > a {
    color: #fff;
  }
`;
