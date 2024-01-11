if(-1!==window.location.href.indexOf("guide.lifestylesolar.com")){const a=`<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
<path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
</svg>`,b=`<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
</svg>`,c=`<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
</svg>`,d=`<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clip-rule="evenodd" />
<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
</svg>`,e="https://solarguidevideos.s3.us-east-2.amazonaws.com/thumbail2.jpg";let s;function getCustomerIdFromUrl(){return new URLSearchParams(window.location.search).get("id")}async function fetchData(e){e="https://hook.us1.make.com/1lqfj9g8jrgqnkwodbt7ctn8uywfdiht?customerId="+e;try{var t=sanitizeJSON(await(await fetch(e)).text()),n=JSON.parse(t);return updateHtmlWithData(n),displaySelectedAnswers(n.survey),updateDisplayAfterFetch(),loadAndPlayVideos((s=n).survey),n}catch(e){console.error("Error:",e),updateDisplayAfterFetch()}}function sanitizeJSON(e){return e=(e=e.replace(/\[,/g,"[null,").replace(/,\]/g,",null]").replace(/,,/g,",null,")).replace(/:\s*,/g,": null,")}function safeRetrieve(e,t){return e&&e[t]?e[t]:""}function updateHtmlWithData(t){if(t){for(let e=1;e<=4;e++){var n=document.getElementById("survey"+e);n&&(n.textContent=t.survey&&t.survey.length>=e?t.survey[e-1]:"")}document.getElementById("zip").textContent=safeRetrieve(t,"zip"),document.getElementById("zip2").textContent=safeRetrieve(t,"zip"),document.getElementById("zip3").textContent=safeRetrieve(t,"zip"),updateRepresentativeInfo(t.rep||{})}else console.error("Received null or invalid data")}function updateRepresentativeInfo(e){var t,n=document.getElementById("repPhone"),o=document.getElementById("repEmail"),l=document.getElementById("repContact"),r=document.getElementById("repPicture");document.getElementById("repName").textContent=safeRetrieve(e,"name"),document.getElementById("contactRepName").textContent=safeRetrieve(e,"name"),e.phone?(t=e.phone.replace(/[ \(\)\-\+]/g,""),n.textContent=e.phone,n.href="tel:"+t,n.style.display="block"):(n.style.display="none",document.getElementById("contactRepPhoneContainer").style.display="none"),e.email?(o.href="mailto:"+e.email,o.style.display="block",document.getElementById("contactRepEmail").textContent=e.email):(o.style.display="none",document.getElementById("contactRepEmailContainer").style.display="none"),e.picture?(r.src=e.picture,r.style.display="block",document.getElementById("contactRepPhone").textContent=e.phone):r.style.display="none",e.phone||e.email||(n.style.display="none",o.style.display="none",l&&(l.style.display="none"))}function updateDisplayAfterFetch(){document.getElementById("loader").style.display="none",document.getElementById("app").style.display="block"}function displaySelectedAnswers(t){for(let e=1;e<=t.length;e++){const o=t[e-1]+1;var n=document.getElementById("q"+e);n&&n.querySelectorAll("div[answer]").forEach(e=>{parseInt(e.getAttribute("answer"))!==o&&(e.style.display="none")})}}let t=!1,x=!1,I=!1,S=!1;async function loadOverlay(){var t=document.querySelector(".video-player"),n=document.createElement("div");n.id="thumbnail-overlay",n.style.position="absolute",n.style.top="0",n.style.left="0",n.style.width="100%",n.style.height="100%",n.style.backgroundImage=`url('${e}')`,n.style.backgroundSize="cover",n.style.zIndex="2",t.appendChild(n)}async function loadAndPlayVideos(e){const l=["Intro.mp4",...e.map((e,t)=>`Q${t+1}A${e+1}.mp4`),"Outro.mp4"],r=30*l.length,n="https://s3.us-east-2.amazonaws.com/solarguidevideos";let s=0,i=0,t=1;const o=document.querySelector(".video-player"),u=document.getElementById("thumbnail-overlay"),m=document.querySelector(".controls");m.style.zIndex="3";let p=document.getElementById("video");p.removeAttribute("controls");const y=document.querySelector(".timeline"),f=(y.max=r,document.querySelector(".play-button.control-button")),h=document.querySelector(".sound-button"),v=document.querySelector(".volume-slider");e=document.querySelector(".fullscreen-button");const g=new Audio(n+"/music.mp3");o.addEventListener("mouseenter",function(){m.style.opacity="1",m.style.transition="opacity 0.5s"}),o.addEventListener("mouseleave",function(){p.paused||(m.style.opacity=0)}),f.addEventListener("click",C),o.addEventListener("click",C),h.addEventListener("click",function(e){e&&e.stopPropagation(),x?(v.value=t,I=!1,g.volume=1):(I=!0,g.volume=0,t=v.value,v.value=0),p.muted=!p.muted,x=!x,h.innerHTML=x?d:c}),v.addEventListener("click",function(e){e&&e.stopPropagation()}),v.addEventListener("input",function(e){e&&e.stopPropagation();e=this.value;p.volume=e,0==(g.volume=e)?(p.muted=!0,g.muted=!0,h.innerHTML=d):(p.muted=!1,g.muted=!1,h.innerHTML=c)}),e.addEventListener("click",e=>{e&&e.stopPropagation(),document.fullscreenElement?document.exitFullscreen?document.exitFullscreen():document.mozCancelFullScreen?document.mozCancelFullScreen():document.webkitExitFullscreen?document.webkitExitFullscreen():document.msExitFullscreen&&document.msExitFullscreen():o.requestFullscreen?o.requestFullscreen():o.webkitRequestFullscreen?o.webkitRequestFullscreen():o.mozRequestFullScreen?o.mozRequestFullScreen():o.msRequestFullscreen?o.msRequestFullscreen():o.webkitEnterFullscreen?o.webkitEnterFullscreen():p.webkitEnterFullScreen&&p.webkitEnterFullscreen()});let E=null;async function C(e){e&&e.stopPropagation(),S?(p.pause(),I||g.pause(),f.innerHTML=a):(u.style.display="none",p.src!==n+"/"+l[s]&&w(l[s]),p.play(),g.play(),f.innerHTML=b),S=!S}function w(e){var t,e=n+"/"+e;E?p=E:p.src!==e&&(p.src=e,p.load(),(e=s)<l.length-1)&&((t=document.createElement("video")).src=n+"/"+l[e+1],t.load())}p.addEventListener("ended",function(){s<l.length-1?(s++,i+=30,w(l[s]),p.play()):(u.style.display="block",s=0,i=0,f.innerHTML=a,g.pause(),g.currentTime=0)}),p.addEventListener("timeupdate",function(){g.paused&&!p.paused&&g.play();var e=i+p.currentTime,t=e/r*100;y.style.backgroundSize=t+"% 100%",y.value=e}),y.addEventListener("click",function(e){e&&e.stopPropagation();var t=y.getBoundingClientRect();let n=(e.clientX-t.left)/y.offsetWidth*r;var e=Math.floor(n/30),t=n/r*100,e=(y.style.backgroundSize=t+"% 100%",y.value=n,u.style.display="none",e!==s?(s=e,i=30*s,w(l[s]),p.removeEventListener("loadedmetadata",o),p.addEventListener("loadedmetadata",o)):e===s&&(t=n-i,p.currentTime=t),n%180);function o(){p.currentTime=n%30,p.play(),g.play(),p.removeEventListener("loadedmetadata",o),f.innerHTML=b}g.currentTime=e})}document.addEventListener("DOMContentLoaded",function(){loadOverlay()});const k=getCustomerIdFromUrl(),l=(k?fetchData(k):console.error("Customer ID not found in URL"),document.querySelector(".play-button")),m=document.getElementById("video"),n=document.querySelector(".timeline"),o=document.querySelector(".sound-button"),p=document.querySelector(".fullscreen-button"),q=document.querySelector(".video-player");function createCharts(){var t=[];let n=s&&s.bill?parseInt(s.bill):165;for(let e=0;e<=40;e++){var o=e/4*2,l=(e%4==0&&(n*=Math.pow(1.037,2)),10*(Math.random()-.5));t.push({x:o,y:Math.max(150,n+l)})}var e=Array.from({length:41},(e,t)=>({x:t/4*2,y:165}));const r=5e3/t.length;var a={type:"line",options:{responsive:!0,animation:{x:{type:"number",easing:"easeInOutBounce",duration:r,from:NaN,delay(e){return"data"!==e.type||e.xStarted?0:(e.xStarted=!0,e.index*r)}},y:{type:"number",easing:"easeInOutBounce",duration:r,from:e=>0===e.index?e.chart.scales.y.getPixelForValue(100):e.chart.getDatasetMeta(e.datasetIndex).data[e.index-1].getProps(["y"],!0).y,delay(e){return"data"!==e.type||e.yStarted?0:(e.yStarted=!0,e.index*r)}}},scales:{x:{type:"linear",position:"bottom",title:{display:!0,text:"Years Passed"},ticks:{callback:function(e){if(e%2==0)return e},stepSize:2}},y:{min:50,max:400,stepSize:50,title:{display:!0,text:"Bill Amount ($)"}}},plugins:{deferred:{xOffset:100,yOffset:"50%",delay:0},tooltip:{usePointStyle:!0,callbacks:{title:function(e){var t=new Date,e=12*parseFloat(e[0].label),e=(t.setMonth(t.getMonth()+e),t.toLocaleString("default",{month:"long"}));return e+" "+t.getFullYear()},label:function(e){return"$"+e.parsed.y.toFixed(2)},labelPointStyle:function(e){return{pointStyle:!1}}}},legend:{display:!1,usePointStyle:!0,pointStyle:"line"}}}};new Chart(document.getElementById("averageBillChart").getContext("2d"),{...a,plugins:[ChartDeferred],data:{datasets:[{data:t,borderColor:"#E04D41",fill:!1,pointStyle:!1,tension:.4}]}}),new Chart(document.getElementById("solarBillChart").getContext("2d"),{...a,plugins:[ChartDeferred],data:{datasets:[{data:e,borderColor:"#00BA81",fill:!1,pointStyle:!1}]}}),new Chart(document.getElementById("combinedBillChart").getContext("2d"),{...a,plugins:[ChartDeferred],data:{datasets:[{label:"Without Solar",data:t,borderColor:"#E04D41",fill:!1,pointStyle:!1,tension:.4},{label:"With Solar",data:e,borderColor:"#00BA81",fill:!1,pointStyle:!1}]}})}function onIntersection(e){e.forEach(e=>{e.isIntersecting&&r.unobserve(e.target)})}l.addEventListener("click",function(){m.paused?(m.play(),q.classList.add("playing"),l.innerHTML=b):(m.pause(),q.classList.remove("playing"),l.innerHTML=a)}),m.onended=function(){l.innerHTML=a},m.ontimeupdate=function(){var e=100*m.currentTime/m.duration;n.style.backgroundSize=e+"% 100%",n.value=e},n.addEventListener("change",function(){var e=n.value*m.duration/100;m.currentTime=e}),o.addEventListener("click",function(){m.muted=!m.muted,o.innerHTML=m.muted?d:c});let r=new IntersectionObserver(onIntersection,{threshold:.5});document.addEventListener("DOMContentLoaded",()=>{var e=document.getElementById("charts");e?(console.log("#charts element found. Starting to observe."),r.observe(e),createCharts()):console.error("Element with ID #charts not found.")}),document.addEventListener("DOMContentLoaded",()=>{var e=document.querySelectorAll(".count-up");const n=new IntersectionObserver(e=>{e.forEach(e=>{if(e.isIntersecting){var e=e.target,t=parseFloat(e.textContent,10);e.textContent="0";{var o=e;var l=0;var r=t;var a=2e3;let n=null;const s=Math.max((l.toString().split(".")[1]||"").length,(r.toString().split(".")[1]||"").length),i=e=>{var e=e-(n=n||e),e=Math.min(e/a,1),t=e*(2-e),t=l+(r-l)*t;o.textContent=t.toFixed(s),e<1?requestAnimationFrame(i):o.textContent=r.toFixed(s)};requestAnimationFrame(i)}n.unobserve(e)}})},{threshold:.5});e.forEach(e=>{n.observe(e)})});let i,u;function initLocal(){!function e(){var t=s;t&&t.zip?(initMap(s.zip),fetchLocalData(s.zip)):setTimeout(e,100)}()}async function fetchLocalData(e){e="https://rk2ou3xhpk.execute-api.us-east-1.amazonaws.com/default/fetchPostal?zipCode="+e;try{var t=await(await fetch(e)).json(),n=t.incentives.data;return t.carbon_offset_metric_tons?set_local_data(t):document.getElementById("localStats").style.display="none",n&&setIncentives(n),t}catch(e){document.querySelector(".local-focus").style.display="none",console.error("Error in fetch:",e)}}function formatMK(e){return 1e6<=e?{num:(e/1e6).toFixed(2),suff:"m"}:1e3<=e?{num:(e/1e3).toFixed(2),suff:"k"}:{num:e.toFixed(2),suff:""}}async function setIncentives(e){let r=document.querySelector(".table2_list"),a=r.childNodes[0],s=r.childNodes[2];for(;r.firstChild;)r.removeChild(r.firstChild);return e.forEach(e=>{var t=e.name,n=e.typeObj.name,o=e.parameterSets[0]?e.parameterSets[0].sectors[0].name:"Other",e=e.websiteUrl,l=("Residential"===o?a:s).cloneNode(!0);l.childNodes[0].childNodes[0].textContent=t,l.childNodes[1].childNodes[0].textContent=o,l.childNodes[2].childNodes[0].textContent=n,e?l.childNodes[3].childNodes[0].href=e:l.childNodes[3].childNodes[0].textContent="",r.appendChild(l)}),!0}function set_local_data(e){var t=formatMK(e.carbon_offset_metric_tons),n=formatMK(e.carbon_offset_metric_tons/.039),e=formatMK(e.carbon_offset_metric_tons/4.73);document.getElementById("c02").childNodes[0].textContent=t.num,document.getElementById("cars").childNodes[0].textContent=e.num,document.getElementById("trees").childNodes[0].textContent=n.num,document.getElementById("c02").childNodes[1].textContent=t.suff,document.getElementById("cars").childNodes[1].textContent=e.suff,document.getElementById("trees").childNodes[1].textContent=n.suff}function initMap(e="15243"){e=document.getElementById("zip").textContent,u=new google.maps.Geocoder;let n;u.geocode({address:e},function(e,t){"OK"==t?(i.setCenter(e[0].geometry.location),(n=e[0].postcode_localities[0])&&[document.getElementById("zip"),document.getElementById("zip2")].forEach(e=>{e.textContent=n})):console.debug("Geocode was not successful for the following reason: "+t)});var e=document.getElementById("localMap"),t=e.childNodes[0],o=document.createElement("div");return o.style.width="100%",o.style.height="auto",o.style.aspectRatio="16/9",o.style.borderRadius="1rem",o.style.border="none",t.style.display="none",i=new google.maps.Map(o,{zoom:6,mapTypeId:"satellite",mapTypeControl:!1,fullscreenControl:!1,rotateControl:!1,streetViewControl:!1,zoomControl:!1,center:{lat:-34.397,lng:150.644}}),e.appendChild(o),!0}function setNames(){}function smoothZoom(e,t,n){var o=e.getZoom();let l=(t-o)/(n/50),r=o,a=setInterval(()=>{0<l&&r>=t||l<0&&r<=t?clearInterval(a):(r+=l,e.setZoom(r))},50)}function zoomToZipCode(){smoothZoom(i,15,5e3)}function onIntersection(e){e.forEach(e=>{e.isIntersecting&&(zoomToZipCode("15243"),y.unobserve(e.target))})}let y=new IntersectionObserver(onIntersection,{threshold:.5});document.addEventListener("DOMContentLoaded",()=>{initLocal();var e=document.getElementById("local");e?(console.log("#maps element found. Starting to observe."),y.observe(e)):console.error("Element with ID #localMap not found.")})}