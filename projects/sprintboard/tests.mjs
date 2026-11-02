import test from"node:test";import assert from"node:assert/strict";import{columns,makeTask,move,stats,parse}from"./domain.mjs";
test("creates task and validates priority",()=>{assert.equal(makeTask("  Implementar CI ","high","1").title,"Implementar CI");assert.throws(()=>makeTask("","low"));assert.throws(()=>makeTask("teste","urgent"))});
test("state transition only to known stages",()=>{assert.equal(move(makeTask("a"),"done").column,"done");assert.throws(()=>move(makeTask("a"),"blocked"))});
test("board summary",()=>{const a=makeTask("a","high"),b=move(makeTask("b"),"done");assert.deepEqual(stats([a,b]),{total:2,done:1,high:1})});
test("invalid persistence and stages",()=>{assert.deepEqual(parse("bad"),[]);assert.equal(columns.length,3)});
