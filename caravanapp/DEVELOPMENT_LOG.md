# CaravanShare 개발 일지

## 1일차

## Phase 1: MVP 기능 구현

### 1. 프로젝트 초기 설정

- **Backend:** `server` 디렉터리 내에 Node.js, Express 기반의 백엔드 프로젝트를 초기화했습니다.
- **Frontend:** Vite 기반의 React 프로젝트 환경을 설정했습니다.
- **Dependencies:** `express`, `mongoose`, `bcryptjs`, `jsonwebtoken`, `cors`, `nodemon` 등 초기 의존성을 설치했습니다.

### 2. 핵심 모델(Schema) 정의

Mongoose를 사용하여 애플리케이션의 핵심 데이터 모델을 정의했습니다.

- `User`: 사용자 (호스트/게스트)
- `Caravan`: 카라반 정보
- `Reservation`: 예약 정보
- `Review`: 리뷰 및 평점

### 3. API 및 UI 구현

요구사항에 명시된 MVP 기능들을 순차적으로 구현했습니다.

- **사용자 관리:**
  - API: 회원가입 (`/api/users/register`), 로그인 (`/api/users/login`) 엔드포인트를 구현했습니다.
  - UI: `Register.jsx`, `Login.jsx` 컴포넌트를 생성하여 사용자 입력을 처리했습니다.

- **카라반 관리:**
  - API: 카라반 CRUD(생성, 조회, 수정, 삭제)를 위한 엔드포인트를 `/api/caravans` 경로에 구현했습니다. 호스트만 접근 가능하도록 인증 미들웨어를 적용했습니다.
  - UI: `CaravanList.jsx`, `CaravanDetails.jsx`, `CaravanForm.jsx` 컴포넌트를 구현하여 카라반 정보를 표시하고 관리할 수 있도록 했습니다.

- **예약 시스템:**
  - API: 예약 생성, 조회, 상태 변경(승인/거절)을 위한 엔드포인트를 `/api/reservations` 경로에 구현했습니다.
  - UI: `CaravanDetails.jsx`에 예약 신청 양식을 추가하고, `Reservations.jsx`와 `HostDashboard.jsx`를 통해 게스트와 호스트가 예약 내역을 관리할 수 있도록 했습니다.

- **리뷰 시스템:**
  - API: 완료된 예약에 대한 리뷰 작성을 위한 엔드포인트를 `/api/reviews` 경로에 구현했습니다.
  - UI: `Reservations.jsx`에 리뷰 작성 양식을 추가하고, `CaravanDetails.jsx`와 `Profile.jsx`에서 리뷰를 볼 수 있도록 구현했습니다.

---

## Phase 2: 백엔드 아키텍처 리팩터링

SOLID 설계 원칙을 적용하여 코드의 유지보수성, 확장성, 테스트 용이성을 개선했습니다.

### 1. 책임 분리 (SRP)

- **Service Layer 도입:** 비즈니스 로직을 라우트 핸들러에서 분리하여 `services` 디렉터리 내의 전용 서비스 클래스(`UserService`, `CaravanService` 등)로 이전했습니다. 이를 통해 각 컴포넌트가 단일 책임을 갖도록 구조를 개선했습니다.

### 2. 복잡한 비즈니스 로직 분리

- **Validator 클래스 설계:** 복잡한 예약 검증 로직(카라반 존재 여부, 날짜 유효성, 중복 예약 방지)을 `ReservationValidator` 클래스로 분리했습니다. 이로써 검증 로직을 독립적으로 테스트하고 재사용할 수 있게 되었습니다.

### 3. 효율적인 자료구조 및 알고리즘 (성능 최적화)

- **Repository 패턴 도입:** `ReservationRepository` 클래스를 설계하여 데이터 접근 로직을 캡슐화했습니다.
- **In-Memory 캐시 구현:** 예약 가능 여부 확인 시 매번 DB를 조회하는 대신, 서버 시작 시 예약 데이터를 메모리에 로드하는 캐시 레이어를 구현했습니다. `Map` 자료구조를 활용하여 O(1)의 시간 복잡도로 카라반별 예약 목록에 접근하고, 날짜 충돌 검사 성능을 크게 향상시켰습니다.

### 4. 변수명과 함수명의 명확성 (가독성 향상)

