import test from"node:test";import assert from"node:assert/strict";import{card,review,due,read}from"./domain.mjs";
test("create validates",()=>{assert.equal(card("A?","B","1").front,"A?");assert.throws(()=>card("","B"))});
test("first recall schedules tomorrow",()=>{const c=review(card("A","B"),true,"2026-11-02");assert.equal(c.due,"2026-11-03");assert.equal(c.interval,1)});
test("interval increases after reviews",()=>{let c=card("A","B");c=review(c,true,"2026-11-02");c=review(c,true,"2026-11-03");assert.equal(c.interval,3);assert.equal(c.due,"2026-11-06")});
test("due set and persistence",()=>{const c=card("A","B");assert.equal(due([c],"2026-11-02").length,1);assert.deepEqual(read("{"),[])});
