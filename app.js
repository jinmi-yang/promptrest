/* ============================================================
   Promptrest — fully static, single-admin gallery.
   No server / no database. "Upload" commits directly to your
   GitHub repo from the browser (you paste a token once), and
   Vercel auto-redeploys. Only you (token holder) can publish.
   ============================================================ */
(() => {
  "use strict";

  /* ===== CONFIG (optional defaults; you can also type these in the Connect panel) ===== */
  const CONFIG = {
    GITHUB: { owner: "jinmi-yang", repo: "promptrest", branch: "main" }, // e.g. owner:"jinmi-yang", repo:"promptrest", branch:"main"
    CONTACT_EMAIL: "jinmiyangplus@gmail.com",
    BUILD: "20260615-1242",
  };
  try{ console.log("%cPromptrest build "+CONFIG.BUILD, "color:#10A0B6;font-weight:700"); }catch{}

  const CATS = [
    { id:"all", tag:"", en:"All", ko:"전체" },
    { id:"id", tag:"idcards", en:"ID & Documents", ko:"증명·신분증" },
    { id:"portrait", tag:"portraits", en:"Portraits", ko:"인물" },
    { id:"poster", tag:"posters", en:"Posters & Type", ko:"포스터·타이포" },
    { id:"product", tag:"product", en:"Product", ko:"제품" },
    { id:"anime", tag:"anime", en:"Anime & Art", ko:"애니·아트" },
    { id:"restore", tag:"restore", en:"Restore & Retouch", ko:"복원·보정" },
    { id:"neon", tag:"cyberpunk", en:"Cyber & Neon", ko:"사이버·네온" },
    { id:"sticker", tag:"stickers", en:"Stickers & Logos", ko:"스티커·로고" },
    { id:"fashion", tag:"fashion", en:"Fashion", ko:"패션" },
  ];
  const TOOLS = [
    { id:"chatgpt", name:"ChatGPT", mark:"G", bg:"#10A37F", url:p=>"https://chatgpt.com/?q="+encodeURIComponent(p), prefill:true },
    { id:"gemini", name:"Gemini", mark:"◆", bg:"#4285F4", url:p=>"https://gemini.google.com/app?prompt="+encodeURIComponent(p), prefill:false },
    { id:"midjourney", name:"Midjourney", mark:"⛵", bg:"#15131a", url:p=>"https://www.midjourney.com/imagine?prompt="+encodeURIComponent(p), prefill:false },
  ];
  const PALETTES = {
    id:["#9fc7f0","#cfe3f8","#5d93d6"], portrait:["#123a3f","#1f6e72","#0c2326"],
    poster:["#e8633f","#f4b740","#2c2a4a"], product:["#f6d9c2","#ecb38f","#d98f63"],
    anime:["#ff9a52","#ff6f91","#7a2e57"], restore:["#caa377","#e8d3b0","#6e5232"],
    neon:["#ff2fd0","#2ff0ff","#0a0a1f"], sticker:["#ffe27a","#ffd23f","#e89c00"],
    fashion:["#7a4f6e","#c79ab8","#3d2436"], default:["#10A0B6","#19A57E","#1183CE"],
  };
  const RATIOS = ["1:1","4:5","3:4","2:3","16:9"];
  const RATIO = { "1:1":1, "4:5":1.25, "2:3":1.5, "3:4":1.333, "16:9":0.5625 };

  const I18N = {
    en: {
      searchPh:"Search prompts, styles, transformations…", region:"Region & language",
      feedAll:"Fresh prompt edits", feedAllSub:"Real images, recreated from a single prompt. Tap any pin to grab it.",
      results:"results", prompt:"Prompt", copy:"Copy prompt", copied:"Copied!",
      save:"Save", saved:"Saved", savedToast:"Saved", removedToast:"Removed",
      openIn:"Open in", copiedToast:"Prompt copied!",
      sentToast:t=>`Prompt sent to ${t}`, pasteToast:t=>`Prompt copied — paste into ${t}`,
      emptyTag:"No pins with this tag yet", emptyTagSub:"Upload one to fill this tag.",
      emptySearch:"No matching prompts", emptySearchSub:"Try another word or tag.",
      beforeAfter:"Before → After", similar:"More with this tag", baBadge:"Before·After",
      hoverBefore:"Hover to see the original", back:"Back to gallery",
      ftAbout:"About", ftContact:"Contact", ftPrivacy:"Privacy Policy", ftTerms:"Terms of Service",
      ftTagline:"A Pinterest-style gallery for AI image prompts — browse curated edits and grab the exact prompt in one tap.",
      ftMadeBy:"Designed & built by the curator. Concept: a Pinterest-inspired prompt-sharing board.",
      ftRights:"All prompts and images are curated by the operator. Unauthorized scraping or reuse is prohibited.",
      aboutTitle:"About Promptrest",
      aboutBody:"Promptrest is a curated, Pinterest-style gallery for AI image-editing prompts. Each pin pairs a result image with the exact prompt behind it, so you can copy it in one tap and recreate the look in your favorite model. It was designed and built as a single-curator platform — the operator hand-picks every entry — with a clean, responsive interface inspired by Pinterest's discovery feed.",
      contactTitle:"Contact",
      contactBody:"Questions, takedown requests, or collaboration ideas? Reach the operator by email.",
      privacyTitle:"Privacy Policy",
      termsTitle:"Terms of Service",
      upload:"Upload", uploadTitle:"Share a prompt edit",
      uploadSub:"Upload your transformed image, drop in the prompt, and publish.",
      dropResult:"Drag your result image here",
      sourceImg:"Source image (optional)", sourceHint:"Show the before → after", addBtn:"Add",
      titleLbl:"Title", titlePh:"e.g. ID-style portrait from a selfie",
      promptLbl:"Prompt", promptPh:"Paste the exact prompt you used…", category:"Category",
      newTag:"New tag", newTagPh:"add a tag",
      publish:"Publish", publishing:"Publishing…", cancel:"Cancel",
      needAfter:"Add a result image first.", needFields:"Add a title and prompt.",
      publishedToast:"Committed! Live in ~1–2 min (after redeploy).",
      // GitHub connect
      ghTitle:"Publish target — your GitHub repo", ghNote:"Owner-only. The token stays in this browser and is never committed.",
      ghOwner:"Owner / username", ghRepo:"Repository", ghBranch:"Branch (default: main)",
      ghToken:"Access token", ghTokenPh:"github_pat_…",
      connect:"Connect", connecting:"Connecting…", disconnect:"Disconnect", connectedTo:"Connected",
      needConnect:"Connect your GitHub repo below to publish.",
      connectedToast:"GitHub connected.", disconnectedToast:"Disconnected.",
      badToken:"Invalid token (check it has Contents write on this repo).",
      repoNotFound:"Repo not found or token can't access it.",
      connFail:"Couldn't reach GitHub. Try again.", commitFail:"Publish failed.",
      ghFields:"Enter owner, repo and token.",
    },
    ko: {
      searchPh:"프롬프트, 스타일, 변환 검색…", region:"지역 및 언어",
      feedAll:"새로 올라온 프롬프트 편집", feedAllSub:"프롬프트 하나로 재현한 이미지들. 핀을 눌러 가져가세요.",
      results:"개의 결과", prompt:"프롬프트", copy:"프롬프트 복사", copied:"복사 완료!",
      save:"저장", saved:"저장됨", savedToast:"보드에 저장됨", removedToast:"저장 해제됨",
      openIn:"바로가기", copiedToast:"프롬프트 복사 완료!",
      sentToast:t=>`프롬프트를 ${t}에 넣었어요`, pasteToast:t=>`프롬프트 복사됨 — ${t}에 붙여넣기`,
      emptyTag:"이 태그의 핀이 아직 없어요", emptyTagSub:"업로드해서 이 태그를 채워보세요.",
      emptySearch:"검색 결과가 없어요", emptySearchSub:"다른 단어나 태그로 찾아보세요.",
      beforeAfter:"원본 → 결과 (Before → After)", similar:"같은 태그 더 보기", baBadge:"비포·애프터",
      hoverBefore:"마우스를 올리면 원본", back:"갤러리로",
      ftAbout:"소개", ftContact:"문의", ftPrivacy:"개인정보처리방침", ftTerms:"이용약관",
      ftTagline:"AI 이미지 프롬프트를 위한 핀터레스트형 갤러리 — 큐레이션된 편집물을 둘러보고, 프롬프트를 한 번의 탭으로 가져가세요.",
      ftMadeBy:"운영자가 직접 기획·제작했습니다. 컨셉: 핀터레스트에서 영감받은 프롬프트 공유 보드.",
      ftRights:"모든 프롬프트와 이미지는 운영자가 큐레이션한 것입니다. 무단 수집·재사용을 금지합니다.",
      aboutTitle:"Promptrest 소개",
      aboutBody:"Promptrest는 AI 이미지 편집 프롬프트를 위한 핀터레스트형 큐레이션 갤러리입니다. 각 핀은 결과 이미지와 그 뒤의 프롬프트를 함께 보여줘서, 한 번의 탭으로 복사해 원하는 모델에서 같은 느낌을 재현할 수 있습니다. 핀터레스트의 탐색 피드에서 영감을 받은 깔끔한 반응형 인터페이스로, 운영자가 모든 항목을 직접 선별하는 1인 큐레이션 플랫폼으로 기획·제작되었습니다.",
      contactTitle:"문의",
      contactBody:"질문, 게시 중단 요청, 협업 제안이 있으시면 이메일로 연락 주세요.",
      privacyTitle:"개인정보처리방침",
      termsTitle:"이용약관",
      upload:"업로드", uploadTitle:"프롬프트 편집 공유",
      uploadSub:"변환한 이미지를 올리고 프롬프트를 넣은 뒤 게시하세요.",
      dropResult:"결과 이미지를 여기에 끌어다 놓으세요",
      sourceImg:"원본 이미지 (선택)", sourceHint:"비포 → 애프터 보여주기", addBtn:"추가",
      titleLbl:"제목", titlePh:"예: 셀카를 ID 스타일 인물로",
      promptLbl:"프롬프트", promptPh:"사용한 프롬프트를 그대로 붙여넣으세요…", category:"카테고리",
      newTag:"태그 추가", newTagPh:"태그 입력",
      publish:"게시", publishing:"게시 중…", cancel:"취소",
      needAfter:"결과 이미지를 먼저 추가하세요.", needFields:"제목과 프롬프트를 입력하세요.",
      publishedToast:"커밋 완료! 약 1~2분 뒤 사이트에 반영됩니다(재배포).",
      ghTitle:"게시 대상 — 내 GitHub 저장소", ghNote:"운영자 전용. 토큰은 이 브라우저에만 저장되고 절대 커밋되지 않습니다.",
      ghOwner:"소유자 / 아이디", ghRepo:"저장소 이름", ghBranch:"브랜치 (기본: main)",
      ghToken:"액세스 토큰", ghTokenPh:"github_pat_…",
      connect:"연결", connecting:"연결 중…", disconnect:"연결 해제", connectedTo:"연결됨",
      needConnect:"게시하려면 아래에서 GitHub 저장소를 연결하세요.",
      connectedToast:"GitHub 연결됨.", disconnectedToast:"연결 해제됨.",
      badToken:"토큰이 유효하지 않아요(이 저장소 Contents 쓰기 권한 확인).",
      repoNotFound:"저장소를 찾을 수 없거나 토큰 권한이 없어요.",
      connFail:"GitHub에 연결하지 못했어요. 다시 시도하세요.", commitFail:"게시에 실패했어요.",
      ghFields:"소유자·저장소·토큰을 입력하세요.",
    },
  };

  /* ===== state ===== */
  const S = {
    seed: [],
    lang: ((navigator.language||"").toLowerCase().startsWith("ko") ? "ko" : "en"),
    query:"", cat:"all", active:null,
    saved: load("pr_saved", {}),
    userCats: load("pr_user_cats", []),
    langOpen:false, toolsOpen:false, admin:false,
    composer:false, busy:false, newTagOpen:false, newTagVal:"", fileWarn:false, info:null,
    draft: blankDraft(), _focusSearch:false,
    gh: { token:"", owner:"", repo:"", branch:"", connected:false, validating:false },
  };
  if (localStorage.getItem("pr_lang")) S.lang = localStorage.getItem("pr_lang");

  function blankDraft(){ return { title:"", prompt:"", category:"id", ratio:"4:5", afterData:"", beforeData:"" }; }
  function load(k,d){ try{ return JSON.parse(localStorage.getItem(k)) ?? d; }catch{ return d; } }
  function save(k,v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch{} }

  const t = () => I18N[S.lang];
  const $app = document.getElementById("app");
  const $toast = document.getElementById("toast");

  /* ===== helpers ===== */
  const esc = s => String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  const allPins = () => S.seed;
  const pinTitle = p => (S.lang==="ko" && p.titleKo) ? p.titleKo : p.title;
  function allCats(){
    const seen=new Set(), out=[]; const add=c=>{ if(!seen.has(c.id)){ seen.add(c.id); out.push(c); } };
    CATS.forEach(add);
    (S.userCats||[]).forEach(c=>add({ id:c.id, tag:c.tag, en:c.tag, ko:c.tag }));
    allPins().forEach(p=>{ if(p.category && !seen.has(p.category)){ const tag=p.category.replace(/^u:/,""); add({ id:p.category, tag, en:tag, ko:tag }); } });
    return out;
  }
  const catOf = id => allCats().find(c=>c.id===id);
  const catLabel = c => (S.lang==="ko" ? c.ko : c.en) || c.tag || c.id;
  const tagOf = id => { const c=catOf(id); return c?(c.tag||id):String(id).replace(/^u:/,""); };
  const pal = cat => PALETTES[cat] || PALETTES.default;

  function placeholder(cat, ratio){
    const p=pal(cat), r=RATIO[ratio]||1.25, pad=(r*100).toFixed(2);
    return `<div class="ph" style="position:relative;padding-bottom:${pad}%;background:linear-gradient(150deg,${p[0]},${p[2]});">
      <span style="position:absolute;inset:0;background:radial-gradient(90% 70% at 50% 30%,${p[1]}55,transparent 70%);"></span>
      <span style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:44%;padding-bottom:44%;border-radius:50%;background:${p[1]}33;"></span></div>`;
  }
  function imgTag(src, alt, extra){ const ph=placeholder("default","4:5").replace(/"/g,"&quot;");
    return `<img src="${esc(src)}" alt="${esc(alt)}" loading="lazy" ${extra||""} onerror="this.outerHTML='${ph}'">`; }
  function media(pin){ const src=pin._afterData||pin.image; return src?imgTag(src,pin.title):placeholder(pin.category,pin.ratio); }

  function copyText(txt){ if (navigator.clipboard?.writeText) navigator.clipboard.writeText(txt).catch(()=>fb(txt)); else fb(txt);
    function fb(x){ const ta=document.createElement("textarea"); ta.value=x; ta.style.position="fixed"; ta.style.opacity="0"; document.body.appendChild(ta); ta.select(); try{document.execCommand("copy");}catch{} ta.remove(); } }
  let toastTimer; function toast(m){ $toast.textContent=m; $toast.classList.remove("show"); void $toast.offsetWidth; $toast.classList.add("show"); clearTimeout(toastTimer); toastTimer=setTimeout(()=>$toast.classList.remove("show"),3200); }

  // Analytics: fires to Vercel Web Analytics (window.va) and/or Google Analytics (gtag) if present.
  function track(name, props){
    try{ if(window.va) window.va("event", { name, data: props||{} }); }catch{}
    try{ if(window.gtag) window.gtag("event", name, props||{}); }catch{}
    try{ if(window.dataLayer) window.dataLayer.push({ event:name, ...(props||{}) }); }catch{}
  }

  function visiblePins(){
    let list=allPins();
    if (S.cat!=="all") list=list.filter(p=>p.category===S.cat);
    const q=S.query.trim().toLowerCase();
    if (q) list=list.filter(p=>(p.title+" "+p.prompt).toLowerCase().includes(q));
    return list;
  }
  function similarPins(pin,n=24){ return allPins().filter(p=>p.category===pin.category && p.id!==pin.id).slice(0,n); }

  function compress(file, max=1280, q=0.85){
    return new Promise((resolve,reject)=>{ const fr=new FileReader();
      fr.onload=()=>{ const img=new Image(); img.onload=()=>{ let{width:w,height:h}=img; if(Math.max(w,h)>max){ const s=max/Math.max(w,h); w=Math.round(w*s); h=Math.round(h*s);} const c=document.createElement("canvas"); c.width=w; c.height=h; c.getContext("2d").drawImage(img,0,0,w,h); try{ resolve(c.toDataURL("image/jpeg",q)); }catch(e){ reject(e); } }; img.onerror=reject; img.src=fr.result; };
      fr.onerror=reject; fr.readAsDataURL(file); });
  }

  /* ===== GitHub commit (no backend) ===== */
  const GH_API="https://api.github.com";
  const ghHeaders = tok => ({ "Authorization":"Bearer "+tok, "Accept":"application/vnd.github+json", "X-GitHub-Api-Version":"2022-11-28" });
  const utf8ToB64 = s => btoa(unescape(encodeURIComponent(s)));
  const b64ToUtf8 = b => decodeURIComponent(escape(atob(String(b).replace(/\s/g,""))));
  const dataB64 = d => (d.split(",")[1]||"");
  const extOf = d => { const m=(d.match(/data:image\/(\w+)/)||[])[1]||"jpeg"; return m==="jpeg"?"jpg":m; };

  async function ghPut(base, path, contentB64, message, branch, token, sha){
    const body={ message, content:contentB64, branch }; if (sha) body.sha=sha;
    const r=await fetch(`${base}/${encodeURI(path)}`,{ method:"PUT", headers:{...ghHeaders(token),"Content-Type":"application/json"}, body:JSON.stringify(body) });
    if (!r.ok){ const j=await r.json().catch(()=>({})); throw new Error(j&&j.message?`${path}: ${j.message}`:`commit failed (${r.status})`); }
    return r.json();
  }
  function pinClean(p){ const o={ id:p.id, title:p.title, prompt:p.prompt, image:p.image||null, ratio:p.ratio||"4:5", category:p.category }; if (p.before) o.before=p.before; return o; }

  async function validateGh(){
    const {owner,repo,token}=S.gh; if(!owner||!repo||!token) return;
    try{ const r=await fetch(`${GH_API}/repos/${owner}/${repo}`,{headers:ghHeaders(token)});
      if(r.ok){ const j=await r.json(); S.gh.connected=true; if(!S.gh.branch) S.gh.branch=j.default_branch||"main"; }
      else { S.gh.connected=false; }
    }catch{ /* leave as-is */ } render();
  }
  async function connectGitHub(){
    const ki=t(), g=S.gh; const owner=(g.owner||"").trim(), repo=(g.repo||"").trim(), token=(g.token||"").trim();
    if(!owner||!repo||!token){ toast(ki.ghFields); return; }
    S.gh.validating=true; render();
    try{
      const r=await fetch(`${GH_API}/repos/${owner}/${repo}`,{headers:ghHeaders(token)});
      if(r.status===401){ S.gh.validating=false; render(); toast(ki.badToken); return; }
      if(!r.ok){ S.gh.validating=false; render(); toast(ki.repoNotFound); return; }
      const j=await r.json();
      S.gh.branch=(g.branch||"").trim()||j.default_branch||"main";
      S.gh.connected=true; S.gh.validating=false;
      save("pr_gh_repo",{owner,repo,branch:S.gh.branch}); try{ localStorage.setItem("pr_gh_token",token);}catch{}
      render(); toast(ki.connectedToast);
    }catch{ S.gh.validating=false; render(); toast(ki.connFail); }
  }
  function disconnectGitHub(){ S.gh.connected=false; S.gh.token=""; try{ localStorage.removeItem("pr_gh_token"); }catch{} render(); toast(t().disconnectedToast); }

  async function publishViaGitHub(){
    const ki=t(), d=S.draft;
    if(!d.afterData){ toast(ki.needAfter); return; }
    if(!d.title.trim()||!d.prompt.trim()){ toast(ki.needFields); return; }
    if(!S.gh.connected){ toast(ki.needConnect); return; }
    S.busy=true; render();
    const {owner,repo,branch,token}=S.gh; const base=`${GH_API}/repos/${owner}/${repo}/contents`;
    const id="u"+Date.now().toString(36);
    const imgPath=`images/${id}.${extOf(d.afterData)}`;
    const pin={ id, title:d.title.trim(), prompt:d.prompt.trim(), image:imgPath, before:null, ratio:d.ratio||"4:5", category:d.category };
    try{
      await ghPut(base, imgPath, dataB64(d.afterData), `promptrest: image ${id}`, branch, token);
      if(d.beforeData){ const bp=`images/${id}-before.${extOf(d.beforeData)}`; await ghPut(base, bp, dataB64(d.beforeData), `promptrest: before ${id}`, branch, token); pin.before=bp; }
      // read current prompts.json (sha + content), prepend, write back
      let list=[], sha;
      const cur=await fetch(`${base}/data/prompts.json?ref=${encodeURIComponent(branch)}`,{headers:ghHeaders(token)});
      if(cur.ok){ const cj=await cur.json(); sha=cj.sha;
        try{ list = cj.content ? JSON.parse(b64ToUtf8(cj.content)) : JSON.parse(await fetch(cj.download_url).then(x=>x.text())); }catch{ list=[]; }
        if(!Array.isArray(list)) list=[];
      }
      list.unshift(pinClean(pin));
      await ghPut(base, "data/prompts.json", utf8ToB64(JSON.stringify(list,null,2)), `promptrest: add pin ${id}`, branch, token, sha);
      // show immediately in this browser (real image via data URL) until redeploy
      S.busy=false; S.seed.unshift({ ...pinClean(pin), _afterData:d.afterData, _beforeData:d.beforeData||null });
      S.composer=false; S.cat="all"; S.query=""; S.draft=blankDraft(); render(); toast(ki.publishedToast);
    }catch(e){ S.busy=false; render(); toast((e&&e.message)||ki.commitFail); }
  }

  /* ===== SVG ===== */
  const LOGO=`<svg width="38" height="34" viewBox="0 0 42 38" fill="none"><defs><linearGradient id="prLogo" x1="9" y1="3" x2="33" y2="32" gradientUnits="userSpaceOnUse"><stop stop-color="#19A57E"/><stop offset=".5" stop-color="#10A0B6"/><stop offset="1" stop-color="#1183CE"/></linearGradient></defs><path d="M21 3C21 3 30 13.5 30 19A9 9 0 0 1 12 19C12 13.5 21 3 21 3Z" fill="url(#prLogo)"/><path d="M21 14.5C21.5 18 21.8 18.3 25.2 18.8 21.8 19.3 21.5 19.6 21 23 20.5 19.6 20.2 19.3 16.8 18.8 20.2 18.3 20.5 18 21 14.5Z" fill="#fff"/><path d="M8 30c5 4 20 4 26 0" stroke="url(#prLogo)" stroke-width="2.4" fill="none" stroke-linecap="round"/><path d="M4 34c7 5 27 5 34 0" stroke="url(#prLogo)" stroke-width="2.1" fill="none" stroke-linecap="round" opacity=".5"/></svg>`;
  const I_SEARCH=`<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="11" cy="11" r="7" stroke="#8b8794" stroke-width="2"/><path d="M21 21l-4-4" stroke="#8b8794" stroke-width="2" stroke-linecap="round"/></svg>`;
  const I_GLOBE=`<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.8"/><path d="M3 12h18M12 3c2.5 2.5 2.5 16 0 18M12 3c-2.5 2.5-2.5 16 0 18" stroke="currentColor" stroke-width="1.5"/></svg>`;
  const I_CHEV=`<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const I_COPY=(c="#15131a")=>`<svg width="13" height="13" viewBox="0 0 24 24" fill="none"><rect x="9" y="9" width="11" height="11" rx="2.5" stroke="${c}" stroke-width="2"/><path d="M5 15V5a2 2 0 012-2h8" stroke="${c}" stroke-width="2" stroke-linecap="round"/></svg>`;
  const I_CHECK=`<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#108CC0" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const I_BACK=`<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="#15131a" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const I_CLOSE=`<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="#15131a" stroke-width="2.4" stroke-linecap="round"/></svg>`;
  const I_BACK2=`<svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M11 6l-6 6 6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const I_SPARK=`<svg width="13" height="13" viewBox="0 0 30 34" fill="none"><path d="M15 1C8 1 2 7 2 15 2 24 15 33 15 33S28 24 28 15C28 7 22 1 15 1Z" fill="#108CC0"/><path d="M15 7C15.7 11.5 16 11.8 21 12.5 16 13.2 15.7 13.5 15 18 14.3 13.5 14 13.2 9 12.5 14 11.8 14.3 11.5 15 7Z" fill="#fff"/></svg>`;
  const I_PLUS=(c="#fff")=>`<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/></svg>`;
  const I_ARR=`<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12h14M13 6l6 6-6 6" stroke="#108CC0" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const I_SWAP=`<svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M4 7h13l-3-3M20 17H7l3 3" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const I_UP=`<svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 16V4M7 9l5-5 5 5" stroke="#108CC0" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 16v3a1 1 0 001 1h12a1 1 0 001-1v-3" stroke="#108CC0" stroke-width="2.2" stroke-linecap="round"/></svg>`;

  /* ===== header ===== */
  function renderHeader(){
    const ki=t();
    const FLAG={en:"🇺🇸",ko:"🇰🇷"};
    const langMenu = S.langOpen ? `<div class="lang-menu"><div class="ttl">${esc(ki.region)}</div>
      ${[["en","English"],["ko","한국어"]].map(([id,n])=>`<button class="lang-opt ${S.lang===id?"active":""}" data-lang="${id}"><span class="flag-emo">${FLAG[id]}</span><span style="flex:1">${n}</span>${S.lang===id?`<span class="chk">${I_CHECK}</span>`:""}</button>`).join("")}</div>`:"";
    return `<header class="header">
      <button class="brand" data-act="home" aria-label="Promptrest home">${LOGO}<span class="name">Promptrest</span></button>
      <div class="search"><div class="wrap">${I_SEARCH}<input id="search" value="${esc(S.query)}" placeholder="${esc(ki.searchPh)}" aria-label="Search"></div></div>
      ${S.admin?`<button class="btn btn-primary" data-act="composer">${I_PLUS()}<span class="lab">${ki.upload}</span></button>`:""}
      <div class="lang"><button class="btn btn-ghost" data-act="lang" style="color:var(--ink)"><span class="flag-emo">${FLAG[S.lang]}</span><span class="lab">${S.lang==="ko"?"KR":"EN"}</span>${I_CHEV}</button>${langMenu}</div>
    </header>`;
  }
  function renderChips(){
    return `<div class="chips noscroll">${allCats().map(c=>{ const on=S.cat===c.id, label=c.id==="all"?(S.lang==="ko"?"전체":"All"):"#"+c.tag;
      return `<button class="chip ${on?"active":""}" data-cat="${c.id}">${esc(label)}</button>`; }).join("")}</div>`;
  }

  /* ===== feed ===== */
  function renderFeed(){
    const ki=t(), pins=visiblePins();
    let title, sub;
    if (S.query){ title=`“${esc(S.query)}”`; sub=`${pins.length} ${ki.results}`; }
    else if (S.cat==="all"){ title=ki.feedAll; sub=ki.feedAllSub; }
    else { const c=catOf(S.cat); title="#"+(c?c.tag:""); sub=catLabel(c||{en:"",ko:""}); }
    let body;
    if (!pins.length){
      if (S.fileWarn && !S.query){
        const msg = S.lang==="ko"
          ? "파일을 더블클릭해서 열면 브라우저 보안 때문에 데이터를 못 불러와요. 폴더에서 <b>python3 -m http.server</b> 를 실행해 <b>localhost:8000</b> 으로 열거나, Vercel에 배포하면 정상적으로 보입니다."
          : "Opening the file directly blocks data loading (browser security). Run <b>python3 -m http.server</b> in this folder and open <b>localhost:8000</b>, or deploy to Vercel.";
        body=`<div class="empty"><div class="big">${I_SPARK}</div><div class="h">${S.lang==="ko"?"로컬 파일로 열렸어요":"Opened as a local file"}</div><div class="s">${msg}</div></div>`;
      } else {
        const h=S.query?ki.emptySearch:ki.emptyTag, s=S.query?ki.emptySearchSub:ki.emptyTagSub;
        body=`<div class="empty"><div class="big">${I_SPARK}</div><div class="h">${esc(h)}</div><div class="s">${esc(s)}</div></div>`;
      }
    }
    else body=`<div class="grid">${pins.map(renderCard).join("")}</div>`;
    return `<div class="feed-head"><h1>${title}</h1><p>${esc(sub)}</p></div>${body}`;
  }
  function renderCard(pin){
    const ki=t();
    return `<div class="card">
      <div class="thumb" data-open="${pin.id}" role="button" tabindex="0" aria-label="${esc(pinTitle(pin))}">
        ${media(pin)}
        <div class="cat-badge">#${esc(tagOf(pin.category))}</div>
        <div class="overlay">
          <button class="copy-card" data-copy="${pin.id}">${I_COPY("#fff")} ${ki.copy}</button>
        </div>
      </div>
    </div>`;
  }

  /* ===== detail — CSS-grid row-span masonry (per reference): card top-left, pins wrap right + below ===== */
  function renderDetail(){
    const pin=allPins().find(p=>p.id===S.active); if(!pin) return renderFeed();
    const ki=t();
    const tools = S.toolsOpen ? `<div class="tools">${TOOLS.map(tl=>`<button data-tool="${tl.id}"><span class="ic" style="background:${tl.bg}">${tl.mark}</span><span style="flex:1">${esc(tl.name)}</span><svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M7 17L17 7M9 7h8v8" stroke="#bcb8c6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`).join("")}</div>`:"";
    const beforeSrc=pin._beforeData||pin.before;
    const ar=(pin.ratio||"4:5").replace(":","/");
    const ba = beforeSrc ? `<div class="ba"><div class="ba-lbl">${ki.beforeAfter}</div><div class="ba-row"><div class="ba-cell" style="aspect-ratio:${ar}"><span class="ba-tag">BEFORE</span>${imgTag(beforeSrc,"before")}</div><div class="ba-arrow">${I_ARR}</div><div class="ba-cell" style="aspect-ratio:${ar}"><span class="ba-tag">AFTER</span>${media(pin)}</div></div></div>`:"";
    const backBtn = `<button class="detail-back" data-act="back" aria-label="${esc(ki.back)}">${I_BACK}</button>`;
    const featImg = beforeSrc
      ? `<div class="feat-img has-ba">${backBtn}${imgTag(beforeSrc,"before",`class="ba-under"`)}<div class="ba-over">${media(pin)}</div><div class="ba-hint">${I_SWAP} ${ki.hoverBefore}</div></div>`
      : `<div class="feat-img">${backBtn}${media(pin)}</div>`;
    const featCard = `<div class="pin-item pin-feature"><div class="feat-card">
      ${featImg}
      <div class="feat-info">
        <div class="tag">${I_SPARK} #${esc(tagOf(pin.category))}</div>
        <h2 class="h">${esc(pinTitle(pin))}</h2>
        <div class="prompt-box"><div class="lbl">${ki.prompt}</div><p>${esc(pin.prompt)}</p></div>
        <div class="detail-actions"><button class="copy" data-act="copy">${I_COPY("#fff")} <span>${ki.copy}</span></button><button class="openin" data-act="tools">${ki.openIn} ${I_CHEV}</button></div>
        ${tools}${ba}
      </div></div></div>`;
    const pins = similarPins(pin).map(sp=>
      `<div class="pin-item pin-sim" data-ratio="${esc(sp.ratio||"4:5")}"><div class="sim-pin" data-open="${sp.id}" role="button" tabindex="0" aria-label="${esc(pinTitle(sp))}"><div class="sim-badge">#${esc(tagOf(sp.category))}</div>${media(sp)}<div class="sim-copy" data-copy="${sp.id}">${I_COPY("#fff")} ${ki.copy}</div></div></div>`
    ).join("");
    return `<div class="detail-page"><div class="pin-masonry" id="pinMasonry">${featCard}${pins}</div></div>`;
  }

  /* CSS-grid masonry: fine 8px rows; the card spans cardCols×cardSpanRows at top-left,
     each pin is placed into the currently-shortest column (so pins fill the card's
     right side first, then flow below it). Matches the reference closeup. */
  function layoutPinMasonry(){
    const c=document.getElementById("pinMasonry"); if(!c) return;
    const W=c.clientWidth; if(!W) return;
    const GAP=18, RU=8;
    const ncols=Math.max(2,Math.min(6,Math.floor(W/300)));
    c.style.display="grid";
    c.style.gridTemplateColumns=`repeat(${ncols},minmax(0,1fr))`;
    c.style.gridAutoRows=RU+"px";
    c.style.columnGap=GAP+"px";
    c.style.alignItems="start";
    const colW=(W-(ncols-1)*GAP)/ncols;
    const cardCols = ncols<=2 ? ncols : (ncols<=4 ? 2 : 3);
    const feat=c.querySelector(".pin-feature");
    if(feat){
      feat.style.gridColumn=`1 / span ${cardCols}`;
      feat.style.gridRow="auto";
    }
    const cardH = feat ? feat.offsetHeight : 560;
    const cardSpan = Math.ceil((cardH+16)/RU);
    if(feat) feat.style.gridRow=`1 / span ${cardSpan}`;
    const heights=new Array(ncols).fill(0);
    for(let i=0;i<cardCols && i<ncols;i++) heights[i]=cardSpan;
    const pins=c.querySelectorAll(".pin-sim");
    pins.forEach(it=>{
      const r=(it.dataset.ratio||"4:5").split(":"); const rw=+r[0]||4, rh=+r[1]||5;
      const thumbH=Math.round(colW*rh/rw);
      const inner=it.querySelector(".sim-pin"); if(inner) inner.style.height=thumbH+"px";
      const span=Math.ceil((thumbH+16)/RU);
      let m=0; for(let i=1;i<ncols;i++) if(heights[i]<heights[m]) m=i;
      const rowStart=heights[m]+1;
      it.style.gridColumn=`${m+1} / span 1`;
      it.style.gridRow=`${rowStart} / span ${span}`;
      heights[m]+=span;
    });
  }
  let _mzTimer; function scheduleMasonry(){ if(!S.active) return; layoutPinMasonry(); requestAnimationFrame(layoutPinMasonry); clearTimeout(_mzTimer); _mzTimer=setTimeout(layoutPinMasonry,280); }
  window.addEventListener("resize",()=>{ if(S.active) layoutPinMasonry(); });

  /* ===== composer ===== */
  function ghPanel(){
    const ki=t(), g=S.gh;
    if (g.connected){
      return `<div class="gh-connected"><span class="gh-dot"></span><span>${ki.connectedTo}: <b>${esc(g.owner)}/${esc(g.repo)}</b> (${esc(g.branch||"main")})</span><button class="btn-mini" data-act="ghDisconnect">${ki.disconnect}</button></div>`;
    }
    return `<div class="gh-panel">
      <div class="gh-title">${I_SPARK} ${ki.ghTitle}</div>
      <div class="gh-note">${esc(ki.ghNote)}</div>
      <div class="gh-grid">
        <input class="finput" data-ghfield="owner" value="${esc(g.owner)}" placeholder="${ki.ghOwner}">
        <input class="finput" data-ghfield="repo" value="${esc(g.repo)}" placeholder="${ki.ghRepo}">
        <input class="finput" data-ghfield="branch" value="${esc(g.branch)}" placeholder="${ki.ghBranch}">
        <input class="finput" type="password" data-ghfield="token" value="${esc(g.token)}" placeholder="${ki.ghTokenPh}">
      </div>
      <button class="btn btn-primary gh-connect ${g.validating?"is-busy":""}" data-act="ghConnect" ${g.validating?"disabled":""}>${g.validating?ki.connecting:ki.connect}</button>
    </div>`;
  }
  function renderComposer(){
    if (!S.composer) return "";
    const ki=t(), d=S.draft;
    const cats=allCats().filter(c=>c.id!=="all");
    const catChips=cats.map(c=>`<button class="cchip ${d.category===c.id?"on":""}" data-dcat="${c.id}">#${esc(c.tag)}</button>`).join("");
    const newTag = S.newTagOpen
      ? `<span class="newtag-edit"><span class="nt-hash">#</span><input id="pr-newtag" value="${esc(S.newTagVal)}" placeholder="${esc(ki.newTagPh)}" autofocus><button class="nt-add" data-act="newtagAdd">${esc(ki.addBtn)}</button></span>`
      : `<button class="cchip cchip-new" data-act="newtagOpen">${I_PLUS("#6b6675")} ${esc(ki.newTag)}</button>`;
    const hero = d.afterData
      ? `<div class="dz-hero filled"><img src="${esc(d.afterData)}" alt="result"><button class="dz-clear" data-clear="after">×</button><input type="file" accept="image/*" data-file="after" hidden></div>`
      : `<label class="dz-hero"><div class="dz-hero-inner"><span class="dz-ic">${I_UP}</span><span class="dz-pill">${esc(ki.dropResult)}</span></div><input type="file" accept="image/*" data-file="after" hidden></label>`;
    const srcThumb = d.beforeData ? `<img src="${esc(d.beforeData)}" alt="before">` : placeholder("portrait","1:1");
    const srcRow = `<div class="src-row"><div class="src-thumb">${srcThumb}</div><div class="src-meta"><div class="src-t">${esc(ki.sourceImg)}</div><div class="src-h">${esc(ki.sourceHint)}</div></div>${d.beforeData?`<button class="btn-mini" data-clear="before">×</button>`:""}<label class="btn-mini src-add">${esc(ki.addBtn)}<input type="file" accept="image/*" data-file="before" hidden></label></div>`;
    const count=(d.prompt||"").length+" / 1200";
    const canPublish = S.gh.connected && !S.busy;
    const pubLabel = S.busy ? ki.publishing : ki.publish;
    const connectHint = S.gh.connected ? "" : `<div class="email-hint">${esc(ki.needConnect)}</div>`;

    return `<div class="modal-bg" data-act="closecomposer"><div class="modal composer" role="dialog" aria-modal="true">
      <div class="composer-body noscroll">
        <h2 class="ch">${ki.uploadTitle}</h2><p class="csub">${esc(ki.uploadSub)}</p>
        <div class="composer-grid">
          <div class="composer-left">${hero}${srcRow}</div>
          <div class="composer-form">
            <div class="fld"><label class="flbl">${ki.titleLbl}</label><input class="finput" data-dfield="title" value="${esc(d.title)}" placeholder="${esc(ki.titlePh)}"></div>
            <div class="fld"><label class="flbl flbl-row"><span>${ki.promptLbl}</span><span class="counter" id="pr-count">${count}</span></label><textarea class="finput ftext" data-dfield="prompt" rows="6" placeholder="${esc(ki.promptPh)}">${esc(d.prompt)}</textarea></div>
            <div class="fld"><label class="flbl">${ki.category}</label><div class="cchips">${catChips}${newTag}</div></div>
            ${ghPanel()}
            ${connectHint}
            <div class="composer-cta">
              <button class="btn btn-primary cta-pub ${S.busy?"is-busy":""}" data-act="publish" ${canPublish?"":"disabled"}>${pubLabel}</button>
              <button class="btn btn-ghost cta-cancel" data-act="composer-close">${ki.cancel}</button>
            </div>
          </div>
        </div>
      </div></div></div>`;
  }

  /* ===== footer + info pages ===== */
  function renderFooter(){
    const ki=t(), email=CONFIG.CONTACT_EMAIL, yr=new Date().getFullYear();
    return `<footer class="footer">
      <div class="footer-inner">
        <div class="ft-left">
          <div class="ft-brand">${LOGO}<span>Promptrest</span></div>
          <p class="ft-tag">${esc(ki.ftTagline)}</p>
          <p class="ft-made">${esc(ki.ftMadeBy)}</p>
          <a class="ft-email" href="mailto:${esc(email)}">${esc(email)}</a>
        </div>
        <nav class="ft-right">
          <button class="ft-link" data-info="about">${ki.ftAbout}</button>
          <button class="ft-link" data-info="contact">${ki.ftContact}</button>
          <button class="ft-link" data-info="privacy">${ki.ftPrivacy}</button>
          <button class="ft-link" data-info="terms">${ki.ftTerms}</button>
        </nav>
      </div>
      <div class="footer-bottom"><span>© ${yr} Promptrest <span class="ft-build">build ${esc(CONFIG.BUILD)}</span></span><span class="ft-rights">${esc(ki.ftRights)}</span></div>
    </footer>`;
  }

  function privacyHtml(){
    const email=CONFIG.CONTACT_EMAIL;
    if (S.lang==="ko") return `
      <p>Promptrest는 별도의 서버 계정·데이터베이스가 없는 정적 웹사이트입니다. 사이트 자체는 개인정보를 수집하거나 추적 쿠키를 사용하지 않습니다.</p>
      <p><b>브라우저에 저장되는 정보(localStorage):</b> 저장한 핀, 언어 설정, 직접 추가한 태그, (운영자에 한해) GitHub 토큰. 이 정보는 <b>이용자 기기에만</b> 보관되며 저희에게 전송되지 않습니다. 브라우저 데이터를 지우면 함께 삭제됩니다.</p>
      <p><b>호스팅:</b> 본 사이트는 Vercel에서 호스팅되며, 접속 시 표준 서버 로그(IP 주소, 요청 정보 등)가 호스팅 제공자의 정책에 따라 처리될 수 있습니다.</p>
      <p><b>제3자:</b> 외부 도구(예: ChatGPT, Gemini)로 이동하는 링크를 누르면 해당 서비스의 정책이 적용됩니다.</p>
      <p>문의: <a href="mailto:${email}">${email}</a></p>`;
    return `
      <p>Promptrest is a static website with no server-side accounts or database. The site itself does not collect personal information or use tracking cookies.</p>
      <p><b>Stored in your browser (localStorage):</b> your saved pins, language preference, custom tags, and (operator only) a GitHub token. This stays <b>on your device</b> and is never sent to us; clearing your browser data removes it.</p>
      <p><b>Hosting:</b> the site is hosted on Vercel; standard server logs (IP address, request metadata) may be processed by the host under their policy.</p>
      <p><b>Third parties:</b> following an "open in" link to an external tool (e.g. ChatGPT, Gemini) is governed by that service's policy.</p>
      <p>Contact: <a href="mailto:${email}">${email}</a></p>`;
  }
  function termsHtml(){
    if (S.lang==="ko") return `
      <p>본 약관은 Promptrest("사이트") 이용에 적용됩니다. 사이트를 이용함으로써 아래 내용에 동의하는 것으로 봅니다.</p>
      <p><b>콘텐츠 권리.</b> 사이트의 모든 프롬프트와 이미지는 운영자가 직접 큐레이션했거나 정당한 권한 하에 게시된 것입니다.</p>
      <p><b>금지 행위.</b> 운영자의 사전 서면 동의 없이 콘텐츠·이미지를 <b>자동 수집(크롤링/스크래핑), 대량 다운로드, 복제, 재배포, 재게시</b>하는 행위를 금지합니다. 개인적·비상업적 열람과 프롬프트의 개인적 사용은 허용됩니다.</p>
      <p><b>자동화 접근.</b> 봇·스크래퍼·자동화 수단을 통한 콘텐츠 수집을 금지하며, robots 규칙을 준수해야 합니다.</p>
      <p><b>보증의 부인.</b> 사이트는 "있는 그대로" 제공되며, 특정 목적 적합성 등 어떠한 보증도 하지 않습니다.</p>
      <p><b>변경.</b> 운영자는 언제든 콘텐츠와 본 약관을 수정·삭제할 수 있습니다.</p>
      <p>문의: <a href="mailto:${CONFIG.CONTACT_EMAIL}">${CONFIG.CONTACT_EMAIL}</a></p>`;
    return `
      <p>These terms govern your use of Promptrest (the "Site"). By using the Site you agree to them.</p>
      <p><b>Content rights.</b> All prompts and images are curated by the operator or published under appropriate permission.</p>
      <p><b>Prohibited use.</b> Without the operator's prior written consent, you may not <b>crawl, scrape, bulk-download, copy, redistribute, or republish</b> the content or images. Personal, non-commercial viewing and personal use of a prompt are permitted.</p>
      <p><b>Automated access.</b> Collecting content via bots, scrapers, or other automated means is prohibited, and you must respect the site's robots rules.</p>
      <p><b>No warranty.</b> The Site is provided "as is" without warranties of any kind.</p>
      <p><b>Changes.</b> The operator may modify or remove content and these terms at any time.</p>
      <p>Contact: <a href="mailto:${CONFIG.CONTACT_EMAIL}">${CONFIG.CONTACT_EMAIL}</a></p>`;
  }
  function renderInfoModal(){
    if (!S.info) return "";
    const ki=t(), email=CONFIG.CONTACT_EMAIL;
    let title, body;
    if (S.info==="about"){ title=ki.aboutTitle; body=`<p>${esc(ki.aboutBody)}</p>`; }
    else if (S.info==="contact"){ title=ki.contactTitle; body=`<p>${esc(ki.contactBody)}</p><p><a class="info-mail" href="mailto:${email}">${email}</a></p>`; }
    else if (S.info==="privacy"){ title=ki.privacyTitle; body=privacyHtml(); }
    else { title=ki.termsTitle; body=termsHtml(); }
    return `<div class="modal-bg" data-act="closeinfo"><div class="modal info-modal" role="dialog" aria-modal="true">
      <button class="close" data-act="info-close" aria-label="Close">${I_CLOSE}</button>
      <div class="info-body noscroll"><h2 class="ch">${esc(title)}</h2><div class="info-content">${body}</div></div>
    </div></div>`;
  }

  /* ===== render ===== */
  function render(){
    const main = S.active ? renderDetail() : renderFeed();
    $app.innerHTML = renderHeader()+renderChips()+`<main class="main${S.active?" is-detail":""}">${main}</main>`+renderFooter()+renderComposer()+renderInfoModal();
    const si=document.getElementById("search"); if (si && S._focusSearch){ si.focus(); si.setSelectionRange(si.value.length, si.value.length); }
    document.body.style.overflow = (S.composer||S.info) ? "hidden" : "";
    if (S.active) scheduleMasonry();
  }

  /* ===== events ===== */
  document.addEventListener("click",(e)=>{
    const el=e.target.closest("[data-act],[data-cat],[data-lang],[data-open],[data-save],[data-tool],[data-dcat],[data-clear],[data-info],[data-copy]");
    if(!el){ if(S.langOpen && !e.target.closest(".lang")){ S.langOpen=false; render(); } return; }
    if(el.dataset.info){ S.info=el.dataset.info; S.langOpen=false; render(); return; }
    if(el.dataset.copy){ e.stopPropagation(); const pin=allPins().find(p=>p.id===el.dataset.copy); if(pin){ copyText(pin.prompt); track("copy_prompt",{id:pin.id,title:pin.title,where:"card"}); toast(t().copiedToast); } return; }
    if(el.dataset.save){ e.stopPropagation(); const id=el.dataset.save; S.saved[id]=!S.saved[id]; save("pr_saved",S.saved); toast(S.saved[id]?t().savedToast:t().removedToast); render(); return; }
    if(el.dataset.open){ S.active=el.dataset.open; S.toolsOpen=false; render(); window.scrollTo({top:0}); return; }
    if(el.dataset.cat){ S.cat=el.dataset.cat; S.active=null; S.query=""; S._focusSearch=false; window.scrollTo({top:0}); render(); return; }
    if(el.dataset.lang){ S.lang=el.dataset.lang; localStorage.setItem("pr_lang",S.lang); S.langOpen=false; render(); return; }
    if(el.dataset.tool){ const tl=TOOLS.find(x=>x.id===el.dataset.tool); const pin=allPins().find(p=>p.id===S.active); if(tl&&pin){ copyText(pin.prompt); track("open_in",{tool:tl.id,id:pin.id}); window.open(tl.url(pin.prompt),"_blank"); S.toolsOpen=false; toast(tl.prefill?t().sentToast(tl.name):t().pasteToast(tl.name)); render(); } return; }
    if(el.dataset.dcat){ S.draft.category=el.dataset.dcat; render(); return; }
    if(el.dataset.clear){ e.preventDefault(); S.draft[el.dataset.clear+"Data"]=""; render(); return; }

    const a=el.dataset.act;
    if(a==="home"){ S.cat="all"; S.query=""; S.active=null; S._focusSearch=false; window.scrollTo({top:0}); render(); }
    else if(a==="lang"){ S.langOpen=!S.langOpen; render(); }
    else if(a==="close"||a==="closebg"||a==="back"){ if(a==="closebg"&&e.target.closest(".modal")) return; S.active=null; S.toolsOpen=false; render(); window.scrollTo({top:0}); }
    else if(a==="tools"){ S.toolsOpen=!S.toolsOpen; render(); }
    else if(a==="copy"){ const pin=allPins().find(p=>p.id===S.active); if(pin){ copyText(pin.prompt); track("copy_prompt",{id:pin.id,title:pin.title,where:"detail"}); toast(t().copiedToast); } }
    else if(a==="composer"){ S.composer=true; S.draft=blankDraft(); S.newTagOpen=false; S.newTagVal=""; render(); }
    else if(a==="composer-close"||a==="closecomposer"){ if(a==="closecomposer"&&e.target.closest(".modal")) return; S.composer=false; render(); }
    else if(a==="newtagOpen"){ S.newTagOpen=true; S.newTagVal=""; render(); const i=document.getElementById("pr-newtag"); if(i)i.focus(); }
    else if(a==="newtagAdd"){ confirmTag(); }
    else if(a==="ghConnect"){ connectGitHub(); }
    else if(a==="ghDisconnect"){ disconnectGitHub(); }
    else if(a==="publish"){ publishViaGitHub(); }
    else if(a==="info-close"||a==="closeinfo"){ if(a==="closeinfo"&&e.target.closest(".modal")) return; S.info=null; render(); }
  });

  document.addEventListener("keydown",(e)=>{
    if(e.target && e.target.id==="pr-newtag"){ if(e.key==="Enter"){ e.preventDefault(); confirmTag(); } else if(e.key==="Escape"){ S.newTagOpen=false; S.newTagVal=""; render(); } return; }
    if(e.key==="Escape"){ if(S.info){S.info=null;render();} else if(S.active){S.active=null;render();} else if(S.composer){S.composer=false;render();} else if(S.langOpen){S.langOpen=false;render();} }
    const card=e.target.closest&&e.target.closest("[data-open]");
    if(card&&(e.key==="Enter"||e.key===" ")){ e.preventDefault(); S.active=card.dataset.open; S.toolsOpen=false; render(); }
  });

  document.addEventListener("input",(e)=>{
    if(e.target.id==="search"){ S.query=e.target.value; S._focusSearch=true; const m=document.querySelector(".main"); if(m) m.innerHTML=renderFeed(); return; }
    if(e.target.id==="pr-newtag"){ S.newTagVal=e.target.value; return; }
    if(e.target.dataset && e.target.dataset.ghfield){ S.gh[e.target.dataset.ghfield]=e.target.value; return; }
    if(e.target.dataset && e.target.dataset.dfield){ const f=e.target.dataset.dfield; S.draft[f]=e.target.value; if(f==="prompt"){ const c=document.getElementById("pr-count"); if(c) c.textContent=(e.target.value.length)+" / 1200"; } }
  });

  document.addEventListener("change", async (e)=>{
    const inp=e.target; if(!inp.dataset || !inp.dataset.file) return;
    const file=inp.files&&inp.files[0]; if(!file) return;
    try{ const data=await compress(file); S.draft[inp.dataset.file+"Data"]=data;
      if(inp.dataset.file==="after"){ const img=new Image(); img.onload=()=>{ const hw=img.naturalHeight/img.naturalWidth; let bk="4:5",bd=Infinity; for(const k of RATIOS){ const diff=Math.abs(RATIO[k]-hw); if(diff<bd){bd=diff;bk=k;} } S.draft.ratio=bk; render(); }; img.src=data; }
      render();
    }catch{ toast(t().commitFail); }
  });

  /* ===== custom tags ===== */
  function confirmTag(){
    const raw=(S.newTagVal||"").trim();
    const slug=raw.toLowerCase().replace(/^#/,"").replace(/[^a-z0-9가-힣_]+/g,"");
    if(!slug){ S.newTagOpen=false; S.newTagVal=""; render(); return; }
    const id="u:"+slug;
    if(!S.userCats.some(c=>c.id===id)){ S.userCats=[...S.userCats,{id,tag:slug}]; save("pr_user_cats",S.userCats); }
    S.draft.category=id; S.newTagOpen=false; S.newTagVal=""; render();
  }

  /* ===== boot ===== */
  function normalize(list){
    return (Array.isArray(list)?list:[]).filter(p=>p&&p.title&&p.prompt).map((p,i)=>({
      id:String(p.id||("p"+i)), title:p.title, titleKo:p.titleKo||"", prompt:p.prompt, image:p.image||null, before:p.before||null,
      ratio:p.ratio||"4:5", category:catOf(p.category)?p.category:(p.category||"portrait"),
    }));
  }
  async function boot(){
    // restore GitHub connection (token stays only in this browser)
    const repo=load("pr_gh_repo",null);
    S.gh.token=localStorage.getItem("pr_gh_token")||"";
    S.gh.owner=(repo&&repo.owner)||CONFIG.GITHUB.owner||"";
    S.gh.repo=(repo&&repo.repo)||CONFIG.GITHUB.repo||"";
    S.gh.branch=(repo&&repo.branch)||CONFIG.GITHUB.branch||"";
    if(S.gh.token && S.gh.owner && S.gh.repo){ S.gh.connected=true; validateGh(); }
    // Upload button is hidden for visitors. Reveal it with ?admin=1 (turn off with ?admin=off).
    // Having a GitHub token connected also counts as admin.
    try{
      const u=new URL(location.href);
      if(u.searchParams.has("admin")){
        const v=u.searchParams.get("admin");
        S.admin = !(v==="off"||v==="0"||v==="false"||v==="no");
        save("pr_admin", S.admin);
        u.searchParams.delete("admin"); history.replaceState(null,"",u.pathname+(u.search||"")+u.hash);
      } else { S.admin = load("pr_admin",false)===true; }
    }catch{ S.admin = load("pr_admin",false)===true; }
    if(S.gh.connected) S.admin=true;
    try{ const r=await fetch("data/prompts.json",{cache:"no-cache"}); const j=r.ok?await r.json():[]; S.seed=normalize(Array.isArray(j)?j:(j.pins||[])); }
    catch{ S.seed=[]; if(location.protocol==="file:") S.fileWarn=true; }
    render();
  }
  boot();
})();