- **네이밍 컨벤션 적용:** `findOverlap` -> `findOverlappingReservation`과 같이 함수의 역할을 더 명확하게 설명하는 이름으로 변경했습니다.
- **상수화:** JWT 시크릿 키, 유효기간, 각종 매직 넘버들을 의미를 알 수 있는 상수로 추출하여 코드의 가독성과 유지보수성을 높였습니다.
- **로직 캡슐화:** 가격 계산 로직을 `_calculateTotalPrice`와 같은 헬퍼 메서드로 분리하여 핵심 로직을 더 간결하고 명확하게 만들었습니다.

### 5. 에러 처리와 예외 관리

- **커스텀 예외 클래스 정의:** 견고한 에러 처리 전략을 위해 `AppError`를 비롯한 커스텀 예외 클래스들을 `core/errors` 디렉터리에 정의했습니다.
- **예외 적용:** 서비스 계층 전반에 걸쳐 `NotFoundError`, `AuthorizationError` 등의 커스텀 예외를 적용하여 상황에 맞는 명확한 에러를 반환하도록 개선했습니다.

### 6. 디자인 패턴 적용

- **리포지토리 패턴:**
  - `repositories` 디렉터리에 `ReservationRepository.js` 및 `CaravanRepository.js`를 생성하여 데이터 접근 로직을 추상화했습니다.
  - `ReservationService`가 직접 Mongoose 모델을 호출하는 대신 이들 리포지토리를 사용하도록 업데이트했습니다.
- **팩토리 패턴:**
  - `services` 디렉터리에 `ReservationFactory.js`를 생성하여 `Reservation` 객체 생성 로직을 캡슐화했습니다.
  - `ReservationService`가 새로운 예약을 생성할 때 이 팩토리를 사용하도록 변경했습니다.
- **전략 패턴:**
  - `services/discount` 디렉터리에 `DiscountStrategy.js` (기본 클래스), `NoDiscount.js`, `SeasonalDiscount.js` (구체적인 전략)를 생성했습니다.
  - `ReservationService`가 예약 총액을 계산할 때 할인 전략을 적용하도록 통합했습니다.
- **옵저버 패턴:**
  - `services/notification` 디렉터리에 `ReservationNotifier.js` (주체) 및 `EmailNotifier.js` (옵저버)를 생성했습니다.
  - `ReservationService`에서 새로운 예약이 생성될 때 등록된 옵저버들에게 알림을 보내도록 통합했습니다.

### 7. 테스트 코드 리팩터링

- **테스트 격리:** `ReservationService.test.js` 파일을 업데이트하여 리포지토리, 팩토리 등 새로운 의존성을 모의(Mock) 처리함으로써 서비스 로직을 독립적으로 테스트하도록 개선했습니다.
- **테스트 정확성 확보:** `UserService.test.js`의 실패하던 테스트를 수정하여 모든 테스트가 통과하는 것을 확인했습니다.

---

## Phase 3: 프론트엔드 UI/UX 및 기능 개선

### 1. Tailwind CSS v4 설정 문제 해결

- **초기 문제 진단:** `postcss`가 `@tailwind.config.js base;`를 인식하지 못하고 `px-6`와 같은 유틸리티 클래스를 찾을 수 없다는 오류 발생.
- **`postcss.config.js` 수정:** `@tailwindcss/postcss`를 `tailwindcss`로 변경 시도 (이후 기존으로 롤백).
- **`@tailwind` 지시문 변경:** Tailwind CSS v4에서 `@tailwind base;`, `@tailwind components;`, `@tailwind utilities;` 지시문이 제거되었음을 확인하고 `src/index.css` 파일을 `@import "tailwindcss";`로 수정.
- **`@apply` 문제 해결:** `btn`과 같은 커스텀 클래스에 `@apply`를 사용할 때 발생하는 오류(`Cannot apply unknown utility class 'btn'`)를 해결하기 위해, 기본 `.btn` 클래스의 유틸리티들을 각 버튼 변형(`.btn-cta-black`, `.btn-cta-orange`, `.btn-ghost` 등)에 직접 인라인하고 `.btn` 기본 클래스 정의를 제거하여 해결.

### 2. 네비게이션 UI/UX 리팩토링 (우측 슬라이드 사이드바)

