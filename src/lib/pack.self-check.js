import { isPackItem, normalizePieces, packAddKey, uid } from "./pack.js";

let failures = 0;
const check = (cond, label) => {
  if (cond) {
    console.log(`ok\t${label}`);
  } else {
    console.error(`FAIL\t${label}`);
    failures += 1;
  }
};

const pack = {
  productId: "p1",
  uid: "abc",
  quantity: 4,
  pieces: [
    { color: "Bleu", size: "M" },
    { color: "Noir", size: "L" },
    { color: "Bleu", size: "M" },
    { color: "Noir", size: "L" },
  ],
};
const single = { productId: "p1", color: "Bleu", size: "L" };

check(isPackItem(pack) === true, "pack detected");
check(isPackItem(single) === false, "single not a pack");
check(isPackItem({ productId: "p1", pieces: [] }) === false, "empty pieces not a pack");

check(packAddKey(pack) === "pack::abc", "pack keyed by uid");
check(packAddKey(single) === "p1::Bleu::L", "single legacy key");
check(packAddKey({ productId: "p1", color: "Bleu" }) === "p1::Bleu", "single legacy key filters null size");

check(uid() !== uid(), "uid unique");

const grown = normalizePieces(6, pack.pieces);
check(grown.length === 6, "grow duplicates to qty");
check(grown[4].color === "Noir" && grown[5].size === "L", "grow duplicates last piece");

const shrunk = normalizePieces(2, pack.pieces);
check(shrunk.length === 2 && shrunk[1].color === "Noir", "shrink slices to qty");

check(normalizePieces(8, []).length === 0, "no pieces yields empty");
check(normalizePieces(0, pack.pieces).length === 1, "quantity floors at 1");

if (failures > 0) {
  console.error(`${failures} check(s) failed`);
  process.exit(1);
} else {
  console.log("pack.self-check: all passed");
}