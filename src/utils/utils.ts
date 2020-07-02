import { parse } from 'querystring';
import pathRegexp from 'path-to-regexp';
import { Route } from '@/models/connect';
import { useIntl } from 'umi';
//const { formatMessage } = useIntl();

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export const isUrl = (path: string): boolean => reg.test(path);

export const isAntDesignPro = (): boolean => {
  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }
  return window.location.hostname === 'preview.pro.ant.design';
};

// 给官方演示站点用，用于关闭真实开发环境不需要使用的特性
export const isAntDesignProOrDev = (): boolean => {
  const { NODE_ENV } = process.env;
  if (NODE_ENV === 'development') {
    return true;
  }
  return isAntDesignPro();
};

export const getPageQuery = () => parse(window.location.href.split('?')[1]);

/**
 * props.route.routes
 * @param router [{}]
 * @param pathname string
 */
export const getAuthorityFromRouter = <T extends { path?: string }>(
  router: T[] = [],
  pathname: string,
): T | undefined => {
  const authority = router.find(
    ({ path }) => path && pathRegexp(path).exec(pathname),
  );
  if (authority) return authority;
  return undefined;
};

export const getRouteAuthority = (path: string, routeData: Route[]) => {
  let authorities: string[] | string | undefined;
  routeData.forEach(route => {
    // match prefix
    if (pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
      if (route.authority) {
        authorities = route.authority;
      }
      // exact match
      if (route.path === path) {
        authorities = route.authority || authorities;
      }
      // get children authority recursively
      if (route.routes) {
        authorities = getRouteAuthority(path, route.routes) || authorities;
      }
    }
  });
  return authorities;
};

// 页面刷新，初始化功能名称
export const getFunctionName = path => {
  console.log(formatMessage({ id: `menu${path.replace(/\//g, '.')}` }));
  return formatMessage({ id: `menu${path.replace(/\//g, '.')}` });
};

export const getBrowser = () => {
  const userAgent = navigator.userAgent.toLowerCase();
  console.log(userAgent);
  let browser = null;
  userAgent.indexOf('chrome') > -1 && userAgent.indexOf('safari') > -1
    ? (browser = 'chrome')
    : userAgent.indexOf('firefox') > -1
    ? (browser = 'firefox')
    : userAgent.indexOf('safari') > -1 && userAgent.indexOf('chrome') === -1
    ? (browser = 'safari')
    : userAgent.indexOf('opera') > -1
    ? (browser = 'opera')
    : userAgent.indexOf('trident') > -1
    ? (browser = 'ie')
    : userAgent.indexOf('edge') > -1
    ? (browser = 'edge')
    : (browser = 0);
  return browser.toString();
};
