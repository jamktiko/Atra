import { greetingsData } from './greetings';

export function getRandomGreeting(greetingsData: string[]) {
  const greetings = greetingsData;
  const index = Math.floor(Math.random() * greetings.length);
  return greetings[index];
}
