import { metaData } from '../routes/state.svelte';

////////////////////////////
export interface IMessageResults {
  ok: boolean;
  message: string;
}

///
const API_TIMEOUT = 15 * 1000;
const PUBLIC_API_URL = "https://api.clearbyte.io/admin/labs/"

//////
export class Api {

  private headers: Headers;
  public url: URL;
  private customFetch: any;
  private abortController: AbortController;

  /////
  constructor(customFetch = fetch) {
    this.url = new URL(PUBLIC_API_URL);

    // if (params) {
    //   Object.entries(params).forEach(([key, value]) => {
    //     if (value !== undefined) {
    //       this.url.searchParams.append(key, String(value));
    //     }
    //   });
    // }

    this.headers = new Headers();
    this.headers.set("Accept", 'application/json');
    this.headers.set('Content-Type', 'application/x-www-form-urlencoded');
    this.customFetch = customFetch;

    this.abortController = new AbortController();
  }
  //////
  public appendUrl(url: string) {
    this.url = new URL(url, this.url);
  }

  //////
  public GET = <Type>(data: any | null = null): Promise<Type> => this.invoke("GET", data);
  public POST = <Type>(data: any | null = null): Promise<Type> => this.invoke("POST", data);
  public PUT = <Type>(data: any | null = null): Promise<Type> => this.invoke("PUT", data);

  //////////
  private async invoke<Type>(method: string, data: any | null = null): Promise<Type> {

    console.debug(`Method:${method} and URL:${this.url} with data:${data}. MetaData:${metaData.jwt.length}`);
    this.headers.set('Authorization', 'Bearer ' + metaData.jwt)

    const timeout = window.setTimeout(() => {
      this.abortController.abort();
    }, API_TIMEOUT);

    //  
    try {
      const response = await this.customFetch(this.url, {
        method: method,
        headers: this.headers,
        body: data,
        signal: this.abortController.signal
      });
      return response.json() as Type;
    } catch (error) {
      console.error('Fetch error: ', error);
    } finally {
      clearTimeout(timeout);
    }
    return Promise.reject(`Error! ${method}`);
  }
}



//export const LoadJwt = $state(async () => {

// if (Jwt) return;

// if (import.meta.env.DEV) {
//   if (PUBLIC_TEST_JWT) {
//     Jwt = PUBLIC_TEST_JWT;
//   } else {
//     alert('No JWT found in environment variables.');
//   }
// } else {
//   if (browser) {
//     while (true) {
//       const template = document.getElementsByTagName('template')
//       if (template.length === 0 || template[0].innerHTML == null) {
//         console.log('Waiting for JWT...');
//         await sleep(500);
//       } else {
//         Jwt = template[0].innerHTML;
//       }
//     }
//   }
// }
//})
