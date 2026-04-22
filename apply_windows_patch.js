const fs = require('fs');
const path = require('path');

const root = process.cwd();
const W = (file, content) => {
  const p = path.join(root, file);
  fs.mkdirSync(path.dirname(p), {recursive: true});
  fs.writeFileSync(p, content.trimStart().replace(/\n/g, '\r\n'), 'utf8');
  console.log('[write]', file);
};
const patchFile = (file, pairs) => {
  const p = path.join(root, file);
  if (!fs.existsSync(p)) {
    console.warn('[skip missing]', file);
    return;
  }
  let s = fs.readFileSync(p, 'utf8');
  for (const [a, b] of pairs) s = s.split(a).join(b);
  fs.writeFileSync(p, s, 'utf8');
  console.log('[patch]', file);
};

// Keep Android runtime unchanged, but avoid loading VisionCamera at runtime where it is only used as a TS type.
[
  'src/components/Video/VideoViewModel.tsx',
  'src/scenes/game/game-play/console/ConsoleViewModel.tsx',
  'src/scenes/game/game-play/console/game-info/index.tsx',
  'src/scenes/game/game-play/console/webcam/WebCamViewModel.tsx',
  'src/scenes/game/game-play/GamePlayViewModel.tsx',
].forEach(f => patchFile(f, [
  ["import { Camera } from 'react-native-vision-camera';", "import type {Camera} from 'react-native-vision-camera';"],
  ["import {Camera} from 'react-native-vision-camera';", "import type {Camera} from 'react-native-vision-camera';"],
]));

// Merge package.json for RNW without touching Android name/package scripts.
const pkgPath = path.join(root, 'package.json');
if (fs.existsSync(pkgPath)) {
  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
  pkg.scripts = pkg.scripts || {};
  pkg.dependencies = pkg.dependencies || {};
  pkg.scripts.windows = pkg.scripts.windows || 'react-native run-windows';
  pkg.scripts['windows:release'] = pkg.scripts['windows:release'] || 'react-native run-windows --release';
  pkg.scripts['windows:autolink'] = pkg.scripts['windows:autolink'] || 'react-native autolink-windows';
  pkg.dependencies['react-native-windows'] = pkg.dependencies['react-native-windows'] || '~0.75.0';
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  console.log('[patch] package.json');
} else {
  console.warn('[skip missing] package.json');
}

W('src/components/View/index.windows.tsx', `
import React,{memo,forwardRef,ReactNode}from'react';
import{View as RNView,ViewStyle,StyleProp,LayoutChangeEvent}from'react-native';
const sp:any={5:5,10:10,15:15,20:20};
const fl:any={0:0,1:1,2:2,3:3,4:4,6:6,8:8,10:10};
const al:any={start:'flex-start',end:'flex-end',center:'center'};
const js:any={start:'flex-start',end:'flex-end',center:'center',between:'space-between',around:'space-around'};
type P={children?:ReactNode;style?:StyleProp<ViewStyle>;onLayout?:(e:LayoutChangeEvent)=>void;alignItems?:'start'|'end'|'center';direction?:'row'|'column';flex?:'0'|'1'|'2'|'3'|'4'|'6'|'8'|'10';justify?:'start'|'end'|'center'|'between'|'around';margin?:'5'|'10'|'15'|'20';marginHorizontal?:'5'|'10'|'15'|'20';marginVertical?:'5'|'10'|'15'|'20';marginTop?:'5'|'10'|'15'|'20';marginLeft?:'5'|'10'|'15'|'20';marginBottom?:'5'|'10'|'15'|'20';marginRight?:'5'|'10'|'15'|'20';padding?:'5'|'10'|'15'|'20';paddingHorizontal?:'5'|'10'|'15'|'20';paddingVertical?:'5'|'10'|'15'|'20';paddingTop?:'5'|'10'|'15'|'20';paddingLeft?:'5'|'10'|'15'|'20';paddingBottom?:'5'|'10'|'15'|'20';paddingRight?:'5'|'10'|'15'|'20';linearColors?:string[];linearEffect?:any;collapsable?:boolean};
const V=forwardRef<RNView,P>((p,ref)=>{const s:any={alignItems:al[p.alignItems||'start'],flexDirection:p.direction||'column',justifyContent:js[p.justify||'start']};if(p.flex)s.flex=fl[p.flex];['margin','marginHorizontal','marginVertical','marginTop','marginLeft','marginBottom','marginRight','padding','paddingHorizontal','paddingVertical','paddingTop','paddingLeft','paddingBottom','paddingRight'].forEach(k=>{const v=(p as any)[k];if(v)s[k]=sp[v]});return <RNView ref={ref} style={[s,p.style]} onLayout={p.onLayout} collapsable={p.collapsable}>{p.children}</RNView>});
export default memo(V);
`);

