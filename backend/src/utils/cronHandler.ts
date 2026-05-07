import cron from "node-cron";
import { certificateService } from "../services/certificate.service";

export const initCronJobs = () => {
  // Run at 2:00 PM every day
  cron.schedule("0 14 * * *", async () => {
    console.log("Cron: Processing pending certificates...");
    try {
      await certificateService.processPendingCertificates();
      console.log("Cron: Individual certificates processed");
    } catch (error) {
      console.error("Cron: Certificate processing failed", error);
    }
  });

  // Run bulk jobs at 2:05 PM (after individual certificates are ready)
  cron.schedule("5 14 * * *", async () => {
    console.log("Cron: Processing pending bulk jobs...");
    try {
      await certificateService.processPendingBulkJobs();
      console.log("Cron: Bulk jobs processed");
    } catch (error) {
      console.error("Cron: Bulk job processing failed", error);
    }
  });

  console.log("Cron jobs initialized");
};