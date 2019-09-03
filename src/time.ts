import moment from 'moment';


function formatDTG(d: string) {
    return moment(d, "L LTS").toISOString();
}

console.log(formatDTG('9/19/2019 12:00:00 AM'))
console.log(formatDTG('9/19/2019 5:00:00 PM'))
console.log(formatDTG('9/20/2019 5:00:00 AM'))