import React,{memo,forwardRef,ReactNode}from'react';
import{View as RNView,ViewStyle,StyleProp,LayoutChangeEvent}from'react-native';
const sp:any={5:5,10:10,15:15,20:20};
const fl:any={0:0,1:1,2:2,3:3,4:4,6:6,8:8,10:10};
const al:any={start:'flex-start',end:'flex-end',center:'center'};
const js:any={start:'flex-start',end:'flex-end',center:'center',between:'space-between',around:'space-around'};
type P={children?:ReactNode;style?:StyleProp<ViewStyle>;onLayout?:(e:LayoutChangeEvent)=>void;alignItems?:'start'|'end'|'center';direction?:'row'|'column';flex?:'0'|'1'|'2'|'3'|'4'|'6'|'8'|'10';justify?:'start'|'end'|'center'|'between'|'around';margin?:'5'|'10'|'15'|'20';marginHorizontal?:'5'|'10'|'15'|'20';marginVertical?:'5'|'10'|'15'|'20';marginTop?:'5'|'10'|'15'|'20';marginLeft?:'5'|'10'|'15'|'20';marginBottom?:'5'|'10'|'15'|'20';marginRight?:'5'|'10'|'15'|'20';padding?:'5'|'10'|'15'|'20';paddingHorizontal?:'5'|'10'|'15'|'20';paddingVertical?:'5'|'10'|'15'|'20';paddingTop?:'5'|'10'|'15'|'20';paddingLeft?:'5'|'10'|'15'|'20';paddingBottom?:'5'|'10'|'15'|'20';paddingRight?:'5'|'10'|'15'|'20';linearColors?:string[];linearEffect?:any;collapsable?:boolean};
const V=forwardRef<RNView,P>((p,ref)=>{const s:any={alignItems:al[p.alignItems||'start'],flexDirection:p.direction||'column',justifyContent:js[p.justify||'start']};if(p.flex)s.flex=fl[p.flex];['margin','marginHorizontal','marginVertical','marginTop','marginLeft','marginBottom','marginRight','padding','paddingHorizontal','paddingVertical','paddingTop','paddingLeft','paddingBottom','paddingRight'].forEach(k=>{const v=(p as any)[k];if(v)s[k]=sp[v]});return <RNView ref={ref} style={[s,p.style]} onLayout={p.onLayout} collapsable={p.collapsable}>{p.children}</RNView>});
export default memo(V);
