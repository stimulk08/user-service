export function getDates(startDate: Date, stopDate: Date) {
    console.log('STARTDATE', startDate);
    const dateArray = [];
    const currentDate = startDate;
    while (currentDate <= stopDate) {
        console.log(currentDate);
        dateArray.push(new Date (currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dateArray;
}