"use client";
import { formatBytes } from "../bookcard";
export default function GetByte({size}:{size:number| null}){
return formatBytes(size)

}