import { User } from "@/types/user";
import { atom } from "jotai";

export const loginUserAtom = atom<User | null>(null);