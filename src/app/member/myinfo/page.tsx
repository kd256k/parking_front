'use client'

import { fetchAPI } from '@/utils/fetchAPI';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { User } from '@/types/user';
import { loginUserAtom } from '@/atoms/atom';
import { validatePassword } from '@/utils/StringValidator';


function HiddenDiv({ isShow, children, className='' }: { isShow: boolean, children: React.ReactNode, className?: string }) {
    return (
        <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isShow ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'} ${className}`}>{children}</div>
    )
}

export default function MyInfoPage() {
    const [realId, setRealId] = useState<string>('');
    const [provider, setProvider] = useState<string>('');
    const [item, setItem] = useState<any>(null);
    const router = useRouter();
    const [loginUser, setLoginUser] = useAtom<User | null>(loginUserAtom);

    const [changePassword, setChangePassword] = useState<boolean>(false);

    const fetchData = async () => {
        const res = await fetchAPI(`/member/myinfo`);

        console.log(res.status);
        if (!res.ok && res.status !== 401) {
            throw new Error('data fetch error');
        }

        return await res.json();
    }

    const onPasswordChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setChangePassword(event.currentTarget.value !== '');
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);

        const name = formData.get('name') as string;
        const orgPassword = formData.get('orgPassword') as string;
        const password = formData.get('password') as string;
        const password2 = formData.get('password2') as string;

        if (!name) {
            alert('사용자명을 입력하세요.');
            return;
        }

        if(name.length > 255) {
            alert('사용자명은 255자 이하로 입력하세요.');
            return;
        }

        if (!provider && !orgPassword) {
            alert('현재 비밀번호를 입력하세요.');
            return;
        }

        const data = {
            name: name,
            orgPassword: orgPassword,
            password: ''
        }

        if (password) {
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

            data.password = password;
        }

        const res = await fetchAPI(`/member/myinfo`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            const data = await res.json();
            alert(data.message ? data.message : '정보 수정에 실패했습니다.\n잠시 후 다시 시도해 주십시오.');
            return;
        }

        alert("정보 수정이 완료되었습니다.");

        setLoginUser(
            {
                ...loginUser!,
                name: name as string
            }
        );
        router.back();
    }

    useEffect(() => {
        (async () => {
            const item = await fetchData();
            setItem(item);
            
            let realId = item.id, provider = '';
            if (item.id.indexOf('|') > -1) {
                const tmp = item.id.split('|');
                realId = tmp[1];
                provider = tmp[0].toUpperCase();
            }

            setRealId(realId);
            setProvider(provider);
        })();
    }, []);

    if (!item) {
        return (<></>);
    }

    if (item.error) {
        return (
            <div className="w-full h-screen flex justify-center items-center">{item.message}</div>
        );
    }

    return (
        <div className="flex mx-auto flex-col justify-center items-center rounded-xl w-120 m-10 p-10 bg-sky-50">
            <form onSubmit={handleSubmit} className="w-full grid grid-cols-[40%_60%] justify-center items-center gap-y-2 text-lg">
                <div className="text-center text-3xl font-bold col-span-2 mb-4 text-sky-700">사용자 정보</div>

                <div className="w-full text-right font-bold text-lg text-sky-700 pr-5">ID</div>
                <div className=""> {realId} </div>

                {
                    provider && <>
                        <div className="w-full text-right font-bold text-lg text-sky-700 pr-5"> SNS </div>
                        <div className=""> {provider} </div>
                    </>
                }

                <div className="w-full text-right font-bold text-lg text-sky-700 pr-5">사용자명</div>
                <div className=""><input type="text" name="name" defaultValue={item.name} className="p-1 border border-sky-600 bg-white rounded-md" /></div>

                { !provider && <>
                <div className="w-full text-right font-bold text-lg text-sky-700 pr-5">현재 비밀번호</div>
                <div><input type="password" name="orgPassword" placeholder='현재 비밀번호 입력' className="p-1 border border-sky-600 bg-white rounded-md" /></div>

                <div className="w-full text-right font-bold text-lg text-sky-700 pr-5">새 비밀번호</div>
                <div><input onChange={onPasswordChange} type="password" name="password" placeholder='변경하려면 비밀번호 입력' className="p-1 border border-sky-600 bg-white rounded-md" /></div>

                <HiddenDiv isShow={changePassword} className="w-full text-right font-bold text-lg text-sky-700 pr-5">새 비밀번호 확인</HiddenDiv>
                <HiddenDiv isShow={changePassword}><input type="password" name="password2" placeholder='비밀번호 확인 입력' className="p-1 border border-sky-600 bg-white rounded-md" /></HiddenDiv>
                </>}
                <div className="col-span-2 text-center mt-3">
                    <button type="submit" className="mt-2 bg-sky-400 px-3 py-2 text-white rounded-md hover:bg-sky-500 cursor-pointer">정보 수정</button>
                </div>
            </form>
        </div>
    );
}