# 새로운 앱을 추가하는 방법

## 1. 생성

프로젝트 루트에서 `npm run app:new -- my-app "새 앱 이름"`을 실행합니다. 영문 소문자·숫자·하이픈으로 된 고유 slug를 사용하세요. 기존 파일이나 `/wego`, `/legal`, 시스템 경로와 겹치면 덮어쓰지 않고 종료합니다.

```text
src/content/apps/my-app.json
src/content/legal/my-app/privacy-YYYY-MM-DD.md
src/content/legal/my-app/terms-YYYY-MM-DD.md
public/images/my-app/          ← 실제 아이콘·스크린샷을 추가
```

새로 생성한 앱은 `visible: false`이므로 홈과 경로에 노출되지 않습니다. 소개 내용을 채운 뒤 로컬 검토를 위해 `visible: true`로 설정하면 아래 경로가 자동 생성됩니다. 문서가 검토본이면 실제 배포 검사가 계속 차단합니다.

```text
/my-app/
/my-app/privacy/
/my-app/terms/
/my-app/privacy/versions/YYYY-MM-DD/
/my-app/terms/versions/YYYY-MM-DD/
```

## 2. 앱 JSON 입력

`src/content.config.ts`가 자료형과 필수값을 검사합니다. `mecodi.json`을 예제로 참고하되 메코디의 슬롯·광고·외부 서비스 정책을 다른 앱에 그대로 복사하지 마세요.

`hero`에는 제목 두 줄, 설명, 실제 화면 경로·대체 텍스트·실제 이미지 크기를 넣습니다. `features`, `screenshots`, `faq`, `usage`는 배열·객체 데이터만 바꾸면 됩니다. `copy`는 각 구역의 짧은 문구를 앱별로 바꾸는 선택 항목입니다. 흰색 공통 레이아웃을 사용하고 `accent`로 강조색을 바꿉니다.

`stores.googlePlay`는 `https://play.google.com/...`, `stores.appStore`는 `https://apps.apple.com/...`의 직접 주소를 사용합니다. 별도 단축 URL이나 종료된 Dynamic Links에 의존하지 않습니다. 아직 공개되지 않았거나 링크가 확인되지 않았다면 해당 `storeStatus`를 `pending`으로 둡니다. 주소를 생략해도 됩니다.

`launchStatus`가 `preview`이면 출시 전 화면임을 분명히 적고 기존 공개 버전과의 차이를 `releaseNote`에 씁니다. 실제 2.0 출시를 확인하면 `available`로 전환하고 해당 문구·FAQ를 함께 고칩니다. 이름·URL·출시 상태만 바꾸고 실제 기능 설명은 그대로 두는 실수를 피하세요.

홈 목록은 레지스트리에서 자동 연결합니다. 기존에 `src/data/products.ts`에 있는 앱을 이전할 때에는 기존 항목에 `appSlug`를 지정하여 중복 없이 공통 페이지를 참조하게 합니다. 위고는 기존 페이지를 유지하므로 현재는 레지스트리에 같은 slug를 등록하지 않습니다.

## 3. 법률 문서

문서는 Markdown 본문과 frontmatter를 사용합니다. 개인정보처리방침·서비스 이용약관 각각 **현재 문서가 정확히 하나**여야 합니다.

```yaml
app: my-app
type: privacy
version: "2026-09-08"
current: true
status: draft
updatedAt: "2026-09-08"
reviewItems:
  - 운영 사실과 공개 내용을 확인하세요.
```

`title`, `summary`도 필수입니다. 공개 승인 후에는 실제 확인한 본문으로 정리하고, `status: published`, `effectiveDate`, `approvedBy`, `reviewItems: []`를 설정합니다. `approvedBy`는 내부 승인 기록이지 인증 서명이나 법률 검토를 자동 보증하는 장치가 아닙니다. 단순히 상태만 바꾸고 미확정 내용을 남기지 마세요.

## 4. 개정과 과거 버전 보존

기존의 공개 문서를 새 내용으로 덮어쓰지 말고 `privacy-새버전.md` 또는 `terms-새버전.md`를 만듭니다. 기존 버전의 `current`를 `false`, 새 버전을 `true`로 변경하면 고정 주소는 새 버전을 표시하고 버전별 주소와 문서 이력은 유지됩니다. 기존 구매 권리나 과거 처리 내역에 소급 적용하는 것처럼 기재하지 않습니다.

현재는 개인정보처리방침·서비스 이용약관 두 종류를 지원합니다. 위치기반서비스 약관 등 새 문서 종류가 필요한 앱은 `type`, 레이블, 필수 문서 정의를 함께 확장하세요. 다른 앱의 개인정보 항목·수탁자·보관기간을 가져다 쓰지 않습니다.
