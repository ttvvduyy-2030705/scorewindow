import React,{forwardRef,memo,useEffect}from'react';
import{Image,StyleSheet}from'react-native';
import View from'components/View';import Text from'components/Text';import images from'assets';import colors from'configuration/colors';
type P={setIsCameraReady?:(v:boolean)=>void};
const AplusVideo=(p:P,_r:React.LegacyRef<any>)=>{useEffect(()=>{p.setIsCameraReady?.(false)},[p]);return <View style={s.c} alignItems={'center'} justify={'center'}><Image source={images.logoclb} style={s.logo} resizeMode={'contain'}/><View marginTop={'10'}><Text color={colors.white} fontSize={16} textAlign={'center'}>Camera Windows chưa hỗ trợ</Text></View><View marginTop={'5'}><Text color={colors.gray} fontSize={12} textAlign={'center'}>Đang dùng fallback để gameplay không crash</Text></View></View>};
const s=StyleSheet.create({c:{flex:1,width:'100%',minHeight:180,backgroundColor:colors.black},logo:{width:140,height:90}});
export default memo(forwardRef(AplusVideo));
