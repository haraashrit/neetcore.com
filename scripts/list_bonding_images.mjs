import fs from 'node:fs';
const md = fs.readFileSync('C:/Users/LENOVO/Downloads/chemical_bonding_topicwise.md','utf8');
const matches = [...md.matchAll(/[A-Z]:[^\n"]+\.png/g)].map(m=>m[0]);
console.log(matches.join('\n'));
console.log('count', matches.length);
