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
