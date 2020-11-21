/**
 * Create a function to generate monotinic numeric ids.
 *
 * @param start the starting id number
 */
export const idGenerator = (start = 0) => {
  let id = start
  return () => id++
}
