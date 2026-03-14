import { PrismaClient, AppRole, Gender } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seed() {
  console.log('Seeding database with sample data...\n');

  // 1. Create Organization Units (Khoa)
  console.log('1. Creating organization units...');
  const orgUnits = await Promise.all([
    prisma.organizationUnit.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, name: 'Khoa Công nghệ thông tin' },
    }),
    prisma.organizationUnit.upsert({
      where: { id: 2 },
      update: {},
      create: { id: 2, name: 'Khoa Kinh tế' },
    }),
    prisma.organizationUnit.upsert({
      where: { id: 3 },
      update: {},
      create: { id: 3, name: 'Khoa Ngoại ngữ' },
    }),
  ]);
  console.log(`   ✓ Created ${orgUnits.length} organization units\n`);

  // 2. Create Staff
  console.log('2. Creating staff members...');
  const staffData = [
    { id: 1, name: 'Tạ Hải Tùng', homeEmail: 'tung.th@hust.edu.vn', schoolEmail: 'tung.tahai@hust.edu.vn', staffcode: 'GV001', gender: Gender.male, academicrank: 'PGS', academicdegree: 'Tiến sỹ', position: 'Viện trưởng', isPartyMember: true, organizationunitid: 1 },
    { id: 2, name: 'Nguyễn Linh Giang', homeEmail: 'giang.nl@hust.edu.vn', schoolEmail: 'giang.nguyenlinh@hust.edu.vn', staffcode: 'GV002', gender: Gender.male, academicrank: 'PGS', academicdegree: 'Tiến sỹ', position: 'Trưởng bộ môn', isPartyMember: true, organizationunitid: 1 },
    { id: 3, name: 'Phạm Văn Hải', homeEmail: 'hai.pv@hust.edu.vn', schoolEmail: 'hai.phamvan@hust.edu.vn', staffcode: 'GV003', gender: Gender.male, academicrank: 'PGS', academicdegree: 'Tiến sỹ', position: 'Phó Viện trưởng', isPartyMember: true, organizationunitid: 1 },
    { id: 4, name: 'Huỳnh Thị Thanh Bình', homeEmail: 'binh.htt@hust.edu.vn', schoolEmail: 'binh.huynhthithanh@hust.edu.vn', staffcode: 'GV004', gender: Gender.female, academicrank: 'GS', academicdegree: 'Tiến sỹ', position: 'Trưởng bộ môn', isPartyMember: true, organizationunitid: 2 },
    { id: 5, name: 'Trần Quang Đức', homeEmail: 'duc.tq@hust.edu.vn', schoolEmail: 'duc.tranquang@hust.edu.vn', staffcode: 'GV005', gender: Gender.male, academicrank: 'PGS', academicdegree: 'Tiến sỹ', position: 'Giảng viên', isPartyMember: true, organizationunitid: 2 },
    { id: 6, name: 'Lê Thanh Hương', homeEmail: 'huong.lt@hust.edu.vn', schoolEmail: 'huong.lethanh@hust.edu.vn', staffcode: 'GV006', gender: Gender.female, academicrank: 'PGS', academicdegree: 'Tiến sỹ', position: 'Giảng viên', isPartyMember: false, organizationunitid: 3 },
    { id: 7, name: 'Ngô Thanh Trung', homeEmail: 'trung.nt@hust.edu.vn', schoolEmail: 'trung.ngothanh@hust.edu.vn', staffcode: 'GV007', gender: Gender.male, academicrank: null, academicdegree: 'Tiến sỹ', position: 'Giảng viên', isPartyMember: false, organizationunitid: 3 },
    { id: 8, name: 'Nguyễn Thị Thanh Nga', homeEmail: 'nga.ntt@hust.edu.vn', schoolEmail: 'nga.nguyenthithanh@hust.edu.vn', staffcode: 'GV008', gender: Gender.female, academicrank: null, academicdegree: 'Tiến sỹ', position: 'Giảng viên', isPartyMember: true, organizationunitid: 1 },
  ];

  for (const s of staffData) {
    await prisma.staff.upsert({
      where: { id: s.id },
      update: s,
      create: s,
    });
  }
  console.log(`   ✓ Created ${staffData.length} staff members\n`);

  // 3. Create Groups
  console.log('3. Creating groups...');
  const groups = await Promise.all([
    prisma.group.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, name: 'Nhóm Lập trình', organizationunitid: 1 },
    }),
    prisma.group.upsert({
      where: { id: 2 },
      update: {},
      create: { id: 2, name: 'Nhóm Mạng máy tính', organizationunitid: 1 },
    }),
    prisma.group.upsert({
      where: { id: 3 },
      update: {},
      create: { id: 3, name: 'Nhóm Kinh tế vĩ mô', organizationunitid: 2 },
    }),
    prisma.group.upsert({
      where: { id: 4 },
      update: {},
      create: { id: 4, name: 'Nhóm Tiếng Anh', organizationunitid: 3 },
    }),
  ]);
  console.log(`   ✓ Created ${groups.length} groups\n`);

  // 4. Create Staff2Groups (assign staff to groups)
  console.log('4. Assigning staff to groups...');
  const staff2groupsData = [
    { staffid: 1, groupid: 1 },
    { staffid: 2, groupid: 1 },
    { staffid: 3, groupid: 1 },
    { staffid: 8, groupid: 1 },
    { staffid: 1, groupid: 2 },
    { staffid: 3, groupid: 2 },
    { staffid: 4, groupid: 3 },
    { staffid: 5, groupid: 3 },
    { staffid: 6, groupid: 4 },
    { staffid: 7, groupid: 4 },
  ];

  for (const s2g of staff2groupsData) {
    await prisma.staff2Group.upsert({
      where: {
        staffid_groupid: { staffid: s2g.staffid, groupid: s2g.groupid },
      },
      update: {},
      create: s2g,
    });
  }
  console.log(`   ✓ Created ${staff2groupsData.length} staff-group assignments\n`);

  // 5. Create Questions
  console.log('5. Creating evaluation questions...');
  const questions = await Promise.all([
    prisma.question.upsert({
      where: { id: 1 },
      update: {},
      create: { id: 1, title: 'Tinh thần trách nhiệm', description: 'Đánh giá mức độ hoàn thành công việc được giao' },
    }),
    prisma.question.upsert({
      where: { id: 2 },
      update: {},
      create: { id: 2, title: 'Khả năng hợp tác', description: 'Đánh giá khả năng làm việc nhóm và phối hợp với đồng nghiệp' },
    }),
    prisma.question.upsert({
      where: { id: 3 },
      update: {},
      create: { id: 3, title: 'Chuyên môn nghiệp vụ', description: 'Đánh giá năng lực chuyên môn và kiến thức' },
    }),
    prisma.question.upsert({
      where: { id: 4 },
      update: {},
      create: { id: 4, title: 'Đổi mới sáng tạo', description: 'Đánh giá khả năng đề xuất ý tưởng mới và cải tiến công việc' },
    }),
    prisma.question.upsert({
      where: { id: 5 },
      update: {},
      create: { id: 5, title: 'Thái độ làm việc', description: 'Đánh giá thái độ tích cực, chuyên nghiệp trong công việc' },
    }),
  ]);
  console.log(`   ✓ Created ${questions.length} questions\n`);

  // 6. Create Evaluation Periods
  console.log('6. Creating evaluation periods...');
  const periods = await Promise.all([
    prisma.evaluationPeriod.upsert({
      where: { id: 1 },
      update: {},
      create: {
        id: 1,
        name: 'Đợt đánh giá HK1 2024-2025',
        description: 'Đánh giá đồng nghiệp học kỳ 1 năm học 2024-2025',
        startDate: new Date('2024-09-01'),
        endDate: new Date('2025-01-31'),
        status: 'closed',
      },
    }),
    prisma.evaluationPeriod.upsert({
      where: { id: 2 },
      update: {},
      create: {
        id: 2,
        name: 'Đợt đánh giá HK2 2024-2025',
        description: 'Đánh giá đồng nghiệp học kỳ 2 năm học 2024-2025',
        startDate: new Date('2025-02-01'),
        endDate: new Date('2025-06-30'),
        status: 'active',
      },
    }),
  ]);
  console.log(`   ✓ Created ${periods.length} evaluation periods\n`);

  // 7. Create Demo User Accounts
  console.log('7. Creating demo user accounts...');

  const demoAccounts = [
    // Admin account
    { email: 'admin@demo.com', password: 'Admin@123', staffId: 1, roles: [AppRole.admin, AppRole.user] },
    // Moderator account
    { email: 'moderator@demo.com', password: 'Mod@123', staffId: 3, roles: [AppRole.moderator, AppRole.user] },
    // Regular users linked to different staff/departments
    { email: 'user1@demo.com', password: 'User@123', staffId: 2, roles: [AppRole.user] },
    { email: 'user2@demo.com', password: 'User@123', staffId: 4, roles: [AppRole.user] },
    { email: 'user3@demo.com', password: 'User@123', staffId: 5, roles: [AppRole.user] },
    { email: 'user4@demo.com', password: 'User@123', staffId: 6, roles: [AppRole.user] },
    { email: 'user5@demo.com', password: 'User@123', staffId: 7, roles: [AppRole.user] },
    { email: 'user6@demo.com', password: 'User@123', staffId: 8, roles: [AppRole.user] },
  ];

  for (const account of demoAccounts) {
    const hashedPassword = await bcrypt.hash(account.password, 10);

    const user = await prisma.user.upsert({
      where: { email: account.email },
      update: { passwordHash: hashedPassword },
      create: {
        email: account.email,
        passwordHash: hashedPassword,
      },
    });

    await prisma.profile.upsert({
      where: { userId: user.id },
      update: { staffId: account.staffId },
      create: {
        userId: user.id,
        staffId: account.staffId,
      },
    });

    for (const role of account.roles) {
      await prisma.userRole.upsert({
        where: {
          userId_role: { userId: user.id, role },
        },
        update: {},
        create: {
          userId: user.id,
          role,
        },
      });
    }
  }
  console.log(`   ✓ Created ${demoAccounts.length} demo user accounts\n`);

  // Legacy accounts for backward compatibility
  console.log('8. Creating legacy test accounts...');
  const legacyPassword = await bcrypt.hash('admin123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: legacyPassword,
    },
  });

  await prisma.profile.upsert({
    where: { userId: adminUser.id },
    update: {},
    create: {
      userId: adminUser.id,
      staffId: null,
    },
  });

  await prisma.userRole.upsert({
    where: {
      userId_role: { userId: adminUser.id, role: AppRole.admin },
    },
    update: {},
    create: {
      userId: adminUser.id,
      role: AppRole.admin,
    },
  });

  const testPassword = await bcrypt.hash('test123', 10);
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      passwordHash: testPassword,
    },
  });

  await prisma.profile.upsert({
    where: { userId: testUser.id },
    update: {},
    create: {
      userId: testUser.id,
      staffId: null,
    },
  });
  console.log('   ✓ Created legacy accounts\n');

  // 9. Create Sample Evaluations (for closed period HK1)
  console.log('9. Creating sample evaluations for HK1 (closed)...');
  const evaluationDataHK1 = [];

  // Staff 1 evaluates Staff 2, 3, 8 in group 1
  for (const evaluateeid of [2, 3, 8]) {
    for (const questionid of [1, 2, 3, 4, 5]) {
      evaluationDataHK1.push({
        reviewerid: 1,
        evaluateeid,
        groupid: 1,
        questionid,
        periodid: 1,
        point: Math.round((Math.random() * 2 + 2) * 10) / 10,
      });
    }
  }

  // Staff 2 evaluates Staff 1, 3, 8 in group 1
  for (const evaluateeid of [1, 3, 8]) {
    for (const questionid of [1, 2, 3, 4, 5]) {
      evaluationDataHK1.push({
        reviewerid: 2,
        evaluateeid,
        groupid: 1,
        questionid,
        periodid: 1,
        point: Math.round((Math.random() * 2 + 2) * 10) / 10,
      });
    }
  }

  // Staff 4 evaluates Staff 5 in group 3
  for (const questionid of [1, 2, 3, 4, 5]) {
    evaluationDataHK1.push({
      reviewerid: 4,
      evaluateeid: 5,
      groupid: 3,
      questionid,
      periodid: 1,
      point: Math.round((Math.random() * 2 + 2) * 10) / 10,
    });
  }

  for (const e of evaluationDataHK1) {
    await prisma.evaluation.create({ data: e });
  }
  console.log(`   ✓ Created ${evaluationDataHK1.length} evaluations for HK1\n`);

  // 10. Create Sample Evaluations (for active period HK2)
  console.log('10. Creating sample evaluations for HK2 (active)...');
  const evaluationDataHK2 = [];

  // Staff 1 evaluates Staff 2 in group 1 (partial - still in progress)
  for (const questionid of [1, 2, 3]) {
    evaluationDataHK2.push({
      reviewerid: 1,
      evaluateeid: 2,
      groupid: 1,
      questionid,
      periodid: 2,
      point: Math.round((Math.random() * 2 + 2) * 10) / 10,
    });
  }

  for (const e of evaluationDataHK2) {
    await prisma.evaluation.create({ data: e });
  }
  console.log(`   ✓ Created ${evaluationDataHK2.length} evaluations for HK2\n`);

  // Reset sequences
  console.log('11. Resetting sequences...');
  await prisma.$executeRawUnsafe(`SELECT setval('organizationunits_id_seq', COALESCE((SELECT MAX(id) FROM organizationunits), 0) + 1, false)`);
  await prisma.$executeRawUnsafe(`SELECT setval('staff_id_seq', COALESCE((SELECT MAX(id) FROM staff), 0) + 1, false)`);
  await prisma.$executeRawUnsafe(`SELECT setval('groups_id_seq', COALESCE((SELECT MAX(id) FROM groups), 0) + 1, false)`);
  await prisma.$executeRawUnsafe(`SELECT setval('staff2groups_id_seq', COALESCE((SELECT MAX(id) FROM staff2groups), 0) + 1, false)`);
  await prisma.$executeRawUnsafe(`SELECT setval('questions_id_seq', COALESCE((SELECT MAX(id) FROM questions), 0) + 1, false)`);
  await prisma.$executeRawUnsafe(`SELECT setval('evaluation_periods_id_seq', COALESCE((SELECT MAX(id) FROM evaluation_periods), 0) + 1, false)`);
  await prisma.$executeRawUnsafe(`SELECT setval('evaluations_id_seq', COALESCE((SELECT MAX(id) FROM evaluations), 0) + 1, false)`);
  console.log('   ✓ Sequences reset\n');

  console.log('========================================');
  console.log('Seeding completed successfully!');
  console.log('========================================\n');

  console.log('Test Accounts:');
  console.log('  ┌───────────────────────────────────────────────────────────────┐');
  console.log('  │ DEMO ACCOUNTS                                                 │');
  console.log('  ├───────────────────────────────────────────────────────────────┤');
  console.log('  │ Admin:     admin@demo.com / Admin@123 (Tạ Hải Tùng)          │');
  console.log('  │ Moderator: moderator@demo.com / Mod@123 (Phạm Văn Hải)      │');
  console.log('  │ User 1:    user1@demo.com / User@123 (Nguyễn Linh Giang)     │');
  console.log('  │ User 2:    user2@demo.com / User@123 (Huỳnh Thị Thanh Bình)  │');
  console.log('  │ User 3:    user3@demo.com / User@123 (Trần Quang Đức)        │');
  console.log('  │ User 4:    user4@demo.com / User@123 (Lê Thanh Hương)        │');
  console.log('  │ User 5:    user5@demo.com / User@123 (Ngô Thanh Trung)       │');
  console.log('  │ User 6:    user6@demo.com / User@123 (Nguyễn Thị Thanh Nga)  │');
  console.log('  ├───────────────────────────────────────────────────────────────┤');
  console.log('  │ LEGACY ACCOUNTS (not linked to staff)                         │');
  console.log('  │ Admin: admin@example.com / admin123                           │');
  console.log('  │ User:  test@example.com / test123                             │');
  console.log('  └───────────────────────────────────────────────────────────────┘');

  await prisma.$disconnect();
}

seed().catch(console.error);
