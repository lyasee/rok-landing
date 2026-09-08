# 메코디 페이지 공개 전 확인표

작성 기준: 2026-09-08. 웹사이트 구현과 사실 확인·법률 문서 승인은 별개입니다. 현재 코드와 실제 실행 캡처를 근거로 작성했으며 공개 배포는 하지 않았습니다.

## 확인된 구현

| 구분           | 근거 및 반영                                                                                                      |
| -------------- | ----------------------------------------------------------------------------------------------------------------- |
| 코디 이미지    | 모바일 `renderClient.ts`가 넥슨 이미지 URL을 기기에서 생성합니다. 별도 메코디 렌더링 서버를 필수로 쓰지 않습니다. |
| 슬롯           | 일반 신규 2칸, 광고 보상 2칸, 최대 100칸. 유효 기존 PRO는 광고 제거·100칸, 신규 판매 없음.                        |
| 기기 저장      | 코디 저장소와 광고 권한 저장소를 구분합니다. 계정 간 클라우드 동기화·광고 슬롯 복구를 보장하지 않습니다.          |
| 광고·개인정보  | AdMob·UMP 포함, 현재 비개인화 요청. 지역 동의 및 운영체제 권한과 별개로 모든 수집이 없다고 주장하지 않습니다.     |
| 분석·오류 보고 | Analytics 자동 수집은 비활성화. Crashlytics 패키지는 포함되어 있어 오류 보고를 별도 항목으로 다룹니다.            |
| 구매 복원      | 기존 SKU와 스토어 거래 상태 확인. 새로운 결제 버튼이나 판매 링크 없음.                                            |
| 웹페이지       | 앱별 새 페이지에 분석·광고 SDK·외부 폰트·회원가입을 추가하지 않았습니다. GitHub Pages 호스팅 로그는 별도입니다.   |
| 실제 화면      | `docs/mecodi-assets.json`의 원본 경로·해시·자르기 범위를 참고하세요. UI나 캐릭터를 새로 그리지 않았습니다.        |

## 운영자가 확인해야 하는 사실

개인정보처리방침은 아래가 확정되어야 정식 공개본으로 사용할 수 있습니다.

1. 개인정보 문의 담당자의 명칭·연락 방법·본인 확인 및 권리 행사 처리 절차.
2. 문의 이메일과 첨부자료의 실제 보관기간, 종료 기준, 삭제 절차, 별도 법정 보존의 적용 여부.
3. 외부 사업자와의 처리 관계(위탁/별도 처리자 등), 국외이전 대상·항목·수령자 연락처·국가·시점·방법·목적·기간·법적 근거·거부 방법과 영향.
4. 최종 배포 빌드에서 Crashlytics·AdMob·UMP가 처리하는 실제 항목, 대상 연령 및 필요한 아동·법정대리인 절차.
5. 최종 승인자, 실제 시행일, 구버전 이용자에게 안내하는 방식.

약관은 앞서 정한 2/2/100 슬롯 정책을 반영했습니다. 기존 구독의 콘솔 판매·자동 갱신 상태와 실제 시행일은 앱 코드만으로 확정할 수 없으므로 별도로 확인하세요. 새로운 PRO 판매 중단을 기존 구매 권리 소멸로 처리하지 않습니다.

## 다운로드 링크와 앱 내부 링크

Google Play: `https://play.google.com/store/apps/details?id=com.lyasee.maple`

앱 코드에 남아 있던 App Store: `https://apps.apple.com/kr/app/id1568920118`

현재 Google Play는 기존 공개 앱의 페이지가 열립니다. Apple의 해당 한국 페이지 및 조회 API에서 제공 여부를 확인하지 못했으므로 `storeStatus.appStore: pending`입니다. 404가 영구 삭제 또는 잘못된 앱 ID라는 뜻이라고 단정하지 않았습니다. App Store Connect의 실제 공개 ID·국가·상태를 확인한 뒤 활성화하세요.

문서가 정식 공개되고 외부에서 200 응답이 확인되면 메코디 앱 설정과 양 스토어의 정책 링크를 각각 `https://rok.gg/mecodi/privacy/`, `https://rok.gg/mecodi/terms/`로 연결할 수 있습니다. 이번 작업에서는 앱 소스나 스토어 콘솔을 변경하지 않았습니다.

## 공개 절차

1. 위 운영 사실을 확인하고 두 Markdown 본문에서 미확정 안내를 실제 내용으로 대체합니다.
2. 실제 시행일과 승인 기록을 frontmatter에 입력합니다. 검토본 안내를 남긴 채 상태만 바꾸면 검사가 실패합니다.
3. `npm run content:check`, `npm test`, `npm run build`, `npm run test:e2e`, `npm run format:check`를 실행합니다.
4. `npm run release:check`가 통과하면 별도 승인 후 기존 GitHub Pages 배포 절차를 사용합니다. 검사를 우회해 `dist/`를 직접 업로드하지 않습니다.
5. 배포 후 직접 URL 접근, HTTPS, 실제 스토어 링크, 앱 내 문서 표시를 확인합니다. 필요하다면 이전 배포 커밋으로 복구합니다.

## 참고한 일차 자료

- Astro 콘텐츠 컬렉션: https://docs.astro.build/en/guides/content-collections/
- Astro 정적 라우팅: https://docs.astro.build/en/guides/routing/
- Google 광고 SDK 데이터 공개: https://developers.google.com/admob/android/privacy/play-data-disclosure
- Firebase 개인정보·Crashlytics 보유기간: https://firebase.google.com/support/privacy
- GitHub Pages 데이터 처리: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection
- 개인정보 보호법: https://www.law.go.kr/법령/개인정보보호법

위 문서의 존재나 링크만으로 개인정보처리방침의 법적 적합성, 콘텐츠 이용 허가 또는 스토어 심사 통과가 보장되는 것은 아닙니다.