- `src/components/Navbar.jsx` 컴포넌트를 정적 네비게이션 바에서 우측 슬라이드 드로어(사이드바) 형태로 전면 리팩토링.
- **구현 기능:** 화면 우측 상단 고정 햄버거 아이콘(트리거), 부드러운 슬라이딩 애니메이션, 모바일(100%)/데스크톱(300px-400px) 반응형 너비, 사이드바 상단 닫기(X) 버튼, 배경 딤(Dimmed Overlay) 처리 및 오버레이 클릭 시 닫기 기능.
- 기존 네비게이션 링크들을 사이드바 내부로 이동시키고 세로 정렬 및 hover 효과 적용.

### 3. 핵심 기능 폼(Register, Login, Create Caravan) 개선

- **`Register.jsx`:**
  - 로딩 및 에러 상태 관리(`useState`) 추가, 사용자 피드백(에러 메시지), 성공 시 `/login`으로 리디렉션(`useNavigate`) 기능 구현.
  - Tailwind CSS를 활용하여 폼, 입력 필드, 제출 버튼의 스타일을 현대적으로 개선.
- **`Login.jsx`:**
  - 로딩 및 에러 상태 관리(`useState`) 추가, 사용자 피드백(에러 메시지) 구현.
  - 로그인 성공 시 JWT 토큰을 `localStorage`에 저장하고, `axios.defaults.headers.common['x-auth-token']`에 설정하여 전역 인증 처리.
  - 로그인 성공 시 `/` (홈페이지)로 리디렉션(`useNavigate`) 기능 구현.
  - `Login` 폼이 `Register` 폼 로직을 실행하는 오류를 진단하고, `Login.jsx` 코드를 재작성하여 문제 해결.
  - Tailwind CSS를 활용하여 폼 스타일 개선.
- **`CaravanForm.jsx` (캐러밴 생성):**
  - 로딩 및 에러 상태 관리(`useState`) 추가, 사용자 피드백(에러 메시지) 구현.
  - `capacity` 및 `dailyRate` 필드가 백엔드에 숫자로 전송되지 않아 발생하던 `400 Bad Request` 오류를 해결하기 위해, `onSubmit` 핸들러에서 해당 필드들을 숫자로 명시적 파싱하여 전송하도록 수정.
  - 캐러밴 생성 성공 시 `/` (홈페이지)로 리디렉션(`useNavigate`) 기능 구현.
  - Tailwind CSS를 활용하여 폼 스타일 개선.

### 4. 홈 화면 캐러밴 목록 표시

- **백엔드 변경:** 특정 호스트(로그인 사용자)의 캐러밴 목록을 가져오기 위한 새 백엔드 라우트 `GET /api/caravans/my-caravans`를 `server/routes/caravans.js`에 추가하고, `server/services/CaravanService.js`에 `getCaravansByHost` 메서드 구현.
- **프론트엔드 변경:** `src/components/Home.jsx`를 수정하여 로그인한 사용자가 등록한 캐러밴 목록을 가져와 카드 레이아웃으로 표시.
- (임시) `CaravanList.jsx`에 샘플 캐러밴 데이터 추가/삭제 기능 구현 후 롤백.

### 5. 백엔드 서버 및 데이터베이스 문제 해결

- **`net::ERR_CONNECTION_REFUSED` / `ECONNREFUSED` 오류 진단:** 프론트엔드 및 백엔드에서 발생하는 연결 거부 오류의 원인이 백엔드 서버 또는 MongoDB 데이터베이스 미실행임을 진단.
- **MongoDB 설치 안내:** Ubuntu 24.04에 MongoDB Community Edition 8.0을 설치하기 위한 상세한 단계별 지침 제공. GPG 키 누락 및 저장소 파일 생성 오류 등 다양한 설치 문제 해결 지원.
- **백엔드 충돌 (`TypeError`) 해결:** `server/server.js` 파일에서 `TypeError: ReservationRepository.loadAll is not a function` 오류를 유발하던 미구현 코드 라인을 제거하여 서버가 정상적으로 시작되도록 수정.

###  Phase4: 호스트 대시보드 및 고급 검색 기능 기획

AI 코딩 도구(Cursor, Copilot 등)를 활용하여 복잡한 비즈니스 로직과 UI 컴포넌트를 구현하기 위한 정교한 프롬프트 엔지니어링 및 아키텍처 설계를 진행했습니다.


1. 호스트 대시보드 (Host Dashboard) 아키텍처 설계
호스트가 차량을 관리하고 수익을 확인할 수 있는 전용 대시보드의 기능을 구체화하고, 이를 CLI 명령어로 구현하기 위한 프롬프트를 작성했습니다.

