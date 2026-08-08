"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, X, Save, Loader2 } from "lucide-react";

type Service = {
  id: string;
  slug: string;
  name: string;
  summary: string;
  content: string;
  duration_minutes: number;
  price_text: string | null;
  published: boolean;
};

type FAQ = {
  id: string;
  category: string;
  question: string;
  answer: string;
  published: boolean;
};

type ModalState =
  | { type: "none" }
  | { type: "add-service" }
  | { type: "edit-service"; item: Service }
  | { type: "add-faq" }
  | { type: "edit-faq"; item: FAQ };

const emptyService = { slug: "", name: "", summary: "", content: "", duration_minutes: 60, price_text: "", published: false };
const emptyFaq = { category: "General", question: "", answer: "", published: false };

export default function AdminContentPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modal, setModal] = useState<ModalState>({ type: "none" });
  const [serviceForm, setServiceForm] = useState(emptyService);
  const [faqForm, setFaqForm] = useState(emptyFaq);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [svcRes, faqRes] = await Promise.all([
        fetch("/api/admin/services"),
        fetch("/api/admin/faqs"),
      ]);
      const svcJson = await svcRes.json();
      const faqJson = await faqRes.json();
      setServices(svcJson.data || []);
      setFaqs(faqJson.data || []);
    } catch {
      setError("Failed to load content from database.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openModal = (state: ModalState) => {
    setError(null);
    if (state.type === "edit-service") {
      setServiceForm({ ...state.item, price_text: state.item.price_text ?? "" });
    } else if (state.type === "add-service") {
      setServiceForm(emptyService);
    } else if (state.type === "edit-faq") {
      setFaqForm(state.item);
    } else if (state.type === "add-faq") {
      setFaqForm(emptyFaq);
    }
    setModal(state);
  };

  const saveService = async () => {
    setSaving(true);
    setError(null);
    const isEdit = modal.type === "edit-service";
    const url = isEdit ? `/api/admin/services/${(modal as any).item.id}` : "/api/admin/services";
    const method = isEdit ? "PATCH" : "POST";
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(serviceForm) });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "Failed to save");
      await fetchData();
      setModal({ type: "none" });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteService = async (id: string) => {
    if (!confirm("Delete this service? This action cannot be undone.")) return;
    const res = await fetch(`/api/admin/services/${id}`, { method: "DELETE" });
    if (res.ok) await fetchData();
  };

  const saveFaq = async () => {
    setSaving(true);
    setError(null);
    const isEdit = modal.type === "edit-faq";
    const url = isEdit ? `/api/admin/faqs/${(modal as any).item.id}` : "/api/admin/faqs";
    const method = isEdit ? "PATCH" : "POST";
    try {
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(faqForm) });
      const json = await res.json();
      if (!res.ok || json.error) throw new Error(json.error || "Failed to save");
      await fetchData();
      setModal({ type: "none" });
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteFaq = async (id: string) => {
    if (!confirm("Delete this FAQ? This action cannot be undone.")) return;
    const res = await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
    if (res.ok) await fetchData();
  };

  const togglePublished = async (type: "service" | "faq", id: string, current: boolean) => {
    const url = type === "service" ? `/api/admin/services/${id}` : `/api/admin/faqs/${id}`;
    await fetch(url, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ published: !current }) });
    await fetchData();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Content Management</h1>
        <p className="text-sm text-slate-500 mt-1">Manage services and FAQ articles displayed on the website.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-600" />
        </div>
      ) : (
        <>
          {/* Services */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">Services <span className="text-slate-400 font-normal text-sm">({services.length})</span></h2>
              <button onClick={() => openModal({ type: "add-service" })} className="inline-flex items-center gap-2 rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500 transition-colors">
                <Plus className="h-4 w-4" /> Add Service
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {services.length === 0 && <div className="p-8 text-center text-slate-400 text-sm">No services yet. Click "Add Service" to get started.</div>}
              {services.map((s) => (
                <div key={s.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div>
                    <p className="font-medium text-slate-900">{s.name}</p>
                    <p className="text-xs text-slate-500">/{s.slug} · {s.duration_minutes} min · {s.price_text || "No price set"}</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4">
                    <button onClick={() => togglePublished("service", s.id, s.published)} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${s.published ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                      {s.published ? "Published" : "Draft"}
                    </button>
                    <button onClick={() => openModal({ type: "edit-service", item: s })} className="text-slate-400 hover:text-cyan-600 p-2 transition-colors"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => deleteService(s.id)} className="text-slate-400 hover:text-red-600 p-2 transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">FAQs <span className="text-slate-400 font-normal text-sm">({faqs.length})</span></h2>
              <button onClick={() => openModal({ type: "add-faq" })} className="inline-flex items-center gap-2 rounded-md bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500 transition-colors">
                <Plus className="h-4 w-4" /> Add FAQ
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {faqs.length === 0 && <div className="p-8 text-center text-slate-400 text-sm">No FAQs yet. Click "Add FAQ" to get started.</div>}
              {faqs.map((f) => (
                <div key={f.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-slate-50 transition-colors">
                  <div className="flex-1 mr-4">
                    <p className="font-medium text-slate-900 text-sm">{f.question}</p>
                    <p className="text-xs text-slate-500 mt-0.5">Category: {f.category}</p>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-4 shrink-0">
                    <button onClick={() => togglePublished("faq", f.id, f.published)} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer transition-colors ${f.published ? "bg-green-100 text-green-800 hover:bg-green-200" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                      {f.published ? "Published" : "Draft"}
                    </button>
                    <button onClick={() => openModal({ type: "edit-faq", item: f })} className="text-slate-400 hover:text-cyan-600 p-2 transition-colors"><Edit2 className="h-4 w-4" /></button>
                    <button onClick={() => deleteFaq(f.id)} className="text-slate-400 hover:text-red-600 p-2 transition-colors"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Service Modal */}
      {(modal.type === "add-service" || modal.type === "edit-service") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="font-semibold text-lg text-slate-900">{modal.type === "add-service" ? "Add Service" : "Edit Service"}</h3>
              <button onClick={() => setModal({ type: "none" })} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>}
              {[
                { label: "Name", key: "name", type: "text" },
                { label: "Slug (URL)", key: "slug", type: "text" },
                { label: "Summary", key: "summary", type: "text" },
                { label: "Price", key: "price_text", type: "text" },
                { label: "Duration (minutes)", key: "duration_minutes", type: "number" },
              ].map(({ label, key, type }) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
                  <input type={type} value={(serviceForm as any)[key]} onChange={e => setServiceForm(f => ({ ...f, [key]: type === "number" ? Number(e.target.value) : e.target.value }))} className="w-full rounded-md border-0 py-2 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-cyan-600 text-sm" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Content / Description</label>
                <textarea rows={4} value={serviceForm.content} onChange={e => setServiceForm(f => ({ ...f, content: e.target.value }))} className="w-full rounded-md border-0 py-2 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-cyan-600 text-sm" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={serviceForm.published} onChange={e => setServiceForm(f => ({ ...f, published: e.target.checked }))} className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600" />
                <span className="text-sm font-medium text-slate-700">Published (visible on website)</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-slate-200">
              <button onClick={() => setModal({ type: "none" })} className="px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
              <button onClick={saveService} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 disabled:opacity-50">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Modal */}
      {(modal.type === "add-faq" || modal.type === "edit-faq") && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="font-semibold text-lg text-slate-900">{modal.type === "add-faq" ? "Add FAQ" : "Edit FAQ"}</h3>
              <button onClick={() => setModal({ type: "none" })} className="text-slate-400 hover:text-slate-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-2">{error}</p>}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select value={faqForm.category} onChange={e => setFaqForm(f => ({ ...f, category: e.target.value }))} className="w-full rounded-md border-0 py-2 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-cyan-600 text-sm">
                  {["General", "Services", "Billing", "Insurance", "Appointments"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Question</label>
                <input type="text" value={faqForm.question} onChange={e => setFaqForm(f => ({ ...f, question: e.target.value }))} className="w-full rounded-md border-0 py-2 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-cyan-600 text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Answer</label>
                <textarea rows={4} value={faqForm.answer} onChange={e => setFaqForm(f => ({ ...f, answer: e.target.value }))} className="w-full rounded-md border-0 py-2 px-3 text-slate-900 ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-cyan-600 text-sm" />
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={faqForm.published} onChange={e => setFaqForm(f => ({ ...f, published: e.target.checked }))} className="h-4 w-4 rounded border-slate-300 text-cyan-600 focus:ring-cyan-600" />
                <span className="text-sm font-medium text-slate-700">Published (visible on website)</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-slate-200">
              <button onClick={() => setModal({ type: "none" })} className="px-4 py-2 text-sm font-semibold text-slate-700 border border-slate-300 rounded-md hover:bg-slate-50">Cancel</button>
              <button onClick={saveFaq} disabled={saving} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-cyan-600 rounded-md hover:bg-cyan-500 disabled:opacity-50">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
