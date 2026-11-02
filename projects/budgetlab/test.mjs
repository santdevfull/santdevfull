import test from 'node:test';
import assert from 'node:assert/strict';
import {entry,summary,categories,csv} from './model.mjs';
test('centavos',()=>assert.equal(summary([entry('a',0.1,'income','Trabalho'),entry('b',0.2,'expense','Casa')]).balance,-10));
test('categorias',()=>assert.equal(categories([entry('b',5,'expense','Casa')])[0][1],500));
test('validacao',()=>assert.throws(()=>entry('',0,'income','Casa')));
test('csv quoting',()=>assert.ok(csv([entry('teste "x"',3,'expense','Casa')]).includes('"teste ""x"""')));
