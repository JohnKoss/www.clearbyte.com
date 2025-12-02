//import { metaData } from '../routes/state.svelte';
import { waitForJWT } from './jwt';

export interface IPostResults {
  ok: boolean;
  message: string;
}

///
const API_TIMEOUT = 60 * 1000; // TODO: Change this when not debugging.

//////
export class Api {

  private headers: Headers;
  private url: URL;
  private abortController:AbortController;

  /////
  constructor(url: URL) {
    this.url = url

    this.headers = new Headers();
    this.headers.set("Accept", 'application/json');
    this.headers.set('Content-Type', 'application/x-www-form-urlencoded');

    this.abortController = new AbortController();
  }
    
  //////
  public Get = <Type>(data: any | null = null): Promise<Type> => this.invoke("GET", data);
  public Post = <Type>(data: any | null = null): Promise<Type> => this.invoke("POST", data);

  //////////
  private async invoke<Type>(method:string, data: any | null = null): Promise<Type> {
    console.log(`Method:${method} and URL:${this.url} with data:${data}`)
    this.headers.set('Authorization', 'Bearer ' + (await waitForJWT()))
    
    const timeout = window.setTimeout(() => {
      this.abortController.abort();
    }, API_TIMEOUT);

    //  
    try {
      const d = {
        method: method,
        headers: this.headers,
        body: data ? JSON.stringify(data) : null,
        signal: this.abortController.signal
      }
      const response = await fetch(this.url, d);

      // Use the responseType parameter to decide how to process the response
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

        return (await response.json()) as Type;
    } catch (error) {
      console.error('Fetch error: ', error);
    } finally {
      clearTimeout(timeout);
    }
    return Promise.reject(`Error! ${method}`);
  }

  ///////
  public async PostForm<Type>(data: any): Promise<Type> {
    this.headers.set('Authorization', 'Bearer ' + (await waitForJWT()));

    const timeout = window.setTimeout(() => {
      this.abortController.abort();
    }, API_TIMEOUT);

    try {
      const response = await fetch(this.url, {
        method: 'POST',
        headers: this.headers,
        body: data,
        signal: this.abortController.signal,
      });
  
      // Use the responseType parameter to decide how to process the response
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }  
        return (await response.text()) as Type;
    } catch (error) {
      console.log('Fetch error: ', error);
    } finally {
      clearTimeout(timeout);
   }
    return Promise.reject(`Error! POST`);
  }
  

}




// export async function PostForm(url: URL, data: any | null): Promise<string> {

//       const abortController = new AbortController();
//       const timeout = setTimeout(() => {
//         abortController.abort();
//       }, API_TIMEOUT);
  
//       //console.log("data", data ? JSON.stringify(data) : null)
//       let headers = {
//                "Accept": 'application/json',
//                'Content-Type': 'application/x-www-form-urlencoded',
//                'Authorization': 'Bearer ' + metaData.jwt
//              };
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: headers,
//         body: data,
//         signal: abortController.signal
//       });
  
//       clearTimeout(timeout);
  
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
  
//       return response.text()
//     }



// import { GetJwt } from './auth';


// //////////////////////////////////////////////////
// const API_TIMEOUT = 1000000;
// export class Api {
//   headers: HeadersInit
//   url: URL
//   await GetJwt()
//   constructor(url: URL) {
    
//     this.url = url
//     this.headers = {
//       "Accept": 'application/json',
//       'Content-Type': 'application/x-www-form-urlencoded',
//       'Authorization': 'Bearer ' + jwt
//     };
//     //this.#headers['Authorization'] = 'Bearer ' + window.btoa(JSON.stringify(auth))
//   }

//   //////
//   // e.g. var params = [['lat', '35.696233'], ['long', '139.570431']]
//   async Get<Type>(): Promise<Type | undefined> {

//     const abortController = new AbortController();
//     const timeout = setTimeout(() => {
//       abortController.abort();
//     }, API_TIMEOUT);

//     // 
//     try {
//       const response = await fetch(this.url, {
//         method: 'GET',
//         headers: this.headers,
//         signal: abortController.signal
//       });

//       return response.json() as Type;
//     } catch (error) {
//       console.log('Fetch error: ', error);
//     } finally {
//       clearTimeout(timeout);
//     }
//   }

//   //////
//   async Post<Type>(url: URL, data: any | null): Promise<Type> {

//     const abortController = new AbortController();
//     const timeout = setTimeout(() => {
//       abortController.abort();
//     }, API_TIMEOUT);

//     console.log("data", data ? JSON.stringify(data) : null)

//     const response = await fetch(url, {
//       method: 'POST',
//       headers: this.headers,
//       body: data ? JSON.stringify(data) : null,
//       signal: abortController.signal
//     });

//     clearTimeout(timeout);

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return response.json()
//   }

//   //////
//   async PostForm(url: URL, data: any | null): Promise<string> {

//     const abortController = new AbortController();
//     const timeout = setTimeout(() => {
//       abortController.abort();
//     }, API_TIMEOUT);

//     //console.log("data", data ? JSON.stringify(data) : null)

//     const response = await fetch(url, {
//       method: 'POST',
//       headers: this.headers,
//       body: data,
//       signal: abortController.signal
//     });

//     clearTimeout(timeout);

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     return response.text()
//   }


// }


// // ////////////////////////////
// // export async function fetchWithTimeout(resource: string, options: any = {}): Promise<Response> {
// //   const { timeout = 8000 } = options;

// //   const controller = new AbortController();
// //   const id = setTimeout(() => controller.abort(), timeout);
// //   const response = await fetch(resource, {
// //     ...options,
// //     signal: controller.signal
// //   });
// //   clearTimeout(id);
// //   console.log(response)
// //   return response

// // }