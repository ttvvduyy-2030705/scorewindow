import React,{memo,ReactElement}from'react';
import{Pressable,ViewStyle,GestureResponderEvent,ActivityIndicator}from'react-native';
import colors from'configuration/colors';
import View from'../View';
import styles from'./styles';
type P={children?:ReactElement|ReactElement[]|boolean;onPress:(e:GestureResponderEvent)=>void;onLongPress?:(e:GestureResponderEvent)=>void;style?:ViewStyle|ViewStyle[];disable?:boolean;isLoading?:boolean;showGradientColors?:boolean;centerChildren?:boolean;loadingColor?:string;gradientColors?:string[];gradientStyle?:ViewStyle;disableStyle?:ViewStyle|ViewStyle[]};
const B=(p:P)=>{const center=p.centerChildren?styles.center:undefined;const dis=p.disable?(p.disableStyle?[styles.disable,p.disableStyle]:styles.disable):undefined;const child=p.isLoading?<View style={[styles.fullWidth,styles.disable,center,p.gradientStyle]} alignItems={'center'} justify={'center'} paddingVertical={'15'}><ActivityIndicator size={10} color={p.loadingColor||colors.white}/></View>:p.children;return <Pressable style={[styles.container,center,p.style,dis]} onPress={p.onPress} onLongPress={p.onLongPress} disabled={p.disable}>{child}</Pressable>};
export default memo(B);
