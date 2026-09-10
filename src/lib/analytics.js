const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };


// Marketing & analytics event tracker.
// Sends events to the Base44 analytics pipeline. Safe to call — no-ops on failure.
export function track(event, properties = {}) {
  try {
    db.analytics.track({ eventName: event, properties });
  } catch {
    // Silently ignore — analytics should never break the UX
  }
}

export const Events = {
  PAGE_VIEW: "page_view",
  VIEW_CONTENT: "view_content",
  SEARCH: "search",
  ADD_TO_CART: "add_to_cart",
  BEGIN_CHECKOUT: "begin_checkout",
  PURCHASE: "purchase",
  LEAD: "lead",
  WHATSAPP_CLICK: "whatsapp_click",
};