import { getGallery } from "@/app/actions/gallery";
import GalleryClient from "./GalleryClient";

export default async function GalleryAdminPage() {
  const items = await getGallery();
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manage Gallery</h1>
      </div>
      
      <GalleryClient initialItems={items} />
    </div>
  );
}