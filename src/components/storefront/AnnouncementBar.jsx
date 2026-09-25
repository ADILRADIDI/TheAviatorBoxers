// The announcement ticker now lives inside the sticky header (see Navbar),
// so pages no longer render their own bar. Kept as a no-op component so
// existing page imports stay valid while they are migrated.
export default function AnnouncementBar() {
  return null;
}