const STORAGE = "pulseops-static-demo-v1";
const initial = () => ({
  services: [
    {id:1,name:"Payment Gateway",url:"https://example.com/payments"},
    {id:2,name:"Public API",url:"https://example.com/api"},
    {id:3,name:"Customer Portal",url:"https://example.com/portal"}
  ],
  incidents: [
    {id:1,serviceId:2,title:"API response times elevated",status:"investigating",createdAt:"2026-11-02"}
  ]
});
function getData(){
  try {
    const data=JSON.parse(localStorage.getItem(STORAGE));
    if (data && Array.isArray(data.services) && Array.isArray(data.incidents)) return data;
  } catch (_) {}
  return initial();
}
let state=getData();
const byId=id=>document.getElementById(id);
const save=()=>localStorage.setItem(STORAGE,JSON.stringify(state));
const statusNames={investigating:"Investigando",identified:"Identificado",monitoring:"Monitorando",resolved:"Resolvido"};
const create=(tag,cls,text)=>{
  const element=document.createElement(tag);
  if(cls)element.className=cls;
  if(text!==undefined)element.textContent=text;
  return element;
};
function render(){
  const open=state.incidents.filter(incident=>incident.status!=="resolved");
  byId("metric-services").textContent=state.services.length;
  byId("metric-open").textContent=open.length;
  byId("metric-health").textContent=open.length?"Aten??o":"Operacional";
  byId("metric-health").style.color=open.length?"#f1b16c":"#53e3c2";
  byId("service-count").textContent=state.services.length+" registrados";
  byId("incident-count").textContent=state.incidents.length+" no hist?rico";
  const services=byId("service-list");
  services.replaceChildren();
  const select=byId("incident-service");
  select.replaceChildren();
  for(const service of state.services){
    const li=create("li"),description=create("div"),name=create("div","row-title",service.name),url=create("div","row-sub",service.url);
    const affected=open.some(incident=>incident.serviceId===service.id);
    const badge=create("span","pill"+(affected?" alert":""),affected?"Degradado":"Operacional");
    description.append(name,url);li.append(description,badge);services.append(li);
    const option=create("option",null,service.name);option.value=service.id;select.append(option);
  }
  if(!state.services.length) services.append(create("li","row-sub","Nenhum servi?o registrado."));
  const incidents=byId("incident-list");
  incidents.replaceChildren();
  for(const incident of [...state.incidents].reverse()){
    const li=create("li"),desc=create("div"),name=create("div","row-title",incident.title);
    const service=state.services.find(s=>s.id===incident.serviceId);
    const sub=create("div","row-sub",(service?.name||"Servi?o removido")+" ? "+incident.createdAt);
    const actions=create("div","row-actions");
    const badge=create("span","pill"+(incident.status==="resolved"?"":incident.status==="investigating"?" alert":" idle"),statusNames[incident.status]||incident.status);
    desc.append(name,sub);actions.append(badge);
    if(incident.status!=="resolved"){
      const button=create("button",null,"Resolver");
      button.type="button";button.setAttribute("aria-label","Resolver "+incident.title);
      button.addEventListener("click",()=>{incident.status="resolved";save();render()});
      actions.append(button);
    }
    li.append(desc,actions);incidents.append(li);
  }
  if(!state.incidents.length)incidents.append(create("li","row-sub","Nenhum incidente reportado."));
}
byId("service-form").addEventListener("submit",event=>{
  event.preventDefault();
  const name=byId("service-name").value.trim();
  const url=byId("service-url").value.trim();
  if(!name||!url)return;
  const id=Math.max(0,...state.services.map(s=>s.id))+1;
  state.services.push({id,name,url});
  save();event.target.reset();render();
});
byId("incident-form").addEventListener("submit",event=>{
  event.preventDefault();
  const serviceId=Number(byId("incident-service").value);
  const title=byId("incident-title").value.trim();
  if(!title||!state.services.some(s=>s.id===serviceId))return;
  const id=Math.max(0,...state.incidents.map(s=>s.id))+1;
  state.incidents.push({id,serviceId,title,status:"investigating",createdAt:new Date().toISOString().slice(0,10)});
  save();event.target.reset();render();
});
byId("reset").addEventListener("click",()=>{state=initial();save();render()});
render();
