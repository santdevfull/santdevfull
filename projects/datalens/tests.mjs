import test from"node:test";import assert from"node:assert/strict";import{csvParse,analyze}from"./domain.mjs";
test("simple CSV and CRLF",()=>assert.deepEqual(csvParse("name,score\r\na,1\r\nb,2"),[["name","score"],["a","1"],["b","2"]]));
test("quoted comma and newline",()=>assert.deepEqual(csvParse('name,note\n"A,B","line 1\nline 2"'),[["name","note"],["A,B","line 1\nline 2"]]));
test("unbalanced quoted data",()=>assert.throws(()=>csvParse('a\n"bad')));
test("analytic counts and averages",()=>{const a=analyze(csvParse("t,v\na,1\na,2\nb,3"),1);assert.equal(a.average,2);assert.equal(a.numericCount,3);assert.equal(a.count,3)});
