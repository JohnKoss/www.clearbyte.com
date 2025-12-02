/////////////
export interface Option {
    text: string;
    selected: boolean;
}
export interface Attrs {
    qid: string;
    type: string;
    points: string;
    questionText: string;
    options: Option[];
}
