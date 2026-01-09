
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
