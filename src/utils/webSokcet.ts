import { Store, Dispatch } from 'redux';
import { any, func } from 'prop-types';

const debounce = (fn, delay) => {
  let timeOut = null;
  return () => {
    if (timeOut !== null) clearTimeout(timeOut);
    timeOut = setTimeout(fn, delay);
  };
};

export function speak(text:string = '',config?:any) {
  if(!text || config&&!config.text) return;
  const speechInstance = new SpeechSynthesisUtterance();
  speechInstance.text = text;
  speechInstance.lang = 'zh-CN';
  speechInstance.volume = 1;
  speechInstance.rate = 1;
  speechSynthesis.speak(speechInstance);
  speechInstance.onend =()=>{
    console.log("语音播报完毕");
  }
}


export default setWbState => {
  let socket: WebSocket;

  // 浏览器不支持WebSocket
  if (typeof WebSocket === 'undefined') return;

  // 实现化WebSocket对象
  // 指定要连接的服务器地址与端口建立连接
  // 注意ws、wss使用不同的端口。我使用自签名的证书测试，
  // 无法使用wss，浏览器打开WebSocket时报错
  // ws对应http、wss对应https。

  socket = new WebSocket('ws://192.168.1.10:8777/ws/asset');
  // 连接打开事件
  socket.onopen = e => {
    // 发送给服务器
    socket.send('消息发送测试(From Client)');
  };

  // 收到消息事件
  socket.onmessage = msg => {
    //console.log(msg.data);
    if (msg.data.includes('{')) {
      const { type, data } = JSON.parse(msg.data);
      setWbState({ [type]: data });
      //console.log(type,data);
      let text: string = '';
      switch (Number(type)) {
        case 4 : text = '丢失监控'; break;
        case 2:  text = '人脸'; break;
        case 3 : text = '区域'; break;
        case 7 : {
          text = `${data.builds.map((item:any)=>item.areaName)}发生火灾！`;
          break;
        }
        default: text='';break;
      }
      //console.log(text)
      if(text){
        speak(text);
      }
      /*const speech = new window.SpeechSynthesisUtterance(`${text}!`);
      window.speechSynthesis.speak(speech);*/
    }
  };
  // 连接关闭事件
  socket.onclose = () => {
    console.log('Socket已关闭');
  };
  // 发生了错误事件
  socket.onerror = () => {
    // alert('Socket发生了错误');
  };

  // 窗口关闭时，关闭连接
  window.unload = () => {
    socket.close();
  };
};
