# ROKGG 통합 앱 웹사이트

Astro 정적 사이트입니다. 기존 홈·위고 페이지를 유지하며, 새 앱은 JSON과 Markdown으로 등록합니다. 메코디부터 공통 랜딩·문서 템플릿을 사용합니다.

## 로컬 실행

```sh
npm ci
npm run dev -- --host 127.0.0.1
```

기본 개발 주소는 `http://127.0.0.1:4321`입니다. 포트가 사용 중이면 Astro가 안내하는 주소를 사용하세요.

| 주소                                   | 내용                                     |
| -------------------------------------- | ---------------------------------------- |
| `/`                                    | 전체 앱·웹 서비스 목록                   |
| `/mecodi/`                             | 메코디 소개·다운로드·실제 화면·이용 안내 |
| `/mecodi/privacy/`                     | 현재 개인정보처리방침 문서               |
| `/mecodi/terms/`                       | 현재 서비스 이용약관 문서                |
| `/mecodi/privacy/versions/2026-09-08/` | 특정 버전 보관 주소                      |
| `/legal/`                              | 앱별 개인정보처리방침·이용약관 모음      |
| `/wego`, `/wego/privacy`               | 기존 위고 페이지, 기존 주소 유지         |

메코디 소개는 **2.0 재출시 미리보기**입니다. Google Play 링크는 기존 공개 버전으로 연결됩니다. 코드에 있던 App Store 주소는 2026-09-08 조회에서 404/조회 결과 0건이므로 링크를 보존하되 화면에는 공개 준비 중으로 표시합니다. 스토어 재공개 확인 후 `storeStatus.appStore`를 `available`로 바꾸세요.

## 새 앱 추가

```sh
npm run app:new -- my-app "새 앱 이름"
```

앱 정보 JSON 1개와 개인정보처리방침·이용약관 Markdown 2개를 생성합니다. 초깃값은 비노출·검토본이며, 라우터 파일을 추가하지 않습니다. [앱 추가 가이드](docs/ADDING_APPS.md)를 따르세요.

## 검사와 빌드

```sh
npm run content:check
npm test
npm run build
npm run test:e2e
npm run format:check
```

브라우저 검사는 설치된 Chrome을 사용하거나 Playwright Chromium을 사용합니다. Chrome이 없다면 `npx playwright install chromium`을 먼저 실행하세요. 빌드 결과는 `dist/`이며 별도 운영 API 서버는 필요하지 않습니다.

## 문서 공개와 배포

메코디 법률 문서는 현재 **공개 전 검토본**입니다. 코드에서 확인할 수 없는 운영 사실과 시행일을 임의로 확정하지 않았습니다. [공개 전 확인표](docs/MECODI_PUBLICATION_CHECKLIST.md)를 완료해야 합니다.

`npm run release:check`는 공개 대상 앱의 문서 승인 누락을 검사합니다. 현재 메코디의 두 문서는 미승인이므로 이 명령과 배포 단계가 차단되는 것이 정상입니다. 로컬 빌드·미리보기는 사용할 수 있습니다. GitHub Actions와 `npm run deploy`에도 같은 검사를 연결했습니다.

기존 공개 사이트는 이번 작업으로 변경되지 않았습니다. `main` 푸시나 수동 배포는 별도 승인 후 진행하세요. 메코디 앱 소스의 개인정보 링크는 이번 웹사이트 작업 범위에서 변경하지 않았습니다.
