import React, { useMemo, useState } from 'react';
import { Comment } from '@/types/comment';
import { FaEdit, FaSave, FaStar, FaTimes, FaTrashAlt, FaUserCircle } from 'react-icons/fa';
import { format, formatDistanceToNow, parseISO, differenceInHours } from 'date-fns';
import { ko } from 'date-fns/locale'; // 한국어 설정
import { User } from '@/types/user';
import { useAtom } from 'jotai';
import { loginUserAtom } from '@/atoms/atom';
import StarRating from './StarRating';

export default function CommentBlock({ data, onEdit, onDelete }: { data: Comment, onEdit: (data: Comment) => void, onDelete: (data: Comment) => void }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(data.content);
    const [editRating, setEditRating] = useState(data.rate);

    const [loginUser, _] = useAtom<User | null>(loginUserAtom);

    const isAuthor = useMemo<boolean>(()=>{
        //console.log('isAuthor', loginUser);
        if(!loginUser) {
            return false;
        }
        return loginUser.role === 'ROLE_ADMIN' || data.memberId === loginUser.id;

    }, [loginUser]);

    const getFormattedDate = (dateStr: string) => {
        const date = parseISO(dateStr);
        const now = new Date();

        // 24시간 이내면 상대 시간, 아니면 절대 시간 포맷 반환
        if (differenceInHours(now, date) < 24) {
            return formatDistanceToNow(date, { addSuffix: true, locale: ko });
        }
        return format(date, 'yyyy-MM-dd HH:mm:ss');
    };

    const handleSave = () => {
        const saveData = { ...data };
        saveData.content = editContent;
        saveData.rate = editRating;
        onEdit(saveData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setEditContent(data.content);
        setEditRating(data.rate);
        setIsEditing(false);
    };

    return (
        <div className="group min-w-150 w-4/5 bg-white p-6 border-b border-gray-100 transition-all hover:bg-gray-50 mt-2 rounded-xl shadow-xl">
            {/* 상단 레이아웃: 작성자 정보와 관리 버튼 */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <FaUserCircle className="text-gray-300" size={40} />
                    <div className="flex flex-col">
                        <h4 className="text-sm font-bold text-gray-900">{data.memberName}</h4>

                        {/* 별점 영역: 수정 모드일 때 클릭 가능 */}
                        <div className={`flex text-amber-400 mt-0.5 ${isEditing && "border border-sky-300 rounded p-1"}`}>
                            <StarRating size={16} initialRating={isEditing ? editRating : data.rate} readOnly={!isEditing} onRate={(score) => setEditRating(score)} />
                        </div>
                    </div>
                </div>

                {/* 액션 버튼 */}
                <div className="flex gap-1">
                    {isEditing ? (
                        <>
                            <button onClick={handleSave} className="p-2 text-green-600 hover:bg-green-50 rounded-full cursor-pointer" title="저장">
                                <FaSave size={18} />
                            </button>
                            <button onClick={handleCancel} className="p-2 text-gray-400 hover:bg-gray-100 rounded-full cursor-pointer" title="취소">
                                <FaTimes size={18} />
                            </button>
                        </>
                    ) : isAuthor && (
                        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => setIsEditing(true)} className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-full cursor-pointer">
                                <FaEdit size={18} />
                            </button>
                            <button onClick={() => onDelete(data)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full cursor-pointer">
                                <FaTrashAlt size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* 본문 영역: 수정 모드일 때 Textarea 출력 */}
            <div className="mt-4">
                {isEditing ? (
                    <textarea
                        className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-lg text-gray-700 leading-relaxed"
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                    />
                ) : (
                    <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
                        {data.content}
                    </p>
                )}
            </div>

            {/* 하단 정보: 날짜 */}
            <div className="text-sm text-gray-400 font-medium text-right">
                {getFormattedDate(data.createdDate)} {data.edited && " (수정됨)"}
            </div>
        </div >
    );
}