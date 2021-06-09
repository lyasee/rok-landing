import React from "react";
import styled from "styled-components";

interface Props {}

const Header: React.FC<Props> = () => {
  return (
    <HeaderBlock>
      <Logo>알오케이지지</Logo>
    </HeaderBlock>
  );
};

export default Header;

const HeaderBlock = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-left: 20px;
  padding-right: 20px;
  height: 54px;
  border-bottom: 1px solid #353b46;
`;

const Logo = styled.h4`
  margin: 0;
  color: #fff;
  font-family: "NIXGONB-Vb";
`;
