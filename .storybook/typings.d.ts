// Permite importar el CSS crudo de un componente como string (Vite `?raw`),
// usado por las stories para documentar los design tokens consumidos.
declare module '*.css?raw' {
  const content: string;
  export default content;
}
