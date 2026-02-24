"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Upload,
  Trash2,
  Download,
  Filter,
  File,
  Image,
  FileSpreadsheet,
  Loader2,
} from "lucide-react";

const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  trust: { label: "Trust", color: "bg-gold/15 text-gold" },
  "operating-agreement": { label: "Operating Agreement", color: "bg-blue-500/15 text-blue-400" },
  "tax-return": { label: "Tax Return", color: "bg-success/15 text-success" },
  insurance: { label: "Insurance", color: "bg-purple-500/15 text-purple-400" },
  general: { label: "General", color: "bg-text-muted/15 text-text-muted" },
};

const CATEGORY_OPTIONS = [
  { value: "general", label: "General" },
  { value: "trust", label: "Trust Document" },
  { value: "operating-agreement", label: "Operating Agreement" },
  { value: "tax-return", label: "Tax Return" },
  { value: "insurance", label: "Insurance" },
];

function formatFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${bytes} B`;
}

function getFileIcon(mimeType: string) {
  if (mimeType.startsWith("image/")) return Image;
  if (mimeType.includes("spreadsheet")) return FileSpreadsheet;
  return File;
}

interface DocumentItem {
  id: string;
  name: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  blobUrl: string;
  category: string;
  entityName: string | null;
  createdAt: string;
}

interface DocumentVaultProps {
  documents: DocumentItem[];
  entities: { id: string; name: string }[];
}

export function DocumentVault({ documents, entities }: DocumentVaultProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Upload form state
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docName, setDocName] = useState("");
  const [docCategory, setDocCategory] = useState("general");
  const [docEntityId, setDocEntityId] = useState("");

  const filteredDocs = activeCategory === "all"
    ? documents
    : documents.filter((d) => d.category === activeCategory);

  const handleFileSelect = useCallback((file: File) => {
    setSelectedFile(file);
    setDocName(file.name.replace(/\.[^.]+$/, ""));
    setShowUploadForm(true);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files?.[0];
      if (file) handleFileSelect(file);
    },
    [handleFileSelect]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  async function handleUpload() {
    if (!selectedFile) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("name", docName);
      formData.append("category", docCategory);
      if (docEntityId) formData.append("entityId", docEntityId);

      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        setShowUploadForm(false);
        setSelectedFile(null);
        setDocName("");
        setDocCategory("general");
        setDocEntityId("");
        router.refresh();
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/documents/${id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold/15">
              <FileText className="h-5 w-5 text-gold" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-text-primary">
                Document Vault
              </h1>
              <p className="mt-0.5 text-sm text-text-muted">
                {documents.length} documents stored securely
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-gold to-gold-dark px-4 py-2.5 text-sm font-semibold text-bg-primary hover:shadow-lg hover:shadow-gold/20"
        >
          <Upload className="h-4 w-4" />
          Upload Document
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.xlsx,.png,.jpg,.jpeg"
          onChange={handleInputChange}
          className="hidden"
        />
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all ${
          dragOver
            ? "border-gold bg-gold/5"
            : "border-border bg-bg-card hover:border-border-light"
        }`}
      >
        <Upload className={`h-8 w-8 ${dragOver ? "text-gold" : "text-text-muted"}`} />
        <p className="mt-3 text-sm font-medium text-text-primary">
          Drag & drop files here
        </p>
        <p className="mt-1 text-xs text-text-muted">
          PDF, DOCX, XLSX, PNG, JPG up to 50MB
        </p>
      </div>

      {/* Upload Form Modal */}
      {showUploadForm && selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowUploadForm(false)} />
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-bg-secondary p-6 shadow-2xl">
            <h2 className="mb-4 text-lg font-semibold text-text-primary">Upload Document</h2>

            <div className="mb-4 rounded-xl border border-border bg-bg-card p-3">
              <p className="text-sm font-medium text-text-primary">{selectedFile.name}</p>
              <p className="text-xs text-text-muted">{formatFileSize(selectedFile.size)}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">
                  Document Name
                </label>
                <input
                  type="text"
                  value={docName}
                  onChange={(e) => setDocName(e.target.value)}
                  className="w-full rounded-xl border border-border bg-bg-card px-4 py-2.5 text-sm text-text-primary outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">
                  Category
                </label>
                <select
                  value={docCategory}
                  onChange={(e) => setDocCategory(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-border bg-bg-card px-4 py-2.5 text-sm text-text-primary outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
                >
                  {CATEGORY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-text-muted">
                  Entity (optional)
                </label>
                <select
                  value={docEntityId}
                  onChange={(e) => setDocEntityId(e.target.value)}
                  className="w-full appearance-none rounded-xl border border-border bg-bg-card px-4 py-2.5 text-sm text-text-primary outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/20"
                >
                  <option value="">No entity</option>
                  {entities.map((e) => (
                    <option key={e.id} value={e.id}>{e.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowUploadForm(false)}
                className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-text-secondary hover:bg-bg-card"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !docName}
                className="flex-1 rounded-xl bg-gradient-to-r from-gold to-gold-dark px-4 py-2.5 text-sm font-semibold text-bg-primary hover:shadow-lg hover:shadow-gold/20 disabled:opacity-50"
              >
                {uploading ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Uploading...
                  </span>
                ) : (
                  "Upload"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-text-muted" />
        <button
          onClick={() => setActiveCategory("all")}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
            activeCategory === "all"
              ? "bg-gold/15 text-gold"
              : "text-text-muted hover:bg-bg-card hover:text-text-secondary"
          }`}
        >
          All {documents.length}
        </button>
        {Object.entries(CATEGORY_CONFIG).map(([key, config]) => {
          const count = documents.filter((d) => d.category === key).length;
          if (count === 0) return null;
          return (
            <button
              key={key}
              onClick={() => setActiveCategory(activeCategory === key ? "all" : key)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                activeCategory === key
                  ? "bg-gold/15 text-gold"
                  : "text-text-muted hover:bg-bg-card hover:text-text-secondary"
              }`}
            >
              {config.label} {count}
            </button>
          );
        })}
      </div>

      {/* Document List */}
      <div className="space-y-3">
        {filteredDocs.map((doc) => {
          const FileIcon = getFileIcon(doc.mimeType);
          const catConfig = CATEGORY_CONFIG[doc.category] || CATEGORY_CONFIG.general;

          return (
            <div
              key={doc.id}
              className="group flex items-center gap-4 rounded-2xl border border-border bg-bg-card p-4 transition-all duration-200 hover:border-border-light hover:bg-bg-card-hover"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-secondary">
                <FileIcon className="h-5 w-5 text-text-muted" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate text-sm font-semibold text-text-primary">
                    {doc.name}
                  </h3>
                  <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${catConfig.color}`}>
                    {catConfig.label}
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-text-muted">
                  {doc.fileName} &middot; {formatFileSize(doc.fileSize)}
                  {doc.entityName && <> &middot; {doc.entityName}</>}
                  {" "}&middot;{" "}
                  {new Date(doc.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <a
                  href={doc.blobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-2 text-text-muted hover:bg-bg-secondary hover:text-text-primary"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </a>
                <button
                  onClick={() => handleDelete(doc.id)}
                  disabled={deletingId === doc.id}
                  className="rounded-lg p-2 text-text-muted hover:bg-danger/10 hover:text-danger disabled:opacity-50"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}

        {filteredDocs.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-bg-card py-16">
            <FileText className="h-8 w-8 text-text-muted" />
            <p className="mt-3 text-sm text-text-muted">No documents yet</p>
            <p className="text-xs text-text-muted">
              Upload your first document to get started
            </p>
          </div>
        )}
      </div>
    </>
  );
}
