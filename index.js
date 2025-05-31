const ElementNode = require('./dom');

const document = new ElementNode('html');

const body = new ElementNode('body');
const head = new ElementNode('head');

document.appendChild(head);
document.appendChild(body);

const p = new ElementNode('p');
const h1 = new ElementNode('h1');
const h2 = new ElementNode('h2');

p.classList.add('xyz');

p.appendChild(h1);
p.appendChild(h2);

body.appendChild(p);

const div = new ElementNode('div');

div.classList.add('test');

body.appendChild(div);

document.print()

console.log('div.test = ',document.querySelector('div')?.toString());
