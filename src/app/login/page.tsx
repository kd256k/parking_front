'use client'

import React, { useState } from "react";
import { RiKakaoTalkFill } from "react-icons/ri";
import { SiNaver } from "react-icons/si";
import { FaGithub } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { useAtom } from "jotai";
import { User } from "@/types/user";
import { loginUserAtom } from "@/atoms/atom";
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const router = useRouter();

    const [loginUser, setLoginUser] = useAtom<User | null>(loginUserAtom);
    
    const idRef = React.useRef<HTMLInputElement>(null);
    const passwordRef = React.useRef<HTMLInputElement>(null);
    

    const loginButton = async () => {
        const credentials = {
            id: idRef.current?.value,
            password: passwordRef.current?.value,
        };

        if(!credentials.id || !credentials.password) {
            alert('아이디와 비밀번호를 입력하세요.');
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(credentials),
            });
            if (response.ok) {
                const jwtToken = response.headers.get("Authorization");
                if (jwtToken) {
                    sessionStorage.setItem("jwtToken", jwtToken);

                    const loginUserInfo : User = await response.json();
                    setLoginUser(loginUserInfo);
                    
                    router.push('/');
                    return;
                }
            }
                
            alert("로그인 실패!");
        } catch (error) {
            console.error("로그인 오류!", error);
        }
    };
    return (
        <div className="flex mx-auto flex-col justify-center items-center border border-blue rounded-xl w-100 m-10 p-10 bg-amber-50">
            <div className="text-3xl font-bold mb-4">로그인</div>
            <div className="grid grid-cols-[30%_70%] items-center justify-center mx-10 mb-4 w-80">
                <label htmlFor="username">아이디</label>
                <input ref={idRef} className="border border-black p-1 rounded bg-white" type="text" id="username" placeholder="아이디를 입력하세요" />
            </div>
            <div className="grid grid-cols-[30%_70%] items-center justify-center mx-10 mb-4 w-80">
                <label htmlFor="password">비밀번호</label>
                <input ref={passwordRef} className="border border-black p-1 rounded bg-white" type="password" id="password" placeholder="비밀번호를 입력하세요" onKeyUp={(e)=>{e.key === 'Enter' && loginButton()}} />
            </div>
            <button type="button" className="mt-2 bg-blue-600 px-3 py-2 text-white rounded-md hover:bg-blue-700 cursor-pointer" onClick={loginButton}>
                로그인
            </button>
            <div className="text-sm m-2 border-t border-gray-300 w-full text-center mt-5 pt-3">
                <span>또는</span>
            </div>
            <div className="flex justify-between w-full">
                <a href={`${backendUrl}/auth/oauth2/authorization/google`} className="flex justify-center items-center w-13 h-13 text-3xl text-white p-2 bg-blue-500 rounded-2xl"><FaGoogle/></a>
                <a href={`${backendUrl}/auth/oauth2/authorization/naver`} className="flex justify-center items-center w-13 h-13 text-2xl text-white p-2 bg-green-500 rounded-2xl"><SiNaver/></a>
                <a href={`${backendUrl}/auth/oauth2/authorization/kakao`} className="flex justify-center items-center w-13 h-13 text-4xl text-black p-2 bg-yellow-300 rounded-2xl"><RiKakaoTalkFill/></a>
                <a href={`${backendUrl}/auth/oauth2/authorization/github`} className="flex justify-center items-center w-13 h-13 text-3xl text-white p-2 bg-black rounded-2xl"><FaGithub/></a>
            </div>
        </div>
    );
};
