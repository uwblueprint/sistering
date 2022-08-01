/**
 * Convert string of ids to json of numeric id for prisma client input
 * @param  {string[]} ids
 * @returns array of numeric id object
 */
export default function convertToNumberIds(ids: string[]): { id: number }[] {
  return ids.map((id: string) => {
    return {
      id: Number(id),
    };
  });
}
