import { useState, useEffect, useCallback } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { getSubscribers } from "~/lib/newsletter";
import { emailTemplates, getTemplateById, type EmailTemplate } from "~/data/email-templates";
import type { Subscriber } from "~/lib/newsletter";

// ── Route definition ─────────────────────────────────────────────────────────────

export const Route = createFileRoute("/admin/email-campaigns")({
  component: EmailCampaigns,
  head: () => ({
    meta: [{ title: "Email Campaigns - DropAI" }],
  }),
});

// ── Types ───────────────────────────────────────────────────────────────────────

interface SentCampaign {
  id: string;
  templateId: string;
  subject: string;
  sentAt: string;
  recipientCount: number;
}

// ── Main component ───────────────────────────────────────────────────────────────

function EmailCampaigns() {
  // Subscribers
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subscribersLoading, setSubscribersLoading] = useState(true);

  // Campaign form
  const [selectedTemplate, setSelectedTemplate] = useState<string>("welcome");
  const [subjectOverride, setSubjectOverride] = useState("");
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null);

  // Sent campaigns
  const [sentCampaigns, setSentCampaigns] = useState<SentCampaign[]>([]);

  // Preview template
  const [previewTemplate, setPreviewTemplate] = useState<EmailTemplate | null>(null);

  // Load subscribers
  useEffect(() => {
    getSubscribers()
      .then((data) => {
        setSubscribers(data);
        setSubscribersLoading(false);
      })
      .catch(() => {
        setSubscribersLoading(false);
      });
  }, []);

  // Load sent campaigns from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("dropai-sent-campaigns");
      if (stored) {
        setSentCampaigns(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  const saveSentCampaigns = useCallback((campaigns: SentCampaign[]) => {
    setSentCampaigns(campaigns);
    try {
      localStorage.setItem("dropai-sent-campaigns", JSON.stringify(campaigns));
    } catch {
      // ignore
    }
  }, []);

  const handleSendCampaign = useCallback(async () => {
    if (subscribers.length === 0) {
      setSendResult({ success: false, message: "No subscribers to send to." });
      return;
    }

    setSending(true);
    setSendResult(null);

    const template = getTemplateById(selectedTemplate);
    if (!template) {
      setSendResult({ success: false, message: "Template not found." });
      setSending(false);
      return;
    }

    // Simulate sending delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const campaign: SentCampaign = {
      id: crypto.randomUUID?.() ?? Date.now().toString(),
      templateId: selectedTemplate,
      subject: subjectOverride || template.subject,
      sentAt: new Date().toISOString(),
      recipientCount: subscribers.length,
    };

    saveSentCampaigns([campaign, ...sentCampaigns]);

    // Log the send action
    console.log(`[Email Campaign] Sent "${campaign.subject}" to ${campaign.recipientCount} subscribers`);

    setSendResult({
      success: true,
      message: `Campaign "${campaign.subject}" sent to ${campaign.recipientCount} subscriber(s)!`,
    });
    setSending(false);
    setSubjectOverride("");
  }, [selectedTemplate, subjectOverride, subscribers, sentCampaigns, saveSentCampaigns]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const selectedTemplateData = getTemplateById(selectedTemplate);

  return (
    <div className="flex min-h-dvh flex-col bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-gray-200/80 bg-white/90 backdrop-blur-lg dark:border-gray-800/80 dark:bg-gray-950/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-2 rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-indigo-400"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-600 to-purple-600">
                <svg className="h-4.5 w-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Email Campaigns
                </h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Manage subscribers and send email campaigns
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          {/* ── Left Column: Subscribers + Templates ─────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Subscribers List */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Subscribers
                  </h2>
                  {!subscribersLoading && (
                    <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400">
                      {subscribers.length}
                    </span>
                  )}
                </div>
              </div>
              <div className="overflow-x-auto">
                {subscribersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <svg className="h-6 w-6 animate-spin text-indigo-600" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  </div>
                ) : subscribers.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <svg className="mb-3 h-10 w-10 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">No subscribers yet</p>
                    <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">Subscribe via the newsletter form on the landing page</p>
                  </div>
                ) : (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-gray-800">
                        <th className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Email</th>
                        <th className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Subscribed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subscribers.map((sub) => (
                        <tr key={sub.email} className="border-b border-gray-50 transition-colors hover:bg-gray-50 dark:border-gray-800/50 dark:hover:bg-gray-800/30">
                          <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">{sub.email}</td>
                          <td className="px-6 py-3 text-right text-gray-500 dark:text-gray-400">{formatDate(sub.subscribedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Campaign Templates */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Campaign Templates
                </h2>
              </div>
              <div className="grid gap-4 p-6 sm:grid-cols-2">
                {emailTemplates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => {
                      setSelectedTemplate(template.id);
                      setPreviewTemplate(template);
                    }}
                    className={`relative rounded-xl border p-5 text-left transition-all hover:shadow-md ${
                      selectedTemplate === template.id
                        ? "border-indigo-500 bg-indigo-50 dark:border-indigo-400 dark:bg-indigo-950/20"
                        : "border-gray-200 bg-white hover:border-indigo-300 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-600"
                    }`}
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-lg">
                        {template.category === "welcome" ? "👋" :
                         template.category === "abandoned-cart" ? "🛒" :
                         template.category === "newsletter" ? "📬" : "✅"}
                      </span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {template.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                      {template.description}
                    </p>
                    <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 truncate">
                      Subject: {template.subject}
                    </p>
                    {selectedTemplate === template.id && (
                      <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] text-white">
                        ✓
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right Column: Send Campaign + Sent ─────────────────────────────── */}
          <div className="space-y-8">
            {/* Send Campaign */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <h2 className="mb-4 text-sm font-semibold text-gray-900 dark:text-white">
                Send Campaign
              </h2>

              {sendResult && (
                <div className={`mb-4 rounded-xl px-4 py-3 text-sm ${
                  sendResult.success
                    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
                    : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300"
                }`}>
                  {sendResult.success ? "✅ " : "⚠️ "}{sendResult.message}
                </div>
              )}

              <div className="space-y-4">
                {/* Template selector */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
                    Template
                  </label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-indigo-400"
                  >
                    {emailTemplates.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                {/* Subject override */}
                <div>
                  <label className="mb-1.5 block text-xs font-medium text-gray-600 dark:text-gray-400">
                    Subject Override <span className="text-gray-400 dark:text-gray-500">(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={subjectOverride}
                    onChange={(e) => setSubjectOverride(e.target.value)}
                    placeholder={selectedTemplateData?.subject ?? ""}
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 dark:focus:border-indigo-400"
                  />
                </div>

                {/* Recipients count */}
                <div className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3 dark:bg-gray-800/50">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Recipients</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {subscribers.length}
                  </span>
                </div>

                {/* Send button */}
                <button
                  onClick={handleSendCampaign}
                  disabled={sending || subscribers.length === 0}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {sending ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Send Campaign
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Template Preview */}
            {previewTemplate && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                    Template Preview
                  </h2>
                  <button
                    onClick={() => setPreviewTemplate(null)}
                    className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Subject
                  </p>
                  <p className="mb-4 text-sm font-medium text-gray-900 dark:text-white">
                    {previewTemplate.subject}
                  </p>
                  <p className="mb-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Preview
                  </p>
                  <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-100 bg-white p-3 text-xs text-gray-600 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-400">
                    <div className="prose prose-xs max-w-none" dangerouslySetInnerHTML={{
                      __html: previewTemplate.body.slice(0, 600) + "..."
                    }} />
                  </div>
                  <p className="mt-2 text-[10px] text-gray-400 dark:text-gray-500">
                    Showing first 600 characters • {previewTemplate.placeholders.length} placeholder variables
                  </p>
                </div>
              </div>
            )}

            {/* Sent Campaigns */}
            <div className="rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
              <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
                <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
                  Sent Campaigns
                </h2>
                {sentCampaigns.length > 0 && (
                  <button
                    onClick={() => {
                      saveSentCampaigns([]);
                    }}
                    className="text-xs text-gray-400 transition-colors hover:text-red-500"
                  >
                    Clear
                  </button>
                )}
              </div>
              {sentCampaigns.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <svg className="mb-2 h-8 w-8 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-xs text-gray-500 dark:text-gray-400">No campaigns sent yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {sentCampaigns.map((campaign) => {
                    const template = getTemplateById(campaign.templateId);
                    return (
                      <div key={campaign.id} className="px-6 py-4">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {campaign.subject}
                        </p>
                        <div className="mt-1 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <span>{template?.name ?? "Unknown template"}</span>
                          <span className="inline-block h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                          <span>{campaign.recipientCount} recipient(s)</span>
                          <span className="inline-block h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                          <span>{formatDate(campaign.sentAt)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center">
          <p className="text-[11px] text-gray-400 dark:text-gray-600">
            ⚡ Email campaigns are logged locally. Connect an email service provider for real delivery.
          </p>
        </div>
      </div>
    </div>
  );
}