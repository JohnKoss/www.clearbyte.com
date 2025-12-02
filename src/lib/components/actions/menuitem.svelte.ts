export type Command = () => void;
export type Active = () => boolean;

export class MenuItem {
    name: string;
    content: string;
    command: Command;
    active = $state<boolean>(false);
    separator: boolean = false;
    //#active: any = () => 1; // Initialize #fn with a default function
    //result = $derived(this.active);
    //doit: Active;


    constructor(
        name: string,
        content: string,
        command: Command,
        //doit: Active,
        separator = false,
    ) {
        this.name = name;
        this.command = command;
        this.content = content;
        //this.doit = doit;
        this.separator = separator;

        $effect(() => {
            // runs when the component is mounted, and again
            // whenever `count` or `doubled` change,
            // after the DOM has been updated
            //this.doit();

            return () => {
                // if a callback is provided, it will run
                // a) immediately before the effect re-runs
                // b) when the component is destroyed
                console.log('cleanup');
            };
        });

    }
}

///////////////////////
// type MenuItem = {
//   name: string;
//   command: (m: MenuItem) => void;
//   content: string;
//   toggled?: boolean;
//   separator?: boolean;
// };
//////////////////////
// let menuItemsLeft: MenuItem[] = [
//   {
//     name: 'hard-break',
//     command: () => console.log('hard-break'),
//     content: 'mdi:format-line-spacing',
//   },
//   {
//     name: 'undo',
//     command: () => console.log('hard-break'),
//     content: 'mdi:undo',
//   },
//   {
//     name: 'redo',
//     command: () => console.log('hard-break'),
//     content: 'mdi:redo',
//     separator: true,
//   },
//   {
//     name: 'toggle-theme',
//     command: function () {
//       console.log(`Executing command for ${this.name}`);
//       toggleTheme(this);
//     },
//     content: 'mdi:theme-light-dark',
//     toggled: $state(false),
//   },
//   {
//     name: 'change-font-size',
//     command: () => {
//       const newSize = prompt('Enter new font size:');
//       if (newSize) {
//         document.body.style.fontSize = newSize + 'px';
//       }
//     },
//     content: 'mdi:format-size',
//   },
//   {
//     name: 'question-mark',
//     command: () => console.log('hard-break'),
//     content: 'mdi:question-mark',
//   },
// ];
