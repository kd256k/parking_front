'use client';

import { fetchClient } from "@/utils/fetchClient";
import { useEffect, useState } from "react";
import { SimpleSouthKoreaMapChart } from "react-simple-south-korea-map-chart";
import dynamic from "next/dynamic";
import { ApexOptions } from "apexcharts";
import { ParkingDashboardResponse } from "@/types/dashboard";

import ContainerCard from "@/components/ContainerCard";
import Top5Card from "@/components/Top5Card";

const ReactApexChart = dynamic(
    () => import("react-apexcharts"),
    { ssr: false }
);


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
        const res = await fetchClient('/parking/dashboard');

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
        <div className="w-full h-screen p-4 md:pt-10">
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
        { data ?
            <div>
                {/* data 있음. 차트 구현 */}
                <div className='w-full h-16 flex flex-col'>
                    <div className='grid grid-cols-4 gap-4'>
                        <ContainerCard />
                        <ContainerCard />
                        <ContainerCard />
                        <ContainerCard />
                    </div>
                    <div className='w-full flex flex-row'>

                        <div className='w-full '>
                            <p >지역별 주차장 수</p>
                            <div className='grid grid-cols-2 gap-4'>
                                <Top5Card />
                                <Top5Card />
                            </div>
                        </div>

                        <div className='w-full flex flex-col'>
                            <div className='flex flex-row p-4 gap-4 text-white'>
                                <div>주차장 구분</div>
                                <div>주차장 요금</div>
                                <div>주차장 유형</div>
                            </div>
                            <div className='w-full p-4 text-white '>
                                지역별 분포 지도
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