"use server";

import { unstable_cache } from "next/cache";
import { db } from "@/db/drizzle";
import { KYCVerification, registrations, user, workshops } from "@/db/schema";
import { desc, eq, sql } from "drizzle-orm";

export const dashboardFetch = unstable_cache(
  async () => {
    /* -------------------------
       1. TOTAL USERS
    -------------------------- */
    const totalUsersRes = await db.select({ count: sql`count(*)` }).from(user);
    const totalUsers = Number(totalUsersRes[0]?.count || 0);

    /* -------------------------
       2. TOTAL WORKSHOPS
    -------------------------- */
    const totalWorkshopsRes = await db
      .select({ count: sql`count(*)` })
      .from(workshops);
    const totalWorkshops = Number(totalWorkshopsRes[0]?.count || 0);

    /* -------------------------
       3. PENDING KYC
    -------------------------- */
    const pendingKycRes = await db
      .select({ count: sql`count(*)` })
      .from(KYCVerification)
      .where(eq(KYCVerification.status, "pending"));
    const pendingKyc = Number(pendingKycRes[0]?.count || 0);

    /* -------------------------
       4. TOTAL REVENUE
    -------------------------- */
    const totalRevenueRes = await db
      .select({
        total: sql`COALESCE(SUM(${registrations.amountPaid}), 0)`,
      })
      .from(registrations);
    const totalRevenue = Number(totalRevenueRes[0]?.total || 0);

    /* -------------------------
       5. MONTHLY REVENUE GRAPH
    -------------------------- */
    const revenueResult = await db.execute(sql`
      SELECT 
        TO_CHAR(created_at, 'Mon') AS month,
        SUM(amount_paid) AS revenue
      FROM registrations
      GROUP BY month, DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at)
    `);

    const rows = revenueResult.rows ?? revenueResult;

    let revenueData = rows.map((row) => ({
      month: String(row.month),
      revenue: Number(row.revenue),
    }));

    // ✅ FIX: if only one month, add previous month with 0 revenue
    if (revenueData.length === 1) {
      const monthOrder = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];

      const currentIndex = monthOrder.indexOf(revenueData[0].month);
      const prevMonth = monthOrder[(currentIndex - 1 + 12) % 12];

      revenueData = [{ month: prevMonth, revenue: 0 }, revenueData[0]];
    }

    /* -------------------------
       6. UPCOMING 5 WORKSHOPS
    -------------------------- */
    const upcomingWorkshops = await db
      .select({
        id: workshops.id,
        title: workshops.title,
        date: workshops.date,
        time: workshops.time,
        price: workshops.price,
        mode: workshops.mode,
      })
      .from(workshops)
      .orderBy(desc(workshops.createdAt))
      .limit(5);

    /* -------------------------
       7. RECENT 5 USERS
    -------------------------- */
    const recentUsers = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      })
      .from(user)
      .orderBy(desc(user.createdAt))
      .limit(5);

    return {
      totalUsers,
      totalWorkshops,
      pendingKyc,
      totalRevenue,
      revenueData,
      upcomingWorkshops,
      recentUsers,
    };
  },
  ["admin-dashboard"],
  {
    revalidate: 60, // auto refresh every 60 seconds
    tags: ["admin-dashboard"],
  }
);
