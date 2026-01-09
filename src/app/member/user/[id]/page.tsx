'use client'

import DesignSpan from "@/components/DesignSpan";
import ModalBackButton from "@/components/ModalBackButton";
import TailSelect from "@/components/TailSelect";
import { Enableds, Roles } from "@/constants/user";
import { Member } from "@/types/user";
import { fetchAPI } from "@/utils/fetchAPI";
import { notFound } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { IoArrowBack } from "react-icons/io5";





export default function MemberUserDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const [realId, setRealId] = useState<string>('');
    const [provider, setProvider] = useState<string>('');
    const [item, setItem] = useState<Member>();

    const selectRoleRef = useRef<HTMLSelectElement>(null);
    const inputNameRef = useRef<HTMLInputElement>(null);
    const inputPasswordRef = useRef<HTMLInputElement>(null);
    const inputEnabledRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        (async () => {
            const { id } = await params;

            const item: Member = await fetchData(id);
            setItem(item);

            console.log(item);


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


    useEffect(()=>{
        if(!item) return;

        selectRoleRef.current!.value = item.role;
        inputNameRef.current!.value = item.name;
        inputEnabledRef.current!.checked = item.enabled;

    }, [item, selectRoleRef, inputNameRef, inputEnabledRef]);


    const fetchData = async (id: string) => {
        const res = await fetchAPI(`/admin/member/detail/${id}`);

        if (!res.ok) {
            if (res.status === 404) {
                notFound();
            }

            throw new Error('data fetch error');
        }

        return await res.json();
    }

    const saveData = async () => {
        if(!item) return;

        const data = {
            id: item.id,
            name: inputNameRef.current!.value,
            role: selectRoleRef.current!.value,
            enabled: inputEnabledRef.current!.checked,
            password: '',
        }

        if (inputPasswordRef.current!.value) {
            data.password = inputPasswordRef.current!.value;
        }

        const res = await fetchAPI(`/admin/member/detail`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });

        if (!res.ok) {
            alert("수정에 실패했습니다.\n잠시 후 다시 시도해 주십시오.");
            return;
        }


        alert('정상적으로 수정되었습니다.');

        history.back();
    }

    return (
        <div className={`w-full`}>
            {item ?
                <div className="w-full">
                    <div className="p-10 flex justify-between items-end bg-sky-500 rounded-t-4xl">
                        <div className="flex justify-start items-start">
                            <ModalBackButton className="-ml-4 text-white p-4 inline-flex items-center text-2xl bg-sky-400 rounded-full"><IoArrowBack /></ModalBackButton>
                            <div className="flex flex-col justify-start items-start pl-4">
                                <div className={`${provider ? 'mb-4':'mb-2'} flex justify-start space-x-2`}>
                                    {provider && <DesignSpan>{provider}</DesignSpan>}
                                </div>
                                <div className="text-center font-bold text-4xl text-white">{item.name}</div>
                            </div>
                        </div>
                        <div className="font-bold text-right">
                        </div>
                    </div>


                    <div className="w-full p-5 gap-5 mx-auto grid grid-cols-[30%_60%] items-center bg-sky-50 px-10 rounded-b-4xl">
                        <div className="w-full text-right font-bold text-lg text-sky-700"> ID </div>
                        <div className="w-full"> {realId} </div>

                        {
                            provider && <>
                                <div className="w-full text-right font-bold text-lg text-sky-700"> SNS </div>
                                <div className="w-full"> {provider} </div>
                            </>
                        }

                        <div className="w-full text-right font-bold text-lg text-sky-700"> 이름 </div>
                        <div className="w-full">
                            <input ref={inputNameRef} type="text" className={`bg-white border border-sky-300 text-sm rounded focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5`} />
                        </div>

                        <div className="w-full text-right font-bold text-lg text-sky-700"> 등급 </div>
                        <div className="w-full">
                            <TailSelect ref={selectRoleRef} opk={Object.keys(Roles)} opv={Object.values(Roles)} value={item.role} />
                        </div>

                        <div className="w-full text-right font-bold text-lg text-sky-700"> 활성화 여부 </div>
                        <div className="w-full">
                            <input ref={inputEnabledRef} type="checkbox" className={`w-6 h-6 bg-white border border-sky-300 rounded focus:ring-sky-500 focus:border-sky-500 block p-2.5`} />
                        </div>

                        <div className="w-full text-right font-bold text-lg text-sky-700"> 비밀번호 초기화 </div>
                        <div className="w-full">
                            <input ref={inputPasswordRef} type="password" className={`bg-white border border-sky-300 text-sm rounded focus:ring-sky-500 focus:border-sky-500 block w-full p-2.5`} placeholder="초기화 하려면 입력" />
                        </div>

                        <div className="col-span-2 flex justify-end items-center">
                            <button className='bg-sky-400 rounded text-white px-3 py-2' onClick={saveData}>저장</button>
                        </div>
                    </div>

                </div>
                : <></>
            }
        </div>
    )
}