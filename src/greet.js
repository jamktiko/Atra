import { greetingsData } from "./greetings.js";

function getRandomGreeting() {
  const { greetings } = greetingsData;
  const index = Math.floor(Math.random() * greetings.length);
  return greetings[index];
}
