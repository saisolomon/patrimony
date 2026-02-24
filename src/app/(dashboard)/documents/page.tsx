import { requireSubscription, getUserDocuments, getUserEntities } from "@/lib/dal";
import { DocumentVault } from "@/components/dashboard/document-vault";

export default async function DocumentsPage() {
  const user = await requireSubscription();
  const [documents, entities] = await Promise.all([
    getUserDocuments(user.id),
    getUserEntities(user.id),
  ]);

  const serializedDocuments = documents.map((d) => ({
    id: d.id,
    name: d.name,
    fileName: d.fileName,
    fileSize: d.fileSize,
    mimeType: d.mimeType,
    blobUrl: d.blobUrl,
    category: d.category,
    entityName: d.entity?.name || null,
    createdAt: d.createdAt.toISOString(),
  }));

  const serializedEntities = entities.map((e) => ({
    id: e.id,
    name: e.name,
  }));

  return (
    <div className="space-y-8">
      <DocumentVault documents={serializedDocuments} entities={serializedEntities} />
    </div>
  );
}
