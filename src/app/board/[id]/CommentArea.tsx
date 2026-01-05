'use client'

import { Comment } from '@/types/comment';
import { fetchAPI } from '@/utils/fetchAPI';
import { notFound } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import CommentBlock from './CommentBlock';
import { useAtom } from 'jotai';
import { User } from '@/types/user';
import { loginUserAtom } from '@/atoms/atom';
import Link from 'next/link';
import StarRating from './StarRating';

export default function CommentArea({parkingId} : {parkingId:string}) {

    const [loginUser, _] = useAtom<User | null>(loginUserAtom);

    const [commentList, setCommentList] = useState<Comment[]>([]);

    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const [rate, setRate] = useState<number>(5);


    const fetchComment = async () => {
        const res = await fetchAPI(`/comment/${parkingId}`);

        if(!res.ok) {
            if(res.status === 404) {
                notFound();
            }

            throw new Error('data fetch error');
        }

        const json = await res.json();

        setCommentList(json);
    }

    const postComment = async () => {
        if(!textareaRef || !textareaRef.current) {
            return;
        }

        const data = {
            content : textareaRef.current.value,
            rate
        }

        const res = await fetchAPI(`/comment/${parkingId}`, {
            method: 'POST',
            body: JSON.stringify(data)
        });

        if(!res.ok) {
            alert("댓글 작성에 실패했습니다.\n잠시 후 다시 시도해 주십시오.");
            return;
        }

        fetchComment();
        textareaRef.current.value = '';
        setRate(5);
    }

    const onCommentEditClick = async (data: Comment) => {
        const res = await fetchAPI(`/comment/${parkingId}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });

        if(!res.ok) {
            alert("댓글 수정에 실패했습니다.\n잠시 후 다시 시도해 주십시오.");
            return;
        }

        data.edited = true;

        setCommentList(commentList=>commentList.map(item=>item.commentId === data.commentId ? data : item));
    }

    const onCommentDeleteClick = async (data: Comment) => {
        if(!confirm('삭제하시겠습니까?\n\n(삭제된 댓글은 복구할 수 없습니다.)')) {
            return;
        }

        const res = await fetchAPI(`/comment/${data.commentId}`, {
            method: 'DELETE'
        });

        if(!res.ok) {
            alert("댓글 삭제에 실패했습니다.\n잠시 후 다시 시도해 주십시오.");
            return;
        }

        setCommentList(commentList=>commentList.filter(item=>item.commentId !== data.commentId));
    }

    useEffect(()=>{
        fetchComment();
    }, []);

    return (
        <div className='flex flex-col mx-auto'>

            <div className="text-center bg-white mx-auto p-5 rounded-xl shadow-xl">
            {
                loginUser ?
                    <div className="min-w-150 w-2/3 flex flex-col">
                        <textarea ref={textareaRef} className='min-w-90 w-full h-20 p-2 border border-gray-300 rounded' placeholder='댓글을 입력하세요.'></textarea>
                        <div className="flex justify-between items-center mt-4">
                            <div className="flex items-center">
                                <span className="font-bold mr-3">별점 : </span>
                                <StarRating totalStars={5} onRate={(score) => setRate(score)} />
                            </div>
                            <div>
                                <button className='bg-green-400 rounded text-white px-3 py-1' onClick={postComment}>등록</button>
                            </div>
                        </div>
                    </div>
                    :
                    <>
                        <div className="mb-3 font-bold">별점을 남기려면 로그인이 필요합니다.</div>
                        <div>
                            <Link className='bg-blue-400 rounded text-white px-3 py-2' href='/login'>로그인</Link>
                        </div>
                    </>
            }
            </div>
            
            
            <div className="mt-10 flex flex-col justify-center items-center">
                {
                    commentList.length ?
                    commentList.map((item, index) => {
                        return (
                            <CommentBlock key={item.commentId} data={item} onEdit={onCommentEditClick} onDelete={onCommentDeleteClick} />
                        );
                    })
                    :
                    <div className='text-center font-bold'>댓글이 없습니다.</div>
                }
            </div>
        </div>
    );
}