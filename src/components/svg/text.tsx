import React from "react";

interface TextSvgProps {
  text?: string;
  className?: string;
  linearGradientList?: Array<any>;
  width: string;
  height?: string;
  x: number;
  y: number;
}
//font_linear
export default ({ text, className, linearGradientList,width="24", height="24", x=0, y=0 }:TextSvgProps)=>(
  <svg version="1.1"
       baseProfile="full"
       width={width}
       height={height}
       xmlns="http://www.w3.org/2000/svg">
    <defs>
      {
        linearGradientList&&
        <linearGradient id="Gradient" x1="0" x2="0" y1="0" y2="1">
          {
            linearGradientList.map((item:any,index: number)=>(
              <stop key={index} offset={item.offset || `${(index+1)/linearGradientList.length}%`} stopColor={item.color}/>
            ))
          }
        </linearGradient>

      }
    </defs>
    <text
      x={x}
      y={y}
      textAnchor="middle"
      className={className}
      fill="url(#Gradient)">{text}</text>
  </svg>
)
