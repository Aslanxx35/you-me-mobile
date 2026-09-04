export function isRealPastDate(value:string){const m=/^(\d{4})-(\d{2})-(\d{2})$/.exec(value);if(!m)return false;const y=+m[1],mo=+m[2],d=+m[3];const x=new Date(Date.UTC(y,mo-1,d));return x.getUTCFullYear()===y&&x.getUTCMonth()===mo-1&&x.getUTCDate()===d&&x.getTime()<=Date.now();}
export function isValidTime(value:string){return /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value)}
