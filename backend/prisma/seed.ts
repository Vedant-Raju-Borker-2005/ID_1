import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create a demo user
  const hashedPassword = await bcrypt.hash('password123', 12);
  const demoUser = await prisma.user.upsert({
    where: { email: 'designer@modular.io' },
    update: {},
    create: {
      email: 'designer@modular.io',
      name: 'Elena Rostova',
      passwordHash: hashedPassword,
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      isVerified: true,
    },
  });

  console.log(`Created/found User: ${demoUser.email}`);

  // 2. Create a demo workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: 'elena-studios' },
    update: {},
    create: {
      name: 'Elena Design Studios',
      slug: 'elena-studios',
      plan: 'PRO',
      ownerId: demoUser.id,
      members: {
        create: {
          userId: demoUser.id,
          role: 'OWNER',
        },
      },
    },
  });

  console.log(`Created/found Workspace: ${workspace.name} (slug: ${workspace.slug})`);

  // 3. Create sample resources (layouts/moodboards)
  const resources = [
    {
      title: 'Nordic Living Room Layout',
      type: 'layout',
      content: 'Minimalist living room arrangement focusing on functional zones, warm oak wood textures, and balanced neutral colors.',
      status: 'In Progress',
    },
    {
      title: 'Industrial Kitchen Concept',
      type: 'moodboard',
      content: 'Exposed brickwork combined with matte black cabinets, industrial pendant light fixtures, and polished concrete flooring.',
      status: 'Todo',
    },
    {
      title: 'Biophilic Bedroom Plan',
      type: 'layout',
      content: 'Main bedroom layout integrating modular planters, natural air-purifying foliage, linen curtains, and sound dampening wood panels.',
      status: 'Review',
    },
    {
      title: 'Japandi Dining Set Mockup',
      type: 'render',
      content: 'Visual mockups featuring clean lines, low-profile wooden tables, light bamboo partitions, and accent task lamps.',
      status: 'Done',
    },
  ];

  for (const r of resources) {
    const resource = await prisma.resource.create({
      data: {
        title: r.title,
        type: r.type,
        content: r.content,
        status: r.status,
        workspaceId: workspace.id,
        assigneeId: demoUser.id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    });
    console.log(`Created resource: ${resource.title}`);
  }

  // 4. Create sample automation rule
  const automation = await prisma.automationRule.create({
    data: {
      name: 'Post Slack Alert on Review Needed',
      trigger: 'status_changed',
      conditions: {
        field: 'status',
        operator: 'equals',
        value: 'Review',
      },
      actions: [
        {
          type: 'notify',
          title: 'Review Needed',
        },
      ],
      workspaceId: workspace.id,
      enabled: true,
    },
  });

  console.log(`Created sample automation rule: ${automation.name}`);
  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
