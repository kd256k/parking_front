const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;


const fetchSub = async (url: string, options: RequestInit = {}) => {
    // 브라우저 환경인지 확인 (Next.js SSR 에러 방지)
    if (typeof window !== 'undefined') {
        const token = sessionStorage.getItem('jwtToken');

        if (token) {
            options.headers = {
                ...options.headers,
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            };
        }
    }

    // 실제 fetch 실행
    const response = await fetch(`${backendUrl}${url}`, options);

    return response;
};

const refreshToken = async () => {
    // 토큰 갱신
    const res = await fetch(`${backendUrl}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include"
    });

    if (res.ok) {
        const jwtToken = res.headers.get('Authorization');
        if (jwtToken) {
            sessionStorage.setItem('jwtToken', jwtToken);
        }
    } else {
        //console.error('토큰 갱신 실패');
        throw new Error('토큰 갱신 실패');
    }
}


export const fetchClient = async (url: string, options: RequestInit = {}) => {

    try{
        for (let i = 0; i < 2; i++) {

            const response = await fetchSub(url, options);

            if (response.status === 401) {
                const json = await response.json();

                if (json.error === 'token_expired') {
                    await refreshToken();
                    continue;

                } else {
                    //console.error('로그인 인증이 되지 않았습니다.');
                    throw new Error('로그인 인증이 되지 않았습니다.');
                }
            }

            return response;
        }
    } catch(e) {
        console.error(e);
    }

    sessionStorage.clear();
    window.location.href = '/login';

    return {
        ok:false
    } as Response;

};