W('src/components/Button/index.windows.tsx', `
import React,{memo,ReactElement}from'react';
import{Pressable,ViewStyle,GestureResponderEvent,ActivityIndicator}from'react-native';
import colors from'configuration/colors';
import View from'../View';
import styles from'./styles';
type P={children?:ReactElement|ReactElement[]|boolean;onPress:(e:GestureResponderEvent)=>void;onLongPress?:(e:GestureResponderEvent)=>void;style?:ViewStyle|ViewStyle[];disable?:boolean;isLoading?:boolean;showGradientColors?:boolean;centerChildren?:boolean;loadingColor?:string;gradientColors?:string[];gradientStyle?:ViewStyle;disableStyle?:ViewStyle|ViewStyle[]};
const B=(p:P)=>{const center=p.centerChildren?styles.center:undefined;const dis=p.disable?(p.disableStyle?[styles.disable,p.disableStyle]:styles.disable):undefined;const child=p.isLoading?<View style={[styles.fullWidth,styles.disable,center,p.gradientStyle]} alignItems={'center'} justify={'center'} paddingVertical={'15'}><ActivityIndicator size={10} color={p.loadingColor||colors.white}/></View>:p.children;return <Pressable style={[styles.container,center,p.style,dis]} onPress={p.onPress} onLongPress={p.onLongPress} disabled={p.disable}>{child}</Pressable>};
export default memo(B);
`);

W('src/components/Video/index.windows.tsx', `
import React,{forwardRef,memo,useEffect}from'react';
import{Image,StyleSheet}from'react-native';
import View from'components/View';import Text from'components/Text';import images from'assets';import colors from'configuration/colors';
type P={setIsCameraReady?:(v:boolean)=>void};
const AplusVideo=(p:P,_r:React.LegacyRef<any>)=>{useEffect(()=>{p.setIsCameraReady?.(false)},[p]);return <View style={s.c} alignItems={'center'} justify={'center'}><Image source={images.logoclb} style={s.logo} resizeMode={'contain'}/><View marginTop={'10'}><Text color={colors.white} fontSize={16} textAlign={'center'}>Camera Windows chưa hỗ trợ</Text></View><View marginTop={'5'}><Text color={colors.gray} fontSize={12} textAlign={'center'}>Đang dùng fallback để gameplay không crash</Text></View></View>};
const s=StyleSheet.create({c:{flex:1,width:'100%',minHeight:180,backgroundColor:colors.black},logo:{width:140,height:90}});
export default memo(forwardRef(AplusVideo));
`);

