import{a as ti}from"./chunk-4ZSVYFPA.js";import{a as oi}from"./chunk-A6PVQWW5.js";import{a as Yt,b as Xt,c as Jt,d as Zt,e as ei}from"./chunk-6XVCTD5U.js";import{a as oe,b as Qt,c as Ut}from"./chunk-W5FIHHGG.js";import{a as Dt,b as Et}from"./chunk-7YX3KTYC.js";import{a as Tt,d as zt,f as Ft,g as Rt,h as ae,i as qt,j as $t}from"./chunk-ZLRH5TPD.js";import{a as ni,b as ai}from"./chunk-THPEE26W.js";import{a as ii}from"./chunk-CUTGDD7Y.js";import{a as St,b as Mt}from"./chunk-UCF5QG7U.js";import{b as Ct}from"./chunk-6EQOVOSI.js";import{j as _t,l as bt,n as vt,r as yt,t as _e,u as be,v as xt}from"./chunk-UOCA7V2G.js";import{a as kt,c as wt,e as Pt,h as It,j as At,k as Lt,l as Vt,m as Nt,n as Bt,o as jt,r as Gt,s as re,u as Wt,v as Ht,w as Kt}from"./chunk-JL53TIZ2.js";import{A as ie,G as at,H as ot,N as rt,P as K,Q as lt,S as q,T as st,U as fe,Y as ct,aa as dt,ca as pt,da as mt,e as Xe,ea as ut,fa as ht,ga as ne,ha as gt,ia as ft,ja as Ot,k as Je,n as Ze,p as et,q as tt,w as it,z as nt}from"./chunk-ZJG5WI6W.js";import{$ as X,$b as E,A as Pe,Ab as f,Bb as je,Ca as J,Cb as j,D as Y,Db as G,E as ue,Eb as u,Ec as H,Fb as a,Gb as o,Hb as _,Hc as b,I as Ie,Ic as R,J as De,L as Ee,Ob as k,Pb as Ge,R as Te,T as he,Tb as h,U as $,V as P,Vb as m,Wb as Z,X as ze,Xa as s,Xb as W,Yb as We,Zb as ee,_b as D,aa as N,ca as I,db as Le,dc as te,ea as d,fc as V,gc as He,hc as c,ic as x,j as C,ja as S,jc as w,ka as M,kb as F,kc as Ke,l as we,la as L,lb as B,lc as ge,ma as Fe,mc as qe,na as Re,nc as Q,oc as $e,pb as Ve,qc as Qe,ra as z,sb as Ne,v as me,va as v,xb as Be,xc as Ue,yb as y,za as Ae,zb as g,zc as Ye}from"./chunk-K6DSINYI.js";var mi=["text"],ui=[[["mat-icon"]],"*"],hi=["mat-icon","*"];function gi(n,r){if(n&1&&_(0,"mat-pseudo-checkbox",1),n&2){let e=m();u("disabled",e.disabled)("state",e.selected?"checked":"unchecked")}}function fi(n,r){if(n&1&&_(0,"mat-pseudo-checkbox",3),n&2){let e=m();u("disabled",e.disabled)}}function _i(n,r){if(n&1&&(a(0,"span",4),c(1),o()),n&2){let e=m();s(),w("(",e.group.label,")")}}var ye=new I("MAT_OPTION_PARENT_COMPONENT"),xe=new I("MatOptgroup");var ve=class{source;isUserInput;constructor(r,e=!1){this.source=r,this.isUserInput=e}},A=(()=>{class n{_element=d(J);_changeDetectorRef=d(H);_parent=d(ye,{optional:!0});group=d(xe,{optional:!0});_signalDisableRipple=!1;_selected=!1;_active=!1;_mostRecentViewValue="";get multiple(){return this._parent&&this._parent.multiple}get selected(){return this._selected}value;id=d(q).getId("mat-option-");get disabled(){return this.group&&this.group.disabled||this._disabled()}set disabled(e){this._disabled.set(e)}_disabled=v(!1);get disableRipple(){return this._signalDisableRipple?this._parent.disableRipple():!!this._parent?.disableRipple}get hideSingleSelectionIndicator(){return!!(this._parent&&this._parent.hideSingleSelectionIndicator)}onSelectionChange=new z;_text;_stateChanges=new C;constructor(){let e=d(at);e.load(pt),e.load(ot),this._signalDisableRipple=!!this._parent&&Ne(this._parent.disableRipple)}get active(){return this._active}get viewValue(){return(this._text?.nativeElement.textContent||"").trim()}select(e=!0){this._selected||(this._selected=!0,this._changeDetectorRef.markForCheck(),e&&this._emitSelectionChangeEvent())}deselect(e=!0){this._selected&&(this._selected=!1,this._changeDetectorRef.markForCheck(),e&&this._emitSelectionChangeEvent())}focus(e,t){let i=this._getHostElement();typeof i.focus=="function"&&i.focus(t)}setActiveStyles(){this._active||(this._active=!0,this._changeDetectorRef.markForCheck())}setInactiveStyles(){this._active&&(this._active=!1,this._changeDetectorRef.markForCheck())}getLabel(){return this.viewValue}_handleKeydown(e){(e.keyCode===13||e.keyCode===32)&&!K(e)&&(this._selectViaInteraction(),e.preventDefault())}_selectViaInteraction(){this.disabled||(this._selected=this.multiple?!this._selected:!0,this._changeDetectorRef.markForCheck(),this._emitSelectionChangeEvent(!0))}_getTabIndex(){return this.disabled?"-1":"0"}_getHostElement(){return this._element.nativeElement}ngAfterViewChecked(){if(this._selected){let e=this.viewValue;e!==this._mostRecentViewValue&&(this._mostRecentViewValue&&this._stateChanges.next(),this._mostRecentViewValue=e)}}ngOnDestroy(){this._stateChanges.complete()}_emitSelectionChangeEvent(e=!1){this.onSelectionChange.emit(new ve(this,e))}static \u0275fac=function(t){return new(t||n)};static \u0275cmp=F({type:n,selectors:[["mat-option"]],viewQuery:function(t,i){if(t&1&&ee(mi,7),t&2){let l;D(l=E())&&(i._text=l.first)}},hostAttrs:["role","option",1,"mat-mdc-option","mdc-list-item"],hostVars:11,hostBindings:function(t,i){t&1&&h("click",function(){return i._selectViaInteraction()})("keydown",function(p){return i._handleKeydown(p)}),t&2&&(Ge("id",i.id),y("aria-selected",i.selected)("aria-disabled",i.disabled.toString()),V("mdc-list-item--selected",i.selected)("mat-mdc-option-multiple",i.multiple)("mat-mdc-option-active",i.active)("mdc-list-item--disabled",i.disabled))},inputs:{value:"value",id:"id",disabled:[2,"disabled","disabled",b]},outputs:{onSelectionChange:"onSelectionChange"},exportAs:["matOption"],ngContentSelectors:hi,decls:8,vars:5,consts:[["text",""],["aria-hidden","true",1,"mat-mdc-option-pseudo-checkbox",3,"disabled","state"],[1,"mdc-list-item__primary-text"],["state","checked","aria-hidden","true","appearance","minimal",1,"mat-mdc-option-pseudo-checkbox",3,"disabled"],[1,"cdk-visually-hidden"],["aria-hidden","true","mat-ripple","",1,"mat-mdc-option-ripple","mat-focus-indicator",3,"matRippleTrigger","matRippleDisabled"]],template:function(t,i){t&1&&(Z(ui),g(0,gi,1,2,"mat-pseudo-checkbox",1),W(1),a(2,"span",2,0),W(4,1),o(),g(5,fi,1,1,"mat-pseudo-checkbox",3),g(6,_i,2,1,"span",4),_(7,"div",5)),t&2&&(f(i.multiple?0:-1),s(5),f(!i.multiple&&i.selected&&!i.hideSingleSelectionIndicator?5:-1),s(),f(i.group&&i.group._inert?6:-1),s(),u("matRippleTrigger",i._getHostElement())("matRippleDisabled",i.disabled||i.disableRipple))},dependencies:[ni,dt],styles:[`.mat-mdc-option {
  -webkit-user-select: none;
  user-select: none;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-start;
  overflow: hidden;
  min-height: 48px;
  padding: 0 16px;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  color: var(--mat-option-label-text-color, var(--mat-sys-on-surface));
  font-family: var(--mat-option-label-text-font, var(--mat-sys-label-large-font));
  line-height: var(--mat-option-label-text-line-height, var(--mat-sys-label-large-line-height));
  font-size: var(--mat-option-label-text-size, var(--mat-sys-body-large-size));
  letter-spacing: var(--mat-option-label-text-tracking, var(--mat-sys-label-large-tracking));
  font-weight: var(--mat-option-label-text-weight, var(--mat-sys-body-large-weight));
}
.mat-mdc-option:hover:not(.mdc-list-item--disabled) {
  background-color: var(--mat-option-hover-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-hover-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-option:focus.mdc-list-item, .mat-mdc-option.mat-mdc-option-active.mdc-list-item {
  background-color: var(--mat-option-focus-state-layer-color, color-mix(in srgb, var(--mat-sys-on-surface) calc(var(--mat-sys-focus-state-layer-opacity) * 100%), transparent));
  outline: 0;
}
.mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-active, .mat-mdc-option-multiple, :focus, :hover) {
  background-color: var(--mat-option-selected-state-layer-color, var(--mat-sys-secondary-container));
}
.mat-mdc-option.mdc-list-item--selected:not(.mdc-list-item--disabled):not(.mat-mdc-option-active, .mat-mdc-option-multiple, :focus, :hover) .mdc-list-item__primary-text {
  color: var(--mat-option-selected-state-label-text-color, var(--mat-sys-on-secondary-container));
}
.mat-mdc-option .mat-pseudo-checkbox {
  --mat-pseudo-checkbox-minimal-selected-checkmark-color: var(--mat-option-selected-state-label-text-color, var(--mat-sys-on-secondary-container));
}
.mat-mdc-option.mdc-list-item {
  align-items: center;
  background: transparent;
}
.mat-mdc-option.mdc-list-item--disabled {
  cursor: default;
  pointer-events: none;
}
.mat-mdc-option.mdc-list-item--disabled .mat-mdc-option-pseudo-checkbox, .mat-mdc-option.mdc-list-item--disabled .mdc-list-item__primary-text, .mat-mdc-option.mdc-list-item--disabled > mat-icon {
  opacity: 0.38;
}
.mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple) {
  padding-left: 32px;
}
[dir=rtl] .mat-mdc-optgroup .mat-mdc-option:not(.mat-mdc-option-multiple) {
  padding-left: 16px;
  padding-right: 32px;
}
.mat-mdc-option .mat-icon,
.mat-mdc-option .mat-pseudo-checkbox-full {
  margin-right: 16px;
  flex-shrink: 0;
}
[dir=rtl] .mat-mdc-option .mat-icon,
[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-full {
  margin-right: 0;
  margin-left: 16px;
}
.mat-mdc-option .mat-pseudo-checkbox-minimal {
  margin-left: 16px;
  flex-shrink: 0;
}
[dir=rtl] .mat-mdc-option .mat-pseudo-checkbox-minimal {
  margin-right: 16px;
  margin-left: 0;
}
.mat-mdc-option .mat-mdc-option-ripple {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
}
.mat-mdc-option .mdc-list-item__primary-text {
  white-space: normal;
  font-size: inherit;
  font-weight: inherit;
  letter-spacing: inherit;
  line-height: inherit;
  font-family: inherit;
  text-decoration: inherit;
  text-transform: inherit;
  margin-right: auto;
}
[dir=rtl] .mat-mdc-option .mdc-list-item__primary-text {
  margin-right: 0;
  margin-left: auto;
}
@media (forced-colors: active) {
  .mat-mdc-option.mdc-list-item--selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after {
    content: "";
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translateY(-50%);
    width: 10px;
    height: 0;
    border-bottom: solid 10px;
    border-radius: 10px;
  }
  [dir=rtl] .mat-mdc-option.mdc-list-item--selected:not(:has(.mat-mdc-option-pseudo-checkbox))::after {
    right: auto;
    left: 16px;
  }
}

.mat-mdc-option-multiple {
  --mat-list-list-item-selected-container-color: var(--mat-list-list-item-container-color, transparent);
}

.mat-mdc-option-active .mat-focus-indicator::before {
  content: "";
}
`],encapsulation:2,changeDetection:0})}return n})();function ri(n,r,e){if(e.length){let t=r.toArray(),i=e.toArray(),l=0;for(let p=0;p<n+1;p++)t[p].group&&t[p].group===i[l]&&l++;return l}return 0}function li(n,r,e,t){return n<e?n:n+r>e+t?Math.max(0,n-t+r):e}var Ce=(()=>{class n{static \u0275fac=function(t){return new(t||n)};static \u0275mod=B({type:n});static \u0275inj=N({imports:[ut,ai,A,ie]})}return n})();var Ci=["trigger"],Si=["panel"],Mi=[[["mat-select-trigger"]],"*"],Oi=["mat-select-trigger","*"];function ki(n,r){if(n&1&&(a(0,"span",4),c(1),o()),n&2){let e=m();s(),x(e.placeholder)}}function wi(n,r){n&1&&W(0)}function Pi(n,r){if(n&1&&(a(0,"span",11),c(1),o()),n&2){let e=m(2);s(),x(e.triggerValue)}}function Ii(n,r){if(n&1&&(a(0,"span",5),g(1,wi,1,0)(2,Pi,2,1,"span",11),o()),n&2){let e=m();s(),f(e.customTrigger?1:2)}}function Di(n,r){if(n&1){let e=k();a(0,"div",12,1),h("keydown",function(i){S(e);let l=m();return M(l._handleKeydown(i))}),W(2,1),o()}if(n&2){let e=m();He(e.panelClass),V("mat-select-panel-animations-enabled",!e._animationsDisabled)("mat-primary",(e._parentFormField==null?null:e._parentFormField.color)==="primary")("mat-accent",(e._parentFormField==null?null:e._parentFormField.color)==="accent")("mat-warn",(e._parentFormField==null?null:e._parentFormField.color)==="warn")("mat-undefined",!(e._parentFormField!=null&&e._parentFormField.color)),y("id",e.id+"-panel")("aria-multiselectable",e.multiple)("aria-label",e.ariaLabel||null)("aria-labelledby",e._getPanelAriaLabelledby())}}var Ei=new I("mat-select-scroll-strategy",{providedIn:"root",factory:()=>{let n=d(Re);return()=>vt(n)}}),Ti=new I("MAT_SELECT_CONFIG"),zi=new I("MatSelectTrigger"),Se=class{source;value;constructor(r,e){this.source=r,this.value=e}},ce=(()=>{class n{_viewportRuler=d(_t);_changeDetectorRef=d(H);_elementRef=d(J);_dir=d(nt,{optional:!0});_idGenerator=d(q);_renderer=d(Le);_parentFormField=d(Rt,{optional:!0});ngControl=d(Vt,{self:!0,optional:!0});_liveAnnouncer=d(rt);_defaultOptions=d(Ti,{optional:!0});_animationsDisabled=ct();_popoverLocation;_initialized=new C;_cleanupDetach;options;optionGroups;customTrigger;_positions=[{originX:"start",originY:"bottom",overlayX:"start",overlayY:"top"},{originX:"end",originY:"bottom",overlayX:"end",overlayY:"top"},{originX:"start",originY:"top",overlayX:"start",overlayY:"bottom",panelClass:"mat-mdc-select-panel-above"},{originX:"end",originY:"top",overlayX:"end",overlayY:"bottom",panelClass:"mat-mdc-select-panel-above"}];_scrollOptionIntoView(e){let t=this.options.toArray()[e];if(t){let i=this.panel.nativeElement,l=ri(e,this.options,this.optionGroups),p=t._getHostElement();e===0&&l===1?i.scrollTop=0:i.scrollTop=li(p.offsetTop,p.offsetHeight,i.scrollTop,i.offsetHeight)}}_positioningSettled(){this._scrollOptionIntoView(this._keyManager.activeItemIndex||0)}_getChangeEvent(e){return new Se(this,e)}_scrollStrategyFactory=d(Ei);_panelOpen=!1;_compareWith=(e,t)=>e===t;_uid=this._idGenerator.getId("mat-select-");_triggerAriaLabelledBy=null;_previousControl;_destroy=new C;_errorStateTracker;stateChanges=new C;disableAutomaticLabeling=!0;userAriaDescribedBy;_selectionModel;_keyManager;_preferredOverlayOrigin;_overlayWidth;_onChange=()=>{};_onTouched=()=>{};_valueId=this._idGenerator.getId("mat-select-value-");_scrollStrategy;_overlayPanelClass=this._defaultOptions?.overlayPanelClass||"";get focused(){return this._focused||this._panelOpen}_focused=!1;controlType="mat-select";trigger;panel;_overlayDir;panelClass;disabled=!1;get disableRipple(){return this._disableRipple()}set disableRipple(e){this._disableRipple.set(e)}_disableRipple=v(!1);tabIndex=0;get hideSingleSelectionIndicator(){return this._hideSingleSelectionIndicator}set hideSingleSelectionIndicator(e){this._hideSingleSelectionIndicator=e,this._syncParentProperties()}_hideSingleSelectionIndicator=this._defaultOptions?.hideSingleSelectionIndicator??!1;get placeholder(){return this._placeholder}set placeholder(e){this._placeholder=e,this.stateChanges.next()}_placeholder;get required(){return this._required??this.ngControl?.control?.hasValidator(Lt.required)??!1}set required(e){this._required=e,this.stateChanges.next()}_required;get multiple(){return this._multiple}set multiple(e){this._selectionModel,this._multiple=e}_multiple=!1;disableOptionCentering=this._defaultOptions?.disableOptionCentering??!1;get compareWith(){return this._compareWith}set compareWith(e){this._compareWith=e,this._selectionModel&&this._initializeSelection()}get value(){return this._value}set value(e){this._assignValue(e)&&this._onChange(e)}_value;ariaLabel="";ariaLabelledby;get errorStateMatcher(){return this._errorStateTracker.matcher}set errorStateMatcher(e){this._errorStateTracker.matcher=e}typeaheadDebounceInterval;sortComparator;get id(){return this._id}set id(e){this._id=e||this._uid,this.stateChanges.next()}_id;get errorState(){return this._errorStateTracker.errorState}set errorState(e){this._errorStateTracker.errorState=e}panelWidth=this._defaultOptions&&typeof this._defaultOptions.panelWidth<"u"?this._defaultOptions.panelWidth:"auto";canSelectNullableOptions=this._defaultOptions?.canSelectNullableOptions??!1;optionSelectionChanges=Pe(()=>{let e=this.options;return e?e.changes.pipe(he(e),$(()=>Y(...e.map(t=>t.onSelectionChange)))):this._initialized.pipe($(()=>this.optionSelectionChanges))});openedChange=new z;_openedStream=this.openedChange.pipe(ue(e=>e),me(()=>{}));_closedStream=this.openedChange.pipe(ue(e=>!e),me(()=>{}));selectionChange=new z;valueChange=new z;constructor(){let e=d(qt),t=d(jt,{optional:!0}),i=d(re,{optional:!0}),l=d(new Ye("tabindex"),{optional:!0}),p=d(yt,{optional:!0});this.ngControl&&(this.ngControl.valueAccessor=this),this._defaultOptions?.typeaheadDebounceInterval!=null&&(this.typeaheadDebounceInterval=this._defaultOptions.typeaheadDebounceInterval),this._errorStateTracker=new $t(e,this.ngControl,i,t,this.stateChanges),this._scrollStrategy=this._scrollStrategyFactory(),this.tabIndex=l==null?0:parseInt(l)||0,this._popoverLocation=p?.usePopover===!1?null:"inline",this.id=this.id}ngOnInit(){this._selectionModel=new ii(this.multiple),this.stateChanges.next(),this._viewportRuler.change().pipe(P(this._destroy)).subscribe(()=>{this.panelOpen&&(this._overlayWidth=this._getOverlayWidth(this._preferredOverlayOrigin),this._changeDetectorRef.detectChanges())})}ngAfterContentInit(){this._initialized.next(),this._initialized.complete(),this._initKeyManager(),this._selectionModel.changed.pipe(P(this._destroy)).subscribe(e=>{e.added.forEach(t=>t.select()),e.removed.forEach(t=>t.deselect())}),this.options.changes.pipe(he(null),P(this._destroy)).subscribe(()=>{this._resetOptions(),this._initializeSelection()})}ngDoCheck(){let e=this._getTriggerAriaLabelledby(),t=this.ngControl;if(e!==this._triggerAriaLabelledBy){let i=this._elementRef.nativeElement;this._triggerAriaLabelledBy=e,e?i.setAttribute("aria-labelledby",e):i.removeAttribute("aria-labelledby")}t&&(this._previousControl!==t.control&&(this._previousControl!==void 0&&t.disabled!==null&&t.disabled!==this.disabled&&(this.disabled=t.disabled),this._previousControl=t.control),this.updateErrorState())}ngOnChanges(e){(e.disabled||e.userAriaDescribedBy)&&this.stateChanges.next(),e.typeaheadDebounceInterval&&this._keyManager&&this._keyManager.withTypeAhead(this.typeaheadDebounceInterval),e.panelClass&&this.panelClass instanceof Set&&(this.panelClass=Array.from(this.panelClass))}ngOnDestroy(){this._cleanupDetach?.(),this._keyManager?.destroy(),this._destroy.next(),this._destroy.complete(),this.stateChanges.complete(),this._clearFromModal()}toggle(){this.panelOpen?this.close():this.open()}open(){this._canOpen()&&(this._parentFormField&&(this._preferredOverlayOrigin=this._parentFormField.getConnectedOverlayOrigin()),this._cleanupDetach?.(),this._overlayWidth=this._getOverlayWidth(this._preferredOverlayOrigin),this._applyModalPanelOwnership(),this._panelOpen=!0,this._overlayDir.positionChange.pipe(De(1)).subscribe(()=>{this._changeDetectorRef.detectChanges(),this._positioningSettled()}),this._overlayDir.attachOverlay(),this._keyManager.withHorizontalOrientation(null),this._highlightCorrectOption(),this._changeDetectorRef.markForCheck(),this.stateChanges.next(),Promise.resolve().then(()=>this.openedChange.emit(!0)))}_trackedModal=null;_applyModalPanelOwnership(){let e=this._elementRef.nativeElement.closest('body > .cdk-overlay-container [aria-modal="true"]');if(!e)return;let t=`${this.id}-panel`;this._trackedModal&&fe(this._trackedModal,"aria-owns",t),st(e,"aria-owns",t),this._trackedModal=e}_clearFromModal(){if(!this._trackedModal)return;let e=`${this.id}-panel`;fe(this._trackedModal,"aria-owns",e),this._trackedModal=null}close(){this._panelOpen&&(this._panelOpen=!1,this._exitAndDetach(),this._keyManager.withHorizontalOrientation(this._isRtl()?"rtl":"ltr"),this._changeDetectorRef.markForCheck(),this._onTouched(),this.stateChanges.next(),Promise.resolve().then(()=>this.openedChange.emit(!1)))}_exitAndDetach(){if(this._animationsDisabled||!this.panel){this._detachOverlay();return}this._cleanupDetach?.(),this._cleanupDetach=()=>{t(),clearTimeout(i),this._cleanupDetach=void 0};let e=this.panel.nativeElement,t=this._renderer.listen(e,"animationend",l=>{l.animationName==="_mat-select-exit"&&(this._cleanupDetach?.(),this._detachOverlay())}),i=setTimeout(()=>{this._cleanupDetach?.(),this._detachOverlay()},200);e.classList.add("mat-select-panel-exit")}_detachOverlay(){this._overlayDir.detachOverlay(),this._changeDetectorRef.markForCheck()}writeValue(e){this._assignValue(e)}registerOnChange(e){this._onChange=e}registerOnTouched(e){this._onTouched=e}setDisabledState(e){this.disabled=e,this._changeDetectorRef.markForCheck(),this.stateChanges.next()}get panelOpen(){return this._panelOpen}get selected(){return this.multiple?this._selectionModel?.selected||[]:this._selectionModel?.selected[0]}get triggerValue(){if(this.empty)return"";if(this._multiple){let e=this._selectionModel.selected.map(t=>t.viewValue);return this._isRtl()&&e.reverse(),e.join(", ")}return this._selectionModel.selected[0].viewValue}updateErrorState(){this._errorStateTracker.updateErrorState()}_isRtl(){return this._dir?this._dir.value==="rtl":!1}_handleKeydown(e){this.disabled||(this.panelOpen?this._handleOpenKeydown(e):this._handleClosedKeydown(e))}_handleClosedKeydown(e){let t=e.keyCode,i=t===40||t===38||t===37||t===39,l=t===13||t===32,p=this._keyManager;if(!p.isTyping()&&l&&!K(e)||(this.multiple||e.altKey)&&i)e.preventDefault(),this.open();else if(!this.multiple){let T=this.selected;p.onKeydown(e);let O=this.selected;O&&T!==O&&this._liveAnnouncer.announce(O.viewValue,1e4)}}_handleOpenKeydown(e){let t=this._keyManager,i=e.keyCode,l=i===40||i===38,p=t.isTyping();if(l&&e.altKey)e.preventDefault(),this.close();else if(!p&&(i===13||i===32)&&t.activeItem&&!K(e))e.preventDefault(),t.activeItem._selectViaInteraction();else if(!p&&this._multiple&&i===65&&e.ctrlKey){e.preventDefault();let T=this.options.some(O=>!O.disabled&&!O.selected);this.options.forEach(O=>{O.disabled||(T?O.select():O.deselect())})}else{let T=t.activeItemIndex;t.onKeydown(e),this._multiple&&l&&e.shiftKey&&t.activeItem&&t.activeItemIndex!==T&&t.activeItem._selectViaInteraction()}}_handleOverlayKeydown(e){e.keyCode===27&&!K(e)&&(e.preventDefault(),this.close())}_onFocus(){this.disabled||(this._focused=!0,this.stateChanges.next())}_onBlur(){this._focused=!1,this._keyManager?.cancelTypeahead(),!this.disabled&&!this.panelOpen&&(this._onTouched(),this._changeDetectorRef.markForCheck(),this.stateChanges.next())}get empty(){return!this._selectionModel||this._selectionModel.isEmpty()}_initializeSelection(){Promise.resolve().then(()=>{this.ngControl&&(this._value=this.ngControl.value),this._setSelectionByValue(this._value),this.stateChanges.next()})}_setSelectionByValue(e){if(this.options.forEach(t=>t.setInactiveStyles()),this._selectionModel.clear(),this.multiple&&e)Array.isArray(e),e.forEach(t=>this._selectOptionByValue(t)),this._sortValues();else{let t=this._selectOptionByValue(e);t?this._keyManager.updateActiveItem(t):this.panelOpen||this._keyManager.updateActiveItem(-1)}this._changeDetectorRef.markForCheck()}_selectOptionByValue(e){let t=this.options.find(i=>{if(this._selectionModel.isSelected(i))return!1;try{return(i.value!=null||this.canSelectNullableOptions)&&this._compareWith(i.value,e)}catch{return!1}});return t&&this._selectionModel.select(t),t}_assignValue(e){return e!==this._value||this._multiple&&Array.isArray(e)?(this.options&&this._setSelectionByValue(e),this._value=e,!0):!1}_skipPredicate=e=>this.panelOpen?!1:e.disabled;_getOverlayWidth(e){return this.panelWidth==="auto"?(e instanceof _e?e.elementRef:e||this._elementRef).nativeElement.getBoundingClientRect().width:this.panelWidth===null?"":this.panelWidth}_syncParentProperties(){if(this.options)for(let e of this.options)e._changeDetectorRef.markForCheck()}_initKeyManager(){this._keyManager=new lt(this.options).withTypeAhead(this.typeaheadDebounceInterval).withVerticalOrientation().withHorizontalOrientation(this._isRtl()?"rtl":"ltr").withHomeAndEnd().withPageUpDown().withAllowedModifierKeys(["shiftKey"]).skipPredicate(this._skipPredicate),this._keyManager.tabOut.subscribe(()=>{this.panelOpen&&(!this.multiple&&this._keyManager.activeItem&&this._keyManager.activeItem._selectViaInteraction(),this.focus(),this.close())}),this._keyManager.change.subscribe(()=>{this._panelOpen&&this.panel?this._scrollOptionIntoView(this._keyManager.activeItemIndex||0):!this._panelOpen&&!this.multiple&&this._keyManager.activeItem&&this._keyManager.activeItem._selectViaInteraction()})}_resetOptions(){let e=Y(this.options.changes,this._destroy);this.optionSelectionChanges.pipe(P(e)).subscribe(t=>{this._onSelect(t.source,t.isUserInput),t.isUserInput&&!this.multiple&&this._panelOpen&&(this.close(),this.focus())}),Y(...this.options.map(t=>t._stateChanges)).pipe(P(e)).subscribe(()=>{this._changeDetectorRef.detectChanges(),this.stateChanges.next()})}_onSelect(e,t){let i=this._selectionModel.isSelected(e);!this.canSelectNullableOptions&&e.value==null&&!this._multiple?(e.deselect(),this._selectionModel.clear(),this.value!=null&&this._propagateChanges(e.value)):(i!==e.selected&&(e.selected?this._selectionModel.select(e):this._selectionModel.deselect(e)),t&&this._keyManager.setActiveItem(e),this.multiple&&(this._sortValues(),t&&this.focus())),i!==this._selectionModel.isSelected(e)&&this._propagateChanges(),this.stateChanges.next()}_sortValues(){if(this.multiple){let e=this.options.toArray();this._selectionModel.sort((t,i)=>this.sortComparator?this.sortComparator(t,i,e):e.indexOf(t)-e.indexOf(i)),this.stateChanges.next()}}_propagateChanges(e){let t;this.multiple?t=this.selected.map(i=>i.value):t=this.selected?this.selected.value:e,this._value=t,this.valueChange.emit(t),this._onChange(t),this.selectionChange.emit(this._getChangeEvent(t)),this._changeDetectorRef.markForCheck()}_highlightCorrectOption(){if(this._keyManager)if(this.empty){let e=-1;for(let t=0;t<this.options.length;t++)if(!this.options.get(t).disabled){e=t;break}this._keyManager.setActiveItem(e)}else this._keyManager.setActiveItem(this._selectionModel.selected[0])}_canOpen(){return!this._panelOpen&&!this.disabled&&this.options?.length>0&&!!this._overlayDir}focus(e){this._elementRef.nativeElement.focus(e)}_getPanelAriaLabelledby(){if(this.ariaLabel)return null;let e=this._parentFormField?.getLabelId()||null,t=e?e+" ":"";return this.ariaLabelledby?t+this.ariaLabelledby:e}_getAriaActiveDescendant(){return this.panelOpen&&this._keyManager&&this._keyManager.activeItem?this._keyManager.activeItem.id:null}_getTriggerAriaLabelledby(){if(this.ariaLabel)return null;let e=this._parentFormField?.getLabelId()||"";return this.ariaLabelledby&&(e+=" "+this.ariaLabelledby),e||(e=this._valueId),e}get describedByIds(){return this._elementRef.nativeElement.getAttribute("aria-describedby")?.split(" ")||[]}setDescribedByIds(e){let t=this._elementRef.nativeElement;e.length?t.setAttribute("aria-describedby",e.join(" ")):t.removeAttribute("aria-describedby")}onContainerClick(e){let t=it(e);t&&(t.tagName==="MAT-OPTION"||t.classList.contains("cdk-overlay-backdrop")||t.closest(".mat-mdc-select-panel"))||(this.focus(),this.open())}get shouldLabelFloat(){return this.panelOpen||!this.empty||this.focused&&!!this.placeholder}static \u0275fac=function(t){return new(t||n)};static \u0275cmp=F({type:n,selectors:[["mat-select"]],contentQueries:function(t,i,l){if(t&1&&We(l,zi,5)(l,A,5)(l,xe,5),t&2){let p;D(p=E())&&(i.customTrigger=p.first),D(p=E())&&(i.options=p),D(p=E())&&(i.optionGroups=p)}},viewQuery:function(t,i){if(t&1&&ee(Ci,5)(Si,5)(be,5),t&2){let l;D(l=E())&&(i.trigger=l.first),D(l=E())&&(i.panel=l.first),D(l=E())&&(i._overlayDir=l.first)}},hostAttrs:["role","combobox","aria-haspopup","listbox",1,"mat-mdc-select"],hostVars:21,hostBindings:function(t,i){t&1&&h("keydown",function(p){return i._handleKeydown(p)})("focus",function(){return i._onFocus()})("blur",function(){return i._onBlur()}),t&2&&(y("id",i.id)("tabindex",i.disabled?-1:i.tabIndex)("aria-controls",i.panelOpen?i.id+"-panel":null)("aria-expanded",i.panelOpen)("aria-label",i.ariaLabel||null)("aria-required",i.required.toString())("aria-disabled",i.disabled.toString())("aria-invalid",i.errorState)("aria-activedescendant",i._getAriaActiveDescendant()),V("mat-mdc-select-disabled",i.disabled)("mat-mdc-select-invalid",i.errorState)("mat-mdc-select-required",i.required)("mat-mdc-select-empty",i.empty)("mat-mdc-select-multiple",i.multiple)("mat-select-open",i.panelOpen))},inputs:{userAriaDescribedBy:[0,"aria-describedby","userAriaDescribedBy"],panelClass:"panelClass",disabled:[2,"disabled","disabled",b],disableRipple:[2,"disableRipple","disableRipple",b],tabIndex:[2,"tabIndex","tabIndex",e=>e==null?0:R(e)],hideSingleSelectionIndicator:[2,"hideSingleSelectionIndicator","hideSingleSelectionIndicator",b],placeholder:"placeholder",required:[2,"required","required",b],multiple:[2,"multiple","multiple",b],disableOptionCentering:[2,"disableOptionCentering","disableOptionCentering",b],compareWith:"compareWith",value:"value",ariaLabel:[0,"aria-label","ariaLabel"],ariaLabelledby:[0,"aria-labelledby","ariaLabelledby"],errorStateMatcher:"errorStateMatcher",typeaheadDebounceInterval:[2,"typeaheadDebounceInterval","typeaheadDebounceInterval",R],sortComparator:"sortComparator",id:"id",panelWidth:"panelWidth",canSelectNullableOptions:[2,"canSelectNullableOptions","canSelectNullableOptions",b]},outputs:{openedChange:"openedChange",_openedStream:"opened",_closedStream:"closed",selectionChange:"selectionChange",valueChange:"valueChange"},exportAs:["matSelect"],features:[ge([{provide:Ft,useExisting:n},{provide:ye,useExisting:n}]),Ae],ngContentSelectors:Oi,decls:11,vars:10,consts:[["fallbackOverlayOrigin","cdkOverlayOrigin","trigger",""],["panel",""],["cdk-overlay-origin","",1,"mat-mdc-select-trigger",3,"click"],[1,"mat-mdc-select-value"],[1,"mat-mdc-select-placeholder","mat-mdc-select-min-line"],[1,"mat-mdc-select-value-text"],[1,"mat-mdc-select-arrow-wrapper"],[1,"mat-mdc-select-arrow"],["viewBox","0 0 24 24","width","24px","height","24px","focusable","false","aria-hidden","true"],["d","M7 10l5 5 5-5z"],["cdk-connected-overlay","","cdkConnectedOverlayHasBackdrop","","cdkConnectedOverlayBackdropClass","cdk-overlay-transparent-backdrop",3,"detach","backdropClick","overlayKeydown","cdkConnectedOverlayDisableClose","cdkConnectedOverlayPanelClass","cdkConnectedOverlayScrollStrategy","cdkConnectedOverlayOrigin","cdkConnectedOverlayPositions","cdkConnectedOverlayWidth","cdkConnectedOverlayFlexibleDimensions","cdkConnectedOverlayUsePopover"],[1,"mat-mdc-select-min-line"],["role","listbox","tabindex","-1",1,"mat-mdc-select-panel","mdc-menu-surface","mdc-menu-surface--open",3,"keydown"]],template:function(t,i){if(t&1&&(Z(Mi),a(0,"div",2,0),h("click",function(){return i.open()}),a(3,"div",3),g(4,ki,2,1,"span",4)(5,Ii,3,1,"span",5),o(),a(6,"div",6)(7,"div",7),L(),a(8,"svg",8),_(9,"path",9),o()()()(),Ve(10,Di,3,16,"ng-template",10),h("detach",function(){return i.close()})("backdropClick",function(){return i.close()})("overlayKeydown",function(p){return i._handleOverlayKeydown(p)})),t&2){let l=te(1);s(3),y("id",i._valueId),s(),f(i.empty?4:5),s(6),u("cdkConnectedOverlayDisableClose",!0)("cdkConnectedOverlayPanelClass",i._overlayPanelClass)("cdkConnectedOverlayScrollStrategy",i._scrollStrategy)("cdkConnectedOverlayOrigin",i._preferredOverlayOrigin||l)("cdkConnectedOverlayPositions",i._positions)("cdkConnectedOverlayWidth",i._overlayWidth)("cdkConnectedOverlayFlexibleDimensions",!0)("cdkConnectedOverlayUsePopover",i._popoverLocation)}},dependencies:[_e,be],styles:[`@keyframes _mat-select-enter {
  from {
    opacity: 0;
    transform: scaleY(0.8);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes _mat-select-exit {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.mat-mdc-select {
  display: inline-block;
  width: 100%;
  outline: none;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  color: var(--mat-select-enabled-trigger-text-color, var(--mat-sys-on-surface));
  font-family: var(--mat-select-trigger-text-font, var(--mat-sys-body-large-font));
  line-height: var(--mat-select-trigger-text-line-height, var(--mat-sys-body-large-line-height));
  font-size: var(--mat-select-trigger-text-size, var(--mat-sys-body-large-size));
  font-weight: var(--mat-select-trigger-text-weight, var(--mat-sys-body-large-weight));
  letter-spacing: var(--mat-select-trigger-text-tracking, var(--mat-sys-body-large-tracking));
}

div.mat-mdc-select-panel {
  box-shadow: var(--mat-select-container-elevation-shadow, 0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12));
}

.mat-mdc-select-disabled {
  color: var(--mat-select-disabled-trigger-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-mdc-select-disabled .mat-mdc-select-placeholder {
  color: var(--mat-select-disabled-trigger-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}

.mat-mdc-select-trigger {
  display: inline-flex;
  align-items: center;
  cursor: pointer;
  position: relative;
  box-sizing: border-box;
  width: 100%;
}
.mat-mdc-select-disabled .mat-mdc-select-trigger {
  -webkit-user-select: none;
  user-select: none;
  cursor: default;
}

.mat-mdc-select-value {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mat-mdc-select-value-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.mat-mdc-select-arrow-wrapper {
  height: 24px;
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
}
.mat-form-field-appearance-fill .mdc-text-field--no-label .mat-mdc-select-arrow-wrapper {
  transform: none;
}

.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-invalid .mat-mdc-select-arrow,
.mat-form-field-invalid:not(.mat-form-field-disabled) .mat-mdc-form-field-infix::after {
  color: var(--mat-select-invalid-arrow-color, var(--mat-sys-error));
}

.mat-mdc-select-arrow {
  width: 10px;
  height: 5px;
  position: relative;
  color: var(--mat-select-enabled-arrow-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-form-field.mat-focused .mat-mdc-select-arrow {
  color: var(--mat-select-focused-arrow-color, var(--mat-sys-primary));
}
.mat-mdc-form-field .mat-mdc-select.mat-mdc-select-disabled .mat-mdc-select-arrow {
  color: var(--mat-select-disabled-arrow-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-select-open .mat-mdc-select-arrow {
  transform: rotate(180deg);
}
.mat-form-field-animations-enabled .mat-mdc-select-arrow {
  transition: transform 80ms linear;
}
.mat-mdc-select-arrow svg {
  fill: currentColor;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
@media (forced-colors: active) {
  .mat-mdc-select-arrow svg {
    fill: CanvasText;
  }
  .mat-mdc-select-disabled .mat-mdc-select-arrow svg {
    fill: GrayText;
  }
}

div.mat-mdc-select-panel {
  width: 100%;
  max-height: 275px;
  outline: 0;
  overflow: auto;
  padding: 8px 0;
  box-sizing: border-box;
  transform-origin: top center;
  border-radius: 0 0 4px 4px;
  position: relative;
  background-color: var(--mat-select-panel-background-color, var(--mat-sys-surface-container));
}
.mat-mdc-select-panel-above div.mat-mdc-select-panel {
  border-radius: 4px 4px 0 0;
  transform-origin: bottom center;
}
@media (forced-colors: active) {
  div.mat-mdc-select-panel {
    outline: solid 1px;
  }
}

.mat-select-panel-animations-enabled {
  animation: _mat-select-enter 120ms cubic-bezier(0, 0, 0.2, 1);
}
.mat-select-panel-animations-enabled.mat-select-panel-exit {
  animation: _mat-select-exit 100ms linear;
}

.mat-mdc-select-placeholder {
  transition: color 400ms 133.3333333333ms cubic-bezier(0.25, 0.8, 0.25, 1);
  color: var(--mat-select-placeholder-text-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-form-field:not(.mat-form-field-animations-enabled) .mat-mdc-select-placeholder, ._mat-animation-noopable .mat-mdc-select-placeholder {
  transition: none;
}
.mat-form-field-hide-placeholder .mat-mdc-select-placeholder {
  color: transparent;
  -webkit-text-fill-color: transparent;
  transition: none;
  display: block;
}

.mat-mdc-form-field-type-mat-select:not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper {
  cursor: pointer;
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mat-mdc-floating-label {
  max-width: calc(100% - 18px);
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-fill .mdc-floating-label--float-above {
  max-width: calc(100% / 0.75 - 24px);
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-notched-outline__notch {
  max-width: calc(100% - 60px);
}
.mat-mdc-form-field-type-mat-select.mat-form-field-appearance-outline .mdc-text-field--label-floating .mdc-notched-outline__notch {
  max-width: calc(100% - 24px);
}

.mat-mdc-select-min-line:empty::before {
  content: " ";
  white-space: pre;
  width: 1px;
  display: inline-block;
  visibility: hidden;
}

.mat-form-field-appearance-fill .mat-mdc-select-arrow-wrapper {
  transform: var(--mat-select-arrow-transform, translateY(-8px));
}
`],encapsulation:2,changeDetection:0})}return n})();var de=(()=>{class n{static \u0275fac=function(t){return new(t||n)};static \u0275mod=B({type:n});static \u0275inj=N({imports:[xt,Ce,ie,bt,oe,Ce]})}return n})();function Ri(n,r){if(n&1&&(a(0,"mat-option",17),c(1),o()),n&2){let e=r.$implicit;u("value",e),s(),w(" ",e," ")}}function Ai(n,r){if(n&1){let e=k();a(0,"mat-form-field",14)(1,"mat-select",16,0),h("selectionChange",function(i){S(e);let l=m(2);return M(l._changePageSize(i.value))}),j(3,Ri,2,2,"mat-option",17,je),o(),a(5,"div",18),h("click",function(){S(e);let i=te(2);return M(i.open())}),o()()}if(n&2){let e=m(2);u("appearance",e._formFieldAppearance)("color",e.color),s(),u("value",e.pageSize)("disabled",e.disabled),Be("aria-labelledby",e._pageSizeLabelId),u("panelClass",e.selectConfig.panelClass||"")("disableOptionCentering",e.selectConfig.disableOptionCentering),s(2),G(e._displayedPageSizeOptions)}}function Li(n,r){if(n&1&&(a(0,"div",15),c(1),o()),n&2){let e=m(2);s(),x(e.pageSize)}}function Vi(n,r){if(n&1&&(a(0,"div",3)(1,"div",13),c(2),o(),g(3,Ai,6,7,"mat-form-field",14),g(4,Li,2,1,"div",15),o()),n&2){let e=m();s(),y("id",e._pageSizeLabelId),s(),w(" ",e._intl.itemsPerPageLabel," "),s(),f(e._displayedPageSizeOptions.length>1?3:-1),s(),f(e._displayedPageSizeOptions.length<=1?4:-1)}}function Ni(n,r){if(n&1){let e=k();a(0,"button",19),h("click",function(){S(e);let i=m();return M(i._buttonClicked(0,i._previousButtonsDisabled()))}),L(),a(1,"svg",8),_(2,"path",20),o()()}if(n&2){let e=m();u("matTooltip",e._intl.firstPageLabel)("matTooltipDisabled",e._previousButtonsDisabled())("disabled",e._previousButtonsDisabled())("tabindex",e._previousButtonsDisabled()?-1:null),y("aria-label",e._intl.firstPageLabel)}}function Bi(n,r){if(n&1){let e=k();a(0,"button",21),h("click",function(){S(e);let i=m();return M(i._buttonClicked(i.getNumberOfPages()-1,i._nextButtonsDisabled()))}),L(),a(1,"svg",8),_(2,"path",22),o()()}if(n&2){let e=m();u("matTooltip",e._intl.lastPageLabel)("matTooltipDisabled",e._nextButtonsDisabled())("disabled",e._nextButtonsDisabled())("tabindex",e._nextButtonsDisabled()?-1:null),y("aria-label",e._intl.lastPageLabel)}}var ji=(()=>{class n{changes=new C;itemsPerPageLabel="Items per page:";nextPageLabel="Next page";previousPageLabel="Previous page";firstPageLabel="First page";lastPageLabel="Last page";getRangeLabel=(e,t,i)=>{if(i==0||t==0)return`0 of ${i}`;i=Math.max(i,0);let l=e*t,p=l<i?Math.min(l+t,i):l+t;return`${l+1} \u2013 ${p} of ${i}`};static \u0275fac=function(t){return new(t||n)};static \u0275prov=X({token:n,factory:n.\u0275fac,providedIn:"root"})}return n})(),Gi=50;var Wi=new I("MAT_PAGINATOR_DEFAULT_OPTIONS"),Me=(()=>{class n{_intl=d(ji);_changeDetectorRef=d(H);_formFieldAppearance;_pageSizeLabelId=d(q).getId("mat-paginator-page-size-label-");_intlChanges;_isInitialized=!1;_initializedStream=new we(1);color;get pageIndex(){return this._pageIndex}set pageIndex(e){this._pageIndex=Math.max(e||0,0),this._changeDetectorRef.markForCheck()}_pageIndex=0;get length(){return this._length}set length(e){this._length=e||0,this._changeDetectorRef.markForCheck()}_length=0;get pageSize(){return this._pageSize}set pageSize(e){this._pageSize=Math.max(e||0,0),this._updateDisplayedPageSizeOptions()}_pageSize;get pageSizeOptions(){return this._pageSizeOptions}set pageSizeOptions(e){this._pageSizeOptions=(e||[]).map(t=>R(t,0)),this._updateDisplayedPageSizeOptions()}_pageSizeOptions=[];hidePageSize=!1;showFirstLastButtons=!1;selectConfig={};disabled=!1;page=new z;_displayedPageSizeOptions;initialized=this._initializedStream;constructor(){let e=this._intl,t=d(Wi,{optional:!0});if(this._intlChanges=e.changes.subscribe(()=>this._changeDetectorRef.markForCheck()),t){let{pageSize:i,pageSizeOptions:l,hidePageSize:p,showFirstLastButtons:T}=t;i!=null&&(this._pageSize=i),l!=null&&(this._pageSizeOptions=l),p!=null&&(this.hidePageSize=p),T!=null&&(this.showFirstLastButtons=T)}this._formFieldAppearance=t?.formFieldAppearance||"outline"}ngOnInit(){this._isInitialized=!0,this._updateDisplayedPageSizeOptions(),this._initializedStream.next()}ngOnDestroy(){this._initializedStream.complete(),this._intlChanges.unsubscribe()}nextPage(){this.hasNextPage()&&this._navigate(this.pageIndex+1)}previousPage(){this.hasPreviousPage()&&this._navigate(this.pageIndex-1)}firstPage(){this.hasPreviousPage()&&this._navigate(0)}lastPage(){this.hasNextPage()&&this._navigate(this.getNumberOfPages()-1)}hasPreviousPage(){return this.pageIndex>=1&&this.pageSize!=0}hasNextPage(){let e=this.getNumberOfPages()-1;return this.pageIndex<e&&this.pageSize!=0}getNumberOfPages(){return this.pageSize?Math.ceil(this.length/this.pageSize):0}_changePageSize(e){let t=this.pageIndex*this.pageSize,i=this.pageIndex;this.pageIndex=Math.floor(t/e)||0,this.pageSize=e,this._emitPageEvent(i)}_nextButtonsDisabled(){return this.disabled||!this.hasNextPage()}_previousButtonsDisabled(){return this.disabled||!this.hasPreviousPage()}_updateDisplayedPageSizeOptions(){this._isInitialized&&(this.pageSize||(this._pageSize=this.pageSizeOptions.length!=0?this.pageSizeOptions[0]:Gi),this._displayedPageSizeOptions=this.pageSizeOptions.slice(),this._displayedPageSizeOptions.indexOf(this.pageSize)===-1&&this._displayedPageSizeOptions.push(this.pageSize),this._displayedPageSizeOptions.sort((e,t)=>e-t),this._changeDetectorRef.markForCheck())}_emitPageEvent(e){this.page.emit({previousPageIndex:e,pageIndex:this.pageIndex,pageSize:this.pageSize,length:this.length})}_navigate(e){let t=this.pageIndex;e!==t&&(this.pageIndex=e,this._emitPageEvent(t))}_buttonClicked(e,t){t||this._navigate(e)}static \u0275fac=function(t){return new(t||n)};static \u0275cmp=F({type:n,selectors:[["mat-paginator"]],hostAttrs:["role","group",1,"mat-mdc-paginator"],inputs:{color:"color",pageIndex:[2,"pageIndex","pageIndex",R],length:[2,"length","length",R],pageSize:[2,"pageSize","pageSize",R],pageSizeOptions:"pageSizeOptions",hidePageSize:[2,"hidePageSize","hidePageSize",b],showFirstLastButtons:[2,"showFirstLastButtons","showFirstLastButtons",b],selectConfig:"selectConfig",disabled:[2,"disabled","disabled",b]},outputs:{page:"page"},exportAs:["matPaginator"],decls:14,vars:14,consts:[["selectRef",""],[1,"mat-mdc-paginator-outer-container"],[1,"mat-mdc-paginator-container"],[1,"mat-mdc-paginator-page-size"],[1,"mat-mdc-paginator-range-actions"],["aria-atomic","true","aria-live","polite","role","status",1,"mat-mdc-paginator-range-label"],["matIconButton","","type","button","matTooltipPosition","above","disabledInteractive","",1,"mat-mdc-paginator-navigation-first",3,"matTooltip","matTooltipDisabled","disabled","tabindex"],["matIconButton","","type","button","matTooltipPosition","above","disabledInteractive","",1,"mat-mdc-paginator-navigation-previous",3,"click","matTooltip","matTooltipDisabled","disabled","tabindex"],["viewBox","0 0 24 24","focusable","false","aria-hidden","true",1,"mat-mdc-paginator-icon"],["d","M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"],["matIconButton","","type","button","matTooltipPosition","above","disabledInteractive","",1,"mat-mdc-paginator-navigation-next",3,"click","matTooltip","matTooltipDisabled","disabled","tabindex"],["d","M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"],["matIconButton","","type","button","matTooltipPosition","above","disabledInteractive","",1,"mat-mdc-paginator-navigation-last",3,"matTooltip","matTooltipDisabled","disabled","tabindex"],["aria-hidden","true",1,"mat-mdc-paginator-page-size-label"],[1,"mat-mdc-paginator-page-size-select",3,"appearance","color"],[1,"mat-mdc-paginator-page-size-value"],["hideSingleSelectionIndicator","",3,"selectionChange","value","disabled","aria-labelledby","panelClass","disableOptionCentering"],[3,"value"],[1,"mat-mdc-paginator-touch-target",3,"click"],["matIconButton","","type","button","matTooltipPosition","above","disabledInteractive","",1,"mat-mdc-paginator-navigation-first",3,"click","matTooltip","matTooltipDisabled","disabled","tabindex"],["d","M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z"],["matIconButton","","type","button","matTooltipPosition","above","disabledInteractive","",1,"mat-mdc-paginator-navigation-last",3,"click","matTooltip","matTooltipDisabled","disabled","tabindex"],["d","M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"]],template:function(t,i){t&1&&(a(0,"div",1)(1,"div",2),g(2,Vi,5,4,"div",3),a(3,"div",4)(4,"div",5),c(5),o(),g(6,Ni,3,5,"button",6),a(7,"button",7),h("click",function(){return i._buttonClicked(i.pageIndex-1,i._previousButtonsDisabled())}),L(),a(8,"svg",8),_(9,"path",9),o()(),Fe(),a(10,"button",10),h("click",function(){return i._buttonClicked(i.pageIndex+1,i._nextButtonsDisabled())}),L(),a(11,"svg",8),_(12,"path",11),o()(),g(13,Bi,3,5,"button",12),o()()()),t&2&&(s(2),f(i.hidePageSize?-1:2),s(3),w(" ",i._intl.getRangeLabel(i.pageIndex,i.pageSize,i.length)," "),s(),f(i.showFirstLastButtons?6:-1),s(),u("matTooltip",i._intl.previousPageLabel)("matTooltipDisabled",i._previousButtonsDisabled())("disabled",i._previousButtonsDisabled())("tabindex",i._previousButtonsDisabled()?-1:null),y("aria-label",i._intl.previousPageLabel),s(3),u("matTooltip",i._intl.nextPageLabel)("matTooltipDisabled",i._nextButtonsDisabled())("disabled",i._nextButtonsDisabled())("tabindex",i._nextButtonsDisabled()?-1:null),y("aria-label",i._intl.nextPageLabel),s(3),f(i.showFirstLastButtons?13:-1))},dependencies:[ae,ce,A,mt,St],styles:[`.mat-mdc-paginator {
  display: block;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  color: var(--mat-paginator-container-text-color, var(--mat-sys-on-surface));
  background-color: var(--mat-paginator-container-background-color, var(--mat-sys-surface));
  font-family: var(--mat-paginator-container-text-font, var(--mat-sys-body-small-font));
  line-height: var(--mat-paginator-container-text-line-height, var(--mat-sys-body-small-line-height));
  font-size: var(--mat-paginator-container-text-size, var(--mat-sys-body-small-size));
  font-weight: var(--mat-paginator-container-text-weight, var(--mat-sys-body-small-weight));
  letter-spacing: var(--mat-paginator-container-text-tracking, var(--mat-sys-body-small-tracking));
  --mat-form-field-container-height: var(--mat-paginator-form-field-container-height, 40px);
  --mat-form-field-container-vertical-padding: var(--mat-paginator-form-field-container-vertical-padding, 8px);
}
.mat-mdc-paginator .mat-mdc-select-value {
  font-size: var(--mat-paginator-select-trigger-text-size, var(--mat-sys-body-small-size));
}
.mat-mdc-paginator .mat-mdc-form-field-subscript-wrapper {
  display: none;
}
.mat-mdc-paginator .mat-mdc-select {
  line-height: 1.5;
}

.mat-mdc-paginator-outer-container {
  display: flex;
}

.mat-mdc-paginator-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 8px;
  flex-wrap: wrap;
  width: 100%;
  min-height: var(--mat-paginator-container-size, 56px);
}

.mat-mdc-paginator-page-size {
  display: flex;
  align-items: baseline;
  margin-right: 8px;
}
[dir=rtl] .mat-mdc-paginator-page-size {
  margin-right: 0;
  margin-left: 8px;
}

.mat-mdc-paginator-page-size-label {
  margin: 0 4px;
}

.mat-mdc-paginator-page-size-select {
  margin: 0 4px;
  width: var(--mat-paginator-page-size-select-width, 84px);
}

.mat-mdc-paginator-range-label {
  margin: 0 32px 0 24px;
}

.mat-mdc-paginator-range-actions {
  display: flex;
  align-items: center;
}

.mat-mdc-paginator-icon {
  display: inline-block;
  width: 28px;
  fill: var(--mat-paginator-enabled-icon-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-icon-button[aria-disabled] .mat-mdc-paginator-icon {
  fill: var(--mat-paginator-disabled-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
[dir=rtl] .mat-mdc-paginator-icon {
  transform: rotate(180deg);
}

@media (forced-colors: active) {
  .mat-mdc-icon-button[aria-disabled] .mat-mdc-paginator-icon,
  .mat-mdc-paginator-icon {
    fill: currentColor;
  }
  .mat-mdc-paginator-range-actions .mat-mdc-icon-button {
    outline: solid 1px;
  }
  .mat-mdc-paginator-range-actions .mat-mdc-icon-button[aria-disabled] {
    color: GrayText;
  }
}
.mat-mdc-paginator-touch-target {
  display: var(--mat-paginator-touch-target-display, block);
  position: absolute;
  top: 50%;
  left: 50%;
  width: var(--mat-paginator-page-size-select-width, 84px);
  height: var(--mat-paginator-page-size-select-touch-target-height, 48px);
  background-color: transparent;
  transform: translate(-50%, -50%);
  cursor: pointer;
}
`],encapsulation:2,changeDetection:0})}return n})(),di=(()=>{class n{static \u0275fac=function(t){return new(t||n)};static \u0275mod=B({type:n});static \u0275inj=N({imports:[ne,de,Mt,Me]})}return n})();var pe=class n{http=d(Je);baseUrl=`${Ot.apiUrl}/categories`;cache$;list(){return this.cache$||(this.cache$=this.http.get(this.baseUrl).pipe(Te(1))),this.cache$}invalidate(){this.cache$=void 0}static \u0275fac=function(e){return new(e||n)};static \u0275prov=X({token:n,factory:n.\u0275fac,providedIn:"root"})};var Ki=()=>[12,24,48],Oe=n=>["/products",n],qi=n=>[n,"EUR","symbol","1.2-2","pt"],ke=(n,r)=>r._id;function $i(n,r){if(n&1&&(a(0,"mat-option",7),c(1),o()),n&2){let e=r.$implicit;u("value",e.name),s(),x(e.name)}}function Qi(n,r){if(n&1&&(a(0,"mat-option",7),c(1),o()),n&2){let e=r.$implicit;u("value",e._id),s(),x(e.name)}}function Ui(n,r){if(n&1&&(a(0,"p",15),c(1),o()),n&2){let e=m();s(),Ke(" ",e.total()," ",e.total()===1?"produto encontrado":"produtos encontrados"," ")}}function Yi(n,r){if(n&1){let e=k();a(0,"mat-chip-set")(1,"mat-chip",18),h("removed",function(){S(e);let i=m();return M(i.clearSupermarketFilter())}),a(2,"mat-icon",19),c(3,"storefront"),o(),c(4),a(5,"button",20)(6,"mat-icon"),c(7,"cancel"),o()()()()}if(n&2){let e=m();s(4),w(" ",e.selectedSupermarketName()," ")}}function Xi(n,r){n&1&&(a(0,"div",16),_(1,"mat-spinner",21),a(2,"p"),c(3,"A pesquisar produtos\u2026"),o()())}function Ji(n,r){if(n&1){let e=k();a(0,"div",17)(1,"mat-icon"),c(2,"search_off"),o(),a(3,"p"),c(4,"N\xE3o foram encontrados produtos com estes crit\xE9rios."),o(),a(5,"button",22),h("click",function(){S(e);let i=m();return M(i.clearFilters())}),c(6,"Limpar filtros"),o()()}}function Zi(n,r){if(n&1&&(a(0,"mat-card",24)(1,"a",26)(2,"mat-icon"),c(3,"shopping_basket"),o()(),a(4,"mat-card-content")(5,"a",27),c(6),o(),a(7,"p",28),c(8),o(),a(9,"p",29)(10,"mat-icon",30),c(11,"storefront"),o(),a(12,"span"),c(13),o()(),a(14,"p",31)(15,"strong"),c(16),$e(17,"currency"),o(),a(18,"span",32),c(19),o()()(),a(20,"mat-card-actions")(21,"a",33),c(22," Ver detalhes "),o(),a(23,"span",34),c(24),o()()()),n&2){let e=r.$implicit,t=m(2);s(),u("routerLink",Q(17,Oe,e._id)),s(4),u("routerLink",Q(19,Oe,e._id)),s(),x(e.name),s(2),x(e.category),s(5),x(t.supermarketNameOf(e)),s(3),x(Qe(17,11,Q(21,qi,e.price))),s(3),w("/ ",e.priceUnit),s(2),u("routerLink",Q(23,Oe,e._id)),s(2),V("low",e.stock<5),s(),w(" ",e.stock," em stock ")}}function en(n,r){if(n&1){let e=k();a(0,"div",23),j(1,Zi,25,25,"mat-card",24,ke),o(),a(3,"mat-paginator",25),h("page",function(i){S(e);let l=m();return M(l.onPage(i))}),o()}if(n&2){let e=m();s(),G(e.products()),s(2),u("length",e.total())("pageSize",e.pageSize())("pageIndex",e.page()-1)("pageSizeOptions",qe(4,Ki))}}var pi=class n{productService=d(oi);categoryService=d(pe);supermarketService=d(ti);route=d(Ze);router=d(et);fb=d(Wt);destroy$=new C;trigger$=new C;loading=v(!1);products=v([]);total=v(0);page=v(1);pageSize=v(12);categories=v([]);supermarkets=v([]);filterForm=this.fb.nonNullable.group({search:[""],category:[""],supermarketId:[""],sort:[""]});selectedSupermarketName=Ue(()=>{let r=this.filterForm.controls.supermarketId.value;return r?this.supermarkets().find(e=>e._id===r)?.name??null:null});ngOnInit(){this.categoryService.list().subscribe(e=>this.categories.set(e)),this.supermarketService.list().subscribe(e=>this.supermarkets.set(e));let r=this.route.snapshot.queryParamMap;this.filterForm.patchValue({search:r.get("search")??"",category:r.get("category")??"",supermarketId:r.get("supermarketId")??"",sort:r.get("sort")??""},{emitEvent:!1}),r.get("page")&&this.page.set(Number(r.get("page"))||1),this.filterForm.valueChanges.pipe(Ie(300),Ee((e,t)=>JSON.stringify(e)===JSON.stringify(t)),P(this.destroy$)).subscribe(()=>{this.page.set(1),this.runQuery()}),this.trigger$.pipe(ze(()=>this.loading.set(!0)),$(e=>this.productService.list(e)),P(this.destroy$)).subscribe({next:e=>{this.products.set(e.products),this.total.set(e.total),this.loading.set(!1)},error:()=>this.loading.set(!1)}),this.runQuery()}ngOnDestroy(){this.destroy$.next(),this.destroy$.complete()}runQuery(){let r=this.filterForm.getRawValue(),e={search:r.search.trim()||void 0,category:r.category||void 0,supermarketId:r.supermarketId||void 0,sort:r.sort||void 0,page:this.page(),limit:this.pageSize()};this.router.navigate([],{relativeTo:this.route,queryParams:{search:e.search??null,category:e.category??null,supermarketId:e.supermarketId??null,sort:e.sort??null,page:this.page()>1?this.page():null},queryParamsHandling:"merge",replaceUrl:!0}),this.trigger$.next(e)}onPage(r){this.page.set(r.pageIndex+1),this.pageSize.set(r.pageSize),this.runQuery()}clearFilters(){this.filterForm.reset({search:"",category:"",supermarketId:"",sort:""})}clearSupermarketFilter(){this.filterForm.patchValue({supermarketId:""})}supermarketNameOf(r){return typeof r.supermarketId=="string"?this.supermarkets().find(e=>e._id===r.supermarketId)?.name??"\u2014":r.supermarketId.name}static \u0275fac=function(e){return new(e||n)};static \u0275cmp=F({type:n,selectors:[["app-shop"]],decls:50,vars:4,consts:[[1,"shop-layout"],[1,"filters",3,"formGroup"],["appearance","outline"],["matPrefix",""],["matInput","","formControlName","search","placeholder","Ex.: leite, p\xE3o..."],["formControlName","category"],["value",""],[3,"value"],["formControlName","supermarketId"],["formControlName","sort"],["value","price_asc"],["value","price_desc"],["mat-stroked-button","","type","button",3,"click"],[1,"results"],[1,"results-header"],[1,"result-count"],[1,"state"],[1,"state","empty"],[3,"removed"],["matChipAvatar",""],["matChipRemove","","aria-label","Remover filtro"],["diameter","48"],["mat-stroked-button","",3,"click"],[1,"grid"],["appearance","outlined",1,"product-card"],["showFirstLastButtons","",3,"page","length","pageSize","pageIndex","pageSizeOptions"],[1,"product-image",3,"routerLink"],[1,"product-name",3,"routerLink"],[1,"category"],[1,"supermarket"],["inline",""],[1,"price"],[1,"unit"],["mat-button","","color","primary",3,"routerLink"],[1,"stock"]],template:function(e,t){e&1&&(a(0,"div",0)(1,"aside",1)(2,"h2"),c(3,"Filtros"),o(),a(4,"mat-form-field",2)(5,"mat-label"),c(6,"Pesquisar produto"),o(),a(7,"mat-icon",3),c(8,"search"),o(),_(9,"input",4),o(),a(10,"mat-form-field",2)(11,"mat-label"),c(12,"Categoria"),o(),a(13,"mat-select",5)(14,"mat-option",6),c(15,"Todas as categorias"),o(),j(16,$i,2,2,"mat-option",7,ke),o()(),a(18,"mat-form-field",2)(19,"mat-label"),c(20,"Supermercado"),o(),a(21,"mat-select",8)(22,"mat-option",6),c(23,"Todos os supermercados"),o(),j(24,Qi,2,2,"mat-option",7,ke),o()(),a(26,"mat-form-field",2)(27,"mat-label"),c(28,"Ordenar por pre\xE7o"),o(),a(29,"mat-select",9)(30,"mat-option",6),c(31,"Sem ordena\xE7\xE3o"),o(),a(32,"mat-option",10),c(33,"Pre\xE7o \u2014 do mais barato"),o(),a(34,"mat-option",11),c(35,"Pre\xE7o \u2014 do mais caro"),o()()(),a(36,"button",12),h("click",function(){return t.clearFilters()}),a(37,"mat-icon"),c(38,"refresh"),o(),c(39," Limpar filtros "),o()(),a(40,"section",13)(41,"header",14)(42,"div")(43,"h1"),c(44,"Cat\xE1logo"),o(),g(45,Ui,2,2,"p",15),o(),g(46,Yi,8,1,"mat-chip-set"),o(),g(47,Xi,4,0,"div",16)(48,Ji,7,0,"div",17)(49,en,4,5),o()()),e&2&&(s(),u("formGroup",t.filterForm),s(15),G(t.categories()),s(8),G(t.supermarkets()),s(21),f(t.loading()?-1:45),s(),f(t.selectedSupermarketName()?46:-1),s(),f(t.loading()?47:t.products().length===0?48:49))},dependencies:[Ht,At,Nt,Bt,Kt,re,Gt,tt,It,kt,Pt,wt,ne,ht,ft,gt,oe,ae,Tt,zt,Ut,Qt,de,ce,A,Et,Dt,di,Me,ei,Jt,Yt,Xt,Zt,Ct,Xe],styles:["[_nghost-%COMP%]{display:block;max-width:1280px;margin:0 auto;padding:2rem 1.5rem}.shop-layout[_ngcontent-%COMP%]{display:grid;grid-template-columns:260px 1fr;gap:2rem;align-items:start}@media(max-width:900px){.shop-layout[_ngcontent-%COMP%]{grid-template-columns:1fr}}.filters[_ngcontent-%COMP%]{position:sticky;top:80px;display:flex;flex-direction:column;gap:.5rem;padding:1.25rem;background:var(--mat-sys-surface-container-low);border:1px solid var(--mat-sys-outline-variant);border-radius:8px}.filters[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%]{margin:0 0 .5rem;font-size:1rem;font-weight:600;color:var(--mat-sys-on-surface-variant);text-transform:uppercase;letter-spacing:.05em}.filters[_ngcontent-%COMP%]   mat-form-field[_ngcontent-%COMP%]{width:100%}.filters[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{margin-top:.5rem}@media(max-width:900px){.filters[_ngcontent-%COMP%]{position:static}}.results[_ngcontent-%COMP%]{min-width:0}.results-header[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;margin-bottom:1.5rem;flex-wrap:wrap}.results-header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:1.5rem;font-weight:600;margin:0 0 .25rem}.results-header[_ngcontent-%COMP%]   .result-count[_ngcontent-%COMP%]{margin:0;color:var(--mat-sys-on-surface-variant);font-size:.9rem}.state[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;gap:1rem;padding:4rem 1rem;color:var(--mat-sys-on-surface-variant);text-align:center}.state[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:3rem;width:3rem;height:3rem;opacity:.5}.grid[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:1rem;margin-bottom:1.5rem}.product-card[_ngcontent-%COMP%]{display:flex;flex-direction:column;transition:transform .15s ease,box-shadow .15s ease}.product-card[_ngcontent-%COMP%]:hover{transform:translateY(-2px);box-shadow:0 4px 12px #00000014}.product-card[_ngcontent-%COMP%]   .product-image[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;height:140px;background:var(--mat-sys-surface-container);border-bottom:1px solid var(--mat-sys-outline-variant);color:var(--mat-sys-on-surface-variant);text-decoration:none}.product-card[_ngcontent-%COMP%]   .product-image[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:3rem;width:3rem;height:3rem}.product-card[_ngcontent-%COMP%]   mat-card-content[_ngcontent-%COMP%]{flex:1;padding-top:1rem!important}.product-card[_ngcontent-%COMP%]   .product-name[_ngcontent-%COMP%]{display:block;font-weight:600;font-size:1rem;color:inherit;text-decoration:none;margin-bottom:.25rem;line-height:1.3}.product-card[_ngcontent-%COMP%]   .product-name[_ngcontent-%COMP%]:hover{color:var(--mat-sys-primary)}.product-card[_ngcontent-%COMP%]   .category[_ngcontent-%COMP%]{font-size:.75rem;text-transform:uppercase;letter-spacing:.05em;color:var(--mat-sys-on-surface-variant);margin:0 0 .5rem}.product-card[_ngcontent-%COMP%]   .supermarket[_ngcontent-%COMP%]{display:flex;align-items:center;gap:.3rem;margin:0 0 .75rem;font-size:.85rem;color:var(--mat-sys-on-surface-variant)}.product-card[_ngcontent-%COMP%]   .supermarket[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%]{font-size:1rem;width:1rem;height:1rem}.product-card[_ngcontent-%COMP%]   .price[_ngcontent-%COMP%]{margin:0;font-size:1.2rem}.product-card[_ngcontent-%COMP%]   .price[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%]{color:var(--mat-sys-primary)}.product-card[_ngcontent-%COMP%]   .price[_ngcontent-%COMP%]   .unit[_ngcontent-%COMP%]{font-size:.8rem;color:var(--mat-sys-on-surface-variant);margin-left:.25rem}.product-card[_ngcontent-%COMP%]   mat-card-actions[_ngcontent-%COMP%]{display:flex;justify-content:space-between;align-items:center;padding:0 .5rem .75rem 1rem}.product-card[_ngcontent-%COMP%]   .stock[_ngcontent-%COMP%]{font-size:.75rem;color:var(--mat-sys-on-surface-variant);font-weight:500}.product-card[_ngcontent-%COMP%]   .stock.low[_ngcontent-%COMP%]{color:var(--mat-sys-error)}mat-paginator[_ngcontent-%COMP%]{background:transparent}"]})};export{pi as Shop};
