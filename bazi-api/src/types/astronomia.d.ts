declare module 'astronomia' {
  export function julian(year: number, month: number, day: number): number;
  export function solar(date: Date): any;
  export function lunar(date: Date): any;
}
