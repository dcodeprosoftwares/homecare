import { getGallery } from "@/app/actions/gallery";
import Image from "next/image";

export const revalidate = 3600;

export const metadata = {
  title: "Gallery | TrueCare Health At Home",
  description: "View photos of our facilities, staff, and care events.",
};

export default async function GalleryPage() {
  const items = await getGallery();

  return (
    <div className="flex flex-col">
      <section className="bg-primary-900 py-16 lg:py-24 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6">Photo Gallery</h1>
          <p className="text-xl text-primary-200 max-w-2xl mx-auto">
            A glimpse into the care and compassion we provide every single day.
          </p>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {items.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Gallery is Empty</h3>
              <p className="text-gray-500">Photos will be added soon.</p>
            </div>
          ) : (
            <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
              {items.map((item: any) => (
                <div key={item.id} className="break-inside-avoid bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group">
                  <div className="relative overflow-hidden bg-gray-100 aspect-square">
                    <Image 
                      src={item.image_url} 
                      alt={item.title || "Gallery photo"} 
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <div>
                        <h4 className="text-white font-bold text-lg">{item.title}</h4>
                        <p className="text-gray-300 text-sm">{item.category}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}