UI 레이아웃 및 디자인:

구조: 사이드바 네비게이션, 헤더(알림/프로필), 메인 콘텐츠 영역(통계 카드 + 상세 뷰)으로 구성된 반응형 레이아웃 설계.

자산 관리 UI: '사진 위, 내용 아래' 배치의 카드 UI(Card Grid) 패턴을 적용하여 보유 카라반 목록을 직관적으로 시각화.

핵심 기능 명세:

통계(Overview): 월별 예상 수입, 예약 대기 건수, 평점 요약 차트(Recharts/Chart.js 활용).

예약 관리: 예약 승인/거절, 상세 정보(면허, 인원 등) 확인, 상태 변경 로직.

유지보수(Maintenance): 차량 점검 로그 및 인계 시 활용할 디지털 체크리스트(상태 사진 업로드 포함) 기능 기획.

DB 스키마 설계: Hosts, Caravans, Bookings, MaintenanceLogs 간의 관계(Relation) 정의.

2. 예약 및 결제 시스템 고도화
단순 예약 생성을 넘어, 실제 서비스 가능한 수준의 결제 및 검증 로직을 설계했습니다.

프론트엔드 (Booking Widget):

달력: 예약 불가능 날짜(기예약/블락) 시각적 비활성화 및 Date Range Picker 구현.

가격 계산기: 대여 기간에 따른 대여료 + 청소비/봉사료 자동 계산 및 실시간 프리뷰 구현.

선결제 로직: '예약 및 결제' 버튼 클릭 시 PG사 모듈(Mock) 연동 및 결제 후 예약 요청 전송 흐름 설계.

백엔드 (Double-booking Prevention):

중복 예약 방지: 서버 저장 직전, 요청된 날짜 범위가 기존 예약과 겹치는지 확인하는 Overlap Check 로직 ((RequestStart < ExistingEnd) AND (RequestEnd > ExistingStart)) 설계.

트랜잭션 처리: 예약 정보 저장과 결제 이력 기록의 원자성(Atomicity) 보장.

3. 위치 기반 검색 및 지도 연동 (Kakao Maps API)
사용자가 지역별로 카라반을 탐색할 수 있는 LocationBasedSearch 기능을 기획했습니다.

지역 필터링 시스템:

전국을 8개 권역({서울/경기/인천}, {강릉/속초/양양}, {제주} 등)으로 그룹화하여 탭 UI 구성.

탭 선택 시 해당 지역의 regionCategory를 가진 카라반 리스트 필터링 로직 구현.

카카오맵(Kakao Maps) 통합:

Split View UI: 좌측은 필터링된 카라반 리스트(스크롤), 우측은 지도(Sticky)가 배치된 화면 구성.

동적 마커 및 오토 줌: 리스트가 변경될 때마다 해당 카라반들의 좌표(lat, lng)에 마커를 생성하고, LatLngBounds를 사용하여 모든 마커가 보이도록 지도 중심과 확대 레벨 자동 조정 기능 설계.

API 키 관리: 카카오 디벨로퍼스 앱 생성, JavaScript 키 발급, 플랫폼(도메인) 등록 절차 및 환경 변수(.env) 보안 설정 가이드 확보.
## Phase 5: 기능 구현 및 버그 수정 (2025년 11월 26일)

### 1. "Invalid Hook Call" 오류 해결

-   **문제 진단:** `react-timeago` 라이브러리가 React 19와 호환되지 않아 발생하는 "Invalid Hook Call" 런타임 오류. `react-timeago`가 부모 프로젝트에 설치되어 `caravanapp` 프로젝트의 React 인스턴스와 충돌하는 문제도 발견.
-   **해결 과정:**
    -   `react-timeago`를 `caravanapp/package.json`으로 이동 및 `--legacy-peer-deps`를 사용하여 강제 설치 시도 (일시적 해결 불가).
    -   최종적으로 `react-timeago` 라이브러리를 제거하고, `ConversationList.jsx`와 `ChatWindow.jsx`에서 네이티브 `Date` 객체의 `toLocaleTimeString()` 메서드를 사용하여 날짜/시간을 표시하도록 수정.

### 2. 캐러밴 생성 기능 개선 (지역 선택 및 사진 업로드)

