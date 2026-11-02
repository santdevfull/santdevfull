export function makeNote(text,id=crypto.randomUUID()){const body=text.trim();if(!body||body.length>3000)throw Error("Use 1 a 3000 caracteres");return{id,body,pinned:false,created:new Date().toISOString()}}
export function filter(notes,query){const q=query.trim().toLocaleLowerCase("pt-BR");return notes.filter(n=>n.body.toLocaleLowerCase("pt-BR").includes(q)).sort((a,b)=>Number(b.pinned)-Number(a.pinned)||b.created.localeCompare(a.created))}
export function togglePin(note){return{...note,pinned:!note.pinned}}
export function read(raw){try{const x=JSON.parse(raw);return Array.isArray(x)?x.filter(n=>n&&typeof n.id==="string"&&typeof n.body==="string"&&typeof n.created==="string"&&typeof n.pinned==="boolean"):[]}catch{return []}}
