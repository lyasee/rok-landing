export interface ProductLink {
  href: string;
}

export interface AppProduct {
  name: string;
  icon: string;
  description: string;
  link?: ProductLink;
  // 내부 소개 페이지 경로(다운로드 링크가 아직 없는 출시 준비 중 앱용).
  page?: string;
}

export interface WebProduct {
  name: string;
  description: string;
  url?: string;
  status?: string;
}

export const appProducts: AppProduct[] = [
  {
    name: "위고 - 그룹 라이딩 내비게이션",
    icon: "/images/wego/icon.png",
    description: "함께 달리는 그룹 라이딩 내비",
    page: "/wego",
  },
  {
    name: "김프 - 김치프리미엄",
    icon: "/images/icon/kimp_appicon.png",
    description: "실시간으로 확인하는 김프",
    link: {
      href: "https://kimpapp.page.link/default",
    },
  },
  {
    name: "메코디 - 코디 시뮬레이터",
    icon: "/images/icon/maple_appicon.png",
    description: "룩덕이라면 필수앱",
    link: {
      href: "https://mapleapp.page.link/default",
    },
  },
  {
    name: "물타기 - scale trading",
    icon: "/images/icon/water_appicon.png",
    description: "10초만에 물타기",
    link: {
      href: "https://addwater.page.link/default",
    },
  },
];

export const webProducts: WebProduct[] = [
  {
    name: "쿠키런 킹덤",
    description: "쿠키런 티어표",
    url: "http://ck.rok.gg",
  },
  {
    name: "라이즈 오브 킹덤즈",
    description: "라오킹 티어표",
    status: "서비스 종료",
  },
];
