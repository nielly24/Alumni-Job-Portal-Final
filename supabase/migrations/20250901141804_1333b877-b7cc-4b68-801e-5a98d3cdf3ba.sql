-- Insert dummy job postings for demonstration
INSERT INTO public.job_postings (
  user_id,
  title,
  company,
  location,
  type,
  description,
  requirements,
  benefits,
  salary_min,
  salary_max,
  is_active,
  featured,
  application_url
) VALUES 
(
  '00000000-0000-0000-0000-000000000001'::uuid,
  'Senior Frontend Developer',
  'TechCorp Inc.',
  'San Francisco, CA',
  'Full-time',
  'We are seeking a talented Senior Frontend Developer to join our dynamic team. You will be responsible for building responsive web applications using modern JavaScript frameworks and ensuring excellent user experiences.',
  '• 5+ years of experience with React, Vue, or Angular
• Strong proficiency in JavaScript, HTML, and CSS
• Experience with state management libraries
• Knowledge of responsive design principles
• Familiarity with version control systems (Git)',
  '• Competitive salary and equity package
• Health, dental, and vision insurance
• Flexible work arrangements
• Professional development budget
• Catered meals and snacks',
  120000,
  180000,
  true,
  true,
  'https://techcorp.com/careers/frontend-dev'
),
(
  '00000000-0000-0000-0000-000000000002'::uuid,
  'Product Manager',
  'StartupXYZ',
  'New York, NY',
  'Full-time',
  'Join our product team to drive the development of innovative solutions. You will work closely with engineering, design, and business stakeholders to define product requirements and roadmaps.',
  '• 3+ years of product management experience
• Strong analytical and problem-solving skills
• Experience with agile development methodologies
• Excellent communication and leadership skills
• Data-driven approach to decision making',
  '• Stock options
• Remote work flexibility
• Learning and development opportunities
• Team retreats and events
• Top-tier health benefits',
  90000,
  130000,
  true,
  false,
  'https://startupxyz.com/jobs/pm'
),
(
  '00000000-0000-0000-0000-000000000003'::uuid,
  'UX/UI Designer',
  'Design Studios',
  'Austin, TX',
  'Full-time',
  'We are looking for a creative UX/UI Designer to create engaging and intuitive user experiences. You will be involved in the entire design process from concept to final implementation.',
  '• Portfolio demonstrating strong design skills
• Proficiency in Figma, Sketch, or Adobe Creative Suite
• Understanding of user-centered design principles
• Experience with prototyping and wireframing
• Knowledge of frontend development is a plus',
  '• Creative and collaborative work environment
• Design conference attendance
• Latest design tools and equipment
• Flexible PTO policy
• Health and wellness programs',
  70000,
  110000,
  true,
  false,
  'https://designstudios.com/careers/ux-designer'
),
(
  '00000000-0000-0000-0000-000000000004'::uuid,
  'DevOps Engineer',
  'CloudTech Solutions',
  'Remote',
  'Full-time',
  'Join our infrastructure team to build and maintain scalable cloud systems. You will work with cutting-edge technologies to ensure our platforms are reliable, secure, and performant.',
  '• Experience with AWS, GCP, or Azure
• Knowledge of containerization (Docker, Kubernetes)
• Proficiency in scripting languages (Python, Bash)
• Understanding of CI/CD pipelines
• Experience with infrastructure as code (Terraform, CloudFormation)',
  '• Fully remote position
• Top-tier compensation package
• Latest technology and equipment
• Professional certification support
• Unlimited PTO',
  100000,
  150000,
  true,
  true,
  'https://cloudtech.com/join/devops'
),
(
  '00000000-0000-0000-0000-000000000005'::uuid,
  'Marketing Specialist',
  'GrowthCo',
  'Chicago, IL',
  'Part-time',
  'Help drive our marketing initiatives across digital channels. You will be responsible for content creation, campaign management, and performance analysis.',
  '• 2+ years of digital marketing experience
• Proficiency in Google Analytics and marketing tools
• Strong writing and communication skills
• Experience with social media management
• Knowledge of SEO/SEM best practices',
  '• Flexible part-time schedule
• Performance-based bonuses
• Professional development opportunities
• Work-life balance focused culture
• Health benefits for part-time employees',
  40000,
  60000,
  true,
  false,
  'https://growthco.com/careers/marketing'
)