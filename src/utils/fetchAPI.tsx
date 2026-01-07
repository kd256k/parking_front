import { redirect } from 'next/navigation'

// 환경 감지 유틸
const isServer = typeof window === 'undefined';
const BACKEND_URL = isServer ? process.env.INTERNAL_BACKEND_URL : process.env.NEXT_PUBLIC_BACKEND_URL;

// 1. 내부 Fetch 함수 (헤더 처리 담당)
const fetchSub = async (url: string, options: RequestInit = {}) => {
  let headers = { ...options.headers };

  if (isServer) {
    // [SSR] 브라우저가 준 쿠키를 백엔드에 그대로 전달 (Forwarding)
    try {
      const { cookies } = await import('next/headers');
      const cookieStore = await cookies();
      const allCookies = cookieStore.toString();
      if (allCookies) {
        headers = { ...headers, Cookie: allCookies };
      }
    } catch (e) {
      // cookies() 호출 불가 환경 대비
    }
  }

  // [CSR] 브라우저가 자동으로 쿠키 전송 (credentials: 'include' 불필요 - Same Origin)
  const response = await fetch(`${BACKEND_URL}${url}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...headers },
    credentials: 'include'
  });

  return response;
};

// 2. 토큰 갱신 함수
const refreshToken = async () => {
  // 쿠키(refresh_token)가 자동으로 백엔드에 전송됨
  const res = await fetch(`${BACKEND_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include'
  });

  if (res.ok) {
    // 성공 시 백엔드가 Set-Cookie 헤더를 줌 -> 브라우저/Nginx가 받아서 쿠키 갱신
    return true;
  }
  return false;
};

// 3. 메인 Fetch 함수 (Retry 로직 포함)
export const fetchAPI = async (url: string, options: RequestInit = {}) => {
  // 최대 2번 시도 (원래 요청 -> [실패시] 갱신 후 재요청)
  for (let i = 0; i < 2; i++) {
    const response = await fetchSub(url, options);

    // 401(Unauthorized) 발생 시 갱신 시도
    if (response.status === 401) {

      // SSR에서는 갱신 로직을 돌리기 어려움 (Set-Cookie 전달 문제 등)
      // 따라서 SSR 401은 그냥 에러로 반환하고 클라이언트가 처리하게 함
      if (isServer) {
        redirect('/login');
        //return response; 
      }

      // CSR에서만 갱신 시도
      const refreshed = await refreshToken();
      if (refreshed) {
        continue; // 갱신 성공! 루프를 돌아 재요청 (새 쿠키 자동 사용)
      } else {
        // 갱신 실패 (리프레시 토큰도 만료됨)
        delete localStorage.__loginUserInfo__;
        if (window.location.pathname !== '/login') {
          redirect('/login');
        }
        return response;
      }
    }

    return response; // 성공(200)이거나 401 아닌 다른 에러면 바로 반환
  }

  return { ok: false } as Response; // 더미 응답
};
