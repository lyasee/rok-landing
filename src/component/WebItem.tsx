import React from "react";
import styled from "styled-components";

interface Props {
  name: string;
  icon?: string;
  description: string;
  url?: string;
  status?: string;
}

const WebItem: React.FC<Props> = ({ name, icon, description, url, status }) => {
  return (
    <WebIteBlock>
      <WebIcon>
        <WebIconText>R</WebIconText>
      </WebIcon>
      <TextContainer>
        <Name>{name}</Name>
        <Description>{description}</Description>

        {url ? (
          <DownloadButtonWrapper>
            <a href={url} target="_blank" rel="noreferrer">
              <DownloadButton>
                <DownloadText>바로가기</DownloadText>
              </DownloadButton>
            </a>
          </DownloadButtonWrapper>
        ) : (
          <DownloadButtonWrapper>
            <DownloadButton>
              <DownloadText>{status || "SOON"}</DownloadText>
            </DownloadButton>
          </DownloadButtonWrapper>
        )}
      </TextContainer>
    </WebIteBlock>
  );
};

export default WebItem;

const WebIteBlock = styled.div`
  display: flex;
`;

const WebIcon = styled.div`
  height: 100px;
  width: 100px;
  border-radius: 8px;
  background-color: #16161f;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const WebIconText = styled.span`
  font-size: 2rem;
  font-weight: bold;
  color: #e28a18;
`;

const TextContainer = styled.div`
  margin-top: 4px;
  margin-left: 16px;
`;

const Name = styled.h3`
  color: #fff;
  margin: 0;
`;

const Description = styled.p`
  margin: 4px 0;
  color: #ccc;
  font-size: 0.825rem;
`;

const DownloadButtonWrapper = styled.div`
  margin-top: 12px;
  display: flex;
  font-size: 0.725rem;
`;

const DownloadButton = styled.div`
  padding: 5px 8px;
  background-color: #444343;
  border-radius: 4px;
`;

const DownloadText = styled.div`
  color: #fff;
`;
