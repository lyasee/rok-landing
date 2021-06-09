import React from "react";
import styled from "styled-components";

interface Props {
  name: string;
  icon: string;
  description: string;
  downloadLink?: string;
}

const AppItem: React.FC<Props> = ({
  name,
  icon,
  description,
  downloadLink,
}) => {
  return (
    <AppItemBlock>
      <AppIcon src={icon} />
      <TextContainer>
        <AppName>{name}</AppName>
        <Description>{description}</Description>

        {downloadLink ? (
          <DownloadButtonWrapper>
            <a href={downloadLink}>
              <DownloadButton>
                <DownloadText>다운로드</DownloadText>
              </DownloadButton>
            </a>
          </DownloadButtonWrapper>
        ) : (
          <DownloadButtonWrapper>
            <DownloadButton>
              <DownloadText>SOON</DownloadText>
            </DownloadButton>
          </DownloadButtonWrapper>
        )}
      </TextContainer>
    </AppItemBlock>
  );
};

export default AppItem;

const AppItemBlock = styled.div`
  display: flex;
`;

const AppIcon = styled.img`
  height: 100px;
  width: 100px;
  border-radius: 8px;
`;

const TextContainer = styled.div`
  margin-top: 4px;
  margin-left: 16px;
`;

const AppName = styled.h3`
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
