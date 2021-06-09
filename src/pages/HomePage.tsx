import React from "react";
import Footer from "../basic/Footer";
import Header from "../basic/Header";
import AppItem from "../component/AppItem";
import WebItem from "../component/WebItem";
import HomePageTemplate from "../home/HomePageTemplate";

const HomePage: React.FC = () => {
  return (
    <HomePageTemplate
      Header={<Header />}
      Footer={<Footer />}
      Kimp={
        <AppItem
          name="김프 - 김치프리미엄"
          icon="/images/icon/kimp_appicon.png"
          description="실시간으로 확인하는 김프"
          downloadLink="https://kimpapp.page.link/default"
        />
      }
      Maple={
        <AppItem
          name="메코디 - 코디 시뮬레이터"
          icon="/images/icon/maple_appicon.png"
          description="룩덕이라면 필수앱"
          downloadLink="https://mapleapp.page.link/default"
        />
      }
      Water={
        <AppItem
          name="물타기 - scale trading"
          icon="/images/icon/water_appicon.png"
          description="10초만에 물타기"
          downloadLink="https://addwater.page.link/default"
        />
      }
      RiseOfKingdom={
        <WebItem
          name="라이즈 오브 킹덤즈"
          description="라오킹 티어표"
          status="서비스 종료"
        />
      }
      CookieRunKingdom={
        <WebItem
          name="쿠키런 킹덤"
          description="쿠키런 티어표"
          url="http://ck.rok.gg"
        />
      }
    />
  );
};

export default HomePage;
