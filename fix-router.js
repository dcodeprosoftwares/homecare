const fs = require('fs');
const path = require('path');

const adminDir = path.join(__dirname, 'app', '(admin)', 'admin');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (content.includes('useRouter')) return; // Already fixed

  // Add import
  if (content.includes('use client')) {
    content = content.replace(
      /("use client";|'use client';)/,
      "$1\nimport { useRouter } from 'next/navigation';"
    );
  }

  // Add useRouter hook
  content = content.replace(
    /export default function (\w+)\(([^)]*)\) \{/,
    "export default function $1($2) {\n  const router = useRouter();"
  );

  // Add router.refresh() inside successful actions
  // For handleCloseModal cases:
  content = content.replace(/handleCloseModal\(\);/g, "handleCloseModal();\n      router.refresh();");
  
  // For handleDelete cases where there's no modal:
  // Look for: if (result.error) { alert(...) } else { ... } OR just if (result.error) alert(...)
  // We can just forcefully add router.refresh() after the delete block.
  content = content.replace(
    /if \(result\.error\) \{\s*alert\([^)]+\);\s*\}/g,
    "if (result.error) { alert(result.error); } else { router.refresh(); }"
  );

  fs.writeFileSync(filePath, content);
  console.log('Fixed:', filePath);
}

const modules = ['services/ServicesClient.tsx', 'careers/CareersClient.tsx', 'blogs/BlogsClient.tsx', 'gallery/GalleryClient.tsx', 'testimonials/TestimonialsClient.tsx', 'inquiries/InquiriesClient.tsx'];

for (const mod of modules) {
  const p = path.join(adminDir, mod);
  if (fs.existsSync(p)) {
    fixFile(p);
  }
}