-   **데이터 모델 업데이트:** `caravanapp/server/models/Caravan.js`에 `region`, `lat`, `lng` 필드 추가.
-   **파일 업로드 백엔드 구현:**
    -   `multer` 라이브러리 설치 (`caravanapp/server/package.json`).
    -   `caravanapp/server/routes/caravans.js`의 `POST /` 라우트에 `multer` 미들웨어 추가하여 `multipart/form-data` 처리.
    -   이미지 파일을 `caravanapp/public/images/caravans` 경로에 저장하고, 데이터베이스에는 `'/images/caravans/filename.jpg'` 형식의 URL 경로를 저장하도록 로직 수정.
    -   `caravanapp/server/server.js`에 `express.static` 미들웨어 추가하여 `public` 디렉토리의 정적 파일들을 클라이언트에서 접근할 수 있도록 설정.
    -   `multer` 저장 경로 오류 (`500 Internal Server Error` 발생) 수정.
    -   `caravanapp/server/routes/caravans.js`의 `router.get("/my-caravans", ...)` 라인에 발생한 `SyntaxError` (점(`.`) 오타) 수정.
-   **프론트엔드 폼 구현:**
    -   `caravanapp/src/components/CaravanForm.jsx`에 지역 선택 드롭다운 및 다중 파일 업로드 `<input type="file">` 필드 추가.
    -   폼 제출 시 `FormData` 객체를 사용하여 이미지 파일 및 캐러밴 데이터를 백엔드로 전송하도록 수정.
    -   `TypeError: onSave is not a function` 오류 해결을 위해 `caravanapp/src/App.jsx`에 `CaravanFormWrapper` 컴포넌트를 생성하여 `onSave` prop 전달.
-   **신규 캐러밴 자동 위치 할당:** `caravanapp/server/services/CaravanService.js`의 `createCaravan` 메서드에, 선택된 `region`에 기반하여 더미 `lat`, `lng` 좌표를 자동으로 할당하는 로직 추가.

### 3. 기존 캐러밴 데이터 연동 및 이미지 표시 문제 해결

-   **`SearchByRegion` 연동:** `caravanapp/src/components/SearchByRegion.jsx`가 `dummyCaravans` 대신 API를 통해 실제 캐러밴 데이터를 가져오도록 수정.
-   **기존 캐러밴 데이터 업데이트 스크립트:** `caravanapp/server/updateCaravans.js` 스크립트를 생성 및 실행하여, 기존 데이터베이스의 캐러밴들에 무작위 `region` 및 `lat`/`lng` 좌표를 할당하고, `photos` 배열이 비어있을 경우 기본 이미지 파일을 할당.
-   **목록/카드 뷰 이미지 URL 수정:** `SearchByRegion.jsx`, `CaravanList.jsx`에서 사용하는 `Card.jsx`, `caravanapp/src/components/dashboard/CaravanCard.jsx`에서 이미지 `src`에 `http://localhost:5000`을 명시적으로 붙여서 이미지를 올바르게 불러오도록 수정.
-   **사진 확장자 불일치 수정:** `caravanapp/server/fixPhotoExtensions.js` 스크립트를 생성 및 실행하여, 특정 캐러밴의 `photos` 필드에 저장된 이미지 파일 확장자 (예: `.jpg` 대신 `.jpeg`)가 실제 파일과 일치하도록 데이터베이스 업데이트.

### 4. 문서화 및 프로젝트 설정 강화

-   **README.md 업데이트:** 프로젝트의 새로운 `README.md` 파일을 상세한 지침에 따라 생성.
    -   프로젝트 소개, 핵심 기능, 기술 스택, 아키텍처 및 설계 원칙, 시작하기 가이드, 라이선스, 작성자 정보 포함.
    -   대시보드 채팅 기능 및 위치 기반 검색 기능 관련 GIF 이미지 (700px 너비, 중앙 정렬) 및 설명 추가.
    -   GIF 파일 경로 및 파일명(`admin.gif`, `guest.gif`) 불일치 문제 해결 및 `README.md` 수정.
-   **환경 변수 보안 강화:**
    -   `caravanapp/.gitignore` 파일에 `server/.env`를 추가하여 민감한 환경 변수 파일이 Git에 업로드되지 않도록 설정.
    -   `caravanapp/server/.env.example` 파일을 생성하여 다른 개발자가 환경 변수를 설정할 때 참고할 수 있도록 가이드 제공.