W('src/constants/webcam.windows.tsx', `
const WEBCAM_HOST='rtsp://',WEBCAM_PORT='554',WEBCAM_PATH='/cam/realmonitor?channel=1&subtype=0';
const WEBCAM_SELECTED_VIDEO_TRACK={type:'index',value:0};
const WEBCAM_BUFFER_CONFIG={minBufferMs:15000,maxBufferMs:50000,bufferForPlaybackMs:2500,bufferForPlaybackAfterRebufferMs:5000,backBufferDurationMs:120000,cacheSizeMB:0,live:{targetOffsetMs:500}};
const WEBCAM_BASE_FILE_NAME='webcam_',WEBCAM_FILE_EXTENSION='.mov',WEBCAM_BASE_CAMERA_FOLDER='camera',WEBCAM_OUTPUT_FILE_NAME='output_camera',WEBCAM_OUTPUT_TEMP_FILE_NAME='output_temp_camera',CAMERA_FILE_EXTENSION='.ts',MATCH_IMAGE='match_info.png',MATCH_COUNTDOWN='match_countdown.png',LIVESTREAM_IMAGE_TOP_LEFT='image_top_left.png',LIVESTREAM_IMAGE_TOP_RIGHT='image_top_right.png',LIVESTREAM_IMAGE_BOTTOM_LEFT='image_bottom_left.png',LIVESTREAM_IMAGE_BOTTOM_RIGHT='image_bottom_right.png';
export{WEBCAM_HOST,WEBCAM_PORT,WEBCAM_PATH,WEBCAM_BUFFER_CONFIG,WEBCAM_SELECTED_VIDEO_TRACK,WEBCAM_BASE_FILE_NAME,WEBCAM_OUTPUT_TEMP_FILE_NAME,WEBCAM_BASE_CAMERA_FOLDER,WEBCAM_OUTPUT_FILE_NAME,WEBCAM_FILE_EXTENSION,CAMERA_FILE_EXTENSION,MATCH_IMAGE,MATCH_COUNTDOWN,LIVESTREAM_IMAGE_TOP_LEFT,LIVESTREAM_IMAGE_TOP_RIGHT,LIVESTREAM_IMAGE_BOTTOM_LEFT,LIVESTREAM_IMAGE_BOTTOM_RIGHT};
`);

W('src/scenes/game/game-play/console/webcam/WebCamViewModel.windows.tsx', `
import{RefObject,useCallback,useMemo,useRef,useState}from'react';
import{WebcamType}from'types/webcam';
export interface Props{innerControls?:boolean;webcamFolderName?:string;updateWebcamFolderName:(name:string)=>void;cameraRef?:RefObject<any>;isStarted:boolean;isPaused:boolean;videoUri?:string;setVideoUri?:(name:string)=>void;isCameraReady:boolean;setIsCameraReady:(v:boolean)=>void;}
const WebCamViewModel=(_p:Props)=>{const videoRef=useRef<any>(null);const[refreshing,setRefreshing]=useState(false);const[innerControlsShow,setInnerControlsShow]=useState(false);const onRefresh=useCallback(()=>{setRefreshing(true);const t=setTimeout(()=>{setRefreshing(false);clearTimeout(t)},500)},[]);const noop=useCallback(()=>{},[]);const onToggleInnerControls=useCallback(()=>setInnerControlsShow(v=>!v),[]);return useMemo(()=>({videoRef,innerControlsShow,refreshing,autoConnect:false,webcamType:WebcamType.camera,webcam:undefined,liveStream:undefined,connectCountdownTime:0,source:undefined,onRefresh,onDelay:noop,onReWatch:noop,onFullscreenPlayerDidPresent:noop,onBuffer:noop,onSeek:noop,onLoad:noop,onVideoTracks:noop,onEnd:noop,onWebcamError:noop,onToggleInnerControls}),[videoRef,innerControlsShow,refreshing,onRefresh,noop,onToggleInnerControls])};
export default WebCamViewModel;
`);

W('src/utils/sound.windows.tsx', `const Sound={playTimeout:()=>{},beep:()=>{},stop:()=>{}};export default Sound;`);
W('src/utils/remote.windows.tsx', `class RemoteControlFallback{static instance=new RemoteControlFallback();registerKeyEvents=()=>{};removeAllListeners=()=>{}}export default RemoteControlFallback;`);
W('src/utils/permission.windows.tsx', `const requestReadWriteStorage=async()=>false;export{requestReadWriteStorage};`);

