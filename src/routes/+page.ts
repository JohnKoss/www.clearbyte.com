// +page.ts
export const prerender = true;
// import { browser } from '$app/environment';
// import { Api, type IMessageResults } from '$components/api.svelte';
// import type { PageLoad } from './$types';
// import { TabItems } from './items.svelte';
// import { getJwtCustomClaims, Store } from './state.svelte';
// export const prerender = true;

// ////////////////////////////
// export const load: PageLoad = async ({ fetch }) => {
// 	if (!browser) return;

// 	if (import.meta.env.DEV) {
// 		if (process.env.PUBLIC_TEST_JWT) {
// 			console.warn('Using environment variables.');
// 			getJwtCustomClaims(process.env.PUBLIC_TEST_JWT);
// 		}
// 	} else {
// 		while (true) {
// 			const template = document?.querySelector('template#jwt') as HTMLTemplateElement | null;
// 			if (template && template instanceof HTMLTemplateElement) {
// 				getJwtCustomClaims(template.innerHTML);
// 				break;
// 			}
// 			console.debug('Waiting for JWT...');
// 			await new Promise((resolve) => setTimeout(resolve, 500));
// 		}
// 	}

// 	// Fetch lab activity data
// 	const api =  new Api(fetch)
	
// 	if (Store.importing)
// 		api.appendUrl('labs/import');

// 	const res = await api.GET<IMessageResults>();
// 	if (res.ok) {
// 		const dataItems = JSON.parse(res.message) as string[]
// 		console.log("dataItems", dataItems);

// 		Object.keys(dataItems).forEach(key => {
// 			console.log(`loading... dataItems[parseInt(${key})]`,dataItems[parseInt(key)])
// 			TabItems[parseInt(key)].data = dataItems[parseInt(key)];
// 			console.log(`loading... TabItems[parseInt(${key})].data`, TabItems[parseInt(key)].data);
// 		});
// 		//TabItems[0].data = dataItems[0];
// 		return {
// 			error: false,
// 			content: dataItems,
// 		}
// 	} else {
// 		return {
// 			error: true,
// 			content: ['Could not fetch lab activity data!'],
// 		};
// 	}
// }




