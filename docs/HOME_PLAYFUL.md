# ROK.GG 메인 — Playful Collection

## 반영 범위

선택한 3번 시안의 흰 바탕, 살구색·연보라색 앱 카드, 파스텔 도형, 굵은 제목을 메인에 구현했습니다. 이미지는 가상 UI가 아닌 프로젝트의 실제 아이콘·스크린샷·운동 카드입니다. 메코디의 작은 코디 사진은 실제 화면 일부를 CSS로 잘라 보여줍니다.

메인은 `getApps()`가 반환하는 공개 대상 앱만 표시합니다. 종료 서비스의 기존 고정 목록과 `Apps / Webs` 구분은 사용하지 않습니다. 기존 `/mecodi/`, `/movecut/`, 정책 문서와 `/wego`의 직접 주소는 변경하지 않았습니다. 메인용 스타일은 앱별 랜딩에 적용되지 않습니다.

## 소스

- `src/pages/index.astro`: 메인 구조, 메타 정보, 앱 목록, 문의·문서 링크
- `src/components/home/HomeAppCard.astro`: 공통 카드, 상태 안내, 테마
- `src/components/home/HomeAppArtwork.astro`: 앱별 이미지 구성과 새 앱용 기본 이미지 구성
- `src/styles/home.css`: 메인 전용 스타일과 반응형 배치
- `src/scripts/home-motion.ts`: 선택적 애니메이션
- `public/images/home/`: 공유 이미지와 ROK.GG 아이콘
- `public/home.webmanifest`: 메인 전용 이름·아이콘 정보

## 움직임

첫 화면의 순차 등장, 스크롤할 때 카드 등장, 도형·사진의 작은 부유 효과, 카드 호버와 화살표 이동, 데스크톱 포인터에 반응하는 가벼운 이미지 이동을 적용했습니다. 외부 애니메이션 패키지는 추가하지 않았습니다.

하단의 `움직임 끄기` 버튼은 현재 페이지의 움직임을 끕니다. 기기의 `동작 줄이기` 설정을 우선하며 설정 변경도 즉시 반영합니다. 화면 밖의 반복 장식은 멈추고, 탭이 숨겨지면 CSS 애니메이션을 일시 정지합니다. 설정을 쿠키·로컬 저장소에 기록하지 않습니다. JavaScript를 꺼도 내용과 링크는 사용할 수 있습니다.

## 새 앱을 추가할 때

기존 `npm run app:new -- my-app "새 앱"` 흐름을 그대로 사용합니다. 앱 JSON의 `visible`로 노출을 정하고 `order`로 정렬합니다. 메인에서 앱 개수는 자동 계산하며, 앱마다 라우터나 목록 배열을 추가할 필요가 없습니다.

선택 항목인 `home`으로 메인용 문구와 색을 정할 수 있습니다. 생략하면 기존 앱 정보와 대표 이미지를 사용합니다. `theme`은 `peach`, `blue`, `mint`, `lemon`, `pink` 중 하나입니다. 메코디·무브컷은 별도 이미지 구성을 사용하고, 다른 앱은 공통 대표 화면 구성이 적용됩니다.

```json
{
  "home": {
    "theme": "mint",
    "englishName": "My App",
    "category": "앱 분류",
    "headline": "사용자에게 전달할 한 문장.",
    "description": "실제 기능을 짧게 소개해주세요.",
    "tags": ["대표 기능", "또 다른 기능"]
  }
}
```

공개 준비 중인 앱은 다운로드 가능한 것처럼 표시하지 않습니다. 각 카드의 상태 안내는 기존 `releaseLabel`을 사용하며, 다운로드는 앱별 랜딩이 담당합니다. 출시 전 문서 승인을 우회하지 않습니다.

## 확인과 공유 이미지

`npm test`, `npm run build`, `npm run test:e2e`, `npm run release:check`, `npm run assets:check`로 확인합니다. 메인 브라우저 검사는 320~1920px 배치, 이미지·링크, 실제 움직임, 동작 줄이기, 키보드, JavaScript 없는 상태를 검사합니다.

검사 스크린샷은 `evidence/HOME-PLAYFUL-20260909/`에 저장합니다. 이 폴더는 로컬 검증 자료로 Git에서 제외됩니다. 처음 작업 전 파일 사본은 같은 폴더의 `before/`에 있습니다.

홈 공유 이미지는 `public/images/home/social.png`이며 1200×630 크기입니다. 운영 빌드를 로컬에서 미리보기한 다음 아래 명령으로 실제 홈페이지의 제목·아이콘·색을 반영하여 다시 캡처할 수 있습니다.

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 4392
# 별도 터미널에서 실행
node scripts/capture-home-social.mjs http://127.0.0.1:4392/
# 새 공유 이미지가 배포 결과에도 포함되도록 다시 빌드
npm run build
```

커밋·원격 푸시·실제 서비스 배포 전에는 위 검증 명령을 모두 통과했는지 확인합니다.
