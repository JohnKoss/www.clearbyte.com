// import InstructionEditor from "$components/instruction/InstructionEditor.svelte"; //InstructionsStore,
// import ActionsEditor from "$components/actions/ActionsEditor.svelte"; //ActionsStore,
// import Config from "$lib/properties/Config.svelte";
// import Analysis from "$lib/analysis/Analysis.svelte";
import {
    TAB_INSTRUCTIONS,
    TAB_ACTIONS,
    TAB_SCORESHEET,
    TAB_PROPERTIES,
    TAB_ANALYSIS,
} from "./constants";
import { type TabItem } from "../model.svelte.";

export let TabItems: TabItem[] = $state([
    { id: TAB_INSTRUCTIONS, data: "" },
    { id: TAB_ACTIONS, data: "" },
    { id: TAB_SCORESHEET, data: "" },
    { id: TAB_PROPERTIES, data: "" },
    { id: TAB_ANALYSIS, data: "" },
]);

// ///////////////
// export let TabItems2 = [
//     {
//         id: TAB_PROPERTIES,
//         component: Config,
//         data:$state("")
//     },
//     {
//         id: TAB_INSTRUCTIONS,
//         component: InstructionEditor,
//         data:""
//     },
//     {
//         id: TAB_ACTIONS,
//         component: ActionsEditor,
//         data:""
//     },
//     {
//         id: TAB_SCORESHEET,
//         component: ActionsEditor,
//         data:""
//     },
//     { id: TAB_ANALYSIS, component: Analysis  },
// ]