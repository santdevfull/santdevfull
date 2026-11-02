import test from"node:test";import assert from"node:assert/strict";import{line,summary,money,read}from"./domain.mjs";
test("validates item",()=>{assert.equal(line(" Servico ",2,0.1,"1").cents,10);assert.throws(()=>line("no",0,1));assert.throws(()=>line("",1,1))});
test("calculates taxes with integer cents",()=>assert.deepEqual(summary([line("a",2,12.45)],10),{subtotal:2490,tax:249,total:2739}));
test("rejects excessive taxes",()=>assert.throws(()=>summary([],101)));
test("money and persistence",()=>{assert.ok(money(100).includes("1,00"));assert.deepEqual(read("broken"),[])});
