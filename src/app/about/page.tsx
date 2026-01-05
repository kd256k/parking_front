'use client'

import React from 'react';

export default function Page() {
  return (
    <div className="p-10 bg-blue-100">
      <div className="font-bold text-3xl text-center">전국 주차장 정보 안내 시스템</div>
      <div className="text-zinc-500 text-sm text-right pt-4">Version 1.0.20260121</div>
      <div className="w-123 mx-auto ">
        <p className="my-5 text-center">행정구역별 주차장 현황, 요금정보, 운영 시간 등 다양한 정보를 <br />
          대시보드, 검색시스템, 지도를 통해 한눈에 파악할 수 있습니다.</p>

        <div className="h-80 bg-center bg-no-repeat bg-contain my-8 " style={{ backgroundImage: "url('about.png')" }}></div>

        <div className="text-sm italic bg-sky-700 p-2 text-white">
          <div className="font-bold">KDT3 미니프로젝트</div>
          <div>개발참여 : 김종현, 유효정, 최윤영</div>
          <div>활용 데이터 출처 : 공공데이터포털(한국교통안전공단_전국공영주차장정보)</div>
        </div>
      </div>
    </div>
  );
}