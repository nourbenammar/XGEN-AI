let counter = 0;

export function getRandomAvatar() {
  // Using a more reliable service with unique seeds
  const styles = [
    "adventurer",
    "adventurer-neutral",
    "avataaars",
    "big-ears",
    "big-smile",
    "bottts",
    "croodles",
    "fun-emoji",
    "icons",
    "identicon",
    "initials",
    "lorelei",
    "micah",
    "miniavs",
    "open-peeps",
    "personas",
    "pixel-art",
    "shapes",
  ];
  const style = styles[Math.floor(Math.random() * styles.length)];
  counter++;
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${
    Date.now() + counter
  }`;
}

// Alternative approach using a more reliable service
// export function getRandomAvatar() {
//     const randomSeed = Math.floor(Math.random() * 1000)
//     return `https://api.dicebear.com/7.x/avataaars/svg?seed=${randomSeed}`
// }
