interface IFilterParam {
    key: string;
    value: string;
}

const helpFunctions = {
    toHHMMSS: (secNum: number) => {
        let hours: number | string = Math.floor(secNum / 3600);
        let minutes: number | string = Math.floor((secNum - (hours * 3600)) / 60);
        let seconds: number | string = secNum - (hours * 3600) - (minutes * 60);
        if (hours < 10) {
            hours = `0${hours}`;
        }
        if (minutes < 10) {
            minutes = `0${minutes}`;
        }
        if (seconds < 10) {
            seconds = `0${seconds}`;
        }
        return `${hours}:${minutes}:${seconds}`;
    },

    eventsFilter: (obj: any, filter: IFilterParam) => {
        const resultArr = [];
        for (const index in obj) {
            if (obj[index].hasOwnProperty(filter.key)) {
                if (filter.value.indexOf(obj[index][filter.key]) !== -1) {
                    resultArr.push(obj[index]);
                }
            }
        }
        return resultArr;
    },
};

export default helpFunctions;