W('src/data/redux/sagas/game.windows.tsx', `
import{put,takeLatest}from'redux-saga/effects';import{gameActions,gameTypes}from'../actions/game';
const updateGameSettings=function*({payload}:ReturnType<any>){yield put(gameActions.updateGameSettingsSuccess(payload))};
const endGame=function*(){yield put(gameActions.endGameSuccess());yield put(gameActions.updateGameSettingsSuccess(undefined))};
const watcher=function*(){yield takeLatest(gameTypes.UPDATE_GAME_SETTINGS,updateGameSettings);yield takeLatest(gameTypes.END_GAME,endGame)};export default watcher();
`);
W('src/data/redux/sagas/history.windows.tsx', `
import{put,takeLatest}from'redux-saga/effects';import{historyActions,historyTypes}from'../actions/history';
const deleteHistory=function*(){yield put(historyActions.deleteHistorySuccess())};
const watcher=function*(){yield takeLatest(historyTypes.DELETE_HISTORY,deleteHistory)};export default watcher();
`);
W('src/data/redux/sagas/configs.windows.tsx', `
import{put,takeLatest}from'redux-saga/effects';import{configsActions,configsTypes}from'../actions/configs';
const retrieveStreamKey=function*({onError}:ReturnType<any>){onError?.();yield put(configsActions.retrieveStreamKeyError())};
const watcher=function*(){yield takeLatest(configsTypes.RETRIEVE_STREAM_KEY,retrieveStreamKey)};export default watcher();
`);

