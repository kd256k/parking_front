'use client'

import { fetchAPI } from "@/utils/fetchAPI";
import { useEffect, useRef, useState } from "react";
import { SimpleSouthKoreaMapChart } from "react-simple-south-korea-map-chart";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { ChartOption, ParkingDashboardResponse } from "@/types/dashboard";

import ContainerCard from "@/components/ContainerCard";
import Top5Card from "@/components/Top5Card";
import TailSelect from "@/components/TailSelect";
import SouthKoreaMapChart from "@/components/SouthKoreaMapChart";
import { createBarChartOption, createPieChartOption } from "./ChartUtil";

const ReactApexChart = dynamic(
  () => import("react-apexcharts"),
  { ssr: false }
);

export default function Page() {
   
  const regionSelectRef = useRef<HTMLSelectElement | null>(null);


  const [data, setData] = useState<ParkingDashboardResponse | null>();
  const [regionList, setRegionList] = useState<string[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>("전국");

  const [countByRegionOption, setCountByRegionOption]= useState<ChartOption>();
  const [countByCategoryOption, setCountByCategoryOption]= useState<ChartOption>();
  const [countByTypeOption, setCountByTypeOption]= useState<ChartOption>();
  const [countByFeeInfoOption, setCountByFeeInfoOption]= useState<ChartOption>();

  useEffect(() => {
    fetchData();
  },[selectedRegion]);


  //

  const fetchRegionList = async () => {

    const res = await fetchAPI(`/parking/region`);

    if (!res.ok) {
      console.error("data fetch Err");
      alert("data fetch Err");
      return;
    }

    const data = await res.json();

    setRegionList(['전국',...data]);
    //console.log(data);
  }

  const fetchData = async () => {
    const res = await fetchAPI(`/parking/dashboard${selectedRegion === '전국' ? '' : '?region=' + selectedRegion}`);

    if (!res.ok) {
      console.error("data fetch Err");
      alert("data fetch Err");
      return;
    }

    const data = await res.json();

    setData(data);
    console.log(data);
  }

  useEffect(() => {
    fetchRegionList();
  }, [])

  useEffect (() => {  
    if(data) {
      const countByRegion = selectedRegion === '전국' ? data.countAllByRegion : data.countByRegion;
      setCountByRegionOption(createBarChartOption(countByRegion));

      setCountByCategoryOption(createPieChartOption(data.countByCategory));
      setCountByTypeOption(createPieChartOption(data.countByType));
      setCountByFeeInfoOption(createPieChartOption(data.countByFeeInfo));

    }

  }, [data]);

  /***********************************************
   * 지도용 함수
   ***********************************************/
  const setColorByCount = (count: number) => {

    if (count === 0) return "#F1F1F1";
    if (count > 5000) return "#79D3C4";
    if (count > 3000) return "#43cdb6";
    if (count > 1000) return "#61CDBB";
    if (count > 200) return "#91D9CD";
    if (count > 100) return "#A9DFD6";
    if (count > 50) return "#C1E5DF";
    if (count > 5) return "#D9EBE8";
    else return "#ebfffd";
  };




  //bg-amber- test
  return (
    <div className="w-full h-screen overflow-hidden bg-gray-200">
      {data ?
        <div className="w-full h-full">
          {/* data 있음. 차트 구현 */}
          <div className='w-full h-full pt-8  flex flex-col space-y-6'>
            <div className='px-2 mx-8 flex justify-between items-center gap-x-4'>
              <ContainerCard caption="전체 주차장 수" item={data.totalParkingCount}/>
              <ContainerCard caption="총 주차구획수" item={data.totalParkingSpaces} />
              <ContainerCard caption="평균 주차구획수"  item={data.averageParkingSpaces}/>
              <ContainerCard caption="대형 주차장 비율" item={data.largeParkingLotPercentage}/>
            </div>
            <div className='row-span-3 px-2 mx-8 grid grid-cols-3 space-x-6'>
              <div className='w-full flex flex-col'>
                <div className='flex-1 p-4 justify-center text-neutral-700 text-lg rounded-xl'>
                  지역별 분포 지도
                  <TailSelect ref={regionSelectRef} opk={regionList} opv={regionList} value={selectedRegion} setValue={setSelectedRegion}/>
                  <div className="w-100">
                    <SouthKoreaMapChart
                      setColorByCount={setColorByCount}
                      data={data.countAllByRegion}
                      selectedRegion={selectedRegion}
                      setSelectedRegion={setSelectedRegion}
                    />

                  </div>
                </div>
              </div>
              <div className='h-90 grid grid-row-2 gap-5'>
                <Top5Card caption="주차장 수 Top5 지역" items={data.top5RegionByCount} regionName={selectedRegion}/>
                <Top5Card caption="주차구획수 Top5 지역" items={data.top5RegionBySpaces} regionName={selectedRegion}/>
              </div>
              <div className='h-full flex flex-col gap-4'>
                <div className="w-full h-full p-4 shadow-xl bg-gray-100 rounded-xl">
                  <p className=" text-neutral-700 text-lg">
                    지역별 주차장 수
                  </p>
                  {countByRegionOption &&
                    <ReactApexChart
                    options={countByRegionOption.options}
                    series={countByRegionOption.series}
                    type="bar"
                    height={350} />}
                </div>
                <div className='w-full h-full grid grid-cols-3 gap-4 text-white'>
                  <div className="w-full h-35 shadow-xl bg-gray-100 text-lg text-neutral-700 rounded-xl p-4">주차장 구분
                    { countByCategoryOption&&
                     <ReactApexChart
                      options={countByCategoryOption.options}
                      series={countByCategoryOption.series}
                      type="pie"   // 또는 bar
                      height={100}
                    />}
                  </div>
                  <div className="w-full h-35 shadow-xl bg-gray-100 text-lg text-neutral-700 rounded-xl p-4">주차장 유형
                    {countByTypeOption &&
                      <ReactApexChart
                      options={countByTypeOption.options}
                      series={countByTypeOption.series}
                      type="pie"   // 또는 bar
                      height={100}
                    />}
                  </div>
                  <div className="w-full h-35 shadow-xl bg-gray-100 text-lg text-neutral-700 rounded-xl p-4">주차장 요금
                    {countByFeeInfoOption &&
                      <ReactApexChart
                      options={countByFeeInfoOption.options}
                      series={countByFeeInfoOption.series}
                      type="pie"   // 또는 bar
                      height={100}
                    />}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div>
          </div>
        </div>



        : <div>
          {/* ...로딩중. 로딩 이미지나 글자 */}
        </div>
      }
    </div>
  );
}