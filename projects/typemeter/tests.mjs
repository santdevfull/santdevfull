import test from"node:test";import assert from"node:assert/strict";import{compare,wpm,score,passages}from"./domain.mjs";
test("perfect accuracy",()=>assert.deepEqual(compare("abc","abc"),{correct:3,typed:3,accuracy:100,finished:true}));
test("mistakes penalize precision",()=>assert.equal(compare("abc","axc").accuracy,67));
test("WPM on correct chars",()=>{assert.equal(wpm(25,60),5);assert.equal(score("hello","hello",60).wpm,1);assert.equal(wpm(2,0),0)});
test("passages exist",()=>assert.ok(passages.length>=4));
