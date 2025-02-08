import {EditorView} from "@codemirror/view"

// 
  // Dark theme configuration
  export  const darkTheme = EditorView.theme({
    "&": { color: "#f8f8f2", backgroundColor: "#282a36" },
    ".cm-content": { 
        caretColor: "#ff79c6" ,
    },
    ".cm-cursor": { borderLeftColor: "#ff79c6" },
    "&.cm-focused .cm-selectionBackground, ::selection": { backgroundColor: "#44475a" },
  }, { dark: true });

  // Light theme configuration
  export const lightTheme = EditorView.theme({
    "&": { color: "#000000", backgroundColor: "#ffffff" },
    ".cm-content": { 
        caretColor: "#000000",
    },
    ".cm-cursor": { borderLeftColor: "#000000" },
    "&.cm-focused .cm-selectionBackground, ::selection": { backgroundColor: "#d0d0d0" },
  });

  // Light theme configuration
  export const fontTheme = EditorView.theme({
    ".cm-content": { 
        fontSize: `16px`, // Set the font size 
    }
  });

  export const fixedHeightEditor = EditorView.theme({
    "&": {height: "500px"},
    ".cm-scroller": {overflow: "auto"}
  })

  //export const baseTheme2 = EditorView.baseTheme({
    //     "&": {
    //       color: "#f8f8f2",
    //       backgroundColor: "#282a36" /* Dark background */,
    //       textSize: "16px",
    //     },
    //     ".cm-content": {
    //       caretColor: "#ff79c6", /* Custom caret color */
    //     },
    //     "&.cm-focused .cm-cursor": {
    //       borderLeftColor: "#ff79c6", /* Cursor color */
    //     },
    //     "&.cm-focused .cm-selectionBackground, ::selection": {
    //       backgroundColor: "#44475a", /* Selection color */
    //     },
    //     ".cm-gutters": {
    //       backgroundColor: "#282a36", /* Gutter background */
    //       color: "#6272a4", /* Gutter text color */
    //       border: "none"
    //     }
    //   });
    
    //   export const  myTheme = EditorView.theme({
    //     "&": {
    //       color: "white",
    //       backgroundColor: "#034"
    //     },
    //     ".cm-content": {
    //       caretColor: "#0e9"
    //     },
    //     "&.cm-focused .cm-cursor": {
    //       borderLeftColor: "#0e9"
    //     },
    //     "&.cm-focused .cm-selectionBackground, ::selection": {
    //       backgroundColor: "#074"
    //     },
    //     ".cm-gutters": {
    //       backgroundColor: "#045",
    //       color: "#ddd",
    //       border: "none"
    //     }
    //   }, {dark: true});
    