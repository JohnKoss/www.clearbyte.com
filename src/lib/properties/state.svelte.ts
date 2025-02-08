import { type CustomClaims} from '../../routes/state.svelte';
// Define the AssignmentProperties type
export interface Props  {
    id: string;
    name: string;
    desc: string;
    level: string;
    points: number;
    version: string;
    attempts: number;
    duration: number;
    //[key: string]: string | number;
}

export interface AssignmentProperties {
    lab: Props;
}

// Initialize the state with the AssignmentProperties type
export const configState = $state<AssignmentProperties>({
    lab: {
        id: '',
        desc: '',
        name: '',
        level: '1',
        points: 0,
        version: '1',
        attempts: 3,
        duration: 300
    }
});