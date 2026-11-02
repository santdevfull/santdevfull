import{fmt,nextSecond,workMinutes,addSession,restore}from"./domain.mjs";
let secs=25*60,mode="focus",running=false,timer=null,stats=restore(localStorage.getItem("focusforge-stats"));
const $=id=>document.getElementById(id);
$("root").innerHTML='<div class="grid"><section class="panel"><h2>Ciclo atual</h2><div id="clock" class="stat" role="timer">25:00</div><p id="mode" class="muted">Sess?o de foco</p><label>Minutos de foco<input type="number" id="minutes" min="1" max="120" value="25"></label><div class="actions"><button id="start">Iniciar</button><button class="secondary" id="pause">Pausar</button><button class="secondary" id="reset">Reiniciar</button></div><div class="actions"><button id="focus" class="secondary">Foco</button><button id="break" class="secondary">Pausa de 5 min</button></div></section><section class="panel"><h2>Seu progresso</h2><div id="sessions" class="stat">0</div><p class="muted">Sess?es conclu?das</p><div id="total" class="stat">0 min</div><p class="muted">Tempo focado acumulado</p></section></div>';
function stop(){running=false;if(timer){clearInterval(timer);timer=null}}
function render(){$("clock").textContent=fmt(secs);$("mode").textContent=mode==="focus"?"Sess?o de foco":"Intervalo";$("sessions").textContent=stats.count;$("total").textContent=stats.minutes+" min";$("start").disabled=running}
function change(m){stop();mode=m;secs=m==="focus"?workMinutes($("minutes").value):5*60;render()}
$("focus").onclick=()=>change("focus");$("break").onclick=()=>change("break");$("reset").onclick=()=>change(mode);
$("pause").onclick=()=>{stop();render()};
$("start").onclick=()=>{if(running)return;if(!secs)change(mode);running=true;render();timer=setInterval(()=>{secs=nextSecond(secs);if(secs===0){stop();if(mode==="focus"){stats=addSession(stats,Number($("minutes").value));localStorage.setItem("focusforge-stats",JSON.stringify(stats))}}render()},1000)};
$("minutes").onchange=()=>{try{workMinutes($("minutes").value);if(mode==="focus")change("focus")}catch(e){alert(e.message);$("minutes").value="25";change("focus")}};
render();
