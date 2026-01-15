"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { CompanyLogo } from "@/components/Logo";
import Image from "next/image";
import AutoFitScale from "@/components/AutoFitScale";
import { Chiron_GoRound_TC, Hanuman } from "next/font/google";


const EnglishFont = Hanuman({
    weight: '400',
})

const KoreanFont = Chiron_GoRound_TC({
    weight: '400',
});


type Step = '' | 'marker_logo' | 'message' | 'message_subtitle' | 'main_logo' | 'main_logo_message'

export default function IntroPage() {
    const [step, setStep] = useState<Step>('marker_logo');
    const router = useRouter();

    useEffect(() => {
        const step_list = ['marker_logo','message', 'message_subtitle', 'main_logo', 'main_logo_message'];
        const step_millis = [0, 3000, 2000, 5000, 4000];

        const timeouts = step_list.map((step, index) => {
            return setTimeout(() => {
                setStep(step as Step);
            }, step_millis.slice(0, index+1).reduce((a, b) => a + b, 0));
        });

        return () => {
            timeouts.forEach(timeout => clearTimeout(timeout));
        };
    }, [router]);

    const goToMap = () => {
        router.push("/map")
    }

    return (
        <div className="w-full h-screen bg-black">
        <AutoFitScale>
            <div className="w-480 h-270 flex items-center justify-center bg-black overflow-hidden" onClick={goToMap}>
                <AnimatePresence mode="wait">
                    {['marker_logo'].includes(step) ? (
                        <motion.div
                            key="div1"
                            initial={{ opacity: 0, scale: 2.2 }}
                            animate={{ opacity: 1, scale: 2 }}
                            exit={{ opacity: 0, scale: 1.8 }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                        >
                            <div className="scale-500">
                                <CompanyLogo border={false} />
                            </div>
                        </motion.div>
                    ) : 
                    ['message', 'message_subtitle'].includes(step) ? (
                        <motion.div
                            key="div2"
                            initial={{ opacity: 1, y: 0 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 2 }}
                        >
                            <div className="w-full h-screen flex flex-col justify-between items-center">
                                <div className={`${KoreanFont.className} text-white font-bold text-4xl pt-20 flex flex-col justify-start items-center gap-y-2 h-1/3`}>
                                    {step === 'message_subtitle' && <>
                                    <div>스파이더맨은 집에 갈 길이 없었지만,</div>
                                    <div>우리는 집(<span className="text-sky-300">주차장</span>)으로 가는 길을 압니다.</div>
                                    </>}
                                </div>
                                <div className={`${EnglishFont.className} text-gray-200 text-5xl flex flex-col justify-center items-start gap-y-2 h-1/3`}>
                                    <div>Spider-Man had <span className="italic text-sky-300">"No Way Home"</span>,</div>
                                    <div>but we <span className="italic text-sky-300">"Know Way Home"</span>.</div>
                                </div>
                                <div className={`${KoreanFont.className} text-white font-bold text-3xl pb-20 flex flex-col justify-end items-center gap-y-2 h-1/3`}>
                                    {step === 'message_subtitle' && <>
                                    <div>(이 메시지는 Gemini 3 Pro가 만들었습니다.)</div>
                                    </>}
                                </div>
                            </div>
                        </motion.div>
                    ) :
                    ['main_logo', 'main_logo_message'].includes(step) ? (
                        <motion.div
                            key="div3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1 }}
                        >
                            <div className="w-full h-screen flex flex-col justify-center items-center mt-30">
                                <Image src='/logo.png' width={1000} height={1000} alt='' />
                                <div className={`text-gray-300 font-bold text-2xl mt-10 ${step === 'main_logo_message' ? '' : 'invisible'}`}>계속하려면 클릭하세요.</div>
                            </div>
                        </motion.div>
                    )
                    : <></>
                    }
                </AnimatePresence>
            </div>
        </AutoFitScale>
        </div>
    );
}