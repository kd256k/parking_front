import { ChartDataItem, ChartOption, PieChartDataItem } from "@/types/dashboard";
import { ApexOptions } from "apexcharts";

export const createBarChartOption = (items: ChartDataItem[]): ChartOption => {

    return {
        series: [{
            name: 'Inflation',
            data: items.map(item => item.count)
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
                    return val + "";
                },
                offsetY: -20,
                style: {
                    fontSize: '12px',
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
            }
        },
        labels: items.labels,
        dataLabels: {
            enabled: true
        }
    };
    return { series, options }
}
