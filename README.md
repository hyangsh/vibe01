# CaravanShare: 당신의 카라반, 새로운 여행의 시작

> 유휴 카라반을 공유하여 부가 수익을 창출하고, 여행자에게는 잊지 못할 경험을 선사하는 카라반 셰어링 플랫폼

## 🏕️ 소개 (Introduction)

**CaravanShare**는 카라반 소유주와 여행객 모두를 위한 혁신적인 솔루션입니다. 많은 카라반 소유주들은 일 년 중 대부분의 시간 동안 자신의 카라반을 사용하지 않은 채로 방치하여 유지비용만 부담하고 있습니다. 반면, 여행객들은 획일화된 숙소에서 벗어나 합리적인 가격으로 특별하고 자유로운 여행을 갈망합니다.

CaravanShare는 바로 이 지점에서 시작되었습니다.

-   **호스트(Host):** 소유하고 있는 카라반을 플랫폼에 손쉽게 등록하고, 사용하지 않는 동안 여행객에게 대여해주며 안정적인 부가 수익을 창출할 수 있습니다.
-   **게스트(Guest):** 전국 각지의 특색 있는 카라반을 합리적인 가격에 예약하여, 틀에 박힌 여행에서 벗어나 자신만의 프라이빗하고 잊지 못할 추억을 만들 수 있습니다.

저희의 비전은 단순히 카라반을 대여하는 것을 넘어, 상호 신뢰를 바탕으로 호스트와 게스트가 만족스러운 경험을 공유하고 소통하는 활발한 커뮤니티를 구축하는 것입니다.

## ✨ 핵심 기능 (Features)

-   **👤 사용자 관리 (User Management)**
    -   이메일 기반의 간편 회원가입 및 안전한 로그인 (JWT 기반 인증)
    -   개인 정보 및 프로필 사진을 관리할 수 있는 마이페이지

-   **🚐 카라반 관리 (Caravan Management)**
    -   호스트를 위한 카라반 등록, 정보 수정, 삭제 (CRUD) 기능
    -   사진, 편의시설, 가격, 예약 가능일 등 상세 정보 설정

-   **📅 지능형 예약 시스템 (Intelligent Reservation System)**
    -   게스트의 실시간 예약 신청 및 현황 조회
    -   호스트의 예약 승인 및 거절 관리
    -   날짜 기반 중복 예약 방지 로직

-   **⭐ 리뷰 및 평점 시스템 (Review & Rating System)**
    -   경험 완료 후 호스트와 게스트 간 상호 리뷰 및 별점 평가
    -   투명한 리뷰 시스템을 통해 사용자 간의 신뢰도 형성

-   **📊 호스트 대시보드 (Host Dashboard)**
    -   예약 현황, 월별 수익 등 핵심 지표를 시각화한 차트 제공
    -   자신이 등록한 카라반 목록 및 관리 기능
    -   **게스트와의 실시간 채팅 기능:** 예약 승인 후, 대시보드 내에서 게스트와 실시간으로 소통하며 여행에 필요한 정보를 교환할 수 있습니다.
    <div align="center">
      <img src="caravanapp/src/assets/admin.gif" alt="Host Admin GIF" width="700px" />
      <br/>
      *<small>호스트가 예약을 승인하고 게스트와 실시간으로 소통하는 모습</small>*
    </div>

-   **🗺️ 위치 기반 검색 (Location-Based Search)**
    -   Kakao Maps API와 연동하여 카라반의 위치를 지도에 표시
    -   주요 권역별 필터링을 통해 원하는 지역의 카라반을 손쉽게 탐색하고 대여까지 진행할 수 있습니다.
    <div align="center">
      <img src="caravanapp/src/assets/guest.gif" alt="Guest Search GIF" width="700px" />
      <br/>
      *<small>게스트가 위치 기반 검색을 통해 캐러밴을 대여하는 모습</small>*
    </div>

## 💻 기술 스택 (Tech Stack)

| Category      | Technology                                                                                                                                                                                                                                                                   |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`Backend`** | <img src="https://img.shields.io/badge/Node.js-339933?logo=nodedotjs&logoColor=fff" /> <img src="https://img.shields.io/badge/Express-000000?logo=express&logoColor=fff" /> <img src="https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=fff" /> <img src="https://img.shields.io/badge/Mongoose-880000?logo=mongoose&logoColor=fff" /> <img src="https://img.shields.io/badge/JWT-000000?logo=jsonwebtokens&logoColor=fff" /> <img src="https://img.shields.io/badge/Bcrypt-634f9a" /> |
| **`Frontend`**| <img src="https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000" /> <img src="https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=fff" /> <img src="https://img.shields.io/badge/React%20Router-CA4245?logo=reactrouter&logoColor=fff" /> <img src="https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=fff" /> <img src="https://img.shields.io/badge/Tailwind%20CSS-06B6D4?logo=tailwindcss&logoColor=fff" />                                                                    |
| **`API`**     | <img src="https://img.shields.io/badge/Kakao%20Maps-FFCD00?logo=kakao&logoColor=000" />                                                                                                                                                                                          |