W('src/scenes/history/index.windows.tsx', `
import React,{memo}from'react';import Container from'components/Container';import View from'components/View';import Text from'components/Text';import colors from'configuration/colors';
const History=()=> <Container><View flex={'1'} alignItems={'center'} justify={'center'} padding={'20'}><Text color={colors.white} fontSize={24} textAlign={'center'}>Lịch sử trận đấu Windows đang tạm tắt</Text><View marginTop={'10'}><Text color={colors.gray} fontSize={16} textAlign={'center'}>Bản Windows ưu tiên chạy giao diện và gameplay trước, không dùng Realm/recording native.</Text></View></View></Container>;
export default memo(History);
`);
W('src/scenes/playback/index.windows.tsx', `
import React,{memo}from'react';import Container from'components/Container';import View from'components/View';import Text from'components/Text';import colors from'configuration/colors';
const Playback=()=> <Container><View flex={'1'} alignItems={'center'} justify={'center'} padding={'20'}><Text color={colors.white} fontSize={24} textAlign={'center'}>Replay Windows chưa hỗ trợ</Text><View marginTop={'10'}><Text color={colors.gray} fontSize={16} textAlign={'center'}>Recording/replay native Android đã được fallback để không crash khi chạy Windows.</Text></View></View></Container>;
export default memo(Playback);
`);
W('src/scenes/game/game-play/livestream-images/index.windows.tsx', `
import React,{memo}from'react';import View from'components/View';const LivestreamImages=()=> <View/>;export default memo(LivestreamImages);
`);
W('src/scenes/configs/index.windows.tsx', `
import React,{memo}from'react';import Container from'components/Container';import View from'components/View';import Text from'components/Text';import LanguageConfig from'./language';import TableNumber from'./table-number';import colors from'configuration/colors';
const Configs=()=> <Container><View flex={'1'} padding={'20'}><View marginBottom={'20'}><Text color={colors.white} fontSize={24} fontWeight={'bold'}>Cấu hình Windows</Text></View><LanguageConfig/><View marginVertical={'10'}/><TableNumber/><View marginTop={'20'}><Text color={colors.gray} fontSize={16}>Camera, livestream, Bluetooth và thumbnail picker đang tạm fallback trên Windows để build không crash.</Text></View></View></Container>;
export default memo(Configs);
`);
W('src/scenes/home/index.windows.tsx', `
import React,{memo}from'react';import{StyleSheet}from'react-native';import Container from'components/Container';import Text from'components/Text';import colors from'configuration/colors';import Button from'components/Button';import i18n from'i18n';import HomeViewModel,{Props}from'./HomeViewModel';import View from'components/View';import Image from'components/Image';import images from'assets';
const Home=(props:Props)=>{const vm=HomeViewModel(props);return <Container><View flex={'1'} style={s.c} padding={'20'} justify={'between'}><View direction={'row'} justify={'between'}><View><Text fontSize={32} letterSpacing={2} color={colors.white}>{i18n.t('msgAppName')}</Text></View><View alignItems={'end'}><View direction={'row'} alignItems={'center'}><Text fontWeight={'bold'} fontSize={32} letterSpacing={3} color={colors.white}>{vm.helloText}</Text><Button onPress={vm.onPressConfigs} style={s.cfg}><Image source={images.settings} style={s.icon}/></Button></View><View marginTop={'10'}><Button style={s.hist} onPress={vm.onPressHistory}><View direction={'row'} alignItems={'center'}><Image source={images.history} style={s.img} resizeMode={'contain'}/><Text fontSize={24} color={colors.white}>{i18n.t('txtHistory')}</Text></View></Button></View></View></View><View flex={'1'} alignItems={'center'} justify={'center'}><Button style={s.btn} onPress={vm.onStartNewGame}><View direction={'row'} alignItems={'center'}><Image source={images.startGame} style={s.img} resizeMode={'contain'}/><Text fontSize={32} color={colors.white}>{i18n.t('txtStartNewGame')}</Text></View></Button></View><View alignItems={'center'}><Image source={images.logo} style={s.logo} resizeMode={'contain'}/><View marginTop={'15'}><Text fontSize={24} fontStyle={'italic'} color={colors.white}>{i18n.t('msgIntroDescription')}</Text></View></View></View></Container>};
const s=StyleSheet.create({c:{backgroundColor:colors.primary},cfg:{padding:10,marginLeft:10},hist:{padding:10,borderRadius:12,backgroundColor:colors.whiteDarkerOverlay},btn:{paddingHorizontal:30,paddingVertical:20,borderRadius:18,backgroundColor:colors.lightPrimary1},icon:{width:32,height:32},img:{width:48,height:48,marginRight:12},logo:{width:220,height:90}});export default memo(Home);
`);
W('src/scenes/screens.windows.tsx', `
import{Scenes,Screens}from'types/scenes';import Home from'./home';import GameSettings from'./game/settings';import GamePlay from'./game/game-play';import History from'./history';import Playback from'./playback';import Configs from'./configs';
const scenes:Scenes={home:Home,gameSettings:GameSettings,gamePlay:GamePlay,history:History,playback:Playback,configs:Configs};const sceneKeys=Object.keys(scenes);const screens:Screens=sceneKeys.reduce((r,i)=>({...r,[i]:i}),{}as Screens);export{screens,scenes,sceneKeys};
`);

W('App.windows.tsx', `
import 'react-native-get-random-values';
import React,{useCallback,useEffect,useState}from'react';
import{StyleSheet}from'react-native';
import{GestureHandlerRootView}from'react-native-gesture-handler';
import{Provider}from'react-redux';
import{PersistGate}from'redux-persist/integration/react';
import{NavigationContainer}from'@react-navigation/native';
import{StackScreens}from'scenes';
import{LanguageContext}from'context/language';
import{loadLanguage,setLanguage}from'i18n';
import{navigationRef}from'utils/navigation';
import Container from'components/Container';
import View from'components/View';
import Loading from'components/Loading';
import storage,{persistor}from'data/redux';
const App=():React.JSX.Element=>{const[isLoading,setIsLoading]=useState(true);const[currentLanguage,setCurrentLanguage]=useState('vi');const init=useCallback(async()=>{const l=await loadLanguage();setCurrentLanguage(l);setIsLoading(false)},[]);useEffect(()=>{init().catch(e=>console.error(JSON.stringify(e)))},[init]);const onChangeCurrentLanguage=useCallback((language:string)=>{setCurrentLanguage(language);setLanguage(language)},[]);return <GestureHandlerRootView style={styles.container}><Provider store={storage}><PersistGate loading={<Loading isLoading/>} persistor={persistor}><LanguageContext.Provider value={{language:currentLanguage,setLanguage:onChangeCurrentLanguage}}><NavigationContainer ref={navigationRef}>{isLoading?<Container isLoading><View/></Container>:<StackScreens/>}</NavigationContainer></LanguageContext.Provider></PersistGate></Provider></GestureHandlerRootView>};
const styles=StyleSheet.create({container:{flex:1}});export default App;
`);

