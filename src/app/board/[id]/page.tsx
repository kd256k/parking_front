export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { Parking } from '@/types/parking';
import { fetchAPI } from '@/utils/fetchAPI';
import { notFound } from 'next/navigation';
import CommentArea from './CommentArea';
import MiniMap from './MiniMap';
import BackButton from '@/app/board/[id]/BackButton';
import { IoArrowBack } from "react-icons/io5";

function LabelBlock({label, value}:{label:string, value:string|number}) {
    return (
        <div className="bg-sky-100 text-sky-500 font-bold p-4 rounded-3xl text-center">
            <div>{label}</div>
            <div className="text-2xl text-sky-600">{value}</div>
        </div>
    )
}

function OperatingTimeBlock({label, start, end}:{label:string, start:string|null, end:string|null}) {
    return (
        <div className="flex flex-col justify-between items-center rounded-xl p-2 bg-sky-400 text-white">
            <div className="font-bold">{label}</div>
            <div>{start && end ? `${start.substring(0,5)} ~ ${end.substring(0,5)}` : "---"}</div>
        </div>
    )
}

function DesignSpan({children}:{children:React.ReactNode}) {
    return (
         <span className="font-bold bg-sky-400 text-white px-2 py-1 rounded-xl">{children}</span>
    )
}

export default async function BoardDetailPage({params} : {params : Promise<{ id: string }>} ) {
    const { id } = await params;

    const fetchData = async () => {
        //console.log('id===', id);

        const res = await fetchAPI(`/parking/detail/${id}`);

        if(!res.ok) {
            if(res.status === 404) {
                notFound();
            }

            throw new Error('data fetch error');
        }

        return await res.json();
    }

    const item : Parking = await fetchData();

    const mapLocation = {lat:item.latitude, lng:item.longitude};

    return (
        <div className={`w-full`}>
            <div className="w-full">
                <div className="p-10 flex justify-between items-end bg-sky-500 rounded-t-4xl">
                    <div className="flex justify-start items-start">
                        <BackButton className="-ml-4 text-white p-4 inline-flex items-center text-2xl bg-sky-400 rounded-full"><IoArrowBack /></BackButton>
                        <div className="flex flex-col justify-start items-start pl-4">
                            <div className="mb-4 flex justify-start space-x-2">
                                <DesignSpan>{item.regionMain}</DesignSpan>
                                <DesignSpan>{item.regionSub}</DesignSpan>
                                <DesignSpan>{item.parkingCategory}</DesignSpan>
                                <DesignSpan>{item.parkingType}</DesignSpan>
                            </div>
                            <div className="text-center font-bold text-4xl text-white">{item.parkingName}</div>
                        </div>
                    </div>
                    <div className="font-bold text-right">
                        <div className="text-2xl text-white">{item.addressRoad ? item.addressRoad : item.addressJibun}</div>
                        {
                            item.addressRoad && item.addressJibun && <div className="text-gray-100">(지번 : {item.addressJibun})</div>
                        }
                    </div>
                </div>

                <div className="w-full grid grid-cols-[67%_33%] bg-sky-50">
                    <div className="w-full px-10 pb-5">
                        <div className="w-full mt-5 grid grid-cols-4 gap-4">
                            <LabelBlock label="주차장 구분" value={item.parkingCategory} />
                            <LabelBlock label="주차장 유형" value={item.parkingType} />
                            <LabelBlock label="요금 정보" value={item.feeInfo} />
                            <LabelBlock label="주차 구획수" value={item.parkingSpaces} />
                        </div>
                        <div className="w-full mt-5 grid grid-cols-[33%_67%] gap-2">
                            <div>
                                <div className="text-gray-400 font-bold mb-3">운영 요일 정보</div>
                                <div className="flex gap-2">
                                    {item.operatingDays.split('+').map((item, index)=><DesignSpan key={index}>{item}</DesignSpan>)}
                                </div>
                            </div>
                            <div>
                                <div className="text-gray-400 font-bold mb-2">운영 시간 정보</div>
                                <div className="grid grid-cols-3 gap-2 rounded-2xl">
                                    <OperatingTimeBlock label="평일" start={item.weekdayStart} end={item.weekdayEnd} />
                                    <OperatingTimeBlock label="토요일" start={item.saturdayStart} end={item.saturdayEnd} />
                                    <OperatingTimeBlock label="공휴일" start={item.holidayStart} end={item.holidayEnd} />
                                </div>
                            </div>
                        </div>
                        <div className="w-full mt-5 grid grid-cols-3 gap-2">
                            <div>
                                <div className="text-gray-400 font-bold mb-2">관리기관</div>
                                <DesignSpan>{item.managementAgency}</DesignSpan>
                            </div>
                            <div>
                                <div className="text-gray-400 font-bold mb-2">연락처</div>
                                <DesignSpan>{item.phoneNumber}</DesignSpan>
                            </div>
                        </div>
                    </div>
                    <div className="w-full p-5">
                        <MiniMap pos={mapLocation} />
                    </div>
                </div>

            </div>
            
            <div className="w-full mx-auto bg-sky-50 rounded-b-xl">
                <div className="pt-10 text-3xl font-bold text-center text-sky-700">주차장 리뷰</div>
                <div className="p-5 text-lg">
                    <CommentArea parkingId={id} />
                </div>
            </div>

        </div>
    );
}