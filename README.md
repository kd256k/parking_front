# FITTER PARKER — 전국 주차장 정보 안내 시스템

## 프로젝트 소개

전국 주차장 정보를 통계 대시보드, 검색 시스템, 지도를 통해 한눈에 파악할 수 있는 웹 애플리케이션입니다.
4인 팀 프로젝트로, 본 레포지토리는 프론트엔드를 담당합니다.

## 기술 스택

- **Framework**: Next.js 16 (App Router), TypeScript
- **Styling**: Tailwind CSS 4
- **Charts**: ApexCharts (막대, 파이, 도넛 차트)
- **Map**: react-kakao-maps-sdk (카카오 맵), react-simple-south-korea-map-chart (한국 지도)
- **State**: Jotai
- **Animation**: Framer Motion
- **Auth**: JWT 기반 인증 (백엔드 연동), OAuth (Google, Naver, Kakao)
- **Routing**: Parallel Routes + Intercepting Routes (모달 기반 네비게이션)

## 주요 기능

- **대시보드**: 행정구역별 주차장 현황 시각화 (막대/파이 차트, 한국 지도 차트)
- **주차장 검색**: 공영/민영, 노상/노외/부설, 유료/무료 필터링, 페이지네이션
- **주차장 상세**: 개별 주차장 정보, 카카오 맵 위치 표시 (MiniMap)
- **지도 뷰**: 카카오 맵 기반 주차장 위치 표시, 드래그/줌 연동 목록 갱신
- **회원 관리**: 회원가입, 로그인 (일반/OAuth), 내 정보 수정
- **댓글 시스템**: 주차장별 댓글 CRUD
- **토큰 관리**: Access Token 자동 갱신 (fetchAPI 유틸), SSR/CSR 분기 처리

## 페이지 구성

```
/                    → 인트로 페이지
/login               → 로그인 (일반 + Google/Naver/Kakao OAuth)
/register            → 회원가입
/dashboard           → 통계 대시보드
/board               → 주차장 목록 (필터링, 페이지네이션)
/board/[id]          → 주차장 상세 (MiniMap, 댓글)
/map                 → 지도 뷰 (카카오 맵)
/comment             → 댓글 관리
/member              → 회원 목록 (관리자)
/member/myinfo       → 내 정보
/member/user/[id]    → 회원 상세
/about               → 서비스 소개
```

모든 페이지는 `@modal` Parallel Route로 모달 기반 네비게이션도 지원합니다.

## 실행 방법

```bash
git clone https://github.com/kd256k/parking_front.git
cd parking_front
npm install
npm run dev
```

http://localhost:3000 에서 확인

## 환경변수

`.env.local` 파일을 생성하고 아래 항목을 설정하세요.

```
NEXT_PUBLIC_BACKEND_URL=<백엔드 API 서버 URL (CSR용)>
NEXT_PUBLIC_KAKAO_APP_KEY=<카카오 맵 JavaScript App Key>
INTERNAL_BACKEND_URL=<백엔드 API 서버 URL (SSR용, 선택)>
```

Vercel 배포 시 `INTERNAL_BACKEND_URL`은 `NEXT_PUBLIC_BACKEND_URL`과 동일하게 설정하면 됩니다.

## 관련 레포지토리

- **Backend**: [parking_back](https://github.com/runawaysheepkd/parking_back) — Spring Boot 3.5 + MariaDB + JWT + OAuth2 (Google/Naver/Kakao/GitHub)

## 시연 영상

[![시연 영상 보기](https://img.youtube.com/vi/AlJ2DVAki70/maxresdefault.jpg)](https://www.youtube.com/watch?v=AlJ2DVAki70)

## 👨‍💻 Team Marker Studios

| Name | Role | GitHub |
|------|------|--------|
| 김종현 | Backend & Map Core | [@runawaysheepkd](https://github.com/runawaysheepkd) |
| 최윤영 | Frontend (List/Dashboard) | [@kd256k](https://github.com/kd256k) |
| 유효정 | Frontend (Design/Guide) | [@ryuhyojeong-art](https://github.com/ryuhyojeong-art) |

## 라이센스

MIT License © 2025 Team Marker Studios
