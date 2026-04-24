const fs = require('fs');
const path = require('path');

const pages = ['about', 'services', 'career', 'gallery', 'blogs', 'testimonials', 'contact'];
const baseDir = path.join(__dirname, '../app/(frontend)');

pages.forEach(page => {
  const dir = path.join(baseDir, page);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const title = page.charAt(0).toUpperCase() + page.slice(1);
  const content = `export default function ${title}Page() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">${title}</h1>
        <p className="text-gray-600">This is the ${title} page content.</p>
      </div>
    </div>
  );
}`;
  fs.writeFileSync(path.join(dir, 'page.tsx'), content);
});

console.log('Pages created successfully.');