// Build GamePlayViewModel.windows.tsx from current source to preserve scoring logic.
const gp = path.join(root, 'src/scenes/game/game-play/GamePlayViewModel.tsx');
if (fs.existsSync(gp)) {
  let s = fs.readFileSync(gp, 'utf8');
  s = s.replace(/import RNFS,[^\n]*\n/g, '');
  s = s.replace(/import \{useRealm\} from '@realm\/react';\n/g, '');
  s = s.replace(/import type \{Camera\} from 'react-native-vision-camera';\n/g, '');
  s = s.replace(/import \{NativeModules\} from 'react-native';\n/g, '');
  s = s.replace(/import DeviceInfo from 'react-native-device-info';\n/g, '');
  s = s.replace(/const \{CameraService\} = NativeModules;\n\n/g, '');
  s = s.replace('  const realm = useRealm();', '  const realm = undefined as any;');
  s = s.replace('  const cameraRef = useRef<Camera>(null);', '  const cameraRef = useRef<any>(null);');
  s = s.replace(/  const onStart = useCallback\(async \(\) => \{[\s\S]*?\n  \}, \[isStarted\]\);/, `  const onStart = useCallback(async () => {
    if (isStarted) {
      return;
    }

    setIsStarted(true);
    setIsCameraReady(false);
    await startVideoRecording();
  }, [isStarted]);`);
  s = s.replace(/  const startVideoRecording = async \(\) => \{[\s\S]*?\n  \};\n\n  const stopVideoRecording = async \(\) => \{[\s\S]*?\n  \};/, `  const startVideoRecording = async () => {
    // Windows fallback: recording/replay native Android is disabled for now.
    setIsRecording(false);
  };

  const stopVideoRecording = async () => {
    // Windows fallback: no native recording session to stop.
    setIsRecording(false);
  };`);
  W('src/scenes/game/game-play/GamePlayViewModel.windows.tsx', s);
} else {
  console.warn('[skip missing]', gp);
}

W('WINDOWS_PORT_NOTES.md', `
# Aplus Score Windows fallback patch

Đã thêm fallback Windows để ưu tiên build được app và vào được gameplay.

## Windows dùng fallback
- Camera/VisionCamera: \`src/components/Video/index.windows.tsx\`
- Webcam/FFmpeg/livestream/replay native: \`WebCamViewModel.windows.tsx\`, \`playback/index.windows.tsx\`
- Realm/history: \`App.windows.tsx\`, \`history/index.windows.tsx\`, \`sagas/*.windows.tsx\`
- Google Sign-In/livestream config: \`configs/index.windows.tsx\`, \`configs.windows.tsx\`
- Bluetooth remote/sound/permission Android: \`remote.windows.tsx\`, \`sound.windows.tsx\`, \`permission.windows.tsx\`
- LinearGradient: \`View/index.windows.tsx\`, \`Button/index.windows.tsx\`, \`home/index.windows.tsx\`

## Android
Android vẫn dùng các file gốc \`.tsx\`. Các file \`.windows.tsx\` chỉ được Metro/RNW dùng khi build Windows.
`);

console.log('\nDONE. Next: npm install, npx react-native init-windows --overwrite, npx react-native run-windows');
