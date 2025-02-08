import { EditorView, Decoration } from "@codemirror/view";
import { StateEffect, StateField } from "@codemirror/state";

// Effect to add or remove error decorations
interface ErrorRange {
  from: number;
  to: number;
}

const addErrorEffect = StateEffect.define<ErrorRange | null>();

export const errorField = StateField.define({
  create() {
    return Decoration.none;
  },
  update(value, tr) {
    value = value.map(tr.changes);
    for (let e of tr.effects) {
      if (e?.value && e.is(addErrorEffect)) {
        return Decoration.set([
          Decoration.mark({ class: "cm-error-highlight" }).range(e.value.from, e.value.to),
        ]);
      }
    }
    return value;
  },
  provide: (f) => EditorView.decorations.from(f),
});

// Function to highlight errors
export function highlightError(editorView: EditorView, from: number, to: number) {
  editorView.dispatch({
    effects: addErrorEffect.of({ from, to }),
  });
}

// Function to clear previous errors
export function clearError(editorView: { dispatch: (arg0: { effects: StateEffect<ErrorRange | null>; }) => void; }) {
  editorView.dispatch({
    effects: addErrorEffect.of(null),
  });
}
