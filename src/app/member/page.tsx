'use client'

import { loginUserAtom } from "@/atoms/atom";
import { User } from "@/types/user";
import { useAtom } from "jotai";

export default function MemberPage() {
    const [loginUser, _] = useAtom<User | null>(loginUserAtom);

    return (
        <div>

        </div>
    );
}