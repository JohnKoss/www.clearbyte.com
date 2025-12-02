
import { SvelteMap } from 'svelte/reactivity';


// export interface EditorState {
//     //doc: string;
//     docs: SvelteMap<string, string>;
// }

// initialize the state with the EditorState type
export let editorState =  new Map() as SvelteMap<number, string>;


//export let editorState: EditorState = $state({ editor: null, doc: '' });