// // // Function that returns an JwtState
// // const fetchData = (): JwtState => {
// //     return {
// //         jwt: "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6IjIwMjQtMDgtMDFUMDA6MDA6MDBaX2E5NmJjM2Y2LWYyODctNDZiNi05NWE1LTZhNzVkYmRhNWY3NCJ9.eyJodHRwczovL3B1cmwuaW1zZ2xvYmFsLm9yZy9zcGVjL2x0aS9jbGFpbS9tZXNzYWdlX3R5cGUiOiJMdGlSZXNvdXJjZUxpbmtSZXF1ZXN0IiwiaHR0cHM6Ly9wdXJsLmltc2dsb2JhbC5vcmcvc3BlYy9sdGkvY2xhaW0vdmVyc2lvbiI6IjEuMy4wIiwiaHR0cHM6Ly9wdXJsLmltc2dsb2JhbC5vcmcvc3BlYy9sdGkvY2xhaW0vcmVzb3VyY2VfbGluayI6eyJpZCI6IjU5ZGJiMDY5LTNiNjYtNDVhNC1hYTA1LWUyM2M4MGI0YjFiYyIsImRlc2NyaXB0aW9uIjoiIiwidGl0bGUiOiJTMyBMYWIgMSIsInZhbGlkYXRpb25fY29udGV4dCI6bnVsbCwiZXJyb3JzIjp7ImVycm9ycyI6e319fSwiaHR0cHM6Ly9wdXJsLmltc2dsb2JhbC5vcmcvc3BlYy9sdGktYWdzL2NsYWltL2VuZHBvaW50Ijp7ImxpbmVpdGVtIjoiaHR0cHM6Ly9vbmxpbmUubWFjb21iLmVkdS9hcGkvbHRpL2NvdXJzZXMvNzI3Mi9saW5lX2l0ZW1zLzM0MDE1Iiwic2NvcGUiOlsiaHR0cHM6Ly9wdXJsLmltc2dsb2JhbC5vcmcvc3BlYy9sdGktYWdzL3Njb3BlL2xpbmVpdGVtIiwiaHR0cHM6Ly9wdXJsLmltc2dsb2JhbC5vcmcvc3BlYy9sdGktYWdzL3Njb3BlL3Jlc3VsdC5yZWFkb25seSIsImh0dHBzOi8vcHVybC5pbXNnbG9iYWwub3JnL3NwZWMvbHRpLWFncy9zY29wZS9zY29yZSIsImh0dHBzOi8vcHVybC5pbXNnbG9iYWwub3JnL3NwZWMvbHRpLWFncy9zY29wZS9saW5laXRlbS5yZWFkb25seSJdLCJsaW5laXRlbXMiOiJodHRwczovL29ubGluZS5tYWNvbWIuZWR1L2FwaS9sdGkvY291cnNlcy83MjcyL2xpbmVfaXRlbXMiLCJ2YWxpZGF0aW9uX2NvbnRleHQiOm51bGwsImVycm9ycyI6eyJlcnJvcnMiOnt9fX0sImF1ZCI6IjYzMDIwMDAwMDAwMDAwMjYwIiwiYXpwIjoiNjMwMjAwMDAwMDAwMDAyNjAiLCJodHRwczovL3B1cmwuaW1zZ2xvYmFsLm9yZy9zcGVjL2x0aS9jbGFpbS9kZXBsb3ltZW50X2lkIjoiMjc3OTY6NmVmYTIxNTYwNTA2Y2Q5ZmEzMDg1YTEwODgzYWVjNmE2MWY3MzNmMyIsImV4cCI6MTcyNzcwNDkzNiwiaWF0IjoxNzI3NzAxMzM2LCJpc3MiOiJodHRwczovL2NhbnZhcy5pbnN0cnVjdHVyZS5jb20iLCJub25jZSI6IjYwNTM2MjJkMzE0MDRmYTM5YTQ0ZjMxMTY4NWY4YjEwIiwic3ViIjoiMmE1OWVhNDMtZTNiYi00NmQ1LWEwNjQtYjY4YTg4NjQyNjI3IiwiaHR0cHM6Ly9wdXJsLmltc2dsb2JhbC5vcmcvc3BlYy9sdGkvY2xhaW0vdGFyZ2V0X2xpbmtfdXJpIjoiaHR0cHM6Ly9sdGkuY2xlYXJieXRlLmlvL29pZGM_YWN0aW9uPWxhdW5jaCIsInBpY3R1cmUiOiJodHRwczovL29ubGluZS5tYWNvbWIuZWR1L2ltYWdlcy90aHVtYm5haWxzLzIwMzU1ODc3LzExb0R3OGFuT2lDM3NSam5wa3BiNnh2UzQzN25WMUgxNkZLczRJR1oiLCJlbWFpbCI6Imtvc3Nqb0BtYWNvbWIuZWR1IiwibmFtZSI6IkpvaG4gS29zcyIsImdpdmVuX25hbWUiOiJKb2huIiwiZmFtaWx5X25hbWUiOiJLb3NzIiwiaHR0cHM6Ly9wdXJsLmltc2dsb2JhbC5vcmcvc3BlYy9sdGkvY2xhaW0vbGlzIjp7InBlcnNvbl9zb3VyY2VkaWQiOiIwNzgyNTQ3IiwiY291cnNlX29mZmVyaW5nX3NvdXJjZWRpZCI6IlNhbmRib3hfa29zc2pvIiwidmFsaWRhdGlvbl9jb250ZXh0IjpudWxsLCJlcnJvcnMiOnsiZXJyb3JzIjp7fX19LCJodHRwczovL3B1cmwuaW1zZ2xvYmFsLm9yZy9zcGVjL2x0aS9jbGFpbS9jb250ZXh0Ijp7ImlkIjoiNmVmYTIxNTYwNTA2Y2Q5ZmEzMDg1YTEwODgzYWVjNmE2MWY3MzNmMyIsImxhYmVsIjoiU2FuZGJveCBrb3Nzam8iLCJ0aXRsZSI6IlNhbmRib3gga29zc2pvIiwidHlwZSI6WyJodHRwOi8vcHVybC5pbXNnbG9iYWwub3JnL3ZvY2FiL2xpcy92Mi9jb3Vyc2UjQ291cnNlT2ZmZXJpbmciXSwidmFsaWRhdGlvbl9jb250ZXh0IjpudWxsLCJlcnJvcnMiOnsiZXJyb3JzIjp7fX19LCJodHRwczovL3B1cmwuaW1zZ2xvYmFsLm9yZy9zcGVjL2x0aS9jbGFpbS90b29sX3BsYXRmb3JtIjp7Imd1aWQiOiJHUGw3MVVWb05oeVg5N0c0VmlJdXA1ZnVidWVhUFFmY1pxcWJtWGZvOmNhbnZhcy1sbXMiLCJuYW1lIjoiTWFjb21iIENvbW11bml0eSBDb2xsZWdlIiwidmVyc2lvbiI6ImNsb3VkIiwicHJvZHVjdF9mYW1pbHlfY29kZSI6ImNhbnZhcyIsInZhbGlkYXRpb25fY29udGV4dCI6bnVsbCwiZXJyb3JzIjp7ImVycm9ycyI6e319fSwiaHR0cHM6Ly9wdXJsLmltc2dsb2JhbC5vcmcvc3BlYy9sdGkvY2xhaW0vbGF1bmNoX3ByZXNlbnRhdGlvbiI6eyJkb2N1bWVudF90YXJnZXQiOiJpZnJhbWUiLCJyZXR1cm5fdXJsIjoiaHR0cHM6Ly9vbmxpbmUubWFjb21iLmVkdS9jb3Vyc2VzLzcyNzIvZXh0ZXJuYWxfY29udGVudC9zdWNjZXNzL2V4dGVybmFsX3Rvb2xfcmVkaXJlY3QiLCJsb2NhbGUiOiJlbiIsImhlaWdodCI6ODAwLCJ3aWR0aCI6ODAwLCJ2YWxpZGF0aW9uX2NvbnRleHQiOm51bGwsImVycm9ycyI6eyJlcnJvcnMiOnt9fX0sImxvY2FsZSI6ImVuIiwiaHR0cHM6Ly9wdXJsLmltc2dsb2JhbC5vcmcvc3BlYy9sdGkvY2xhaW0vcm9sZXMiOlsiaHR0cDovL3B1cmwuaW1zZ2xvYmFsLm9yZy92b2NhYi9saXMvdjIvaW5zdGl0dXRpb24vcGVyc29uI0luc3RydWN0b3IiLCJodHRwOi8vcHVybC5pbXNnbG9iYWwub3JnL3ZvY2FiL2xpcy92Mi9pbnN0aXR1dGlvbi9wZXJzb24jU3R1ZGVudCIsImh0dHA6Ly9wdXJsLmltc2dsb2JhbC5vcmcvdm9jYWIvbGlzL3YyL21lbWJlcnNoaXAjSW5zdHJ1Y3RvciIsImh0dHA6Ly9wdXJsLmltc2dsb2JhbC5vcmcvdm9jYWIvbGlzL3YyL3N5c3RlbS9wZXJzb24jVXNlciJdLCJodHRwczovL3B1cmwuaW1zZ2xvYmFsLm9yZy9zcGVjL2x0aS9jbGFpbS9jdXN0b20iOnsidXNlcl9pZCI6IjE5ODQxIiwiY291cnNlX2lkIjoiNzI3MiIsImNvdXJzZV9lbmRfZGF0ZSI6bnVsbCwiY291cnNlX3N0YXJ0X2RhdGUiOiIyMDE2LTA2LTA1VDIzOjU1OjA3WiIsInN1Ym1pc3Npb25fZW5kX2RhdGUiOiIkUmVzb3VyY2VMaW5rLnN1Ym1pc3Npb24uZW5kRGF0ZVRpbWUiLCJzdWJtaXNzaW9uX3N0YXJ0X2RhdGUiOiIkUmVzb3VyY2VMaW5rLnN1Ym1pc3Npb24uc3RhcnREYXRlVGltZSIsImxhYl9pZCI6IkxhYklkLWl0Y2MxMDAwX3MzXzF2MSIsImxhYl9kZXNjIjoiQW4gYWN0aXZpdHkgdG8gY3JlYXRlIGFuIFMzIGJ1Y2tldCB0byBob3N0IGEgc3RhdGljIHdlYnNpdGUuIiwibGFiX25hbWUiOiJTMyBMYWIgMSIsInBsYWNlbWVudCI6ImFzc2lnbm1lbnRfc2VsZWN0aW9uIn0sImh0dHBzOi8vcHVybC5pbXNnbG9iYWwub3JnL3NwZWMvbHRpLW5ycHMvY2xhaW0vbmFtZXNyb2xlc2VydmljZSI6eyJjb250ZXh0X21lbWJlcnNoaXBzX3VybCI6Imh0dHBzOi8vb25saW5lLm1hY29tYi5lZHUvYXBpL2x0aS9jb3Vyc2VzLzcyNzIvbmFtZXNfYW5kX3JvbGVzIiwic2VydmljZV92ZXJzaW9ucyI6WyIyLjAiXSwidmFsaWRhdGlvbl9jb250ZXh0IjpudWxsLCJlcnJvcnMiOnsiZXJyb3JzIjp7fX19LCJodHRwczovL3B1cmwuaW1zZ2xvYmFsLm9yZy9zcGVjL2x0aS9jbGFpbS9sdGkxMV9sZWdhY3lfdXNlcl9pZCI6ImRlZjUzYzJhN2YxYWE3NDljNDE3ZTJkMjZiMzBmOGVjYTljMzI5NmIiLCJodHRwczovL3B1cmwuaW1zZ2xvYmFsLm9yZy9zcGVjL2x0aS9jbGFpbS9sdGkxcDEiOnsicmVzb3VyY2VfbGlua19pZCI6ImYxNTI5ZDNkMTVkM2NjOGU4YWEwMTRkOTVkNGU2ZGE3NTZmNGIyYzUiLCJ1c2VyX2lkIjoiZGVmNTNjMmE3ZjFhYTc0OWM0MTdlMmQyNmIzMGY4ZWNhOWMzMjk2YiIsInZhbGlkYXRpb25fY29udGV4dCI6bnVsbCwiZXJyb3JzIjp7ImVycm9ycyI6e319LCJvYXV0aF9jb25zdW1lcl9rZXkiOiJhc2RmYSIsIm9hdXRoX2NvbnN1bWVyX2tleV9zaWduIjoiRUovRlBRVmpKZERmb0srRVZXWTdaajlZckJqc3E0SzZaRS9obGhTd0FxOD0ifSwiZXJyb3JzIjp7ImVycm9ycyI6e319LCJodHRwczovL3d3dy5pbnN0cnVjdHVyZS5jb20vcGxhY2VtZW50IjpudWxsfQ.BklYMAEaDAaexdGu96pxn1aSMPPLPYPBU-UCqLAc6qPewwVqmQ4glg5j4LMJfWFzM46hUnN3-e6ZMiZgKtybUZNgU2KCmaH_bSsKShKuzr_uMKEevJvgqQmYqxBKBQhtRbkFZW_K8Wc2tWfJELLcFrUGBIQiQrM0wI1iSUEjZfwYrCuDjJflCfXNMUuFuXpVor95jxVFrGkBS3ONM4QXkSCdRRDrfPPrV6J9S7qQt7ncihD6PGKHll1Qvms9Xz_HSzmTOC-oT7OE_yOyGu4XdkKf2motnMcAj5vKfuZF1VNnp4QvPHIy0MBhcVcE2VmhZPbcCCEXUZ45nrh9fs82PQ"
// //     };
// // };

// // // Call the function and return the result
// // return fetchData();

// //const labId = document.querySelector('meta[name="lab_id"]')?.getAttribute('content') ?? '';
// //const labName = document.querySelector('meta[name="lab_name"]')?.getAttribute('content') ?? '';
// //const sub = document.querySelector('meta[name="sub"]')?.getAttribute('content') ?? '';
// //return { jwt: template.innerHTML, labId, labName, sub };
