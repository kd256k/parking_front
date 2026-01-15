'use client'

import { fetchAPI } from "@/utils/fetchAPI";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { ChartOption, ParkingDashboardResponse } from "@/types/dashboard";

import ContainerCard from "@/components/ContainerCard";
import Top5Card from "@/components/Top5Card";
import TailSelect from "@/components/TailSelect";
import SouthKoreaMapChart from "@/components/SouthKoreaMapChart";
import { createBarChartOption, createPieChartOption } from "./ChartUtil";
import AutoFitScale from "@/components/AutoFitScale";

const ReactApexChart = dynamic(
  () => import("react-apexcharts"),
  { ssr: false }
);

export default function Page() {

  const regionSelectRef = useRef<HTMLSelectElement | null>(null);


  const [data, setData] = useState<ParkingDashboardResponse | null>();
  const [regionList, setRegionList] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("전국");
  //const [selectedRegionColor, setSelectedRegionColor] = useState<string>("");


  const [countByRegionOption, setCountByRegionOption] = useState<ChartOption>();
  const [countByCategoryOption, setCountByCategoryOption] = useState<ChartOption>();
  const [countByTypeOption, setCountByTypeOption] = useState<ChartOption>();
  const [countByFeeInfoOption, setCountByFeeInfoOption] = useState<ChartOption>();

  useEffect(() => {
    fetchData();

  }, [selectedRegion]);


  //

  const fetchRegionList = async () => {

    const res = await fetchAPI(`/parking/region`);

    if (!res.ok) {
      alert("대시보드 데이터 조회 중 오류가 발생했습니다.\n잠시 후 다시 시도해 주십시오.");
      return;
    }

    const data = await res.json();

    setRegionList(['전국', ...data]);
    //console.log(data);
  }

  const fetchData = async () => {
    const res = await fetchAPI(`/parking/dashboard${selectedRegion === '전국' ? '' : '?region=' + selectedRegion}`);

    if (!res.ok) {
      alert("대시보드 데이터 조회 중 오류가 발생했습니다.\n잠시 후 다시 시도해 주십시오.");
      return;
    }

    const data = await res.json();

    setData(data);
    //console.log(data);
  }

  useEffect(() => {
    fetchRegionList();
  }, [])

  useEffect(() => {
    if (data) {
      const countByRegion = selectedRegion === '전국' ? data.countAllByRegion : data.countByRegion;
      setCountByRegionOption(createBarChartOption(countByRegion));

      setCountByCategoryOption(createPieChartOption(data.countByCategory));
      setCountByTypeOption(createPieChartOption(data.countByType));
      setCountByFeeInfoOption(createPieChartOption(data.countByFeeInfo));

      //setSelectedRegionColor(selectedRegion === '전국' ? '#fff' : setColorByCount(data.countAllByRegion.find(item => item.locale === selectedRegion)!.count));
    }

  }, [data]);

  /***********************************************
   * 지도용 함수
   ***********************************************/
  const setColorByCount = (count: number) => {
    //if (selectedRegion !== '전국') return '#b9e9fe';

    // 1. 수량 기준 배열 (큰 숫자부터 내림차순)
    const thresholds = [2500, 1000, 800, 600, 500, 300];

    // 7단계 색상 배열 (진한 색 -> 연한 색 순서)
    const nonSelectedColors = [
      "#00bcff", // 7번 (count > 2500)
      "#21c5ff", // 6번 (count > 2000)
      "#47ceff", // 5번 (count > 1000)
      "#6dd7ff", // 4번 (count > 500)
      "#93e0fe", // 3번 (count > 200)
      "#b9e9fe", // 2번 (count > 100)
      "#dff2fe"  // 1번 (기본값 / 100 이하)
    ];

    const selectedColors = [
      "#c0efff", // 7번 (count > 2500) - 가장 선명한 연한 블루
      "#c8f1ff", // 6번 (count > 2000)
      "#d1f4ff", // 5번 (count > 1000)
      "#daf7ff", // 4번 (count > 500)
      "#e3faff", // 3번 (count > 200)
      "#ecfdff", // 2번 (count > 100)
      "#f5feff"  // 1번 (기본값 / 100 이하) - 거의 흰색에 가까운 블루
    ];

    const colors = selectedRegion === '전국' ? nonSelectedColors : selectedColors;

    // 기본값

    let color = colors[colors.length - 1];

    // thresholds 배열을 순회하며 조건에 맞는 인덱스를 찾습니다.
    for (let i = 0; i < thresholds.length; i++) {
      if (count > thresholds[i]) {
        color = colors[i];
        break;
      }
    }

    return color;
  };


  const CustomTooltip = ({ darkMode, tooltipStyle, children }: any) => {
    return (
      <div className='hidden'>
        {children}
      </div>
    );
  };

  //bg-amber- test
  return (
    <div className="w-full aspect-video rounded-xl overflow-hidden bg-sky-50">
      <AutoFitScale>
        {data ?
          <div className="w-full h-full">
            {/* data 있음. 차트 구현 */}
            <div className='w-full h-screen flex flex-col z-1 pt-50'>
              <div className='w-full flex justify-center text-center text-neutral-700 text-2xl text-font-bold rounded-xl'>
                {/* 지역별 분포 지도 */}

                <div className="w-125 origin-top scale-120">
                  <SouthKoreaMapChart
                    setColorByCount={setColorByCount}
                    data={data.countAllByRegion}
                    selectedRegion={selectedRegion}
                    selectedColor='#00bcff'
                    diagonalWidth={1}
                    diagonalColor='rgba(0,0,0,0.5)'
                    setSelectedRegion={setSelectedRegion}
                    hoverColor='#00a6f4'
                    customTooltip={<CustomTooltip />}
                  />
                </div>

                <TailSelect ref={regionSelectRef}
                  opk={regionList}
                  opv={regionList}
                  value={selectedRegion}
                  setValue={setSelectedRegion}
                  className="absolute ml-80 scale-120 font-bold" />

              </div>
            </div>
            <div className='w-full h-full absolute top-0 left-0 flex flex-col justify-between p-5 z-10 pointer-events-none '>
              <div className="w-full h-1/6 flex">
                <div className="w-1/3 text-6xl font-bold text-sky-900 flex items-center pl-10">주차장 현황 통계</div>
                <div className="flex-1 flex justify-end">
                  <div className="w-250 flex gap-x-4">
                    <ContainerCard caption="전체 주차장 수" item={data.totalParkingCount} />
                    <ContainerCard caption="총 주차구획수" item={data.totalParkingSpaces} />
                    <ContainerCard caption="평균 주차구획수" item={data.averageParkingSpaces} />
                    <ContainerCard caption="대형 주차장 비율" item={data.largeParkingLotPercentage} />
                  </div>
                </div>
              </div>
              <div className='w-full flex-1 flex justify-between items-center'>
                <div className='w-70'>
                  <Top5Card caption="주차장 수 Top5 지역" items={data.top5RegionByCount} regionName={selectedRegion} />
                </div>
                <div className='w-70'>
                  <Top5Card caption="주차구획수 Top5 지역" items={data.top5RegionBySpaces} regionName={selectedRegion} />
                </div>
              </div>
              <div className='w-full h-2/7 flex justify-between items-center'>
                <div className="flex flex-col h-full w-170 shadow-lg bg-white overflow-hidden rounded-xl">
                  <p className="text-2xl text-white font-bold text-center bg-sky-500 p-4 rounded-t-xl">
                    지역별 주차장 수
                  </p>
                  <div className="flex-1">
                    {countByRegionOption &&
                      <ReactApexChart
                        options={countByRegionOption.options}
                        series={countByRegionOption.series}
                        type="bar"
                        height={'110%'} />}
                  </div>
                </div>
                <div className="h-full w-200 flex justify-between items-center gap-4">
                  <div className="w-1/3 h-full flex flex-col pb-10 shadow-xl bg-white text-neutral-700 rounded-xl text-lg">
                    <div className="w-full bg-sky-500 text-white text-2xl font-bold text-center p-4 rounded-t-xl">주차장 구분</div>
                    {countByCategoryOption &&
                      <div className="h-full flex-1 flex flex-col items-center pt-1.5">
                        <ReactApexChart
                          options={countByCategoryOption.options}
                          series={countByCategoryOption.series}
                          type="pie"
                          height='130%'
                          width='80%'
                        />
                      </div>}
                  </div>
                  <div className="w-1/3 h-full flex flex-col pb-10 shadow-xl bg-white text-neutral-700 rounded-xl text-lg">
                    <div className="w-full bg-sky-500 text-white text-2xl font-bold text-center p-4 rounded-t-xl">주차장 유형</div>
                    {countByTypeOption &&
                      <div className="h-full flex-1 flex flex-col items-center pt-1.5">
                        <ReactApexChart
                          options={countByTypeOption.options}
                          series={countByTypeOption.series}
                          type="pie"
                          height='130%'
                          width='80%'
                        />
                      </div>}
                  </div>
                  <div className="w-1/3 h-full flex flex-col pb-10 shadow-xl bg-white text-neutral-700 rounded-xl text-lg">
                    <div className="w-full bg-sky-500 text-white text-2xl font-bold text-center p-4 rounded-t-xl">주차장 요금</div>
                    {countByFeeInfoOption &&
                      <div className="h-full flex-1 flex flex-col items-center pt-1.5">
                        <ReactApexChart
                          options={countByFeeInfoOption.options}
                          series={countByFeeInfoOption.series}
                          type="pie"
                          height='130%'
                          width='80%'
                        />
                      </div>}
                  </div>
                </div>
              </div>
            </div>
          </div>

          : <div>
            {/* ...로딩중. 로딩 이미지나 글자 */}
          </div>
        }
      </AutoFitScale>
    </div>
  );
}