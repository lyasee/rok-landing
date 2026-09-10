# 메코디 페이지 공개 전 확인표

작성 기준: 2026-09-08. 웹사이트 구현과 사실 확인·법률 문서 승인은 별개이며, 이번 공개본은 운영자가 확인한 현재 운영 사실을 반영했습니다. GitHub Pages 배포와 공개 URL 확인을 완료했습니다.

## 확인된 구현

| 구분           | 근거 및 반영                                                                                                                                                                                                    |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 코디 이미지    | 모바일 `renderClient.ts`가 넥슨 이미지 URL을 기기에서 생성합니다. 별도 메코디 렌더링 서버를 필수로 쓰지 않습니다.                                                                                               |
| 슬롯           | 일반 신규 2칸, 광고 보상 2칸, 최대 100칸. 유효 기존 PRO는 광고 제거·100칸, 신규 판매 없음.                                                                                                                      |
| 기기 저장      | 코디 저장소와 광고 권한 저장소를 구분합니다. 계정 간 클라우드 동기화·광고 슬롯 복구를 보장하지 않습니다.                                                                                                        |
| 광고·개인정보  | AdMob·UMP 포함, 현재 비개인화 요청. 지역 동의 및 운영체제 권한과 별개로 모든 수집이 없다고 주장하지 않습니다.                                                                                                   |
| 분석·오류 보고 | Analytics는 최초 실행 시 비활성화 상태로 시작하고 이용자 동의 후에만 이벤트를 전송합니다. 설정에서 철회할 수 있습니다. Crashlytics 패키지는 포함되어 있지만 Android·iOS 자동 수집은 현재 비활성화되어 있습니다. |
| 구매 복원      | 기존 SKU와 스토어 거래 상태 확인. 새로운 결제 버튼이나 판매 링크 없음.                                                                                                                                          |
| 웹페이지       | 앱별 새 페이지에 분석·광고 SDK·외부 폰트·회원가입을 추가하지 않았습니다. GitHub Pages 호스팅 로그는 별도입니다.                                                                                                 |
| 실제 화면      | `docs/mecodi-assets.json`의 원본 경로·해시·자르기 범위를 참고하세요. UI나 캐릭터를 새로 그리지 않았습니다.                                                                                                      |

## 확정한 운영 사실

개인정보처리방침과 이용약관은 2026-09-08부터 시행하며, 승인 기록은 `알오케이지지 운영자`로 남겼습니다.

- 개인정보 문의는 `notice.rokgg@gmail.com`으로 접수하며, 문의 이메일·첨부자료는 별도 보존기간 없이 요청 시 지체 없이 삭제합니다(법령상 보존 예외).
- 국외 처리 사업자와 처리 범위는 개인정보처리방침의 표에 기재했습니다. Google·Apple·GitHub는 계정·계약·지역 설정에 따라 처리 법인·국가가 달라질 수 있음을 명시했습니다.
- 현재 앱 설정은 비개인화 광고, UMP 지역 동의, Analytics opt-in, Crashlytics 자동 수집 비활성화입니다. 대상 이용자는 만 16세 이상입니다.
- 약관은 기본 슬롯 2칸, 광고 보상 2칸씩 최대 100칸, 기존 PRO 권리 유지, 신규 PRO 판매 중단을 반영했습니다.

약관은 앞서 정한 2/2/100 슬롯 정책을 반영했습니다. 기존 구독의 콘솔 판매·자동 갱신 상태와 실제 시행일은 앱 코드만으로 확정할 수 없으므로 별도로 확인하세요. 새로운 PRO 판매 중단을 기존 구매 권리 소멸로 처리하지 않습니다.

## 다운로드 링크와 앱 내부 링크

Google Play: `https://play.google.com/store/apps/details?id=com.lyasee.maple`

앱 코드에 남아 있던 App Store: `https://apps.apple.com/kr/app/id1568920118`

현재 Google Play는 기존 공개 앱의 페이지가 열립니다. Apple의 해당 한국 페이지 및 조회 API에서 제공 여부를 확인하지 못했으므로 `storeStatus.appStore: pending`입니다. 404가 영구 삭제 또는 잘못된 앱 ID라는 뜻이라고 단정하지 않았습니다. App Store Connect의 실제 공개 ID·국가·상태를 확인한 뒤 활성화하세요.

문서가 정식 공개되고 외부에서 200 응답이 확인되면 메코디 앱 설정과 양 스토어의 정책 링크를 각각 `https://rok.gg/mecodi/privacy/`, `https://rok.gg/mecodi/terms/`로 연결할 수 있습니다. 이번 작업에서는 앱 소스나 스토어 콘솔을 변경하지 않았습니다.

## 공개 및 확인 결과

1. `npm run release:check`, `npm test`(19개), `npm run build`, `npm run test:e2e`(23개), `npm run format:check`를 통과했습니다.
2. `npm run deploy`로 `lyasee/rok-landing`의 `gh-pages` 브랜치에 배포했습니다.
3. 다음 공개 URL에서 HTTPS·HTTP 200·본문·사이트맵 노출을 확인했습니다.
   - `https://rok.gg/mecodi/privacy/`
   - `https://rok.gg/mecodi/terms/`
   - `https://rok.gg/sitemap.xml`

## 참고한 일차 자료

- Astro 콘텐츠 컬렉션: https://docs.astro.build/en/guides/content-collections/
- Astro 정적 라우팅: https://docs.astro.build/en/guides/routing/
- Google 광고 SDK 데이터 공개: https://developers.google.com/admob/android/privacy/play-data-disclosure
- Firebase 개인정보·Crashlytics 보유기간: https://firebase.google.com/support/privacy
- GitHub Pages 데이터 처리: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages#data-collection
- 개인정보 보호법: https://www.law.go.kr/법령/개인정보보호법

위 문서의 존재나 링크만으로 개인정보처리방침의 법적 적합성, 콘텐츠 이용 허가 또는 스토어 심사 통과가 보장되는 것은 아닙니다.
