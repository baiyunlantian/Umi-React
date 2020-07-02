import { useImmer } from 'use-immer';
import {Campus} from "@/type";
import {string} from "prop-types";
import {useState} from "react";
import {async} from "q";

interface StoreProps {
  token: string;
  campus: Array<Campus>
}

export default () => {
  const [store, reducer] = useImmer<any>( {});


  function setStore(data:any) {
    reducer((draft:any) => {
      Object.keys(data).forEach((key:string)=>{
        if(data[key]){
          draft[key] = data[key];
        }
      })
    })
  }

  return {store, setStore};
};
