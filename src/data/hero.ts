// Homepage background video (drone footage of Poway).
//
// The compressed clip is hosted on Vercel Blob so it isn't stored in git. Until
// the Blob URL is filled in, the local copy in public/videos/ is used (that
// file is gitignored, so on Vercel the poster image shows instead).
const BLOB_VIDEO_URL = "https://d5czwmfqdpgymqmc.public.blob.vercel-storage.com/Drone%20Video%20Edit%201.0_3.mp4";

export const HERO_VIDEO = BLOB_VIDEO_URL || "/videos/poway-drone.mp4";

// Still frame shown while the video loads (and for reduced-motion visitors).
export const HERO_POSTER = "/videos/poway-drone-poster.jpg";
