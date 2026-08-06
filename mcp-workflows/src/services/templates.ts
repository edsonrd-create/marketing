import type { WorkflowTemplate } from "./store.js";

export const SEED_TEMPLATES: WorkflowTemplate[] = [
  {
    id: "tpl-birthday",
    name: "Birthday Message",
    description: "Send a birthday WhatsApp message with optional coupon",
    category: "whatsapp",
    trigger: { type: "schedule", cron: "0 9 * * *" },
    steps: [
      {
        type: "whatsapp.send_birthday_message",
        name: "Send Birthday Message",
        config: { template: "birthday_v1", includeCoupon: true },
      },
    ],
  },
  {
    id: "tpl-abandoned-cart",
    name: "Abandoned Cart Recovery",
    description: "Remind customers about items left in cart",
    category: "whatsapp",
    trigger: { type: "event", eventType: "cart.abandoned" },
    steps: [
      {
        type: "whatsapp.send_template",
        name: "Cart Reminder",
        config: { templateName: "abandoned_cart_v1", delayHours: 2 },
      },
      {
        type: "whatsapp.send_coupon",
        name: "Offer Discount",
        config: { discount: "10% OFF", delayHours: 24 },
      },
    ],
  },
  {
    id: "tpl-welcome",
    name: "Welcome Series",
    description: "Onboard new subscribers with a welcome message",
    category: "whatsapp",
    trigger: { type: "event", eventType: "contact.created" },
    steps: [
      {
        type: "whatsapp.send_template",
        name: "Welcome Message",
        config: { templateName: "welcome_v1" },
      },
    ],
  },
  {
    id: "tpl-order-confirmation",
    name: "Order Confirmation",
    description: "Send order confirmation after purchase",
    category: "whatsapp",
    trigger: { type: "event", eventType: "order.completed" },
    steps: [
      {
        type: "whatsapp.order_confirmation",
        name: "Confirm Order",
        config: {},
      },
    ],
  },
  {
    id: "tpl-weekly-report",
    name: "Weekly Performance Report",
    description: "Generate and review weekly marketing insights",
    category: "insights",
    trigger: { type: "schedule", cron: "0 8 * * 1" },
    steps: [
      {
        type: "insights.generate_report",
        name: "Generate Report",
        config: { format: "summary" },
      },
    ],
  },
  {
    id: "tpl-daily-campaign-audit-whatsapp",
    name: "Daily Campaign Audit & WhatsApp Dispatch",
    description: "Triggers mcp-insights campaign structure audit daily and automatically sends results to WhatsApp +55 (41) 99780-6839",
    category: "insights",
    trigger: { type: "schedule", cron: "0 9 * * *" },
    steps: [
      {
        type: "insights.audit_campaign_structure",
        name: "Run Daily Campaign Structure Audit",
        config: { channel: "google", autoGenerateTasks: true },
      },
      {
        type: "whatsapp.send_message",
        name: "Send Audit & Tasks to WhatsApp",
        config: { recipientPhone: "5541997806839", messageFormat: "executive_audit_summary" },
      },
    ],
  },
];

export function seedTemplates(existing: WorkflowTemplate[]): WorkflowTemplate[] {
  const byId = new Map(existing.map((t) => [t.id, t]));
  for (const template of SEED_TEMPLATES) {
    if (!byId.has(template.id)) {
      byId.set(template.id, template);
    }
  }
  return [...byId.values()];
}
