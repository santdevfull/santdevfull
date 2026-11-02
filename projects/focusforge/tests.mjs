import test from "node:test";import assert from "node:assert/strict";import{fmt,nextSecond,workMinutes,addSession,restore}from"./domain.mjs";
test("format",()=>{assert.equal(fmt(125),"02:05");assert.equal(fmt(-5),"00:00")});
test("timer saturates at zero",()=>assert.equal(nextSecond(0),0));
test("valid work limits",()=>{assert.equal(workMinutes(25),1500);assert.throws(()=>workMinutes(0));assert.throws(()=>workMinutes(200))});
test("statistics and corrupt storage",()=>{assert.deepEqual(addSession({count:1,minutes:10},25),{count:2,minutes:35});assert.equal(restore("{broken").count,0)});
