// 공통 데이터 구조 (차트에 주로 사용되는 { label, value } 형태)
export interface ChartDataItem {
  label: string;
  value: number;
}

// 메인 데이터 구조
export interface ParkingDashboardResponse {
  totalParkingCount: number;         // 전체 주차장 수
  totalParkingSpaces: number;        // 전체 주차 면 수
  averageParkingSpaces: number;      // 평균 주차 면 수
  largeParkingLotPercentage: number; // 대형 주차장 비율 (%)

  // 전국 기준 지역별 주차장 수
  countAllByRegion: ChartDataItem[];

  // 행정구역 기준 지역별 주차장 수
  countByRegion: ChartDataItem[];

  // 구분별 (공영/민영) 주차장 수
  countByCategory: ChartDataItem[];

  // 요금 정보별 (무료/유료/혼합) 주차장 수
  countByFeeInfo: ChartDataItem[];

  // 유형별 (노상/노외/부설) 주차장 수
  countByType: ChartDataItem[];

  // 주차장 수 상위 5개 지역
  top5RegionByCount: ChartDataItem[];

  // 주차 면 수 상위 5개 지역
  top5RegionBySpaces: ChartDataItem[];
}