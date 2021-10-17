import moment from 'moment';

export const formatDate = (date:Date, formatString:string): string => {
    return moment(date).format(formatString)
}