import { ChartDataItem, ChartOption, PieChartDataItem } from "@/types/dashboard";
import { ApexOptions } from "apexcharts";

export const createBarChartOption = (items: ChartDataItem[]): ChartOption => {

    return {
        series: [{
            name: '주차장수',
            data: items.map(item => item.count)
        }],
        options: {
            chart: {
                type: 'bar',
                toolbar: {
                    show: false
                }
            },
            plotOptions: {
                bar: {
                    borderRadius: 3,
                    dataLabels: {
                        position: 'top', // top, center, bottom
                    },
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val: any) {
                    return Number(val.toFixed(0),).toLocaleString() + "";
                },
                offsetY: -20,
                style: {
                    fontSize: '14px',
                    colors: ["#304758"]
                }
            },

            xaxis: {
                categories: items.map(item => item.locale),
                position: 'bottom',
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    show: false
                },
                labels: {
                    rotate: -45,
                    rotateAlways: true,
                    style: {
                        fontSize: '14px',
                        fontWeight: 'bold',
                    }
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
                    show: true,
                    style: {
                        fontSize: '14px'
                    },
                }

            },
        },


    }
}

export const createPieChartOption = (items: PieChartDataItem): ChartOption => {

    const series = items.series;

    const options: ApexOptions = {
        chart: {
            type: "pie",
            animations: {
                enabled: true,
                speed: 600 // 처음 로딩 애니메이션 속도
            },
        },
        labels: items.labels,
        dataLabels: {
            enabled: true,
            style: {
                fontSize: '26px',
                fontWeight: 'bold',
                colors: ['#000'] // 텍스트 색상
            },
            dropShadow: {
                enabled: true,
                top: 2,
                left: 2,
                blur: 0,
                opacity: 1,
                color: '#fff'
            }
        },
        legend: {
            position: 'bottom',
            fontSize: '20px', // 범례 글자 크기
            fontWeight: 'bold',
            offsetY: -10,
            labels: {
                colors: ['#333'] // 범례 텍스트 색상
            }
        },
    };
    return { series, options }
}
