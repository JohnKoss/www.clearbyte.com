// export const GetMetaTags = (): Map<string, string> => {

import { getJwtCustomClaims } from "../routes/state.svelte";

//   const metasMap = new Map<string, string>();
//   var metas = document.getElementsByTagName('meta');
//   for (let meta of metas) {
//       console.log(meta.name,":", meta.content)
//       metasMap.set(meta.name, meta.content)
//   }
//   return metasMap
// }

export const GetMetaTags = (): Map<string, string> => {

  const metasMap = new Map<string, string>();
  var metas = document.getElementsByTagName('meta');

  for (let meta of metas) {
    if (!meta.content)
      continue;

    console.log(meta.name, ":", meta.content)
    metasMap.set(meta.name, meta.content)
  }

  console.log('metasMap:', metasMap)
  return metasMap
}

/////////////////////////////

export interface IAuthParams {
  contextId: string;
  resourceId: string;
  userId: string;
  nonce: string;
}


////////////////////////////
export function GetAuthParams(): IAuthParams {
  const tags = GetMetaTags()
  return {
    contextId: tags.get('context_id'),
    resourceId: tags.get('resource_id'),
    userId: tags.get('user_id'),
    nonce: tags.get('nonce')
  } as IAuthParams;
}

////////////////////////////
export interface IStateParams {
  state: string;
  callbackUrl: string;
}

export function GetStateParams(): IStateParams {
  const tags = GetMetaTags()

  ////
  return {
    state: tags.get('state'),
    callbackUrl: tags.get('callback_url'),
  } as IStateParams;
}

// ////////////////////////////
// export function GetJwt(): string {
//   let template = document.getElementsByTagName('template')
//   if (template.length != 1 || template[0].innerHTML == null)
//     throw new Error("Error:undefined HTML template tag");
//   return template[0].innerHTML
// }
////////
// Load once...
let jwt: string | null = null;
export const LoadJwt = async (timeoutMs: number = 5000) => {
  if (jwt) return jwt;
  const startTime = Date.now();
  while (true) {
    if (Date.now() - startTime > timeoutMs) {
      throw new Error('Timeout waiting for JWT template');
    }
    const template = document?.querySelector('template#jwt') as HTMLTemplateElement | null;
    if (template && template instanceof HTMLTemplateElement) {
      console.log("jwt obtained!")
      getJwtCustomClaims(template.innerHTML);
      break;
    } else {
      console.log('sleeping...jwt');
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
  }
}

////////////////////////////
export interface ILabParams {
  labId: string
}

export function GetLabParams(): ILabParams {
  const tags = GetMetaTags()
  return {
    labId: tags.get('lab_id')
  } as ILabParams;
}