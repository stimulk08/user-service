import dayjs from "dayjs";

export function getDates(startDate: Date, stopDate: Date) {
    if (startDate > stopDate) return [];
    const dateArray = [];
    const currentDate = startDate;
    while (currentDate <= stopDate) {
        dateArray.push(dayjs(currentDate).format('YYYY-MM-DD'));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
}