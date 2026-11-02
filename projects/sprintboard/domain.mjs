export const columns=["todo","doing","done"];
export function makeTask(title,priority="normal",id=crypto.randomUUID()){title=title.trim();if(!title||title.length>100||!["low","normal","high"].includes(priority))throw Error("Tarefa inv?lida");return{id,title,priority,column:"todo",created:Date.now()}}
export function move(task,next){if(!columns.includes(next))throw Error("Status inv?lido");return{...task,column:next}}
export function stats(rows){return{total:rows.length,done:rows.filter(r=>r.column==="done").length,high:rows.filter(r=>r.priority==="high"&&r.column!=="done").length}}
export function parse(raw){try{const a=JSON.parse(raw);return Array.isArray(a)?a.filter(x=>x&&columns.includes(x.column)&&typeof x.id==="string"&&typeof x.title==="string"):[]}catch{return []}}
