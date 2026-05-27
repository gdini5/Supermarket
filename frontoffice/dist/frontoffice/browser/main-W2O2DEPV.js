import{a as h}from"./chunk-7N4YRRHC.js";import{a as jt}from"./chunk-DHIXHXEY.js";import{a as Nt,b as Lt}from"./chunk-UCF5QG7U.js";import{a as Bt,b as zt}from"./chunk-6EQOVOSI.js";import{a as Vt}from"./chunk-7SBCAFGC.js";import{b as Rt,l as At,n as Pt,o as Tt,p as St,s as Ot,v as Ft}from"./chunk-UOCA7V2G.js";import{A as S,B as pt,C as ht,F as _e,G as ae,H as gt,M as ft,O as _t,P as bt,R as vt,S as oe,V as yt,Y as j,aa as Mt,ca as xt,da as Ct,ea as wt,fa as Dt,g as tt,ga as kt,h as nt,ha as Et,i as it,ia as It,ja as Ht,l as at,m as ot,o as rt,p as ie,q as st,r as lt,s as mt,t as ct,u as dt,z as ut}from"./chunk-ZJG5WI6W.js";import{$ as Ae,$a as ze,$b as k,Ab as Z,Ca as b,D as Q,Da as Fe,E as De,Eb as T,Ec as ne,Fb as l,G as ke,Gb as m,Hb as g,Hc as p,Ia as Be,Ib as fe,J as Ee,Jb as Xe,Ob as J,Pb as Qe,T as q,Tb as L,U as ge,Ub as qe,V as Ie,Vb as f,Wb as H,Xa as v,Xb as w,Y as Re,Yb as ee,Zb as Ge,_b as D,a as pe,aa as I,ab as Ne,b as xe,bb as Le,ca as y,cb as He,db as W,dc as We,ea as o,f as U,fa as Pe,fb as K,fc as E,gb as je,gc as te,hc as c,ic as Ke,j as X,ja as M,ka as x,kb as d,la as Te,lb as P,lc as $e,mb as C,mc as Ze,na as R,oa as _,ob as Ve,q as he,qb as Ye,r as Ce,ra as G,sa as A,tc as Je,u as we,ub as Ue,uc as et,va as Se,wa as Oe,yb as N,zb as $}from"./chunk-K6DSINYI.js";var on=["*",[["mat-toolbar-row"]]],rn=["*","mat-toolbar-row"],sn=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275dir=C({type:i,selectors:[["mat-toolbar-row"]],hostAttrs:[1,"mat-toolbar-row"],exportAs:["matToolbarRow"]})}return i})(),Yt=(()=>{class i{_elementRef=o(b);_platform=o(dt);_document=o(_);color;_toolbarRows;constructor(){}ngAfterViewInit(){this._platform.isBrowser&&(this._checkToolbarMixedModes(),this._toolbarRows.changes.subscribe(()=>this._checkToolbarMixedModes()))}_checkToolbarMixedModes(){this._toolbarRows.length}static \u0275fac=function(t){return new(t||i)};static \u0275cmp=d({type:i,selectors:[["mat-toolbar"]],contentQueries:function(t,n,r){if(t&1&&ee(r,sn,5),t&2){let s;D(s=k())&&(n._toolbarRows=s)}},hostAttrs:[1,"mat-toolbar"],hostVars:6,hostBindings:function(t,n){t&2&&(te(n.color?"mat-"+n.color:""),E("mat-toolbar-multiple-rows",n._toolbarRows.length>0)("mat-toolbar-single-row",n._toolbarRows.length===0))},inputs:{color:"color"},exportAs:["matToolbar"],ngContentSelectors:rn,decls:2,vars:0,template:function(t,n){t&1&&(H(on),w(0),w(1,1))},styles:[`.mat-toolbar {
  background: var(--mat-toolbar-container-background-color, var(--mat-sys-surface));
  color: var(--mat-toolbar-container-text-color, var(--mat-sys-on-surface));
}
.mat-toolbar, .mat-toolbar h1, .mat-toolbar h2, .mat-toolbar h3, .mat-toolbar h4, .mat-toolbar h5, .mat-toolbar h6 {
  font-family: var(--mat-toolbar-title-text-font, var(--mat-sys-title-large-font));
  font-size: var(--mat-toolbar-title-text-size, var(--mat-sys-title-large-size));
  line-height: var(--mat-toolbar-title-text-line-height, var(--mat-sys-title-large-line-height));
  font-weight: var(--mat-toolbar-title-text-weight, var(--mat-sys-title-large-weight));
  letter-spacing: var(--mat-toolbar-title-text-tracking, var(--mat-sys-title-large-tracking));
  margin: 0;
}
@media (forced-colors: active) {
  .mat-toolbar {
    outline: solid 1px;
  }
}
.mat-toolbar .mat-form-field-underline,
.mat-toolbar .mat-form-field-ripple,
.mat-toolbar .mat-focused .mat-form-field-ripple {
  background-color: currentColor;
}
.mat-toolbar .mat-form-field-label,
.mat-toolbar .mat-focused .mat-form-field-label,
.mat-toolbar .mat-select-value,
.mat-toolbar .mat-select-arrow,
.mat-toolbar .mat-form-field.mat-focused .mat-select-arrow {
  color: inherit;
}
.mat-toolbar .mat-input-element {
  caret-color: currentColor;
}
.mat-toolbar .mat-mdc-button-base.mat-mdc-button-base.mat-unthemed {
  --mat-button-text-label-text-color: var(--mat-toolbar-container-text-color, var(--mat-sys-on-surface));
  --mat-button-outlined-label-text-color: var(--mat-toolbar-container-text-color, var(--mat-sys-on-surface));
}

.mat-toolbar-row, .mat-toolbar-single-row {
  display: flex;
  box-sizing: border-box;
  padding: 0 16px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  white-space: nowrap;
  height: var(--mat-toolbar-standard-height, 64px);
}
@media (max-width: 599px) {
  .mat-toolbar-row, .mat-toolbar-single-row {
    height: var(--mat-toolbar-mobile-height, 56px);
  }
}

.mat-toolbar-multiple-rows {
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  width: 100%;
  min-height: var(--mat-toolbar-standard-height, 64px);
}
@media (max-width: 599px) {
  .mat-toolbar-multiple-rows {
    min-height: var(--mat-toolbar-mobile-height, 56px);
  }
}
`],encapsulation:2,changeDetection:0})}return i})();var Ut=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=P({type:i});static \u0275inj=I({imports:[S]})}return i})();var hn=["mat-menu-item",""],gn=[[["mat-icon"],["","matMenuItemIcon",""]],"*"],fn=["mat-icon, [matMenuItemIcon]","*"];function _n(i,a){i&1&&(Te(),l(0,"svg",2),g(1,"polygon",3),m())}var bn=["*"];function vn(i,a){if(i&1){let e=J();fe(0,"div",0),qe("click",function(){M(e);let n=f();return x(n.closed.emit("click"))})("animationstart",function(n){M(e);let r=f();return x(r._onAnimationStart(n.animationName))})("animationend",function(n){M(e);let r=f();return x(r._onAnimationDone(n.animationName))})("animationcancel",function(n){M(e);let r=f();return x(r._onAnimationDone(n.animationName))}),fe(1,"div",1),w(2),Xe()()}if(i&2){let e=f();te(e._classList),E("mat-menu-panel-animations-disabled",e._animationsDisabled)("mat-menu-panel-exit-animation",e._panelAnimationState==="void")("mat-menu-panel-animating",e._isAnimating()),Qe("id",e.panelId),N("aria-label",e.ariaLabel||null)("aria-labelledby",e.ariaLabelledby||null)("aria-describedby",e.ariaDescribedby||null)}}var ve=new y("MAT_MENU_PANEL"),Y=(()=>{class i{_elementRef=o(b);_document=o(_);_focusMonitor=o(_e);_parentMenu=o(ve,{optional:!0});_changeDetectorRef=o(ne);role="menuitem";disabled=!1;disableRipple=!1;_hovered=new X;_focused=new X;_highlighted=!1;_triggersSubmenu=!1;constructor(){o(ae).load(xt),this._parentMenu?.addItem?.(this)}focus(e,t){this._focusMonitor&&e?this._focusMonitor.focusVia(this._getHostElement(),e,t):this._getHostElement().focus(t),this._focused.next(this)}ngAfterViewInit(){this._focusMonitor&&this._focusMonitor.monitor(this._elementRef,!1)}ngOnDestroy(){this._focusMonitor&&this._focusMonitor.stopMonitoring(this._elementRef),this._parentMenu&&this._parentMenu.removeItem&&this._parentMenu.removeItem(this),this._hovered.complete(),this._focused.complete()}_getTabIndex(){return this.disabled?"-1":"0"}_getHostElement(){return this._elementRef.nativeElement}_checkDisabled(e){this.disabled&&(e.preventDefault(),e.stopPropagation())}_handleMouseEnter(){this._hovered.next(this)}getLabel(){let e=this._elementRef.nativeElement.cloneNode(!0),t=e.querySelectorAll("mat-icon, .material-icons");for(let n=0;n<t.length;n++)t[n].remove();return e.textContent?.trim()||""}_setHighlighted(e){this._highlighted=e,this._changeDetectorRef.markForCheck()}_setTriggersSubmenu(e){this._triggersSubmenu=e,this._changeDetectorRef.markForCheck()}_hasFocus(){return this._document&&this._document.activeElement===this._getHostElement()}static \u0275fac=function(t){return new(t||i)};static \u0275cmp=d({type:i,selectors:[["","mat-menu-item",""]],hostAttrs:[1,"mat-mdc-menu-item","mat-focus-indicator"],hostVars:8,hostBindings:function(t,n){t&1&&L("click",function(s){return n._checkDisabled(s)})("mouseenter",function(){return n._handleMouseEnter()}),t&2&&(N("role",n.role)("tabindex",n._getTabIndex())("aria-disabled",n.disabled)("disabled",n.disabled||null),E("mat-mdc-menu-item-highlighted",n._highlighted)("mat-mdc-menu-item-submenu-trigger",n._triggersSubmenu))},inputs:{role:"role",disabled:[2,"disabled","disabled",p],disableRipple:[2,"disableRipple","disableRipple",p]},exportAs:["matMenuItem"],attrs:hn,ngContentSelectors:fn,decls:5,vars:3,consts:[[1,"mat-mdc-menu-item-text"],["matRipple","",1,"mat-mdc-menu-ripple",3,"matRippleDisabled","matRippleTrigger"],["viewBox","0 0 5 10","focusable","false","aria-hidden","true",1,"mat-mdc-menu-submenu-icon"],["points","0,0 5,5 0,10"]],template:function(t,n){t&1&&(H(gn),w(0),l(1,"span",0),w(2,1),m(),g(3,"div",1),$(4,_n,2,0,":svg:svg",2)),t&2&&(v(3),T("matRippleDisabled",n.disableRipple||n.disabled)("matRippleTrigger",n._getHostElement()),v(),Z(n._triggersSubmenu?4:-1))},dependencies:[Mt],encapsulation:2,changeDetection:0})}return i})();var yn=new y("MatMenuContent");var Mn=new y("mat-menu-default-options",{providedIn:"root",factory:()=>({overlapTrigger:!1,xPosition:"after",yPosition:"below",backdropClass:"cdk-overlay-transparent-backdrop"})}),be="_mat-menu-enter",re="_mat-menu-exit",F=(()=>{class i{_elementRef=o(b);_changeDetectorRef=o(ne);_injector=o(R);_keyManager;_xPosition;_yPosition;_firstItemFocusRef;_exitFallbackTimeout;_animationsDisabled=j();_allItems;_directDescendantItems=new Fe;_classList={};_panelAnimationState="void";_animationDone=new X;_isAnimating=Se(!1);parentMenu;direction;overlayPanelClass;backdropClass;ariaLabel;ariaLabelledby;ariaDescribedby;get xPosition(){return this._xPosition}set xPosition(e){this._xPosition=e,this.setPositionClasses()}get yPosition(){return this._yPosition}set yPosition(e){this._yPosition=e,this.setPositionClasses()}templateRef;items;lazyContent;overlapTrigger=!1;hasBackdrop;set panelClass(e){let t=this._previousPanelClass,n=pe({},this._classList);t&&t.length&&t.split(" ").forEach(r=>{n[r]=!1}),this._previousPanelClass=e,e&&e.length&&(e.split(" ").forEach(r=>{n[r]=!0}),this._elementRef.nativeElement.className=""),this._classList=n}_previousPanelClass;get classList(){return this.panelClass}set classList(e){this.panelClass=e}closed=new G;close=this.closed;panelId=o(oe).getId("mat-menu-panel-");constructor(){let e=o(Mn);this.overlayPanelClass=e.overlayPanelClass||"",this._xPosition=e.xPosition,this._yPosition=e.yPosition,this.backdropClass=e.backdropClass,this.overlapTrigger=e.overlapTrigger,this.hasBackdrop=e.hasBackdrop}ngOnInit(){this.setPositionClasses()}ngAfterContentInit(){this._updateDirectDescendants(),this._keyManager=new vt(this._directDescendantItems).withWrap().withTypeAhead().withHomeAndEnd(),this._keyManager.tabOut.subscribe(()=>this.closed.emit("tab")),this._directDescendantItems.changes.pipe(q(this._directDescendantItems),ge(e=>Q(...e.map(t=>t._focused)))).subscribe(e=>this._keyManager.updateActiveItem(e)),this._directDescendantItems.changes.subscribe(e=>{let t=this._keyManager;if(this._panelAnimationState==="enter"&&t.activeItem?._hasFocus()){let n=e.toArray(),r=Math.max(0,Math.min(n.length-1,t.activeItemIndex||0));n[r]&&!n[r].disabled?t.setActiveItem(r):t.setNextItemActive()}})}ngOnDestroy(){this._keyManager?.destroy(),this._directDescendantItems.destroy(),this.closed.complete(),this._firstItemFocusRef?.destroy(),clearTimeout(this._exitFallbackTimeout)}_hovered(){return this._directDescendantItems.changes.pipe(q(this._directDescendantItems),ge(t=>Q(...t.map(n=>n._hovered))))}addItem(e){}removeItem(e){}_handleKeydown(e){let t=e.keyCode,n=this._keyManager;switch(t){case 27:bt(e)||(e.preventDefault(),this.closed.emit("keydown"));break;case 37:this.parentMenu&&this.direction==="ltr"&&this.closed.emit("keydown");break;case 39:this.parentMenu&&this.direction==="rtl"&&this.closed.emit("keydown");break;default:(t===38||t===40)&&n.setFocusOrigin("keyboard"),n.onKeydown(e);return}}focusFirstItem(e="program"){this._firstItemFocusRef?.destroy(),this._firstItemFocusRef=Ne(()=>{let t=this._resolvePanel();if(!t||!t.contains(document.activeElement)){let n=this._keyManager;n.setFocusOrigin(e).setFirstItemActive(),!n.activeItem&&t&&t.focus()}},{injector:this._injector})}resetActiveItem(){this._keyManager.setActiveItem(-1)}setElevation(e){}setPositionClasses(e=this.xPosition,t=this.yPosition){this._classList=xe(pe({},this._classList),{"mat-menu-before":e==="before","mat-menu-after":e==="after","mat-menu-above":t==="above","mat-menu-below":t==="below"}),this._changeDetectorRef.markForCheck()}_onAnimationDone(e){let t=e===re;(t||e===be)&&(t&&(clearTimeout(this._exitFallbackTimeout),this._exitFallbackTimeout=void 0),this._animationDone.next(t?"void":"enter"),this._isAnimating.set(!1))}_onAnimationStart(e){(e===be||e===re)&&this._isAnimating.set(!0)}_setIsOpen(e){if(this._panelAnimationState=e?"enter":"void",e){if(this._keyManager.activeItemIndex===0){let t=this._resolvePanel();t&&(t.scrollTop=0)}}else this._animationsDisabled||(this._exitFallbackTimeout=setTimeout(()=>this._onAnimationDone(re),200));this._animationsDisabled&&setTimeout(()=>{this._onAnimationDone(e?be:re)}),this._changeDetectorRef.markForCheck()}_updateDirectDescendants(){this._allItems.changes.pipe(q(this._allItems)).subscribe(e=>{this._directDescendantItems.reset(e.filter(t=>t._parentMenu===this)),this._directDescendantItems.notifyOnChanges()})}_resolvePanel(){let e=null;return this._directDescendantItems.length&&(e=this._directDescendantItems.first._getHostElement().closest('[role="menu"]')),e}static \u0275fac=function(t){return new(t||i)};static \u0275cmp=d({type:i,selectors:[["mat-menu"]],contentQueries:function(t,n,r){if(t&1&&ee(r,yn,5)(r,Y,5)(r,Y,4),t&2){let s;D(s=k())&&(n.lazyContent=s.first),D(s=k())&&(n._allItems=s),D(s=k())&&(n.items=s)}},viewQuery:function(t,n){if(t&1&&Ge(Le,5),t&2){let r;D(r=k())&&(n.templateRef=r.first)}},hostVars:3,hostBindings:function(t,n){t&2&&N("aria-label",null)("aria-labelledby",null)("aria-describedby",null)},inputs:{backdropClass:"backdropClass",ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],ariaDescribedby:[0,"aria-describedby","ariaDescribedby"],xPosition:"xPosition",yPosition:"yPosition",overlapTrigger:[2,"overlapTrigger","overlapTrigger",p],hasBackdrop:[2,"hasBackdrop","hasBackdrop",e=>e==null?null:p(e)],panelClass:[0,"class","panelClass"],classList:"classList"},outputs:{closed:"closed",close:"close"},exportAs:["matMenu"],features:[$e([{provide:ve,useExisting:i}])],ngContentSelectors:bn,decls:1,vars:0,consts:[["tabindex","-1","role","menu",1,"mat-mdc-menu-panel",3,"click","animationstart","animationend","animationcancel","id"],[1,"mat-mdc-menu-content"]],template:function(t,n){t&1&&(H(),Ye(0,vn,3,12,"ng-template"))},styles:[`mat-menu {
  display: none;
}

.mat-mdc-menu-content {
  margin: 0;
  padding: 8px 0;
  outline: 0;
}
.mat-mdc-menu-content,
.mat-mdc-menu-content .mat-mdc-menu-item .mat-mdc-menu-item-text {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  flex: 1;
  white-space: normal;
  font-family: var(--mat-menu-item-label-text-font, var(--mat-sys-label-large-font));
  line-height: var(--mat-menu-item-label-text-line-height, var(--mat-sys-label-large-line-height));
  font-size: var(--mat-menu-item-label-text-size, var(--mat-sys-label-large-size));
  letter-spacing: var(--mat-menu-item-label-text-tracking, var(--mat-sys-label-large-tracking));
  font-weight: var(--mat-menu-item-label-text-weight, var(--mat-sys-label-large-weight));
}

@keyframes _mat-menu-enter {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes _mat-menu-exit {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.mat-mdc-menu-panel {
  min-width: 112px;
  max-width: 280px;
  overflow: auto;
  box-sizing: border-box;
  outline: 0;
  animation: _mat-menu-enter 120ms cubic-bezier(0, 0, 0.2, 1);
  border-radius: var(--mat-menu-container-shape, var(--mat-sys-corner-extra-small));
  background-color: var(--mat-menu-container-color, var(--mat-sys-surface-container));
  box-shadow: var(--mat-menu-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
  will-change: transform, opacity;
}
.mat-mdc-menu-panel.mat-menu-panel-exit-animation {
  animation: _mat-menu-exit 100ms 25ms linear forwards;
}
.mat-mdc-menu-panel.mat-menu-panel-animations-disabled {
  animation: none;
}
.mat-mdc-menu-panel.mat-menu-panel-animating {
  pointer-events: none;
}
.mat-mdc-menu-panel.mat-menu-panel-animating:has(.mat-mdc-menu-content:empty) {
  display: none;
}
@media (forced-colors: active) {
  .mat-mdc-menu-panel {
    outline: solid 1px;
  }
}
.mat-mdc-menu-panel .mat-divider {
  border-top-color: var(--mat-menu-divider-color, var(--mat-sys-surface-variant));
  margin-bottom: var(--mat-menu-divider-bottom-spacing, 8px);
  margin-top: var(--mat-menu-divider-top-spacing, 8px);
}

.mat-mdc-menu-item {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  padding: 0;
  cursor: pointer;
  width: 100%;
  text-align: left;
  box-sizing: border-box;
  color: inherit;
  font-size: inherit;
  background: none;
  text-decoration: none;
  margin: 0;
  min-height: 48px;
  padding-left: var(--mat-menu-item-leading-spacing, 12px);
  padding-right: var(--mat-menu-item-trailing-spacing, 12px);
  -webkit-user-select: none;
  user-select: none;
  cursor: pointer;
  outline: none;
  border: none;
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-menu-item::-moz-focus-inner {
  border: 0;
}
[dir=rtl] .mat-mdc-menu-item {
  padding-left: var(--mat-menu-item-trailing-spacing, 12px);
  padding-right: var(--mat-menu-item-leading-spacing, 12px);
}
.mat-mdc-menu-item:has(.material-icons, mat-icon, [matButtonIcon]) {
  padding-left: var(--mat-menu-item-with-icon-leading-spacing, 12px);
  padding-right: var(--mat-menu-item-with-icon-trailing-spacing, 12px);
}
[dir=rtl] .mat-mdc-menu-item:has(.material-icons, mat-icon, [matButtonIcon]) {
  padding-left: var(--mat-menu-item-with-icon-trailing-spacing, 12px);
  padding-right: var(--mat-menu-item-with-icon-leading-spacing, 12px);
}
.mat-mdc-menu-item, .mat-mdc-menu-item:visited, .mat-mdc-menu-item:link {
  color: var(--mat-menu-item-label-text-color, var(--mat-sys-on-surface));
}
.mat-mdc-menu-item .mat-icon-no-color,
.mat-mdc-menu-item .mat-mdc-menu-submenu-icon {
  color: var(--mat-menu-item-icon-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-menu-item[disabled] {
  cursor: default;
  opacity: 0.38;
}
.mat-mdc-menu-item[disabled]::after {
  display: block;
  position: absolute;
  content: "";
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
}
.mat-mdc-menu-item:focus {
  outline: 0;
}
.mat-mdc-menu-item .mat-icon {
  flex-shrink: 0;
  margin-right: var(--mat-menu-item-spacing, 12px);
  height: var(--mat-menu-item-icon-size, 24px);
  width: var(--mat-menu-item-icon-size, 24px);
}
[dir=rtl] .mat-mdc-menu-item {
  text-align: right;
}
[dir=rtl] .mat-mdc-menu-item .mat-icon {
  margin-right: 0;
  margin-left: var(--mat-menu-item-spacing, 12px);
}
.mat-mdc-menu-item:not([disabled]):hover {
  background-color: var(--mat-menu-item-hover-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-hover-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-menu-item:not([disabled]).cdk-program-focused, .mat-mdc-menu-item:not([disabled]).cdk-keyboard-focused, .mat-mdc-menu-item:not([disabled]).mat-mdc-menu-item-highlighted {
  background-color: var(--mat-menu-item-focus-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-focus-state-layer-opacity) * 100%), transparent));
}
@media (forced-colors: active) {
  .mat-mdc-menu-item {
    margin-top: 1px;
  }
}

.mat-mdc-menu-submenu-icon {
  width: var(--mat-menu-item-icon-size, 24px);
  height: 10px;
  fill: currentColor;
  padding-left: var(--mat-menu-item-spacing, 12px);
}
[dir=rtl] .mat-mdc-menu-submenu-icon {
  padding-right: var(--mat-menu-item-spacing, 12px);
  padding-left: 0;
}
[dir=rtl] .mat-mdc-menu-submenu-icon polygon {
  transform: scaleX(-1);
  transform-origin: center;
}
@media (forced-colors: active) {
  .mat-mdc-menu-submenu-icon {
    fill: CanvasText;
  }
}

.mat-mdc-menu-item .mat-mdc-menu-ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
}
`],encapsulation:2,changeDetection:0})}return i})(),xn=new y("mat-menu-scroll-strategy",{providedIn:"root",factory:()=>{let i=o(R);return()=>Pt(i)}});var O=new WeakMap,Cn=(()=>{class i{_canHaveBackdrop;_element=o(b);_viewContainerRef=o(je);_menuItemInstance=o(Y,{optional:!0,self:!0});_dir=o(ut,{optional:!0});_focusMonitor=o(_e);_ngZone=o(A);_injector=o(R);_scrollStrategy=o(xn);_changeDetectorRef=o(ne);_animationsDisabled=j();_portal;_overlayRef=null;_menuOpen=!1;_closingActionsSubscription=U.EMPTY;_menuCloseSubscription=U.EMPTY;_pendingRemoval;_parentMaterialMenu;_parentInnerPadding;_openedBy=void 0;get _menu(){return this._menuInternal}set _menu(e){e!==this._menuInternal&&(this._menuInternal=e,this._menuCloseSubscription.unsubscribe(),e&&(this._parentMaterialMenu,this._menuCloseSubscription=e.close.subscribe(t=>{this._destroyMenu(t),(t==="click"||t==="tab")&&this._parentMaterialMenu&&this._parentMaterialMenu.closed.emit(t)})),this._menuItemInstance?._setTriggersSubmenu(this._triggersSubmenu()))}_menuInternal=null;constructor(e){this._canHaveBackdrop=e;let t=o(ve,{optional:!0});this._parentMaterialMenu=t instanceof F?t:void 0}ngOnDestroy(){this._menu&&this._ownsMenu(this._menu)&&O.delete(this._menu),this._pendingRemoval?.unsubscribe(),this._menuCloseSubscription.unsubscribe(),this._closingActionsSubscription.unsubscribe(),this._overlayRef&&(this._overlayRef.dispose(),this._overlayRef=null)}get menuOpen(){return this._menuOpen}get dir(){return this._dir&&this._dir.value==="rtl"?"rtl":"ltr"}_triggersSubmenu(){return!!(this._menuItemInstance&&this._parentMaterialMenu&&this._menu)}_closeMenu(){this._menu?.close.emit()}_openMenu(e){if(this._triggerIsAriaDisabled())return;let t=this._menu;if(this._menuOpen||!t)return;this._pendingRemoval?.unsubscribe();let n=O.get(t);O.set(t,this),n&&n!==this&&n._closeMenu();let r=this._createOverlay(t),s=r.getConfig(),u=s.positionStrategy;this._setPosition(t,u),this._canHaveBackdrop?s.hasBackdrop=t.hasBackdrop==null?!this._triggersSubmenu():t.hasBackdrop:s.hasBackdrop=t.hasBackdrop??!1,r.hasAttached()||(r.attach(this._getPortal(t)),t.lazyContent?.attach(this.menuData)),this._closingActionsSubscription=this._menuClosingActions().subscribe(()=>this._closeMenu()),t.parentMenu=this._triggersSubmenu()?this._parentMaterialMenu:void 0,t.direction=this.dir,e&&t.focusFirstItem(this._openedBy||"program"),this._setIsMenuOpen(!0),t instanceof F&&(t._setIsOpen(!0),t._directDescendantItems.changes.pipe(Ie(t.close)).subscribe(()=>{u.withLockedPosition(!1).reapplyLastPosition(),u.withLockedPosition(!0)}))}focus(e,t){this._focusMonitor&&e?this._focusMonitor.focusVia(this._element,e,t):this._element.nativeElement.focus(t)}_destroyMenu(e){let t=this._overlayRef,n=this._menu;!t||!this.menuOpen||(this._closingActionsSubscription.unsubscribe(),this._pendingRemoval?.unsubscribe(),n instanceof F&&this._ownsMenu(n)?(this._pendingRemoval=n._animationDone.pipe(Ee(1)).subscribe(()=>{t.detach(),O.has(n)||n.lazyContent?.detach()}),n._setIsOpen(!1)):(t.detach(),n?.lazyContent?.detach()),n&&this._ownsMenu(n)&&O.delete(n),this.restoreFocus&&(e==="keydown"||!this._openedBy||!this._triggersSubmenu())&&this.focus(this._openedBy),this._openedBy=void 0,this._setIsMenuOpen(!1))}_setIsMenuOpen(e){e!==this._menuOpen&&(this._menuOpen=e,this._menuOpen?this.menuOpened.emit():this.menuClosed.emit(),this._triggersSubmenu()&&this._menuItemInstance._setHighlighted(e),this._changeDetectorRef.markForCheck())}_createOverlay(e){if(!this._overlayRef){let t=this._getOverlayConfig(e);this._subscribeToPositions(e,t.positionStrategy),this._overlayRef=Ot(this._injector,t),this._overlayRef.keydownEvents().subscribe(n=>{this._menu instanceof F&&this._menu._handleKeydown(n)})}return this._overlayRef}_getOverlayConfig(e){return new Tt({positionStrategy:St(this._injector,this._getOverlayOrigin()).withLockedPosition().withGrowAfterOpen().withTransformOriginOn(".mat-menu-panel, .mat-mdc-menu-panel"),backdropClass:e.backdropClass||"cdk-overlay-transparent-backdrop",panelClass:e.overlayPanelClass,scrollStrategy:this._scrollStrategy(),direction:this._dir||"ltr",disableAnimations:this._animationsDisabled})}_subscribeToPositions(e,t){e.setPositionClasses&&t.positionChanges.subscribe(n=>{this._ngZone.run(()=>{let r=n.connectionPair.overlayX==="start"?"after":"before",s=n.connectionPair.overlayY==="top"?"below":"above";e.setPositionClasses(r,s)})})}_setPosition(e,t){let[n,r]=e.xPosition==="before"?["end","start"]:["start","end"],[s,u]=e.yPosition==="above"?["bottom","top"]:["top","bottom"],[me,ce]=[s,u],[de,ue]=[n,r],z=0;if(this._triggersSubmenu()){if(ue=n=e.xPosition==="before"?"start":"end",r=de=n==="end"?"start":"end",this._parentMaterialMenu){if(this._parentInnerPadding==null){let Me=this._parentMaterialMenu.items.first;this._parentInnerPadding=Me?Me._getHostElement().offsetTop:0}z=s==="bottom"?this._parentInnerPadding:-this._parentInnerPadding}}else e.overlapTrigger||(me=s==="top"?"bottom":"top",ce=u==="top"?"bottom":"top");t.withPositions([{originX:n,originY:me,overlayX:de,overlayY:s,offsetY:z},{originX:r,originY:me,overlayX:ue,overlayY:s,offsetY:z},{originX:n,originY:ce,overlayX:de,overlayY:u,offsetY:-z},{originX:r,originY:ce,overlayX:ue,overlayY:u,offsetY:-z}])}_menuClosingActions(){let e=this._getOutsideClickStream(this._overlayRef),t=this._overlayRef.detachments(),n=this._parentMaterialMenu?this._parentMaterialMenu.closed:he(),r=this._parentMaterialMenu?this._parentMaterialMenu._hovered().pipe(De(s=>this._menuOpen&&s!==this._menuItemInstance)):he();return Q(e,n,r,t)}_getPortal(e){return(!this._portal||this._portal.templateRef!==e.templateRef)&&(this._portal=new Rt(e.templateRef,this._viewContainerRef)),this._portal}_ownsMenu(e){return O.get(e)===this}_triggerIsAriaDisabled(){return p(this._element.nativeElement.getAttribute("aria-disabled"))}static \u0275fac=function(t){K()};static \u0275dir=C({type:i})}return i})(),qt=(()=>{class i extends Cn{_cleanupTouchstart;_hoverSubscription=U.EMPTY;get _deprecatedMatMenuTriggerFor(){return this.menu}set _deprecatedMatMenuTriggerFor(e){this.menu=e}get menu(){return this._menu}set menu(e){this._menu=e}menuData;restoreFocus=!0;menuOpened=new G;onMenuOpen=this.menuOpened;menuClosed=new G;onMenuClose=this.menuClosed;constructor(){super(!0);let e=o(W);this._cleanupTouchstart=e.listen(this._element.nativeElement,"touchstart",t=>{ht(t)||(this._openedBy="touch")},{passive:!0})}triggersSubmenu(){return super._triggersSubmenu()}toggleMenu(){return this.menuOpen?this.closeMenu():this.openMenu()}openMenu(){this._openMenu(!0)}closeMenu(){this._closeMenu()}updatePosition(){this._overlayRef?.updatePosition()}ngAfterContentInit(){this._handleHover()}ngOnDestroy(){super.ngOnDestroy(),this._cleanupTouchstart(),this._hoverSubscription.unsubscribe()}_getOverlayOrigin(){return this._element}_getOutsideClickStream(e){return e.backdropClick()}_handleMousedown(e){pt(e)||(this._openedBy=e.button===0?"mouse":void 0,this.triggersSubmenu()&&e.preventDefault())}_handleKeydown(e){let t=e.keyCode;(t===13||t===32)&&(this._openedBy="keyboard"),this.triggersSubmenu()&&(t===39&&this.dir==="ltr"||t===37&&this.dir==="rtl")&&(this._openedBy="keyboard",this.openMenu())}_handleClick(e){this.triggersSubmenu()?(e.stopPropagation(),this.openMenu()):this.toggleMenu()}_handleHover(){this.triggersSubmenu()&&this._parentMaterialMenu&&(this._hoverSubscription=this._parentMaterialMenu._hovered().subscribe(e=>{e===this._menuItemInstance&&!e.disabled&&this._parentMaterialMenu?._panelAnimationState!=="void"&&(this._openedBy="mouse",this._openMenu(!1))}))}static \u0275fac=function(t){return new(t||i)};static \u0275dir=C({type:i,selectors:[["","mat-menu-trigger-for",""],["","matMenuTriggerFor",""]],hostAttrs:[1,"mat-mdc-menu-trigger"],hostVars:3,hostBindings:function(t,n){t&1&&L("click",function(s){return n._handleClick(s)})("mousedown",function(s){return n._handleMousedown(s)})("keydown",function(s){return n._handleKeydown(s)}),t&2&&N("aria-haspopup",n.menu?"menu":null)("aria-expanded",n.menuOpen)("aria-controls",n.menuOpen?n.menu==null?null:n.menu.panelId:null)},inputs:{_deprecatedMatMenuTriggerFor:[0,"mat-menu-trigger-for","_deprecatedMatMenuTriggerFor"],menu:[0,"matMenuTriggerFor","menu"],menuData:[0,"matMenuTriggerData","menuData"],restoreFocus:[0,"matMenuTriggerRestoreFocus","restoreFocus"]},outputs:{menuOpened:"menuOpened",onMenuOpen:"onMenuOpen",menuClosed:"menuClosed",onMenuClose:"onMenuClose"},exportAs:["matMenuTrigger"],features:[Ve]})}return i})();var Gt=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=P({type:i});static \u0275inj=I({imports:[wt,Ft,S,At]})}return i})();var Wt="mat-badge-content",Dn=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275cmp=d({type:i,selectors:[["ng-component"]],decls:0,vars:0,template:function(t,n){},styles:[`.mat-badge {
  position: relative;
}
.mat-badge.mat-badge {
  overflow: visible;
}

.mat-badge-content {
  position: absolute;
  text-align: center;
  display: inline-block;
  transition: transform 200ms ease-in-out;
  transform: scale(0.6);
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  box-sizing: border-box;
  pointer-events: none;
  background-color: var(--mat-badge-background-color, var(--mat-sys-error));
  color: var(--mat-badge-text-color, var(--mat-sys-on-error));
  font-family: var(--mat-badge-text-font, var(--mat-sys-label-small-font));
  font-weight: var(--mat-badge-text-weight, var(--mat-sys-label-small-weight));
  border-radius: var(--mat-badge-container-shape, var(--mat-sys-corner-full));
}
.mat-badge-above .mat-badge-content {
  bottom: 100%;
}
.mat-badge-below .mat-badge-content {
  top: 100%;
}
.mat-badge-before .mat-badge-content {
  right: 100%;
}
[dir=rtl] .mat-badge-before .mat-badge-content {
  right: auto;
  left: 100%;
}
.mat-badge-after .mat-badge-content {
  left: 100%;
}
[dir=rtl] .mat-badge-after .mat-badge-content {
  left: auto;
  right: 100%;
}
@media (forced-colors: active) {
  .mat-badge-content {
    outline: solid 1px;
    border-radius: 0;
  }
}

.mat-badge-disabled .mat-badge-content {
  background-color: var(--mat-badge-disabled-state-background-color, color-mix(in srgb, var(--mat-sys-error) 38%, transparent));
  color: var(--mat-badge-disabled-state-text-color, var(--mat-sys-on-error));
}

.mat-badge-hidden .mat-badge-content {
  display: none;
}

.ng-animate-disabled .mat-badge-content,
.mat-badge-content._mat-animation-noopable {
  transition: none;
}

.mat-badge-content.mat-badge-active {
  transform: none;
}

.mat-badge-small .mat-badge-content {
  width: var(--mat-badge-legacy-small-size-container-size, unset);
  height: var(--mat-badge-legacy-small-size-container-size, unset);
  min-width: var(--mat-badge-small-size-container-size, 6px);
  min-height: var(--mat-badge-small-size-container-size, 6px);
  line-height: var(--mat-badge-small-size-line-height, 6px);
  padding: var(--mat-badge-small-size-container-padding, 0);
  font-size: var(--mat-badge-small-size-text-size, 0);
  margin: var(--mat-badge-small-size-container-offset, -6px 0);
}
.mat-badge-small.mat-badge-overlap .mat-badge-content {
  margin: var(--mat-badge-small-size-container-overlap-offset, -6px);
}

.mat-badge-medium .mat-badge-content {
  width: var(--mat-badge-legacy-container-size, unset);
  height: var(--mat-badge-legacy-container-size, unset);
  min-width: var(--mat-badge-container-size, 16px);
  min-height: var(--mat-badge-container-size, 16px);
  line-height: var(--mat-badge-line-height, 16px);
  padding: var(--mat-badge-container-padding, 0 4px);
  font-size: var(--mat-badge-text-size, var(--mat-sys-label-small-size));
  margin: var(--mat-badge-container-offset, -12px 0);
}
.mat-badge-medium.mat-badge-overlap .mat-badge-content {
  margin: var(--mat-badge-container-overlap-offset, -12px);
}

.mat-badge-large .mat-badge-content {
  width: var(--mat-badge-legacy-large-size-container-size, unset);
  height: var(--mat-badge-legacy-large-size-container-size, unset);
  min-width: var(--mat-badge-large-size-container-size, 16px);
  min-height: var(--mat-badge-large-size-container-size, 16px);
  line-height: var(--mat-badge-large-size-line-height, 16px);
  padding: var(--mat-badge-large-size-container-padding, 0 4px);
  font-size: var(--mat-badge-large-size-text-size, var(--mat-sys-label-small-size));
  margin: var(--mat-badge-large-size-container-offset, -12px 0);
}
.mat-badge-large.mat-badge-overlap .mat-badge-content {
  margin: var(--mat-badge-large-size-container-overlap-offset, -12px);
}
`],encapsulation:2,changeDetection:0})}return i})(),Kt=(()=>{class i{_ngZone=o(A);_elementRef=o(b);_ariaDescriber=o(yt);_renderer=o(W);_animationsDisabled=j();_idGenerator=o(oe);get color(){return this._color}set color(e){this._setColor(e),this._color=e}_color="primary";overlap=!0;disabled=!1;position="above after";get content(){return this._content}set content(e){this._updateRenderedContent(e)}_content;get description(){return this._description}set description(e){this._updateDescription(e)}_description;size="medium";hidden=!1;_badgeElement;_inlineBadgeDescription;_isInitialized=!1;_interactivityChecker=o(ft);_document=o(_);constructor(){let e=o(ae);e.load(Dn),e.load(gt)}isAbove(){return this.position.indexOf("below")===-1}isAfter(){return this.position.indexOf("before")===-1}getBadgeElement(){return this._badgeElement}ngOnInit(){this._clearExistingBadges(),this.content&&!this._badgeElement&&(this._badgeElement=this._createBadgeElement(),this._updateRenderedContent(this.content)),this._isInitialized=!0}ngAfterViewInit(){}ngOnDestroy(){this._renderer.destroyNode&&(this._renderer.destroyNode(this._badgeElement),this._inlineBadgeDescription?.remove()),this._ariaDescriber.removeDescription(this._elementRef.nativeElement,this.description)}_isHostInteractive(){return this._interactivityChecker.isFocusable(this._elementRef.nativeElement,{ignoreVisibility:!0})}_createBadgeElement(){let e=this._renderer.createElement("span"),t="mat-badge-active";return e.setAttribute("id",this._idGenerator.getId("mat-badge-content-")),e.setAttribute("aria-hidden","true"),e.classList.add(Wt),this._animationsDisabled&&e.classList.add("_mat-animation-noopable"),this._elementRef.nativeElement.appendChild(e),typeof requestAnimationFrame=="function"&&!this._animationsDisabled?this._ngZone.runOutsideAngular(()=>{requestAnimationFrame(()=>{e.classList.add(t)})}):e.classList.add(t),e}_updateRenderedContent(e){let t=`${e??""}`.trim();this._isInitialized&&t&&!this._badgeElement&&(this._badgeElement=this._createBadgeElement()),this._badgeElement&&(this._badgeElement.textContent=t),this._content=t}_updateDescription(e){this._ariaDescriber.removeDescription(this._elementRef.nativeElement,this.description),(!e||this._isHostInteractive())&&this._removeInlineDescription(),this._description=e,this._isHostInteractive()?this._ariaDescriber.describe(this._elementRef.nativeElement,e):this._updateInlineDescription()}_updateInlineDescription(){this._inlineBadgeDescription||(this._inlineBadgeDescription=this._document.createElement("span"),this._inlineBadgeDescription.classList.add("cdk-visually-hidden")),this._inlineBadgeDescription.textContent=this.description,this._badgeElement?.appendChild(this._inlineBadgeDescription)}_removeInlineDescription(){this._inlineBadgeDescription?.remove(),this._inlineBadgeDescription=void 0}_setColor(e){let t=this._elementRef.nativeElement.classList;t.remove(`mat-badge-${this._color}`),e&&t.add(`mat-badge-${e}`)}_clearExistingBadges(){let e=this._elementRef.nativeElement.querySelectorAll(`:scope > .${Wt}`);for(let t of Array.from(e))t!==this._badgeElement&&t.remove()}static \u0275fac=function(t){return new(t||i)};static \u0275dir=C({type:i,selectors:[["","matBadge",""]],hostAttrs:[1,"mat-badge"],hostVars:20,hostBindings:function(t,n){t&2&&E("mat-badge-overlap",n.overlap)("mat-badge-above",n.isAbove())("mat-badge-below",!n.isAbove())("mat-badge-before",!n.isAfter())("mat-badge-after",n.isAfter())("mat-badge-small",n.size==="small")("mat-badge-medium",n.size==="medium")("mat-badge-large",n.size==="large")("mat-badge-hidden",n.hidden||!n.content)("mat-badge-disabled",n.disabled)},inputs:{color:[0,"matBadgeColor","color"],overlap:[2,"matBadgeOverlap","overlap",p],disabled:[2,"matBadgeDisabled","disabled",p],position:[0,"matBadgePosition","position"],content:[0,"matBadge","content"],description:[0,"matBadgeDescription","description"],size:[0,"matBadgeSize","size"],hidden:[2,"matBadgeHidden","hidden",p]}})}return i})(),$t=(()=>{class i{static \u0275fac=function(t){return new(t||i)};static \u0275mod=P({type:i});static \u0275inj=I({imports:[_t,S]})}return i})();var In=()=>({exact:!0});function Rn(i,a){if(i&1){let e=J();l(0,"a",7)(1,"mat-icon"),c(2,"shopping_cart"),m()(),l(3,"button",8)(4,"mat-icon"),c(5,"account_circle"),m(),l(6,"span",9),c(7),m(),l(8,"mat-icon"),c(9,"arrow_drop_down"),m()(),l(10,"mat-menu",null,0)(12,"a",10)(13,"mat-icon"),c(14,"person"),m(),l(15,"span"),c(16,"O meu perfil"),m()(),l(17,"a",11)(18,"mat-icon"),c(19,"receipt_long"),m(),l(20,"span"),c(21,"As minhas encomendas"),m()(),g(22,"mat-divider"),l(23,"button",12),L("click",function(){M(e);let n=f();return x(n.auth.logout())}),l(24,"mat-icon"),c(25,"logout"),m(),l(26,"span"),c(27,"Terminar sess\xE3o"),m()()()}if(i&2){let e,t=We(11),n=f();T("matBadge",n.cart.cartCount())("matBadgeHidden",n.cart.cartCount()===0),v(3),T("matMenuTriggerFor",t),v(4),Ke((e=n.auth.currentUser())==null?null:e.name)}}function An(i,a){i&1&&(l(0,"a",13),c(1,"Entrar"),m(),l(2,"a",14),c(3,"Registar"),m())}var se=class i{auth=o(h);cart=o(jt);static \u0275fac=function(e){return new(e||i)};static \u0275cmp=d({type:i,selectors:[["app-navbar"]],decls:14,vars:3,consts:[["userMenu","matMenu"],["color","primary",1,"navbar"],["routerLink","/",1,"brand"],[1,"nav-links"],["mat-button","","routerLink","/","routerLinkActive","active",3,"routerLinkActiveOptions"],["mat-button","","routerLink","/shop","routerLinkActive","active"],[1,"spacer"],["mat-icon-button","","routerLink","/cart","aria-label","Carrinho","matTooltip","Carrinho","matBadgeColor","warn",3,"matBadge","matBadgeHidden"],["mat-button","",1,"user-btn",3,"matMenuTriggerFor"],[1,"user-name"],["mat-menu-item","","routerLink","/profile"],["mat-menu-item","","routerLink","/orders"],["mat-menu-item","",3,"click"],["mat-button","","routerLink","/login"],["mat-stroked-button","","routerLink","/register",1,"register-btn"]],template:function(e,t){e&1&&(l(0,"mat-toolbar",1)(1,"a",2)(2,"mat-icon"),c(3,"storefront"),m(),l(4,"span"),c(5,"Marketplace"),m()(),l(6,"nav",3)(7,"a",4),c(8," In\xEDcio "),m(),l(9,"a",5),c(10," Loja "),m()(),g(11,"span",6),$(12,Rn,28,4)(13,An,4,0),m()),e&2&&(v(7),T("routerLinkActiveOptions",Ze(2,In)),v(5),Z(t.auth.isAuthenticated()?12:13))},dependencies:[st,lt,Ut,Yt,kt,Dt,Ct,It,Et,Gt,F,Y,qt,zt,Bt,Lt,Nt,$t,Kt],styles:[".navbar[_ngcontent-%COMP%]{position:sticky;top:0;z-index:100;gap:1rem;box-shadow:0 2px 4px #0000001a}.brand[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.5rem;color:inherit;text-decoration:none;font-weight:600;font-size:1.15rem;margin-right:1.5rem}.brand[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:1.6rem;width:1.6rem;height:1.6rem}.nav-links[_ngcontent-%COMP%]{display:flex;gap:.25rem}.nav-links[_ngcontent-%COMP%]   a.active[_ngcontent-%COMP%]{background:#ffffff26}.spacer[_ngcontent-%COMP%]{flex:1}.user-btn[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.25rem}.user-name[_ngcontent-%COMP%]{max-width:140px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.register-btn[_ngcontent-%COMP%]{margin-left:.5rem}@media(max-width:600px){.nav-links[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]   span[_ngcontent-%COMP%], .user-name[_ngcontent-%COMP%]{display:none}}"]})};var le=class i{static \u0275fac=function(e){return new(e||i)};static \u0275cmp=d({type:i,selectors:[["app-root"]],decls:3,vars:0,consts:[[1,"app-main"]],template:function(e,t){e&1&&(g(0,"app-navbar"),l(1,"main",0),g(2,"router-outlet"),m())},dependencies:[rt,se],styles:[".app-main[_ngcontent-%COMP%]{min-height:calc(100vh - 64px);background:var(--mat-sys-surface)}"]})};function Pn(i){let a=i,e=Math.floor(Math.abs(i)),t=i.toString().replace(/^[^.]*\.?/,"").length,n=parseInt(i.toString().replace(/^[^e]*(e([-+]?\d+))?/,"$2"))||0;return e===Math.floor(e)&&e>=0&&e<=1?1:n===0&&e!==0&&e%1e6===0&&t===0||!(n>=0&&n<=5)?4:5}var Zt=["pt",[["AM","PM"]],void 0,[["D","S","T","Q","Q","S","S"],["dom.","seg.","ter.","qua.","qui.","sex.","s\xE1b."],["domingo","segunda-feira","ter\xE7a-feira","quarta-feira","quinta-feira","sexta-feira","s\xE1bado"],["dom.","seg.","ter.","qua.","qui.","sex.","s\xE1b."]],void 0,[["J","F","M","A","M","J","J","A","S","O","N","D"],["jan.","fev.","mar.","abr.","mai.","jun.","jul.","ago.","set.","out.","nov.","dez."],["janeiro","fevereiro","mar\xE7o","abril","maio","junho","julho","agosto","setembro","outubro","novembro","dezembro"]],void 0,[["a.C.","d.C."],void 0,["antes de Cristo","depois de Cristo"]],0,[6,0],["dd/MM/y","d 'de' MMM 'de' y","d 'de' MMMM 'de' y","EEEE, d 'de' MMMM 'de' y"],["HH:mm","HH:mm:ss","HH:mm:ss z","HH:mm:ss zzzz"],["{1} {0}",void 0,void 0,void 0],[",",".",";","%","+","-","E","\xD7","\u2030","\u221E","NaN",":"],["#,##0.###","#,##0%","\xA4\xA0#,##0.00","#E0"],"BRL","R$","Real brasileiro",{AUD:["AU$","$"],BYN:[void 0,"\u0440."],JPY:["JP\xA5","\xA5"],PHP:[void 0,"\u20B1"],PTE:["Esc."],RON:[void 0,"L"],SYP:[void 0,"S\xA3"],THB:["\u0E3F"],TWD:["NT$"],USD:["US$","$"]},"ltr",Pn];var Tn="@",Sn=(()=>{class i{doc;delegate;zone;animationType;moduleImpl;_rendererFactoryPromise=null;scheduler=null;injector=o(R);loadingSchedulerFn=o(On,{optional:!0});_engine;constructor(e,t,n,r,s){this.doc=e,this.delegate=t,this.zone=n,this.animationType=r,this.moduleImpl=s}ngOnDestroy(){this._engine?.flush()}loadImpl(){let e=()=>this.moduleImpl??import("./chunk-7LJYEPUX.js").then(n=>n),t;return this.loadingSchedulerFn?t=this.loadingSchedulerFn(e):t=e(),t.catch(n=>{throw new Re(5300,!1)}).then(({\u0275createEngine:n,\u0275AnimationRendererFactory:r})=>{this._engine=n(this.animationType,this.doc);let s=new r(this.delegate,this._engine,this.zone);return this.delegate=s,s})}createRenderer(e,t){let n=this.delegate.createRenderer(e,t);if(n.\u0275type===0)return n;typeof n.throwOnSyntheticProps=="boolean"&&(n.throwOnSyntheticProps=!1);let r=new ye(n);return t?.data?.animation&&!this._rendererFactoryPromise&&(this._rendererFactoryPromise=this.loadImpl()),this._rendererFactoryPromise?.then(s=>{let u=s.createRenderer(e,t);r.use(u),this.scheduler??=this.injector.get(Oe,null,{optional:!0}),this.scheduler?.notify(10)}).catch(s=>{r.use(n)}),r}begin(){this.delegate.begin?.()}end(){this.delegate.end?.()}whenRenderingDone(){return this.delegate.whenRenderingDone?.()??Promise.resolve()}componentReplaced(e){this._engine?.flush(),this.delegate.componentReplaced?.(e)}static \u0275fac=function(t){K()};static \u0275prov=Ae({token:i,factory:i.\u0275fac})}return i})(),ye=class{delegate;replay=[];\u0275type=1;constructor(a){this.delegate=a}use(a){if(this.delegate=a,this.replay!==null){for(let e of this.replay)e(a);this.replay=null}}get data(){return this.delegate.data}destroy(){this.replay=null,this.delegate.destroy()}createElement(a,e){return this.delegate.createElement(a,e)}createComment(a){return this.delegate.createComment(a)}createText(a){return this.delegate.createText(a)}get destroyNode(){return this.delegate.destroyNode}appendChild(a,e){this.delegate.appendChild(a,e)}insertBefore(a,e,t,n){this.delegate.insertBefore(a,e,t,n)}removeChild(a,e,t,n){this.delegate.removeChild(a,e,t,n)}selectRootElement(a,e){return this.delegate.selectRootElement(a,e)}parentNode(a){return this.delegate.parentNode(a)}nextSibling(a){return this.delegate.nextSibling(a)}setAttribute(a,e,t,n){this.delegate.setAttribute(a,e,t,n)}removeAttribute(a,e,t){this.delegate.removeAttribute(a,e,t)}addClass(a,e){this.delegate.addClass(a,e)}removeClass(a,e){this.delegate.removeClass(a,e)}setStyle(a,e,t,n){this.delegate.setStyle(a,e,t,n)}removeStyle(a,e,t){this.delegate.removeStyle(a,e,t)}setProperty(a,e,t){this.shouldReplay(e)&&this.replay.push(n=>n.setProperty(a,e,t)),this.delegate.setProperty(a,e,t)}setValue(a,e){this.delegate.setValue(a,e)}listen(a,e,t,n){return this.shouldReplay(e)&&this.replay.push(r=>r.listen(a,e,t,n)),this.delegate.listen(a,e,t,n)}shouldReplay(a){return this.replay!==null&&a.startsWith(Tn)}},On=new y("");function Jt(i="animations"){return ze("NgAsyncAnimations"),Pe([{provide:He,useFactory:()=>new Sn(o(_),o(nt),o(A),i)},{provide:Be,useValue:i==="noop"?"NoopAnimations":"BrowserAnimations"}])}var B=(i,a)=>{let e=o(h),t=o(ie);return e.isAuthenticated()?!0:t.createUrlTree(["/login"],{queryParams:{returnUrl:a.url}})};var en=[{path:"",loadComponent:()=>import("./chunk-4T76BB55.js").then(i=>i.Home),title:"In\xEDcio | Marketplace"},{path:"shop",loadComponent:()=>import("./chunk-SJJWOOCQ.js").then(i=>i.Shop),title:"Loja | Marketplace"},{path:"products/:id",loadComponent:()=>import("./chunk-FCMZ7IJ7.js").then(i=>i.ProductDetail),title:"Produto | Marketplace"},{path:"login",loadComponent:()=>import("./chunk-FKH4M5WQ.js").then(i=>i.Login),title:"Iniciar sess\xE3o | Marketplace"},{path:"register",loadComponent:()=>import("./chunk-S2TAUHGZ.js").then(i=>i.Register),title:"Registar | Marketplace"},{path:"cart",loadComponent:()=>import("./chunk-A3ZUS5ZA.js").then(i=>i.Cart),canActivate:[B],title:"Carrinho | Marketplace"},{path:"checkout",loadComponent:()=>import("./chunk-F3SO5OO4.js").then(i=>i.Checkout),canActivate:[B],title:"Finalizar encomenda | Marketplace"},{path:"orders",loadComponent:()=>import("./chunk-CXX234G6.js").then(i=>i.Orders),canActivate:[B],title:"As minhas encomendas | Marketplace"},{path:"orders/:id",loadComponent:()=>import("./chunk-VGUTER2Q.js").then(i=>i.OrderDetail),canActivate:[B],title:"Detalhe da encomenda | Marketplace"},{path:"profile",loadComponent:()=>import("./chunk-INCLWFN3.js").then(i=>i.Profile),canActivate:[B],title:"O meu perfil | Marketplace"},{path:"**",redirectTo:""}];var tn=(i,a)=>{let t=o(h).getToken();if(!i.url.startsWith(Ht.apiUrl))return a(i);let r=i.clone({withCredentials:!0});return a(t?r.clone({setHeaders:{Authorization:`Bearer ${t}`}}):r)};var nn=(i,a)=>{let e=o(h),t=o(ie),n=o(Vt),r=i.url.includes("/auth/login")||i.url.includes("/auth/register");return a(i).pipe(ke(s=>(s.status===401&&!r?(e.clearSession(),t.navigate(["/login"],{queryParams:{returnUrl:t.url}}),n.open("Sess\xE3o expirada. Por favor, inicia sess\xE3o novamente.","OK",{duration:4e3})):s.status===403?n.open("N\xE3o tens permiss\xE3o para esta a\xE7\xE3o.","OK",{duration:4e3}):s.status===0?n.open("Sem liga\xE7\xE3o ao servidor. Verifica a tua internet.","OK",{duration:4e3}):s.status>=500&&n.open("Ocorreu um erro no servidor. Tenta novamente.","OK",{duration:4e3}),Ce(()=>s))))};tt(Zt);var an={providers:[Je(),mt(en,ct()),at(ot([tn,nn])),Jt(),{provide:et,useValue:"pt"},Ue(()=>{let i=o(h);return we(i.loadCurrentUser()).catch(()=>null)})]};it(le,an).catch(i=>console.error(i));
