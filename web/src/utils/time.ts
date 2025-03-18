
export function GetUseTimeString(startTime: number, endTime: number) {
    if (!startTime || !endTime || startTime > endTime) {
        return "";
    }
    const ms = endTime - startTime;
    const hours = Math.floor(ms / (60 * 60 * 1000));
    const minutes = Math.floor((ms % (60 * 60 * 1000)) / (60 * 1000));
    const seconds = Math.floor((ms % (60 * 1000)) / 1000);
    if (hours > 0) {
        return `${hours}时${minutes}分${seconds}秒`;
    } else if (minutes > 0) {
        return `${minutes} 分 ${seconds} 秒`;
    } else if (seconds > 0) {
        return `${seconds} 秒`;
    } else {
        return `${ms} ms`;
    }
}