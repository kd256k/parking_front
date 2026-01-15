import { Saira_Stencil_One } from 'next/font/google';
import { Yesteryear } from 'next/font/google';
import { REM } from 'next/font/google';

export const LogoMainFont = Saira_Stencil_One({
    weight: '400',
});

export const LogoSubFont = Yesteryear({
    weight: '400',
});

export const LogoSubFont2 = REM({
    weight: '700',
});


export function CompanyLogo({inverse = false, border = true}:{inverse?:boolean,border?:boolean}) {
    return (
        <div className={`${LogoSubFont2.className} flex text-bold text-lg justify-center items-center scale-x-65 scale-y-130 ${border? '': 'bg-white'}`}>
            <div className="bg-red-500 text-white px-1 border border-red-500 leading-none">
                MARKER
            </div>
            <div className={`${border? 'border': ''} ${inverse ? 'bg-gray-800 border-white text-white' : 'bg-white border-gray-800 text-gray-800'} border-l-0 px-0.5 leading-none `}>
                STUDIOS
            </div>
        </div>
    )
}

export default function Logo({ scale = 1, includeSub = true, inverse = false }: { scale?: number, includeSub?: boolean, inverse?:boolean }) {
    return (
        <div>
            <div className="w-full flex flex-col justify-center items-center" style={{ scale }}>
                <CompanyLogo inverse={inverse}/>
                <div className={`${LogoMainFont.className} mt-2 text-4xl font-extrabold text-transparent bg-clip-text bg-linear-to-b from-sky-400 to-sky-800 scale-x-110 scale-y-130 tracking-wide`} >
                    FITTER PARKER
                </div>
                {
                    includeSub &&
                    <div className={`${LogoSubFont.className} mt-1 text-2xl font-bold text-sky-400 rotate-357`}>
                        Know Way Home
                    </div>
                }
            </div>
        </div>
    );
}