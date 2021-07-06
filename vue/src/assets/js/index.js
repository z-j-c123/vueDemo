let mGetDate = (year, month) => {
    var d = new Date(year, month, 0);
    return d.getDate();
}
function stringToDate(dateString) {
    dateString = dateString.split('-');
    return new Date(dateString[0], dateString[1] - 1, dateString[2]);
}

let countWorkDay = (sDay, eDay) => {
    var s = stringToDate(sDay), e = stringToDate(eDay);
    var s_t_w = s.getDay(), e_t_w = e.getDay();
    //相差天数
    var diffDay = (e - s) / (1000 * 60 * 60 * 24) + 1;
    var diffWeekDay = diffDay - (s_t_w == 0 ? 0 : 7 - s_t_w) + e_t_w;
    //计算有几个完整的周
    var weeks = Math.floor(diffWeekDay / 7);
    if (weeks <= 0) { //在同一周内 即开始结束时间不可能同时为周天与周六（周天为一周第一天）
        return e_t_w - s_t_w + (s_t_w ? 1 : 0) + (e_t_w == 6 ? -1 : 0);
    } else {
        return weeks * 5 + (e_t_w == 6 ? 5 : e_t_w) + (s_t_w >= 1 && s_t_w <= 5 ? (6 - s_t_w) : 0);
    }
}
export default {
    mGetDate,
    countWorkDay
}