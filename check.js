// Dev check: every lesson step's screen exists and contains its target id.  Run: node check.js
const fs=require('fs'),vm=require('vm');
const html=fs.readFileSync(__dirname+'/index.html','utf8');
const js=html.match(/<script>([\s\S]*?)<\/script>/)[1];
const ctx=vm.createContext({});
vm.runInContext(js,ctx);
const out=vm.runInContext(`(()=>{let bad=[],n=0;for(const l of LESSONS)for(const [i,s] of l.steps.entries()){n++;
 if(!SCREENS[s.screen]){bad.push(l.id+'#'+(i+1)+' missing screen '+s.screen);continue}
 const h=SCREENS[s.screen](), id=s.target.slice(1);
 if(!h.includes('id="'+id+'"'))bad.push(l.id+'#'+(i+1)+' missing '+s.target+' in '+s.screen)}
 const ids=new Set();for(const l of LESSONS){if(ids.has(l.id))bad.push('duplicate id '+l.id);ids.add(l.id);for(const a of (l.answers||[]))if(!/^P-[A-Z2-9]{4}$/.test(a))bad.push(l.id+' bad answer code '+a)}
 return {lessons:LESSONS.length,steps:n,bad}})()`,ctx);
console.log(JSON.stringify(out));process.exit(out.bad.length?1:0);
