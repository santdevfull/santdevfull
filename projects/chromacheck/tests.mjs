import test from"node:test";import assert from"node:assert/strict";import{rgb,luminance,contrast,wcag,suggestText}from"./domain.mjs";
test("RGB parsing",()=>{assert.deepEqual(rgb("#ffffff"),[255,255,255]);assert.throws(()=>rgb("#fff"))});
test("relative luminance",()=>{assert.equal(luminance("#000000"),0);assert.equal(luminance("#ffffff"),1)});
test("WCAG ratios",()=>{assert.ok(Math.abs(contrast("#ffffff","#000000")-21)<1e-10);assert.deepEqual(wcag(3),{aaText:false,aaaText:false,aaLarge:true})});
test("best contrasting text",()=>{assert.equal(suggestText("#ffffff"),"#000000");assert.equal(suggestText("#000000"),"#ffffff")});
