export const metadata = {
  title: "Privacy Policy | William Dentist",
  description: "Privacy policy and data collection practices for William Dentist.",
};

export default function PrivacyPage() {
  return (
    <div className="bg-white min-h-screen py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-serif text-4xl font-bold tracking-tight text-slate-900 mb-8">
          Privacy <span className="text-cyan-600">Policy</span>
        </h1>
        
        <div className="prose prose-slate max-w-none text-slate-600">
          <p className="lead text-lg font-medium text-slate-700">
            <strong>Demo Statement:</strong> This website is a portfolio demonstration project. It is NOT a real dental clinic. The information collected on this site is not subject to HIPAA compliance and is used solely for the purpose of demonstrating software functionality. Please do not submit real medical data, social security numbers, or payment information.
          </p>

          <h2 className="font-serif text-2xl text-slate-900 mt-10 mb-4">1. Information We Collect</h2>
          <p>
            When you use our forms, chat, or request an appointment, we may collect the following information:
          </p>
          <ul>
            <li><strong>Contact Information:</strong> Name, email address, phone number.</li>
            <li><strong>Inquiry Details:</strong> The service you are interested in and any non-medical notes you provide in free-text fields.</li>
            <li><strong>Usage Data:</strong> Basic analytics such as page views and interaction events.</li>
          </ul>

          <h2 className="font-serif text-2xl text-slate-900 mt-10 mb-4">2. Purpose of Collection</h2>
          <p>
            We collect this information to:
          </p>
          <ul>
            <li>Respond to your inquiries and schedule appointments.</li>
            <li>Send confirmations, reminders, and follow-ups.</li>
            <li>Provide relevant answers via our AI chat assistant.</li>
            <li>Improve our website functionality and user experience.</li>
          </ul>

          <h2 className="font-serif text-2xl text-slate-900 mt-10 mb-4">3. AI and Third-Party Integrations</h2>
          <p>
            Our website uses an AI assistant and third-party automation tools (such as n8n) to process inquiries and manage schedules.
          </p>
          <ul>
            <li>Conversations with the AI assistant are stored to improve service quality and allow our human staff to follow up appropriately.</li>
            <li>Appointment data is synchronized with Google Calendar for scheduling purposes.</li>
          </ul>

          <h2 className="font-serif text-2xl text-slate-900 mt-10 mb-4">4. Cookies and Analytics</h2>
          <p>
            We use essential cookies to maintain sessions (e.g., for appointment requests) and optional analytics cookies to track usage patterns without storing sensitive free-text data.
          </p>

          <h2 className="font-serif text-2xl text-slate-900 mt-10 mb-4">5. Data Retention</h2>
          <p>
            Inquiry and appointment data is retained as long as necessary to provide services and maintain operational records. Since this is a demo environment, data may be periodically cleared.
          </p>

          <h2 className="font-serif text-2xl text-slate-900 mt-10 mb-4">6. Contact Us</h2>
          <p>
            If you have questions about this privacy policy, please contact us at hello@williamdentist.online or call +1 (555) 123-4567.
          </p>
          
          <p className="text-sm mt-12 text-slate-400">Last updated: August 2026</p>
        </div>
      </div>
    </div>
  );
}
