'use client'

import { fetchAPI } from "@/utils/fetchAPI";
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
const map_sample_data = [
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


  const [barState, setBarState] = useState({

    series: [{
      name: 'Inflation',
      data: [2.3, 3.1, 4.0, 5.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2, 2.3, 3.1, 4.0, 5.1, 4.0, 3.6, 3.2, 2.3, 1.4, 0.8, 0.5, 0.2, 2.3, 3.1, 4.0, 5.1, 4.0, 3.6, 3.2]
    }],
    options: {
      chart: {
        height: 350,
        type: 'bar',
      },
      plotOptions: {
        bar: {
          borderRadius: 0,
          dataLabels: {
            position: 'top', // top, center, bottom
          },
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function (val: any) {
          return val + "%";
        },
        offsetY: -20,
        style: {
          fontSize: '12px',
          colors: ["#304758"]
        }
      },

      xaxis: {
        categories: ["가평군", "고양시", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시", "동두천시", "부천시", "성남시", "수원시", "시흥시", "안산시", "안성시", "안양시", "양주시", "양평군", "여주시", "연천군", "오산시", "용인시", "의왕시", "의정부시", "이천시", "파주시", "평택시", "포천시", "하남시", "화성시"],
        position: 'bottom',
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: 'gradient',
            gradient: {
              colorFrom: '#D8E3F0',
              colorTo: '#BED1E6',
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            }
          }
        },
        tooltip: {
          enabled: true,
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function (val: any) {
            return val + "%";
          }
        }

      },
      title: {
        text: '',
        floating: true,
        offsetY: 330,
        align: 'center',
        style: {
          color: '#444'
        }
      }
    },


  });




  //bg-amber- test
  return (
    <div className="w-full h-full p-4 md:pt-10 bg-gray-200">
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
        <div className="w-full h-full pt-6">
          {/* data 있음. 차트 구현 */}
          <div className='w-full h-full grid grid-rows-4'>
            <div className='row-span-1 px-2 mx-8 grid grid-cols-4 gap-4'>
              <ContainerCard />
              <ContainerCard />
              <ContainerCard />
              <ContainerCard />
            </div>
            <div className='row-span-3 px-2 py-8 mx-8 grid grid-cols-4 gap-4'>
              <div className='col-span-1 h-full flex flex-col'>
                <div className='w-full flex-1 p-4 shadow-xl bg-gray-100 text-neutral-700 text-lg rounded-xl'>
                  지역별 분포 지도
                  <div className="w-80">
                    <SimpleSouthKoreaMapChart
                      setColorByCount={setColorByCount}
                      data={map_sample_data}
                    />
                  </div>
                </div>
              </div>
              <div className='col-span-1 flex-1 grid grid-row-2 gap-5'>
                <Top5Card />
                <Top5Card />
              </div>
              <div className='col-span-2 h-full grid grid-rows-2 gap-4'>
                <div className="w-full h-full p-4 shadow-xl bg-gray-100 rounded-xl">
                  <p className=" text-neutral-700 text-lg">
                    지역별 주차장 수
                  </p>
                  <ReactApexChart options={barState.options as ApexOptions} series={barState.series} type="bar" height={350} />
                </div>
                <div className='w-full h-full grid grid-cols-3 gap-4 mb-4 text-white'>
                  <div className="w-full h-full shadow-xl bg-gray-100 text-lg text-neutral-700 rounded-xl p-4">주차장 구분
                    <ReactApexChart
                      options={options}
                      series={series}
                      type="pie"   // 또는 bar
                      height={350}
                    />
                  </div>
                  <div className="w-full h-full shadow-xl bg-gray-100 text-lg text-neutral-700 rounded-xl p-4">주차장 요금
                    <ReactApexChart
                      options={options}
                      series={series}
                      type="pie"   // 또는 bar
                      height={350}
                    />
                  </div>
                  <div className="w-full h-full shadow-xl bg-gray-100 text-lg text-neutral-700 rounded-xl p-4">주차장 유형
                    <ReactApexChart
                      options={options}
                      series={series}
                      type="pie"   // 또는 bar
                      height={350}
                    />
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