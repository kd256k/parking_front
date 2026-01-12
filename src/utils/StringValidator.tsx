
export const validatePassword = (password:string) => {
    // 8자리 이상 체크
    if (password.length < 8) return false;

    // 각 조건에 대한 정규식
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // 만족하는 조건 개수 합산
    const criteriaCount = [hasLower, hasUpper, hasNumber, hasSpecial].filter(Boolean).length;

    return criteriaCount >= 3;
};

export const validateUserId = (userId: string) => {
    /**
     * 정규식 설명:
     * ^[a-z]       : 시작은 영어 소문자로 (조건 2)
     * [a-z0-9]+    : 그 뒤는 소문자 또는 숫자가 1번 이상 반복 (조건 1)
     * $            : 문자열의 끝
     */
    const idRegex = /^[a-z][a-z0-9]+$/;

    // 길이에 대한 추가 제약이 필요하다면 (예: 4~12자) 아래 주석을 참고하세요.
    // const idRegex = /^[a-z][a-z0-9]{3,11}$/;

    return idRegex.test(userId);
};