"use client";
import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams, useSelectedLayoutSegment, useSelectedLayoutSegments } from 'next/navigation';




const ModalContext = createContext(false);

export const useIsModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }: { children: React.ReactNode }) => (
    <ModalContext.Provider value={true}>{children}</ModalContext.Provider>
);



export function useModalRouter() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // 현재 depth 가져오기 (없으면 1)
    const currentDepth = parseInt(searchParams.get('_depth_') || '1', 10);

    // 다음 단계로 이동하는 함수 (경로만 넣으면 depth 자동 계산)
    const push = (path: string, forceDepth?: number) => {
        // 이미 쿼리가 있는지 확인해서 ? 또는 & 붙이기
        const separator = path.includes('?') ? '&' : '?';
        const nextUrl = `${path}${separator}_depth_=${forceDepth ? forceDepth : currentDepth + 1}`;
        router.push(nextUrl);
    };

    // 모달 닫기 함수
    const close = () => {
        if (currentDepth > 1) {
            window.history.go(-currentDepth);
        } else {
            router.back();
        }
    };

    return { currentDepth, push, close, router };
}










type ModalRouteInfo = {
  segment: string | null
  segments: string[]
}

type ModalChangeInfo = {
  from: ModalRouteInfo
  to: ModalRouteInfo
}

type ModalEventHandlers = {
  onOpen?: (info: ModalRouteInfo) => void
  onClose?: (info: ModalRouteInfo) => void
  onChange?: (info: ModalChangeInfo) => void
}

const Ctx = createContext<{
  setModalEventHandlers: (h: ModalEventHandlers) => void
  getModalEventHandlers: () => ModalEventHandlers
} | null>(null)

export function useModalEvents() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useModalEvents must be used within ModalEventsHost')
  return v
}

export default function ModalEventsHost({ children }: { children: React.ReactNode }) {
  const ref = useRef<ModalEventHandlers>({})

  const api = useMemo(() => ({
    setModalEventHandlers: (h: ModalEventHandlers) => { ref.current = h },
    getModalEventHandlers: () => ref.current,
  }), [])

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>
}













export function ModalRouteWatcher() {
  const { getModalEventHandlers } = useModalEvents()

  const segment = useSelectedLayoutSegment('modal')
  const segments = useSelectedLayoutSegments('modal') ?? []

  const prevSegment = useRef<string | null>(null)
  const prevSegments = useRef<string[]>([])

  useEffect(() => {
    const { onOpen, onClose, onChange } = getModalEventHandlers()

    const from = prevSegment.current
    const fromSegments = prevSegments.current
    const to = segment
    const toSegments = segments

    // close: 직전 세그먼트/segments를 전달
    if (from !== null && to === null) {
      onClose?.({ segment: from, segments: fromSegments })
    }

    // open
    if (from === null && to !== null) {
      onOpen?.({ segment: to, segments: toSegments })
    }

    // change (A -> B)
    if (from !== null && to !== null && from !== to) {
      onChange?.({
        from: { segment: from, segments: fromSegments },
        to: { segment: to, segments: toSegments },
      })
    }

    // 다음 tick 대비해 "현재값"을 저장
    prevSegment.current = to
    prevSegments.current = toSegments
  }, [segment, segments, getModalEventHandlers])

  return null
}