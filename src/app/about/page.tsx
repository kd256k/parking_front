'use client'

import AutoFitScale from '@/components/AutoFitScale';
import Logo, { CompanyLogo, LogoMainFont, LogoSubFont, LogoSubFont2 } from '@/components/Logo';

export default function Page() {
  return (
    <div className="w-150 h-220 bg-blue-100 rounded-xl">
      <AutoFitScale baseWidth={600} baseHeight={880}>
        <div className="p-10">
          <div>
            <Logo />
          </div>
          <div className="font-bold text-2xl text-center mt-3 text-sky-800">전국 주차장 정보 안내 시스템</div>
          <div className="text-zinc-500 text-sm text-right pt-4">Version 1.0.20260121</div>
          <div className="w-130 mx-auto ">
            <div className="my-5 text-center font-bold text-sky-800 text-lg">
              <div className="flex justify-center items-center">당신의 주차 시간을 지키는 다정한 이웃,<span className={`${LogoMainFont.className} text-sky-600 text-2xl leading-none ml-1`}>FITTER PARKER</span>가</div>
              <div className="flex justify-center items-center">주차장으로 가는 길(<span className={`${LogoSubFont.className} text-sky-600 text-xl leading-none`}>Know Way Home</span>)을</div>
              <div className="flex justify-center items-center">
                <CompanyLogo />
                <span className="-ml-7">가 완벽히 안내해 드립니다.</span>
              </div>
            </div>
            <p className="mt-5 text-center font-bold">
              행정구역별 주차장 현황, 요금정보, 운영 시간 등 다양한 정보를 <br />
              통계 대시보드, 검색시스템, 지도를 통해 한눈에 파악할 수 있습니다.
            </p>

            <div className="h-80 bg-center bg-no-repeat bg-contain mb-4 " style={{ backgroundImage: "url('about.png')" }}></div>

            <div className="text-sm italic bg-sky-700 p-2 text-white">
              <div className="font-bold">KDT3 미니프로젝트</div>
              <div>개발참여 : 김종현(SpringBoot, MariaDB), 유효정(Next.js), 최윤영(Next.js)</div>
              <div>활용 데이터 출처 : 공공데이터포털(한국교통안전공단_전국공영주차장정보)</div>
            </div>

            <div className="flex justify-center items-center mt-5 -mb-5 text-gray-500 leading-none text-sm">
              <span>© 2026 </span>
              <span className={`${LogoSubFont2.className} -ml-5 -m-6 -mb-6 scale-x-65`}>MARKER STUDIOS</span>
              <span>. All rights reserved.</span>
            </div>
          </div>
        </div>
      </AutoFitScale>
    </div>
  );
}