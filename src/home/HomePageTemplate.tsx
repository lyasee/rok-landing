import React from "react";
import styled from "styled-components";

interface Props {
  Header: React.ReactElement;
  Footer: React.ReactElement;
  Kimp: React.ReactElement;
  Maple: React.ReactElement;
  Water: React.ReactElement;
  RiseOfKingdom: React.ReactElement;
  CookieRunKingdom: React.ReactElement;
}

const HomePageTemplate: React.FC<Props> = ({
  Header,
  Kimp,
  Maple,
  Water,
  RiseOfKingdom,
  CookieRunKingdom,
  Footer,
}) => {
  return (
    <HomePageTemplateBlock>
      <div>
        {Header}
        <Container>
          <AppListBox>
            <AppListTitle>Apps</AppListTitle>
            <AppList>
              <AppListItemWrapper>{Kimp}</AppListItemWrapper>
              <AppListItemWrapper>{Maple}</AppListItemWrapper>
            </AppList>
            <AppList>
              <AppListItemWrapper>{Water}</AppListItemWrapper>
              <AppListItemWrapper></AppListItemWrapper>
            </AppList>
          </AppListBox>
          <AppListBox>
            <AppListTitle>Webs</AppListTitle>
            <AppList>
              <AppListItemWrapper>{CookieRunKingdom}</AppListItemWrapper>
              <AppListItemWrapper>{RiseOfKingdom}</AppListItemWrapper>
            </AppList>
          </AppListBox>
        </Container>
      </div>

      {Footer}
    </HomePageTemplateBlock>
  );
};

export default HomePageTemplate;

const HomePageTemplateBlock = styled.div`
  background-color: #282c34;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Container = styled.div`
  padding: 20px;
  margin: 0 auto;
  max-width: 1200px;
`;

const AppListBox = styled.div`
  padding-top: 16px;
  margin: 0 auto;
  max-width: 800px;
`;

const AppListTitle = styled.h1`
  color: #fff;
`;

const AppList = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 42px;
  margin-bottom: 72px;

  @media (max-width: 1000px) {
    margin: 0;
  }
`;

const AppListItemWrapper = styled.div`
  width: 300px;

  @media (max-width: 1000px) {
    margin: 16px 0;
  }
`;
