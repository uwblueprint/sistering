/**
 * @param {string} value
 * @returns string with first letter capitalized and rest lowercase
 */
export default function getTitleCaseForOneWord(value: string): string {
  return value[0].toUpperCase() + value.toLowerCase().slice(1);
}
