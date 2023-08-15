class Options{constructor(){this.$tabLinks=document.querySelector(".button-list"),this.$sitesList=document.querySelector(".sites-list"),this.$pagesList=document.querySelector(".pages-list"),this.$domainInputField=document.querySelector(".input-field.domain"),this.$pageInputField=document.querySelector(".input-field.page"),this.$exclusionBtn=document.querySelector(".add-domain"),this.$exclusionPageBtn=document.querySelector(".add-page"),this.$schemesList=document.querySelector(".schemes-list"),this.$colorInputs=document.querySelectorAll(".color-input"),this.$saveSchemeBtn=document.querySelector(".save-scheme"),this.storage=null,this.initStorage=this.initStorage.bind(this),this.exclusionBtnClickHandler=this.exclusionBtnClickHandler.bind(this),this.renderWhiteList=this.renderWhiteList.bind(this),this.initListeners=this.initListeners.bind(this),this.deleteSiteHandler=this.deleteSiteHandler.bind(this),this.initColorPickerListeners=this.initColorPickerListeners.bind(this),this.createScheme=this.createScheme.bind(this),this.renderColorSchemes=this.renderColorSchemes.bind(this),this.renderScheme=this.renderScheme.bind(this),this.deleteSchemeHandler=this.deleteSchemeHandler.bind(this),this.schemeNameKeyUpHandler=this.schemeNameKeyUpHandler.bind(this),this.schemeNameBlurHandler=this.schemeNameBlurHandler.bind(this),this.activateScheme=this.activateScheme.bind(this),this.initStorage(),this.initListeners()}initListeners(){this.$tabLinks.addEventListener("click",this.tabsToggle),this.$exclusionBtn.addEventListener("click",this.exclusionBtnClickHandler),this.$domainInputField.addEventListener("keydown",(e=>{13===e.keyCode&&(e.preventDefault(),this.exclusionBtnClickHandler(e))})),this.$exclusionPageBtn.addEventListener("click",this.exclusionBtnClickHandler),this.$pageInputField.addEventListener("keydown",(e=>{13===e.keyCode&&(e.preventDefault(),this.exclusionBtnClickHandler(e))})),this.initColorPickerListeners(),this.$saveSchemeBtn.addEventListener("click",this.createScheme)}initStorage(){chrome.storage.local.get((e=>{this.storage=e,this.storage.whitelist||(this.storage.whitelist=[]),this.storage.whitePagesList||(this.storage.whitePagesList=[]),this.storage.colorSchemes||(this.storage.colorSchemes={}),this.storage.activeScheme||(this.storage.activeScheme=""),this.renderWhiteList(this.storage.whitelist,this.$sitesList),this.renderWhiteList(this.storage.whitePagesList,this.$pagesList),this.renderColorSchemes(this.storage.colorSchemes)}))}tabsToggle(e){const t=e.target.dataset.name;if(!t)return;let s,i,a;for(i=document.getElementsByClassName("tab"),s=0;s<i.length;s++)i[s].classList.remove("active");for(a=document.getElementsByClassName("tablinks"),s=0;s<a.length;s++)a[s].classList.remove("active");document.getElementById(t).classList.add("active"),e.target.classList.add("active")}exclusionBtnClickHandler(e){e.target.closest("#site-exclusion")?this.excludeResourceFromBlackout("$domainInputField","whitelist","$sitesList"):this.excludeResourceFromBlackout("$pageInputField","whitePagesList","$pagesList")}excludeResourceFromBlackout(e,t,s){let i;i="$domainInputField"===e?this.getHostname(this[e].value):this[e].value;const a=this.isResourceDublicated(i,this.storage[t]),n="$domainInputField"===e?"site":"page";this.isDomainCorrect(i)?i&&!a?(this.storage[t].push(i),chrome.storage.local.set({[t]:this.storage[t]},(t=>{const a=this.createListItem(i);this[s].appendChild(a),this[e].value=""}))):a&&(this[e].value=`This ${n} has been already added`):this[e].value=`Invalid ${n}`}createListItem(e){if(!e)return;const t=document.createElement("li");t.textContent=e,t.classList.add("list-item"),t.dataset.name=e;const s=document.createElement("span");return s.classList.add("delete-icon"),s.addEventListener("click",this.deleteSiteHandler),t.appendChild(s),t}renderWhiteList(e,t){if(e&&e.length)for(let s=0;s<e.length;s++)t.appendChild(this.createListItem(e[s]))}deleteSiteHandler(e){let t;t=e.target.closest("ul").classList.contains("sites-list")?"whitelist":"whitePagesList";let s=e.target.closest("li");const i=s.dataset.name;this.storage[t]=this.storage[t].filter((e=>e!==i)),chrome.storage.local.set(this.storage,(e=>{s.remove()}))}isResourceDublicated(e,t){for(let s=0;s<t.length;s++)if(-1!==e.indexOf(t[s]))return!0;return!1}isDomainCorrect(e){return/(?!:\/\/)([a-zA-Z0-9-]+\.){0,5}[a-zA-Z0-9-][a-zA-Z0-9-]+\.[a-zA-Z]{2,64}?([^:\/\n?]?)/gi.test(e)}initColorPickerListeners(){for(let e=0,t=this.$colorInputs.length;e<t;++e)new CP(this.$colorInputs[e]).on("create",(function(e){this.source.onkeyup=()=>{this.set(this.source.value).enter()}})).on("change",(function(e){this.source.parentNode.querySelector(".color-preview").style.background=`#${e}`,this.source.value=`#${e}`}))}createScheme(e){e.preventDefault();const t=this.findName(this.storage.colorSchemes||{},"theme"),s=this.getColorValues();chrome.runtime.sendMessage({message:"createScheme",schemeName:t,schemeParams:s},(e=>{const t=this.renderScheme(e.schemeName);this.$schemesList.appendChild(t),this.storage.colorSchemes[e.schemeName]=e.schemeParams,this.activateScheme(e.schemeName)}))}findName(e,t){var s,i=1;do{s=t+"_"+i,i++}while(e[s]&&i<1e3);return s}getColorValues(){const e={};for(let t=0,s=this.$colorInputs.length;s>t;t++)e[this.$colorInputs[t].name]=this.$colorInputs[t].value;return e}renderColorSchemes(e){if(this.$schemesList.appendChild(this.renderScheme()),0!==Object.entries(e).length&&e.constructor===Object)for(let t in e)e.hasOwnProperty(t)&&this.$schemesList.appendChild(this.renderScheme(t))}renderScheme(e=""){const t=document.createElement("li");if(t.dataset.name=e,t.classList.add("list-item"),this.storage.activeScheme===e&&t.classList.add("active"),""!==e){const e=document.createElement("span");e.classList.add("delete-icon"),e.addEventListener("click",this.deleteSchemeHandler),t.appendChild(e)}const s=document.createElement("span");s.textContent=e||"Default theme",s.classList.add("scheme-name"),s.setAttribute("contentEditable",!!e),s.addEventListener("keydown",this.schemeNameKeyUpHandler),s.addEventListener("blur",this.schemeNameBlurHandler),t.appendChild(s);const i=document.createElement("span");return i.textContent="set",i.classList.add("activate-btn"),i.addEventListener("click",(e=>{this.activateScheme(e.target.parentNode.dataset.name)})),t.appendChild(i),t}deleteSchemeHandler(e){let t=e.target.closest("li");const s=t.dataset.name,i=this.storage.activeScheme===s;chrome.runtime.sendMessage({message:"deleteScheme",schemeToDelete:s,isActive:i},(e=>{this.storage.colorSchemes=e.colorSchemes,i&&this.activateScheme(),t.remove()}))}schemeNameKeyUpHandler(e){const t=e.target.parentNode.dataset.name,s=this.storage.activeScheme===t,i=e.target.textContent;if(27==e.keyCode&&e.target.blur(),13==e.keyCode){if(e.preventDefault(),t===i||""===i)return void e.target.blur();const a=this.validateSchemeName(i);if(""!==a)return void(e.target.textContent=a);chrome.runtime.sendMessage({message:"renameScheme",prevSchemeName:t,newSchemeName:i},(t=>{e.target.parentNode.dataset.name=t.schemeName,this.storage.colorSchemes=t.colorSchemes,s&&this.activateScheme(t.schemeName),e.target.blur()}))}}validateSchemeName(e){let t="";return e in this.storage.colorSchemes&&(t="Name is already exists"),e.length>32&&(t="Name is too long"),t}schemeNameBlurHandler(e){e.target.textContent=e.target.parentNode.dataset.name}activateScheme(e=""){chrome.runtime.sendMessage({message:"setActiveScheme",schemeToActivate:e},(t=>{this.storage.activeScheme=t.activeScheme,this.activateSchemeUI(e)}))}activateSchemeUI(e){const t=this.$schemesList.getElementsByClassName("active"),s=this.$schemesList.querySelector(`[data-name="${e}"]`);t.length>0&&t[0].classList.remove("active"),s.classList.add("active")}getHostname(e){var t=(e=e.replace("www.","")).indexOf("//")+2;if(t>1){var s=e.indexOf("/",t);return s>0||(s=e.indexOf("?",t))>0?e.substring(t,s):e.substring(t)}return e}}const o=new Options;