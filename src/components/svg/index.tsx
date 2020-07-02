
const  files = require.context('./', false, /\.ts[x]?$/);
const modules:any = {};

files.keys().forEach((key:string)=>{
  const path = key.split("/");
  const fileName = key.split("/")[path.length-1];

  if(fileName.includes('index')) return;
  let moduleName = fileName.split(".")[0];
  moduleName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1);
  modules[moduleName] =  files(key).default;
});

export default modules;