## 🏛️ 아키텍처 및 설계 원칙 (Architecture & Design Principles)

CaravanShare는 단순한 MVP(Minimum Viable Product)를 넘어, 지속 가능한 서비스로 성장하기 위한 견고한 아키텍처와 설계 원칙 위에 구축되었습니다.

-   **SOLID 원칙 적용 (SOLID Principles)**
    -   **단일 책임 원칙 (SRP):** `Service` - `Repository` - `Controller` 계층을 명확히 분리하여 각 컴포넌트가 하나의 책임만 갖도록 설계했습니다. 예를 들어, `ReservationService`는 오직 예약 관련 비즈니스 로직에만 집중합니다.
    -   **개방-폐쇄 원칙 (OCP):** 새로운 할인 정책이나 알림 방식이 추가되더라도 기존 코드를 수정할 필요 없이, `Strategy`나 `Observer` 패턴을 통해 새로운 기능을 손쉽게 확장할 수 있는 구조를 채택했습니다.

-   **디자인 패턴 적용 (Design Patterns)**
    -   **Repository Pattern:** 데이터 영속성 로직을 `Repository` 계층에 캡슐화하여, `Service` 계층이 데이터베이스 기술(MongoDB)에 직접 종속되지 않도록 분리했습니다.
    -   **Factory Pattern:** `Reservation` 객체 생성 로직을 팩토리에 위임하여, 복잡한 생성 과정을 단순화하고 일관성을 유지합니다.
    -   **Strategy Pattern:** 계절별, 기간별 등 다양한 할인 정책을 `DiscountStrategy` 인터페이스와 구현체로 분리하여, 런타임에 동적으로 할인 로직을 변경하거나 추가할 수 있습니다.
    -   **Observer Pattern:** 예약 상태가 변경될 때 이메일, SMS 등 다양한 수신자에게 알림을 보내는 기능을 `Observer` 패턴으로 구현하여, 알림 시스템과 비즈니스 로직 간의 결합도를 낮췄습니다.

-   **성능 최적화 (Performance Optimization)**
    -   **In-Memory Cache:** 특정 카라반의 예약 불가능한 날짜들을 메모리에 캐싱하여, 예약 가능 여부 확인 시 매번 데이터베이스를 조회하는 대신 O(1) 시간 복잡도로 빠르게 응답할 수 있도록 성능을 최적화했습니다.

-   **견고한 에러 처리 (Robust Error Handling)**
    -   `AppError`를 상속받는 `NotFoundError`, `ValidationError` 등 커스텀 예외 클래스를 정의했습니다. 이를 통해 API 전반에 걸쳐 예측 가능하고 일관된 에러 응답(HTTP 상태 코드, 에러 메시지)을 보장하여 디버깅 효율을 높였습니다.

## 🚀 시작하기 (Getting Started)

로컬 환경에서 CaravanShare 프로젝트를 실행하는 방법은 다음과 같습니다.

### Prerequisites (사전 요구사항)

-   [Node.js](https://nodejs.org/) (v18.x 이상 권장)
-   `npm` (Node.js 설치 시 함께 설치됨)
-   [MongoDB](https://www.mongodb.com/try/download/community)가 로컬 또는 원격 환경에 설치 및 실행되어 있어야 합니다.

### Backend 설정

1.  **서버 디렉토리로 이동:**
    ```bash
    cd caravanapp/server
    ```

2.  **의존성 설치:**
    ```bash
    npm install
    ```

3.  **.env 파일 생성:**
    `server` 디렉토리 내에 `.env` 파일을 생성하고 아래 내용을 채워주세요.
    ```
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```

4.  **백엔드 서버 실행:**
    ```bash
    npm start
    ```
    서버가 `http://localhost:5000`에서 실행됩니다.

### Frontend 설정

1.  **프로젝트 루트 디렉토리로 이동:**
    ```bash
    cd .. 
    ```

2.  **의존성 설치:**
    ```bash
    npm install
    ```

3.  **프론트엔드 앱 실행:**
    ```bash
    npm run dev
    ```
    애플리케이션이 `http://localhost:5173`에서 실행되며, 브라우저에서 확인하실 수 있습니다.

## 📜 라이선스 (License)

This project is licensed under the [BSD-3-Clause](LICENSE).

