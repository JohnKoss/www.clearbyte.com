export const IMG_STYLE_LEFT = 'display:block; margin-right:auto;'
export const IMG_STYLE_CENTER ='display:block; margin-left:auto; margin-right:auto;'
export const IMG_STYLE_RIGHT = 'display:block; margin-left:auto;'
export const IMG_STYLE_INLINE = 'display:inline-block;'


// //import {SvelteMap} from 'svelte/reactivity';
export interface ImageProps {
    //id: number;
    src: string;
    alt: string;
    title: string;
    width: number;
    height: number;
    //pos: number;
}

// //export type Value = SvelteMap<number, ImageProps>;

// // /////////////
// // export let imageProps = new SvelteMap<number, ImageProps>([
// //     [0, {
// //         src: '',
// //         alt: '',
// //         title: '',
// //         width: 0,
// //         height: 0
// //     }]
// // ]);
// // export interface Value {
// //     props: ImageProps;
// // }
// // export interface ImageProps {
// //     id: number;
// //     src: string;
// //     alt: string;
// //     title: string;
// //     width: number;
// //     height: number;
// // }


// // /////////////
// // export let imageProps = $state<Value>({
// //     props: {
// //         id: 0,
// //         src: '',
// //         alt: '',
// //         title: '',
// //         width: 0,
// //         height: 0
// //     }
// // });

// // export function createImageProps({ id, src, alt, title, width, height }: ImageProps): ImageProps {
// //     let imageProps = $state({
// //         id,
// //         src,
// //         alt,
// //         title,
// //         width,
// //         height
// //     })
// //     return imageProps;
// // }
