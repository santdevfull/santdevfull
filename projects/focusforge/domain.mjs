export function fmt(seconds){const n=Math.max(0,Math.floor(seconds));return String(Math.floor(n/60)).padStart(2,"0")+":"+String(n%60).padStart(2,"0")}
export function nextSecond(seconds){return Math.max(0,seconds-1)}
export function workMinutes(minutes){const m=Number(minutes);if(!Number.isInteger(m)||m<1||m>120)throw Error("Escolha de 1 a 120 minutos");return m*60}
export function addSession(total,minutes){return {count:total.count+1,minutes:total.minutes+minutes}}
export function restore(raw){try{const x=JSON.parse(raw);if(Number.isInteger(x?.count)&&Number.isInteger(x?.minutes)&&x.count>=0&&x.minutes>=0)return x}catch{}return {count:0,minutes:0}}
