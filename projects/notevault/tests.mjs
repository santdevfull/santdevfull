import test from"node:test";import assert from"node:assert/strict";import{makeNote,filter,togglePin,read}from"./domain.mjs";
test("note validation",()=>{assert.equal(makeNote("  ola  ","1").body,"ola");assert.throws(()=>makeNote("  "))});
test("search and case",()=>{const rows=[makeNote("Caf?","1"),makeNote("Reuni?o","2")];assert.equal(filter(rows,"CAF?").length,1)});
test("pin prioritizes",()=>{const a=makeNote("a","1"),b=togglePin(makeNote("b","2"));assert.equal(filter([a,b],"")[0].id,"2")});
test("corrupt storage recovery",()=>assert.deepEqual(read("null"),[]));
