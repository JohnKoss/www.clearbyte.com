////////////////////
export function findFirstAvailableId(attrId: string): string {

    const elements = document.querySelectorAll(`[${attrId}]`) as NodeListOf<HTMLElement>;
    const ids = Array.from(elements)
      .map((el) => parseInt(el.getAttribute(attrId) || "-1", 10))
      .filter((id) => id >= 0);
  
    // Sort the `ids` in ascending order
    ids.sort((a, b) => a - b);
  
    // Find the first missing number in the sequence
    let availableId = 0;
    for (const id of ids) {
      if (id !== availableId) {
        return availableId.toString();
      }
      availableId++;
    }
  
    // If no gaps were found, return the next number after the largest `id`
    return availableId.toString();
  }
  