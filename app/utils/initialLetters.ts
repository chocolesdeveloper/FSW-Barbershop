export function initialLetters(name: string): String {
  const nameAndSurname = name.split(" ");

  let initalLetter = "";
  for (let name of nameAndSurname) {
    if (name.length > 0) {
      initalLetter += name[0].toUpperCase();
    }
  }

  return initalLetter;
}
