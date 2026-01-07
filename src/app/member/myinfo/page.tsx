'use client'

import { fetchAPI } from '@/utils/fetchAPI';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAtom } from 'jotai';
import { User } from '@/types/user';
import { loginUserAtom } from '@/atoms/atom';

export default function MyInfoPage() {
    const [item, setItem] = useState<any>(null);
    const router = useRouter();
    const [loginUser, setLoginUser] = useAtom<User | null>(loginUserAtom);

    const fetchData = async () => {
        const res = await fetchAPI(`/member/myinfo`);

        console.log(res.status);
        if(!res.ok && res.status !== 401) {
            throw new Error('data fetch error');
        }

        return await res.json();
    }

    const applyData = async (formData: FormData) => {

        const name = formData.get('name');
        const password = formData.get('password');

        const data = {
            name,
            password
        }

        const res = await fetchAPI(`/member/myinfo`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });

        if(!res.ok) {
            alert('정보 수정에 실패했습니다.\n잠시 후 다시 시도해 주십시오.');
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

    useEffect(()=>{
        (async() => {
            setItem(await fetchData());
        })();        
    }, []);
    
    if(!item) {
        return (<></>);
    }

    if(item.error) {
        return (
            <div className="w-full h-screen flex justify-center items-center">{item.message}</div>
        );
    }


    return (
        <div className="flex mx-auto flex-col justify-center items-center rounded-xl w-120 m-10 p-10 bg-sky-50">
            <form action={applyData} className="w-full grid grid-cols-[30%_70%] justify-center items-center gap-y-2 text-lg">
                <div className="text-center text-3xl font-bold col-span-2 mb-4">사용자 정보</div>

                <div>ID</div>
                <div>{item.id}</div>

                <div>사용자명</div>
                <div><input type="text" name="name" defaultValue={item.name}  className="p-1 border border-sky-600 bg-white rounded-md" /></div>

                <div>비밀번호</div>
                <div><input type="password" name="password" placeholder='변경하려면 비밀번호 입력' className="p-1 border border-sky-600 bg-white rounded-md"/></div>            

                <div className="col-span-2 text-center mt-3">
                    <button type="submit" className="mt-2 bg-sky-400 px-3 py-2 text-white rounded-md hover:bg-sky-500 cursor-pointer">정보 수정</button>
                </div>
            </form>
        </div>
    );
}