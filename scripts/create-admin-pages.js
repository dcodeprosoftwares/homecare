const fs = require('fs');
const path = require('path');

const pages = ['services', 'careers', 'blogs', 'gallery', 'testimonials', 'inquiries'];
const baseDir = path.join(__dirname, '../app/(admin)/admin');

pages.forEach(page => {
  const dir = path.join(baseDir, page);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const title = page.charAt(0).toUpperCase() + page.slice(1);
  const content = `export default function ${title}AdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manage ${title}</h1>
        <button className="bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors">
          Add New
        </button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
        <p>The ${title} management module is ready to be connected to Supabase.</p>
      </div>
    </div>
  );
}`;
  fs.writeFileSync(path.join(dir, 'page.tsx'), content);
});

console.log('Admin pages created successfully.');
