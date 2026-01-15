'use client'

import Logo from "@/components/Logo";
import { fetchAPI } from "@/utils/fetchAPI";
import { validatePassword, validateUserId } from "@/utils/StringValidator";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";


export default function RegisterPage() {
    const router = useRouter();

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const id = formData.get('id') as string;
        const name = formData.get('name') as string;
        const password = formData.get('password') as string;
        const password2 = formData.get('password2') as string;


        if (!id) {
            alert('ID를 입력하세요.');
            return;
        }

        if(!validateUserId(id)) {
            alert('ID는 영소문자로 시작하고 영소문자,숫자만 포함해야 합니다.');
            return;
        }

        if(id.length < 4) {
            alert('ID는 4자 이상으로 입력하세요.');
            return;
        }

        if(id.length > 255) {
            alert('ID는 255자 이하로 입력하세요.');
            return;
        }
        
        if (!validatePassword(password)) {
            alert("비밀번호는 8자 이상이며 소문자, 대문자, 숫자, 특수문자 중 3가지 이상을 포함해야 합니다.");
            return;
        }

        if (!password2) {
            alert('비밀번호 확인을 입력하세요.');
            return;
        }

        if (password !== password2) {
            alert('비밀번호 확인이 일치하지 않습니다.');
            return;
        }


        if (!name) {
            alert('사용자명을 입력하세요.');
            return;
        }

        if(name.length > 255) {
            alert('사용자명은 255자 이하로 입력하세요.');
            return;
        }

        const data = {
            id,
            name,
            password,
        }

        const res = await fetchAPI(`/register`, {
            method: 'POST',
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const data = await res.json();
            alert(data.message ? data.message : '회원 가입에 실패했습니다.\n잠시 후 다시 시도해 주십시오.');
            return;
        }

        alert("회원 가입이 완료되었습니다.");

        router.back();
    }

    return (
        <form onSubmit={handleSubmit} className="flex mx-auto flex-col justify-center items-center rounded-xl w-100 m-10 p-10 bg-sky-50">
            <div className="text-3xl font-bold mb-8 text-sky-700">
                <Logo scale={1} includeSub={false} />
            </div>
            <div className="grid grid-cols-[40%_60%] items-center justify-center mx-10 mb-4 w-90">
                <label htmlFor="id" className="w-full text-right font-bold text-lg text-sky-700 pr-5">아이디</label>
                <input className="border border-sky-700 p-1 rounded bg-white mr-5" type="text" name="id" placeholder="아이디 입력" />
            </div>
            <div className="grid grid-cols-[40%_60%] items-center justify-center mx-10 mb-4 w-90">
                <label htmlFor="password" className="w-full text-right font-bold text-lg text-sky-700 pr-5">비밀번호</label>
                <input className="border border-sky-700 p-1 rounded bg-white mr-5" type="password" name="password" placeholder="비밀번호 입력" />
            </div>
            <div className="grid grid-cols-[40%_60%] items-center justify-center mx-10 mb-4 w-90">
                <label htmlFor="password2" className="w-full text-right font-bold text-lg text-sky-700 pr-5">비밀번호 확인</label>
                <input className="border border-sky-700 p-1 rounded bg-white mr-5" type="password" name="password2" placeholder="비밀번호 확인 입력"/>
            </div>
            <div className="grid grid-cols-[40%_60%] items-center justify-center mx-10 mb-4 w-90">
                <label htmlFor="name" className="w-full text-right font-bold text-lg text-sky-700 pr-5">이름</label>
                <input className="border border-sky-700 p-1 rounded bg-white mr-5" type="text" name="name" placeholder="이름 입력" />
            </div>

            <div className="flex justify-between w-7/10">
                <button className="mt-2 bg-sky-400 px-3 py-2 text-white rounded-md hover:bg-sky-500 cursor-pointer w-25">
                    회원가입
                </button>
                <button type="button" className="mt-2 bg-sky-500 px-3 py-2 text-white rounded-md hover:bg-sky-600 cursor-pointer w-25" onClick={()=>history.back()}>
                    취소
                </button>
            </div>

        </form>
    )
}