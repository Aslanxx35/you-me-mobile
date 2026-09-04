import {Share} from 'react-native'; import {captureRef} from 'react-native-view-shot';
export async function shareView(ref:any,message:string){const uri=await captureRef(ref,{format:'png',quality:0.95});await Share.share({message,url:uri});return uri;}
export async function shareText(message:string){await Share.share({message});}
