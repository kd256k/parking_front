'use client'

import { fetchAPI } from "@/utils/fetchAPI";
import { useEffect, useState } from "react";
import { SimpleSouthKoreaMapChart } from "react-simple-south-korea-map-chart";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { ParkingDashboardResponse } from "@/types/dashboard";

import ContainerCard from "@/components/ContainerCard";
import Top5Card from "@/components/Top5Card";
/*
const ReactApexChart = dynamic(
    () => import("react-apexcharts"),
    { ssr: false }
);
*/

/***********************************************
 * 지도용 샘플데이터
 ***********************************************/
const data = [
    { locale: "부산광역시", count: 1500 },
    { locale: "대구광역시", count: 3000 },
    { locale: "대전광역시", count: 400 },
    { locale: "강원도", count: 2500 },
    { locale: "광주광역시", count: 1000 },
    { locale: "경기도", count: 4000 },
    { locale: "인천광역시", count: 2200 },
    { locale: "제주특별자치도", count: 100 },
    { locale: "충청북도", count: 49 },
    { locale: "경상북도", count: 2000 },
    { locale: "전라북도", count: 3300 },
    { locale: "세종특별자치시", count: 110 },
    { locale: "충청남도", count: 10 },
    { locale: "경상남도", count: 0 },
    { locale: "전라남도", count: 250 },
    { locale: "울산광역시", count: 100 },
    { locale: "서울특별시", count: 10000 },
];
export default function Page() {

    const [data, setData] = useState<ParkingDashboardResponse | null>();

    const fetchData = async () => {
        const res = await fetchAPI('/parking/dashboard');

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
        fetchData();

    }, [])

    /*
    const fetchData = async () => {
        const res = await fetchAPI('/parking/dashboard');

        if (!res.ok) {
            console.error("data fetch Err");
            //alert("data fetch Err");
            return;
        }



        const data = await res.json();

        console.log(data);

        return data;
    }

    const data = await fetchData();
*/

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



    /***********************************************
     * 차트용 함수
     ***********************************************/
    const series = [44, 55, 13, 43, 22];

    const options: ApexOptions = {
        chart: {
            type: "pie",
            animations: {
                enabled: true,
                speed: 600 // 처음 로딩 애니메이션 속도
            }
        },
        labels: ["Team A", "Team B", "Team C", "Team D", "Team E"],
        dataLabels: {
            enabled: true
        }
    };




    //bg-amber- test
    return (
        <div className="w-full h-screen flex flex-col p-4 md:pt-10 bg-gray-200">

            {/* <SimpleSouthKoreaMapChart
            setColorByCount={setColorByCount}
            data={data}
        /> */}



            {/* <ReactApexChart
  options={options}
  series={series}
  type="pie"   // 또는 bar
  height={350}
/> */}
        {data ?
            <div className="flex flex-1 sm:p-4 lg:ml-20 lg:mt-20 lg:mb-12 bg-indigo-50 rounded-2xl">
                <div className="w-full h-full">
                    {/* data 있음. 차트 구현 */}
                    <div className='w-full h-full flex flex-col gap-5'>
                        <div className='h-[25%] px-2 mx-8 grid grid-cols-4 gap-5'>
                            <ContainerCard />
                            <ContainerCard />
                            <ContainerCard />
                            <ContainerCard />
                        </div>
                        <div className='h-full px-2 mx-8 grid grid-cols-2 gap-5'>
                            <div className='w-full h-full grid grid-rows-2 gap-5'>
                                <div className="h-full p-4 shadow-xl bg-gray-50 rounded-2xl">
                                    <p className="text-neutral-700 text-lg">지역별 주차장 수</p>
                                </div>
                                <div className='flex-1 grid grid-cols-2 gap-5'>
                                    <Top5Card />
                                    <Top5Card />
                                </div>
                            </div>

                            <div className='h-full flex flex-col gap-5'>
                                <div className='w-full h-[25%] grid grid-cols-3 gap-5 text-white'>
                                    <div className="w-full h-full shadow-xl bg-gray-50 text-lg text-neutral-700 rounded-2xl p-4">주차장 구분</div>
                                    <div className="w-full h-full shadow-xl bg-gray-50 text-lg text-neutral-700 rounded-2xl p-4">주차장 요금</div>
                                    <div className="w-full h-full shadow-xl bg-gray-50 text-lg text-neutral-700 rounded-2xl p-4">주차장 유형</div>
                                </div>
                                <div className='w-full flex-1 p-4 shadow-xl bg-gray-50 text-neutral-700 text-lg rounded-2xl'>
                                    지역별 분포 지도
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            : <div>
                {/* ...로딩중. 로딩 이미지나 글자 */}
            </div>
        }

        </div>
    );
}