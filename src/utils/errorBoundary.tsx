import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { reportError } from '../services/errorReport';
import { COLORS } from '../constants/colors';
export class AppErrorBoundary extends React.Component<React.PropsWithChildren, {hasError:boolean}> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) { void reportError(error, { componentStack: info.componentStack }); }
  render() { if (!this.state.hasError) return this.props.children; return <View style={{flex:1,backgroundColor:COLORS.dark.ink,justifyContent:'center',padding:24}}><Text style={{color:COLORS.dark.gold,fontSize:28,textAlign:'center'}}>Bir şey ters gitti</Text><Text style={{color:COLORS.dark.textDim,textAlign:'center',marginTop:12}}>Uygulama güvenli şekilde durduruldu. Tekrar deneyebilirsin.</Text><TouchableOpacity onPress={()=>this.setState({hasError:false})} style={{marginTop:24,padding:16,borderRadius:14,backgroundColor:COLORS.dark.gold}}><Text style={{textAlign:'center',fontWeight:'700',color:'#060610'}}>Tekrar Dene</Text></TouchableOpacity></View>; }
}
