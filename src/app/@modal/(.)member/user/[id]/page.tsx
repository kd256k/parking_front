import Modal from "@/components/Modal";
import AspectScroll from "@/components/AspectScroll";
import MemberUserDetailPage from "@/app/member/user/[id]/page";

export default function Page({params} : {params : Promise<{ id: string }>}) {
    return (
        <Modal containerClassName="w-full max-w-170 px-4">
            <AspectScroll ratio={0.9}>
                <MemberUserDetailPage params={params} />
            </AspectScroll>
        </Modal>
    );
}