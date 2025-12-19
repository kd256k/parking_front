'use client'

import React, { useEffect } from "react";
import { useRouter } from 'next/navigation';
import { User } from "@/types/user";
import { useAtom } from "jotai";
import { loginUserAtom } from "@/atoms/atom";

export default function OAuth2Callback() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    const router = useRouter();
    const [loginUser, setLoginUser] = useAtom<User | null>(loginUserAtom);

    useEffect(() => {
        const fetchCallback = async () => {
            try {
                const response = await fetch(`${backendUrl}/auth/jwtcallback`, {
                    method: "POST",
                    credentials: "include", // 쿠키 포함
                });

                if (response.ok) {
                    const jwtToken = response.headers.get("Authorization");
                    //console.log("jwtToken", jwtToken);

                    if (jwtToken) sessionStorage.setItem("jwtToken", jwtToken);

                    const loginUserInfo : User = await response.json();

                    setLoginUser(loginUserInfo);
                    
                    router.push('/');
                } else {
                    alert("JWT 검증 실패");
                    router.push("/login");
                }
            } catch (err) {
                console.error("서버 요청 오류", err);
                alert("서버 요청 오류");
                router.push("/login");
            }
        };
        fetchCallback();
    }, [router]);

    return <p>로그인 처리중...</p>;
};