// 摄像头对象
export declare type Camera= {
  devId: string;
  warn: boolean|undefined
}


export interface VideoContentState {
  vDetailVisible: boolean;
  videoItem: Object;
  lockedList: Array<Camera>;
}
