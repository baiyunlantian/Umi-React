
// import { AppBase, mapConfig } from '@/pages/components/vtouch/vtouch-map';
import { AppBase, mapConfig } from 'vtouch-map';
import { Plugin, mapDivUpdate } from './project/campus/plugin/plugin';
import { mainConfig } from '@/layouts/config';

export class MAPAPP extends AppBase {
  public plugin: Plugin;
  constructor(plugin: Plugin) {
    super();
    this.plugin = plugin;
  }
}
export class mapPlugin {
  public static app: MAPAPP;
  constructor(plugin: Plugin) {
    // if (!(mapConfig.map instanceof AppBase)) {
    //   mapPlugin.app = null as any;
    // }
    // if (!mapPlugin.app) {
    //   mapConfig.map = null as any;
    // }

    if (mainConfig.thridDStatus === 'off') {
      // mapConfig.map = null as any;
      // mapPlugin.app = null as any;
      new mapDivUpdate().quit3D();
      mainConfig.thridDStatus = 'on';
    }

    if (!(mapPlugin.app instanceof AppBase)) {
      mapPlugin.app = new MAPAPP(plugin);
      mapConfig.map = mapPlugin.app;
    };
    return mapPlugin.app as AppBase;
  }
}

export const App = mapPlugin.app;

