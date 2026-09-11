# 포근일기 웹페이지 작업 결과 · 2026-09-10

## 반영 범위

기존 Astro 앱 등록·문서·레이아웃 체계를 사용해 포근일기를 추가했습니다. 별도의 홈페이지를 새로 만들거나 다른 앱을 대체하지 않았습니다.
메인 앱 목록에는 메코디, 무브컷과 함께 포근일기가 표시됩니다. 스토어 링크는 임의로 만들지 않았으며 포근일기는 공개 준비 중으로 표시합니다.
배포자: 알오케이지지. 고객지원: notice.rokgg@gmail.com.

## 생성된 경로

- `/pogeun-diary/` — 앱 소개, 실제 화면, 기능, FAQ, 스토어 준비 상태
- `/pogeun-diary/privacy/` — 개인정보처리방침 검토본
- `/pogeun-diary/terms/` — 서비스 이용약관 검토본
- `/pogeun-diary/support/` — 고객지원 이메일, 오류 문의 방법, 기록·백업 도움말
- `/pogeun-diary/privacy/versions/2026-09-10/` — 개인정보처리방침 버전 경로
- `/pogeun-diary/terms/versions/2026-09-10/` — 이용약관 버전 경로
  문서 모음과 사이트맵을 기존 규칙에 연결했습니다. 미승인 문서는 noindex 처리하고 검색용 사이트맵에서는 제외합니다.
  공개 도메인은 `https://rok.gg`이며, 원격 배포는 승인된 법적 문서와 release gate를 통과한 뒤 기존 GitHub Pages 절차로 진행합니다.

## 화면과 이미지

따뜻한 아이보리·분홍·초록색을 사용하는 문구점 분위기의 소개 페이지입니다. 모바일 대응과 모션 감소 설정을 반영했습니다.
실제 네이티브 iPhone 화면 6개를 비율을 유지한 WebP로 변환했습니다. 화면의 글과 스티커는 가상의 예시 기록입니다.
이미지 위치: `public/images/pogeun-diary/`. 원본 연결과 해시: `artifacts/pogeun-diary/media-manifest.json`.
기능 수량은 스티커 72종과 속지 8종으로 일치하며, 일기 즐겨찾기·클라우드 동기화·자동 페이지 나눔 등 미구현 기능을 광고하지 않습니다.

## 최종 검증

`npm run build`: 콘텐츠 검사, Astro 검사, 정적 빌드 통과. 오류·경고·힌트 0건, 23개 페이지 생성.
`npm test`: 19개 통과.
`npm run test:e2e`: 85개 통과. 기존 앱과 홈을 포함해 경로, 이미지, 내부 링크, 메타데이터, 모바일 폭, 키보드, 모션 감소, JavaScript 비활성 상태를 검사했습니다.
실제 화면: `evidence/POGEUN-DIARY-20260910/`. 데스크톱과 360px 모바일의 화면도 확인했습니다.
로컬 검증 로그: `artifacts/pogeun-diary/final-build.log`, `final-unit.log`, `final-browser.log`.

## 법적 문서 공개 전 확인

개인정보처리방침과 약관은 본문까지 작성했지만 운영자 승인과 시행일을 임의로 확정하지 않았습니다.
고객지원 문의의 실제 보유기간·삭제 절차, Gmail 처리와 국외이전 관련 고지, 실제 웹 호스팅 접속 로그 정책 등을 운영자가 확인해야 합니다.
본문은 로컬 일기 처리와 선택적인 고객지원 이메일 처리를 구분합니다. 일기 원문이나 백업 암호를 문의에 첨부하도록 요구하지 않습니다.
확인이 끝나기 전에는 `status: draft`와 공개 전 검토본 안내를 유지합니다. `npm run release:check`는 현재 이 두 문서의 미승인 상태 때문에 실패하며 이를 우회하지 않았습니다.
검토 항목은 각 Markdown의 `reviewItems`에 적었습니다. 확인된 운영 사실에 맞춰 문서를 수정하고 승인·시행일을 기록한 뒤 배포하세요.

## 주요 파일

`src/content/apps/pogeun-diary.json`
`src/components/landing/PogeunDiaryLanding.astro`
`src/styles/pogeun-diary.css`
`src/pages/pogeun-diary/support/index.astro`
`src/content/legal/pogeun-diary/privacy-2026-09-10.md`
`src/content/legal/pogeun-diary/terms-2026-09-10.md`
`tests/browser/pogeun.spec.ts`

## 배포

페이지 내용과 법적 문서는 현재 검토본이며, 법적 문서 승인과 release gate 통과 후 기존 배포 절차를 사용하면 동일한 앱별 경로로 공개할 수 있습니다. 스토어 업로드는 별도 작업입니다.

## 2026-09-11 최신 앱 화면 재동기화

포근일기의 UI/UX 수정과 V3 스티커 적용 이후 iPhone 네이티브 화면 6장을 새로 촬영했고 랜딩페이지의 실제 화면 이미지도 해당 캡처로 교체했습니다.
`public/images/pogeun-diary/screen-*.webp`는 새 iPhone 원본에서 비율을 유지해 변환했습니다.
연결 해시와 원본 파일은 `artifacts/pogeun-diary/media-manifest.json`에 기록했습니다.
스토어용 iPhone·iPad·Android 18장은 앱 프로젝트 `assets/store/`에 별도로 보관되며 AI 홍보 시안과 혼용하지 않습니다.

이번 동기화 후 정적 빌드와 단위 테스트는 통과했습니다. 브라우저 테스트에서 처음 발견된 3건은 실제 법적 문서가 이미 `published`인데 이전 테스트가 `draft`를 가정하던 문제였고, 문서 상태를 되돌리지 않고 해당 기대값을 현재 승인 상태에 맞게 수정했습니다.

## 최종 회귀 결과

최신 iPhone 화면 6장 동기화 후 전체 브라우저 회귀 테스트 **85개가 모두 통과**했습니다.
포근일기 전용 브라우저 테스트는 **17개 모두 통과**했습니다.
법적 문서는 실제 `published` 상태를 기준으로 현재 문서는 검색 색인 허용, 버전 이력 경로는 `noindex`로 검증합니다.
최종 로그: `artifacts/pogeun-diary/recapture-browser-all-final.log`, `recapture-pogeun-final.log`.
