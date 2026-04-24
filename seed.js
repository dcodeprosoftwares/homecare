const { createClient } = require('@supabase/supabase-js');

const supabase = createClient('https://otuxvvxveuomytcosnta.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90dXh2dnh2ZXVvbXl0Y29zbnRhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NzM4MzcsImV4cCI6MjA5MjU0OTgzN30.kONsx84_Ib-7Vlziqw2ovG02UrVoYNirQ0Lf2k2MeYg');

async function seed() {
  console.log("Seeding services...");
  await supabase.from('services').insert([
    { title: 'Nursing Care', slug: 'nursing-care', description: 'Professional nursing care including wound care, vital monitoring, and post-operative support.', icon: 'Activity', content: 'Our certified nurses provide hospital-level care right in your home. Perfect for patients recovering from surgery, managing chronic illnesses, or requiring skilled medical interventions.', is_active: true },
    { title: 'Elderly Companion', slug: 'elderly-care', description: 'Compassionate assistance with daily activities, meal prep, and meaningful companionship.', icon: 'HeartPulse', content: 'We help seniors maintain their independence safely. Services include light housekeeping, grocery shopping, medication reminders, and engaging social interaction.', is_active: true },
    { title: 'Physiotherapy', slug: 'physiotherapy', description: 'In-home physical therapy to restore mobility, strength, and independence after injury.', icon: 'Users', content: 'Our licensed physiotherapists bring the clinic to you. We design custom exercise programs to help you recover from joint replacements, strokes, or mobility issues.', is_active: true },
    { title: 'Dementia Care', slug: 'dementia-care', description: 'Specialized care protocols for Alzheimer’s and dementia patients to ensure safety and comfort.', icon: 'Shield', content: 'Caring for a loved one with dementia can be overwhelming. Our specially trained caregivers provide a safe environment, cognitive stimulation, and respite for family members.', is_active: true },
    { title: '24/7 Monitoring', slug: 'monitoring', description: 'Round-the-clock supervision and care for patients who require constant medical attention.', icon: 'Clock', content: 'For peace of mind, our team works in shifts to ensure your loved one is never alone. We monitor vitals, assist with nighttime routines, and handle emergencies instantly.', is_active: true }
  ]);

  console.log("Seeding careers...");
  await supabase.from('careers').insert([
    { job_title: 'Registered Nurse (RN)', slug: 'rn-homecare', location: 'New York, NY', employment_type: 'Full-time', description: 'Provide skilled nursing care to patients in their homes.', requirements: 'Valid RN license, 2+ years of clinical experience, BLS certification.', is_active: true },
    { job_title: 'Physiotherapist', slug: 'physio', location: 'Los Angeles, CA', employment_type: 'Contract', description: 'Assess and treat patients recovering from injuries in home settings.', requirements: 'Degree in Physiotherapy, valid state license.', is_active: true },
    { job_title: 'Caregiver / Home Health Aide', slug: 'hha', location: 'Multiple Locations', employment_type: 'Part-time', description: 'Assist elderly clients with daily living activities.', requirements: 'HHA certification preferred, compassionate attitude.', is_active: true }
  ]);

  console.log("Seeding blogs...");
  await supabase.from('blogs').insert([
    { title: '5 Tips for Preventing Falls at Home', slug: 'prevent-falls', excerpt: 'Simple modifications you can make to ensure your home is safe for seniors.', content: '<p>Falls are the leading cause of injury among seniors. Here are 5 ways to prevent them:</p><ol><li>Remove trip hazards like loose rugs.</li><li>Install grab bars in the bathroom.</li><li>Improve lighting in hallways.</li><li>Wear non-slip footwear indoors.</li><li>Keep everyday items within easy reach.</li></ol>', cover_image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80', author_name: 'Dr. Sarah Jenkins', is_active: true },
    { title: 'The Mental Health Benefits of Home Care', slug: 'mental-health-homecare', excerpt: 'Why staying in familiar surroundings can dramatically improve patient outlook.', content: '<p>Healing isn’t just physical. Patients who recover in their own homes often experience less anxiety and depression compared to those in clinical settings. The comfort of a familiar bed, the presence of family pets, and the ability to maintain a personalized routine all contribute to better mental health and faster physical recovery.</p>', cover_image: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800&q=80', author_name: 'TrueCare Team', is_active: true }
  ]);

  console.log("Seeding testimonials...");
  await supabase.from('testimonials').insert([
    { author_name: 'Emily R.', content: 'The nurses from TrueCare were absolute angels during my father’s recovery. They were professional, gentle, and always on time.', rating: 5, is_active: true },
    { author_name: 'Michael T.', content: 'Having a physiotherapist come to my house saved me so much pain and hassle after my knee replacement. Highly recommend their services!', rating: 5, is_active: true },
    { author_name: 'Sarah W.', content: 'We use their 24/7 monitoring service for my grandmother. The peace of mind it gives our family is priceless.', rating: 5, is_active: true }
  ]);

  console.log("Seeding gallery...");
  await supabase.from('gallery').insert([
    { title: 'Nurse Consultation', image_url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80', category: 'Staff', is_active: true },
    { title: 'Elderly Care', image_url: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?w=800&q=80', category: 'Patients', is_active: true },
    { title: 'Physiotherapy Session', image_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=80', category: 'Services', is_active: true }
  ]);

  console.log("Done seeding!");
}
seed();
