/**
 * 주차장 전체 정보 엔티티
 * (Java Entity: Parking)
 */
export interface Parking {
    /** 
     * 주차장관리번호 
     * @example "10115" 
     */
    parkingId: string;

    /** 
     * 주차장명 
     * @example "염포마을공동" 
     */
    parkingName: string;

    /** 
     * 경도 
     * @example 129.392919 
     */
    longitude: number;

    /** 
     * 위도 
     * @example 35.5362615 
     */
    latitude: number;

    /** 
     * 주차장구분 
     * @example "공영" 
     */
    parkingCategory: string;

    /** 
     * 주차장유형 
     * @example "노외" 
     */
    parkingType: string;

    /** 
     * 주차장지번주소 
     * @example "울산광역시 북구 염포동 307-3" 
     */
    addressJibun: string;

    /** 
     * 주차장도로명주소 
     */
    addressRoad: string;

    /** 
     * 주차구획수 
     * @example 50 
     */
    parkingSpaces: number;

    /** 
     * 운영요일 
     * @example "평일+토요일+공휴일" 
     */
    operatingDays: string;

    /** 
     * 평일운영시작시각 (Format: "HH:mm:ss")
     * @example "05:00:00" 
     */
    weekdayStart: string | null;

    /** 
     * 평일운영종료시각 (Format: "HH:mm:ss")
     * @example "20:00:00" 
     */
    weekdayEnd: string | null;

    /** 
     * 토요일운영시작시각 (Format: "HH:mm:ss")
     * @example "05:00:00" 
     */
    saturdayStart: string | null;

    /** 
     * 토요일운영종료시각 (Format: "HH:mm:ss")
     * @example "20:00:00" 
     */
    saturdayEnd: string | null;

    /** 
     * 공휴일운영시작시각 (Format: "HH:mm:ss")
     * @example "00:00:00" 
     */
    holidayStart: string | null;

    /** 
     * 공휴일운영종료시각 (Format: "HH:mm:ss")
     * @example "00:00:00" 
     */
    holidayEnd: string | null;

    /** 
     * 요금정보 
     * @example "혼합" 
     */
    feeInfo: string;

    /** 
     * 관리기관명 
     * @example "울산광역시 북구청" 
     */
    managementAgency: string;

    /** 
     * 지역구분 
     * @example "울산광역시" 
     */
    regionMain: string;

    /** 
     * 지역구분_sub 
     * @example "북구" 
     */
    regionSub: string;

    /** 
     * 지역중심좌표(X좌표) 
     * @example 129.3798015 
     */
    regionCenterX: number;

    /** 
     * 지역중심좌표(Y좌표) 
     * @example 35.6100624 
     */
    regionCenterY: number;

    /** 
     * 지역코드 
     * @example "31200" 
     */
    regionCode: string;

    /** 
     * 연락처 
     * @example "052-241-7964" 
     */
    phoneNumber: string;

    /** 
     * 수정일자 (Format: "YYYY-MM-DD")
     * @example "2016-09-13" 
     */
    lastModified: string | null;
}
