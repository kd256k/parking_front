import Modal from "@/components/Modal";
import BoardDetailPage from "@/app/board/[id]/page";
import AspectScroll from "@/components/AspectScroll";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

export default function Page({params} : {params : Promise<{ id: string }>}) {
    return (
        <Modal containerClassName="w-full max-w-[85%] px-4">
            <AspectScroll>
                <BoardDetailPage params={params} />
            </AspectScroll>
        </Modal>
    );
}