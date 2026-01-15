'use client'

import React, { useEffect, useState } from "react";
import { RiKakaoTalkFill } from "react-icons/ri";
import { SiNaver } from "react-icons/si";
import { FaGithub } from "react-icons/fa";
import { FaGoogle } from "react-icons/fa";
import { useAtom } from "jotai";
import { User } from "@/types/user";
import { loginUserAtom } from "@/atoms/atom";
import { useIsModal, useModalRouter } from "@/utils/ModalUtil";
import { fetchAPI } from "@/utils/fetchAPI";
import { logout } from "./UserInfo";
import Logo from "@/components/Logo";
export default function LoginPage() {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    const {router, push} = useModalRouter();


    const isModal = useIsModal();

    const [loginState, setLoginState] = useState<boolean|null>(null);

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
                credentials: 'include'
            });
            if (response.ok) {
                const loginUserInfo : User = await response.json();
                setLoginUser(loginUserInfo);
                
                if(isModal) {
                    router.back();
                } else {
                    router.push('/map');
                }
                return;
            }
                
            alert("ID 혹은 비밀번호가 맞지 않습니다.");
        } catch (error) {
            console.error("로그인 오류!", error);
        }
    };

    const registerButton = () => {
        if(isModal) {
            push('/register');
        } else {
            window.location.href = '/register';
        }
    }

    const logoutAction = async () => {
        await logout(setLoginUser);

        if(isModal) {
            router.back();
        } else {
            router.push('/map');
        }
    }

    useEffect(()=>{
        if(!loginUser) {
            setLoginState(false);
            return;
        }

        // 실제 로그인 상태 확인
        (async () => {
            const res = await fetchAPI('/member/myinfo');

            if(!res.ok) {
                setLoginState(false);
                setLoginUser(null);
            } else {
                setLoginState(true);
            }
        })();

    },[loginUser]);
    
    if(loginState === null) {
        return (<></>);
    }

    return (
        <div className="flex mx-auto flex-col justify-center items-center rounded-xl w-100 m-10 p-10 bg-sky-50">
            {
                loginState ?
                <>
                    <div className="text-xl font-bold mb-4">이미 로그인 되어 있습니다.</div>
                    <button type="button" className="mt-2 bg-sky-600 px-3 py-2 text-white rounded-md hover:bg-sky-700 cursor-pointer" onClick={() => logoutAction()}>
                        로그아웃
                    </button>
                </>
                :
                <>
                    <div className="text-3xl font-bold mb-8 text-sky-700">
                        <Logo scale={1} includeSub={false} />
                    </div>
                    <div className="grid grid-cols-[30%_70%] items-center justify-center mx-10 mb-4 w-80">
                        <label htmlFor="username" className="w-full text-right font-bold text-lg text-sky-700 pr-5">아이디</label>
                        <input ref={idRef} className="border border-sky-700 p-1 rounded bg-white" type="text" id="username" placeholder="아이디를 입력하세요" />
                    </div>
                    <div className="grid grid-cols-[30%_70%] items-center justify-center mx-10 mb-4 w-80">
                        <label htmlFor="password" className="w-full text-right font-bold text-lg text-sky-700 pr-5">비밀번호</label>
                        <input ref={passwordRef} className="border border-sky-700 p-1 rounded bg-white" type="password" id="password" placeholder="비밀번호를 입력하세요" onKeyUp={(e)=>{e.key === 'Enter' && loginButton()}} />
                    </div>
                    <div className="flex justify-between w-7/10">
                        <button type="button" className="mt-2 bg-sky-400 px-3 py-2 text-white rounded-md hover:bg-sky-500 cursor-pointer w-25 text-center" onClick={registerButton}>
                            회원가입
                        </button>
                        <button type="button" className="mt-2 bg-sky-500 px-3 py-2 text-white rounded-md hover:bg-sky-600 cursor-pointer w-25" onClick={loginButton}>
                            로그인
                        </button>
                    </div>
                    <div className="text-sm m-2 border-t border-gray-300 w-full text-center mt-5 pt-3">
                        <span>또는</span>
                    </div>
                    <div className="flex justify-between w-7/10">
                        <a href={`${backendUrl}/auth/oauth2/authorization/google`} className="flex justify-center items-center w-11 h-11 text-2xl text-white p-2 bg-blue-500 rounded-2xl"><FaGoogle/></a>
                        <a href={`${backendUrl}/auth/oauth2/authorization/naver`}  className="flex justify-center items-center w-11 h-11 text-xl text-white p-2 bg-green-500 rounded-2xl"><SiNaver/></a>
                        <a href={`${backendUrl}/auth/oauth2/authorization/kakao`}  className="flex justify-center items-center w-11 h-11 text-4xl text-black p-2 bg-yellow-300 rounded-2xl"><RiKakaoTalkFill/></a>
                        <a href={`${backendUrl}/auth/oauth2/authorization/github`} className="flex justify-center items-center w-11 h-11 text-2xl text-white p-2 bg-black rounded-2xl"><FaGithub/></a>
                    </div>
                </>
            }
        </div>
    );
};
