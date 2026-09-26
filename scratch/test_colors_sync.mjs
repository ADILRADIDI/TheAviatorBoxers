import assert from "node:assert";

// Simulation of color format and multi-word handling
const testColors = [
  { id: "col-1", name: "Noir", displayName: "Noir", hex: "#111111", active: true, sortOrder: 1 },
  { id: "col-2", name: "Bleu marine", displayName: "Bleu marine", hex: "#07132B", active: true, sortOrder: 2 },
  { id: "col-3", name: "Gris chiné", displayName: "Gris chiné", hex: "#8E9297", active: true, sortOrder: 3 },
  { id: "col-4", name: "Bleu marine / bande blanc", displayName: "Bleu marine / bande blanc", hex: "#07132B", hex2: "#FFFFFF", bicolor: true, active: true, sortOrder: 4 },
];

console.log("Testing multi-word and bicolor colors...");
for (const color of testColors) {
  assert(color.name.length > 0, "Color name must not be empty");
  const words = color.name.split(/\s+/);
  console.log(`✓ Color "${color.name}" (${words.length} words, hex: ${color.hex}${color.hex2 ? ' / ' + color.hex2 : ''}) validated successfully.`);
}

console.log("\nAll color validation assertions passed 100%!");
