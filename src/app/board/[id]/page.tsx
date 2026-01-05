export const dynamic = 'force-dynamic';
export const revalidate = 0;

import BackButton from '@/components/BackButton';
import { Parking } from '@/types/parking';
import { fetchAPI } from '@/utils/fetchAPI';
import { notFound } from 'next/navigation';
import CommentArea from './CommentArea';
import { IoArrowBack } from "react-icons/io5";

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

    return (
        <div className="w-full">
        
            <div className="w-full p-10">
                <div className="flex justify-between items-start">
                    <BackButton className="text-white p-4 inline-flex items-center text-2xl bg-blue-400 rounded-full"><IoArrowBack /></BackButton>
                    <p className="text-center font-bold text-4xl mb-10 text-white drop-shadow-[0_0_5px_rgba(0,0,0,1)]">{item.parkingName}</p>
                    <div className="w-14"></div>
                </div>

                <div className="w-full grid grid-cols-[15%_85%] p-5 space-y-5 rounded-xl shadow-xl bg-yellow-50 text-lg">
                    <div className="text-right pr-5">지역구군</div>
                    <div className="font-bold">{item.parkingCategory}</div>
                    <div className="text-right pr-5">기간</div>
                    <div className="font-bold">{item.holidayEnd}</div>
                    <div className="text-right pr-5 flex justify-end items-start">주소</div>
                    <div className="font-bold">
                        <div className="flex items-center">
                            <span>{item.addressRoad}<br/>{item.addressJibun}</span>
                            {/* <a className="text-white px-4 py-2 -my-2 rounded ml-2 inline-flex items-center text-sm bg-green-400" target="_blank" href={naverUrl}>
                                <img className="w-7 h-7 -m-2 mr-1" src="https://maps-service.pstatic.net/pcweb_navermap_v5/251024-387deda/assets/icons/favicon.ico" />
                                <span>새창에서 네이버지도 보기</span>
                            </a> */}
                        </div>
                        {/* <div className="w-full overflow-hidden rounded-xl mt-5 border border-yellow-400">
                            <iframe src={getNaverMapUrl(item.LNG, item.LAT)} className="w-[calc(100%+480px)] h-100 -ml-[480px] overflow-hidden" />
                        </div> */}
                    </div>
                    {/* <div className="text-right pr-5">대표메뉴</div>
                    <div className="font-bold">{item.RPRSNTV_MENU}</div>
                    <div className="text-right pr-5">연락처</div>
                    <div className="font-bold">{item.CNTCT_TEL}</div>
                    <div className="text-right pr-5">홈페이지</div>
                    <div className="font-bold">
                        {
                            item.HOMEPAGE_URL ?
                                <a className="text-blue-500 hover:underline cursor-pointer" target="_blank" href={item.HOMEPAGE_URL}>{item.HOMEPAGE_URL}</a>
                                : <span>홈페이지 정보가 없습니다.</span>
                        }
                    </div>
                    <div className="text-right pr-5">상세내용</div>
                    <div className="whitespace-pre-wrap font-bold">{description}</div> */}
                </div>
            </div>
            
            <div className="w-full mx-auto">
                <div className="mx-10 p-5 rounded-xl shadow-xl bg-yellow-50 text-lg">
                    <CommentArea parkingId={id} />
                </div>
            </div>

        </div>
    );
}