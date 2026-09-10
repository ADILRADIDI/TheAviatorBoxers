const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

export const IMAGES = {
  heroProduct: "https://media.db.com/images/public/6a79ebca519f7434bf8ae448/174551e8d_generated_image.png",
  heroSlider: [
    "https://media.db.com/images/public/6a79ebca519f7434bf8ae448/5fb8e43fc_generated_image.png",
    "https://media.db.com/images/public/6a79ebca519f7434bf8ae448/8a1423eeb_generated_image.png",
    "https://media.db.com/images/public/6a79ebca519f7434bf8ae448/919471dba_generated_image.png",
  ],
  brandStory: "https://media.db.com/images/public/6a79ebca519f7434bf8ae448/b975da357_generated_be32477f.png",
  fabricMacro: "https://media.db.com/images/public/6a79ebca519f7434bf8ae448/1a28b1eed_generated_6277cb55.png",
  productNavy: "https://media.db.com/images/public/6a79ebca519f7434bf8ae448/45f75bafc_generated_66128165.png",
  productBlack: "https://media.db.com/images/public/6a79ebca519f7434bf8ae448/b5e437373_generated_a56d2a52.png",
  productGrey: "https://media.db.com/images/public/6a79ebca519f7434bf8ae448/eebc7e774_generated_ce94ea79.png",
  productRoyalBlue: "https://media.db.com/images/public/6a79ebca519f7434bf8ae448/838155bcf_generated_7ffc34ae.png",
  productWhite: "https://media.db.com/images/public/user_69fda7283dbd4a7b7ef386b7/c35258df0_WhatsAppImage2026-08-10at73849AM.jpg",
  packFive: "https://media.db.com/images/public/user_69fda7283dbd4a7b7ef386b7/10cc2e681_WhatsAppImage2026-08-10at73849AM1.jpg",
  logo: "https://media.db.com/images/public/user_69fda7283dbd4a7b7ef386b7/ed50e35b1_WhatsAppImage2026-08-10at73850AM.jpg",
};