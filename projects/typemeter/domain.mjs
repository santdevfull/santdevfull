export function compare(target,typed){let correct=0;for(let i=0;i<typed.length;i++)if(target[i]===typed[i])correct++;return{correct,typed:typed.length,accuracy:typed.length?Math.round(100*correct/typed.length):100,finished:typed===target}}
export function wpm(correct,elapsedSeconds){if(elapsedSeconds<=0)return 0;return Math.round((correct/5)/(elapsedSeconds/60))}
export function score(target,typed,seconds){const m=compare(target,typed);return{...m,wpm:wpm(m.correct,seconds)}}
export const passages=["A consist?ncia constr?i resultados melhores que a pressa.","Programar ? resolver problemas de forma clara e verific?vel.","Todo progresso come?a com uma pequena decis?o consciente.","Uma boa interface torna o trabalho di?rio mais simples."];
