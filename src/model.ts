export interface TabItem {
  id: number; // Unique identifier and index
  component: any; // Use a more specific type if you know the component type  
  data?: string; // Data in json format
}
