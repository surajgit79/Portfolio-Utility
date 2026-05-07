import cron from "node-cron";
import { certificateService } from "../services/certificate.service";

let isProcessingIndividual = false;
let isProcessingBulk = false;

export const initCronJobs = () => {
  cron.schedule("* * * * *", async () => {
    if (isProcessingIndividual) {
      return;
    }
    isProcessingIndividual = true;
    try {
      await certificateService.processPendingCertificates();
    } catch (error) {
      console.error("Cron: Certificate processing failed", error);
    } finally {
      isProcessingIndividual = false;
    }
  });

  cron.schedule("* * * * *", async () => {
    if (isProcessingBulk) {
      return;
    }
    if (isProcessingIndividual) {
      return;
    }
    isProcessingBulk = true;
    try {
      await certificateService.processPendingBulkJobs();
    } catch (error) {
      console.error("Cron: Bulk job processing failed", error);
    } finally {
      isProcessingBulk = false;
    }
  });

  console.log("Cron jobs initialized");
};
