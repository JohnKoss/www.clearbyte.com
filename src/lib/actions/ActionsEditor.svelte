<script lang="ts">
  import { EditorView, basicSetup } from "codemirror";
  import { json } from "@codemirror/lang-json";
  import { wordCounter } from "./panel";
  import { lightTheme, fixedHeightEditor, fontTheme } from "./theme";
  import Menu, { themeCompartment, fontCompartment } from "./Menu.svelte";
  import { onDestroy, onMount } from "svelte";
  import { TabItems } from "../../routes/items.svelte";

  import {errorField} from "./errorHighlighting";

  const { id, data }: { id: number; data: string } = $props();
  let editor: EditorView | null = $state(null);

  //////////////
  onMount(async () => {
    let saveTimeout: ReturnType<typeof setTimeout>;
    editor = new EditorView({
      doc: data,
      extensions: [
        basicSetup,
        json(),
        wordCounter(),
        errorField,
        fixedHeightEditor,
        themeCompartment.of(lightTheme),
        fontCompartment.of(fontTheme),
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
              TabItems[id].data = update.state.doc.toString();
            }, 500);
          }
        }),
      ],
      parent: dom,
      dispatchTransactions: (tr) => editor?.update(tr),
    });
  });

  ///
  onDestroy(() => editor?.destroy());

  let dom: HTMLDivElement;
</script>

<div class="m-0">
  <Menu {editor} />
  <div bind:this={dom}></div>
</div>
