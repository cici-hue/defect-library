import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Download,
  Share2,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Package,
  Building2,
  Calendar,
  User,
  Tag,
  FileText,
  Image as ImageIcon,
  Clock,
  Layers,
  Ruler,
  Palette,
  Factory,
  Globe,
  FileCheck,
  Leaf,
  Info,
  DollarSign,
  Clock4,
  FlaskConical,
  Beaker,
  Users,
} from 'lucide-react';

export function MaterialDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getMaterialById, deleteMaterial } = useApp();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const material = id ? getMaterialById(id) : undefined;

  if (!material) {
    return (
      <div className="min-h-screen">
        <Header title="Material Not Found" />
        <div className="p-6">
          <Card className="py-12 text-center">
            <Package className="w-12 h-12 text-[#94a3b8] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#0f172a] mb-2">Material not found</h3>
            <p className="text-sm text-[#64748b] mb-4">
              The material you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/library')}>
              <ArrowLeft className="w-4 h-4" />
              Back to Library
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    if (id) {
      deleteMaterial(id);
      navigate('/library');
    }
  };

  return (
    <div className="min-h-screen">
      <Header
        title={material.name}
        subtitle={material.code}
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <Button variant="secondary">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button variant="secondary">
              <Download className="w-4 h-4" />
              Export
            </Button>
            <Button onClick={() => navigate(`/edit/${id}`)}>
              <Edit className="w-4 h-4" />
              Edit
            </Button>
          </div>
        }
      />

      <div className="p-6 space-y-6">
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Images */}
          <div className="lg:col-span-1">
            <Card title="Material Images">
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-square bg-[#f0f4f8] rounded-lg overflow-hidden">
                  {material.images.length > 0 ? (
                    <img
                      src={material.images[0]}
                      alt={material.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-16 h-16 text-[#94a3b8]" />
                    </div>
                  )}
                </div>

                {/* Thumbnail Gallery */}
                {material.images.length > 1 && (
                  <div className="grid grid-cols-4 gap-2">
                    {material.images.map((img, index) => (
                      <button
                        key={index}
                        className="aspect-square bg-[#f0f4f8] rounded overflow-hidden border-2 border-transparent hover:border-[#3b82f6] transition-colors"
                      >
                        <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Quick Info */}
            <Card title="Quick Info" className="mt-6">
              <div className="space-y-3">
                <QuickInfoRow label="Approval" value={<ApprovalBadge status={material.status} />} />
                <QuickInfoRow label="Test Status" value={<TestStatusBadge status={material.testStatus} />} />
                <QuickInfoRow label="Created" value={material.createdAt} />
                <QuickInfoRow label="Updated" value={material.updatedAt} />
                <QuickInfoRow label="Created By" value={material.createdBy} />
              </div>
            </Card>

            {/* Certifications */}
            {material.certifications && material.certifications.length > 0 && (
              <Card title="Certifications" className="mt-6">
                <div className="flex flex-wrap gap-2">
                  {material.certifications.map((cert, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-[#22c55e]/10 text-[#22c55e] rounded-full text-xs"
                    >
                      <FileCheck className="w-3 h-3" />
                      {cert}
                    </span>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Module 1: Material Specification */}
            <Card
              title="Module 1: Material Specification"
              subtitle="Material Category and parameter specification"
              icon={<Layers className="w-5 h-5" />}
            >
              <div className="space-y-6">
                {/* Category & Classification */}
                <div>
                  <h4 className="text-sm font-medium text-[#334155] mb-3 flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    Category & Classification
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <DetailItem label="Material Top Category" value={material.materialTopCategory} />
                    <DetailItem label="Material Sub Category" value={material.materialSubCategory} />
                    <DetailItem label="Impression Intents" value={material.impressionIntents || '-'} />
                  </div>
                </div>

                {/* Fiber & Composition */}
                <div className="pt-4 border-t border-[#f1f5f9]">
                  <h4 className="text-sm font-medium text-[#334155] mb-3 flex items-center gap-2">
                    <Palette className="w-4 h-4" />
                    Fiber & Composition
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <DetailItem label="Fiber Contents" value={material.fiberContents} />
                    <DetailItem label="Branded Fiber" value={material.brandedFiber || '-'} />
                    <DetailItem label="Fabric Density" value={material.fabricDensity || '-'} />
                  </div>
                </div>

                {/* Dimensions */}
                <div className="pt-4 border-t border-[#f1f5f9]">
                  <h4 className="text-sm font-medium text-[#334155] mb-3 flex items-center gap-2">
                    <Ruler className="w-4 h-4" />
                    Dimensions
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <DetailItem label="Finished Weight" value={`${material.finishedWeight} GSM`} />
                    <DetailItem label="Material Width" value={`${material.materialWidth} inch`} />
                    <DetailItem label="Cuttable Width" value={material.cuttableWidth ? `${material.cuttableWidth} inch` : '-'} />
                  </div>
                </div>

                {/* Finishes & Functions */}
                <div className="pt-4 border-t border-[#f1f5f9]">
                  <h4 className="text-sm font-medium text-[#334155] mb-3 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Finishes & Functions
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem
                      label="Material Finishes"
                      value={material.materialFinishes && material.materialFinishes.length > 0
                        ? material.materialFinishes.join(', ')
                        : '-'
                      }
                    />
                    <DetailItem label="Material Function" value={material.materialFunction || '-'} />
                    <DetailItem label="Sustainable" value={material.sustainable || '-'} />
                    <DetailItem label="Care Recommendations" value={material.careRecommendations || '-'} />
                  </div>
                </div>

                {/* Customer (多选) */}
                <div className="bg-white rounded-lg border border-[#e2e8f0] p-4">
                  <h3 className="text-sm font-semibold text-[#334155] mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-[#475569]" />
                    Customer
                  </h3>
                  {material.customers && material.customers.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {material.customers.map((c) => (
                        <span
                          key={c}
                          className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-[#475569]/10 text-[#475569] border border-[#475569]/20"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-[#94a3b8]">-</span>
                  )}
                </div>

                {/* Comments */}
                {material.comments && (
                  <div className="pt-4 border-t border-[#f1f5f9]">
                    <h4 className="text-sm font-medium text-[#334155] mb-3">Comments</h4>
                    <p className="text-sm text-[#64748b] bg-[#f8fafc] p-3 rounded-lg">{material.comments}</p>
                  </div>
                )}
              </div>
            </Card>

            {/* Module 2: Supply Chain */}
            <Card
              title="Module 2: Supply Chain"
              subtitle="Material Supplier and production locations"
              icon={<Factory className="w-5 h-5" />}
            >
              <div className="space-y-6">
                {/* Supplier Info */}
                <div>
                  <h4 className="text-sm font-medium text-[#334155] mb-3 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Supplier Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <DetailItem label="Material Supplier Name" value={material.supplierName || '-'} />
                    <DetailItem label="Material Code (Mill Code)" value={material.materialCode || '-'} />
                    <DetailItem label="OI Code (Customer Code)" value={material.oiCode || '-'} />
                  </div>
                </div>

                {/* Production Location */}
                <div className="pt-4 border-t border-[#f1f5f9]">
                  <h4 className="text-sm font-medium text-[#334155] mb-3 flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Production Location
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem label="Country of Production" value={material.countryOfProduction || '-'} />
                    <DetailItem label="Weaving/Knitting Factory" value={material.weavingFactory || '-'} />
                    <DetailItem label="Dyeing Factory" value={material.dyeingFactory || '-'} />
                    <DetailItem label="Printing Factory" value={material.printingFactory || '-'} />
                    <DetailItem label="Finishing Factory" value={material.finishingFactory || '-'} />
                  </div>
                </div>
              </div>
            </Card>

            {/* Module 3: Cost and Lead-time */}
            <Card
              title="Module 3: Cost, MOQ, MCQ, Production Lead-time"
              subtitle="Material cost, minimum order quantity, and lead-time"
              icon={<DollarSign className="w-5 h-5" />}
            >
              <div className="space-y-6">
                {/* Material Cost */}
                <div>
                  <h4 className="text-sm font-medium text-[#334155] mb-3 flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    Material Cost
                  </h4>
                  <div className="space-y-4">
                    {/* USD */}
                    <div className="bg-[#f8fafc] p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                        <DetailItem
                          label="USD / M based on cuttable width, FOB ex-mill cost"
                          value={material.usdPerMCuttable ? `$${material.usdPerMCuttable}` : '-'}
                        />
                      </div>
                      <p className="text-xs text-[#94a3b8] italic">
                        system automatic to calculate the price based on 60" ( for price comparison purpose only ) :
                        <span className="ml-2 font-semibold text-[#3b82f6]">
                          {material.usdPerMCuttable && material.cuttableWidth
                            ? `$${(parseFloat(material.usdPerMCuttable) * material.cuttableWidth / 60).toFixed(2)}`
                            : '-'}
                        </span>
                      </p>
                    </div>
                    {/* RMB */}
                    <div className="bg-[#f8fafc] p-4 rounded-lg">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-2">
                        <DetailItem
                          label="RMB / M based on cuttable width, VAT ex-mill cost"
                          value={material.rmbPerMCuttable ? `¥${material.rmbPerMCuttable}` : '-'}
                        />
                      </div>
                      <p className="text-xs text-[#94a3b8] italic">
                        system automatic to calculate the price based on 60" ( for price comparison purpose only ) :
                        <span className="ml-2 font-semibold text-[#3b82f6]">
                          {material.rmbPerMCuttable && material.cuttableWidth
                            ? `¥${(parseFloat(material.rmbPerMCuttable) * material.cuttableWidth / 60).toFixed(2)}`
                            : '-'}
                        </span>
                      </p>
                    </div>
                    {/* Cost Validation Date */}
                    <DetailItem
                      label="Cost Validation date"
                      value={material.costValidationDate || '-'}
                    />
                  </div>
                </div>

                {/* Material MOQ & MCQ */}
                <div className="pt-4 border-t border-[#f1f5f9]">
                  <h4 className="text-sm font-medium text-[#334155] mb-3 flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Material MOQ & MCQ
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem
                      label="Material MOQ"
                      value={
                        material.materialMOQQuantity || material.materialMOQUnit
                          ? `${material.materialMOQQuantity || '-'} ${material.materialMOQUnit || ''}`.trim()
                          : '-'
                      }
                    />
                    <DetailItem
                      label="Material MCQ"
                      value={
                        material.materialMCQQuantity || material.materialMCQUnit
                          ? `${material.materialMCQQuantity || '-'} ${material.materialMCQUnit || ''}`.trim()
                          : '-'
                      }
                    />
                  </div>
                </div>

                {/* Material Lead-time */}
                <div className="pt-4 border-t border-[#f1f5f9]">
                  <h4 className="text-sm font-medium text-[#334155] mb-3 flex items-center gap-2">
                    <Clock4 className="w-4 h-4" />
                    Material Lead-time
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem
                      label="Sample Yardage development time"
                      value={material.sampleYardageDevTime ? `${material.sampleYardageDevTime} day${material.sampleYardageDevTime === '1' ? '' : 's'}` : '-'}
                    />
                    <DetailItem
                      label="Bulk production ( based on 3000M/color )"
                      value={material.bulkProductionTime ? `${material.bulkProductionTime} day${material.bulkProductionTime === '1' ? '' : 's'}` : '-'}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Module 4: Material Test */}
            <Card
              title="Module 4: Material Test"
              subtitle="Enable supplier to attach the test report"
              icon={<FlaskConical className="w-5 h-5" />}
            >
              <div className="space-y-6">
                {/* Test Report Files */}
                <div>
                  <h4 className="text-sm font-medium text-[#334155] mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Fabric Test Report
                  </h4>
                  {material.testReportFiles && material.testReportFiles.length > 0 ? (
                    <div className="space-y-2">
                      {material.testReportFiles.map((report) => (
                        <div
                          key={report.id}
                          className="flex items-center justify-between p-3 bg-[#f0f4f8] rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <FileText className="w-5 h-5 text-[#64748b]" />
                            <div>
                              <span className="text-sm text-[#0f172a] block">{report.name}</span>
                              <span className="text-xs text-[#64748b]">{report.type}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-[#94a3b8] bg-[#f8fafc] p-3 rounded-lg italic">
                      No test report uploaded
                    </p>
                  )}
                </div>

                {/* Test Status */}
                <div className="pt-4 border-t border-[#f1f5f9]">
                  <h4 className="text-sm font-medium text-[#334155] mb-3 flex items-center gap-2">
                    <Beaker className="w-4 h-4" />
                    Material Test Status
                  </h4>
                  <div>
                    <TestStatusBadgeLarge status={material.testStatus} />
                  </div>
                </div>
              </div>
            </Card>

            {/* Remarks */}
            {material.remarks && (
              <Card title="Remarks">
                <p className="text-sm text-[#64748b]">{material.remarks}</p>
              </Card>
            )}

            {/* Danger Zone */}
            <Card title="Danger Zone" className="!border-[#ef4444]/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-[#0f172a]">Delete this material</p>
                  <p className="text-xs text-[#64748b]">
                    Once you delete a material, there is no going back.
                  </p>
                </div>
                <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-[#ef4444]/10 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-[#ef4444]" />
              </div>
              <h3 className="text-lg font-bold text-[#0f172a]">Delete Material</h3>
            </div>
            <p className="text-sm text-[#64748b] mb-6">
              Are you sure you want to delete <strong>{material.name}</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleDelete}>
                <Trash2 className="w-4 h-4" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Detail Item Component
function DetailItem({ label, value, highlight }: { label: string; value: React.ReactNode; highlight?: boolean }) {
  return (
    <div>
      <p className="text-xs text-[#64748b] uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-sm font-medium ${highlight ? 'text-[#3b82f6] text-lg' : 'text-[#0f172a]'}`}>
        {value}
      </p>
    </div>
  );
}

// Quick Info Row Component
function QuickInfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-[#f1f5f9] last:border-0">
      <span className="text-sm text-[#64748b]">{label}</span>
      <span className="text-sm font-medium text-[#0f172a]">{value}</span>
    </div>
  );
}

// Approval Badge
function ApprovalBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    pending: { bg: 'bg-[#f59e0b]/10', text: 'text-[#f59e0b]', icon: <Clock className="w-3 h-3" /> },
    approved: { bg: 'bg-[#22c55e]/10', text: 'text-[#22c55e]', icon: <CheckCircle className="w-3 h-3" /> },
    archived: { bg: 'bg-[#94a3b8]/10', text: 'text-[#94a3b8]', icon: <Package className="w-3 h-3" /> },
  };

  const { bg, text, icon } = config[status] || config.pending;

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${bg} ${text}`}>
      {icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

// Test Status Badge (small, used in Quick Info)
function TestStatusBadge({ status }: { status?: string }) {
  if (!status) {
    return <span className="text-sm text-[#94a3b8]">N/A</span>;
  }
  return <TestStatusBadgeLarge status={status} />;
}

// Test Status Badge Large (used in Module 4)
function TestStatusBadgeLarge({ status }: { status?: string }) {
  const config: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
    'Pass': { bg: 'bg-[#22c55e]/10', text: 'text-[#22c55e]', icon: <CheckCircle className="w-4 h-4" /> },
    'Conditional Tolerance': { bg: 'bg-[#f59e0b]/10', text: 'text-[#f59e0b]', icon: <AlertTriangle className="w-4 h-4" /> },
    'Fail': { bg: 'bg-[#ef4444]/10', text: 'text-[#ef4444]', icon: <XCircle className="w-4 h-4" /> },
  };

  if (!status) {
    return (
      <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm bg-[#94a3b8]/10 text-[#94a3b8]">
        N/A
      </span>
    );
  }

  const { bg, text, icon } = config[status] || config['Pass'];

  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${bg} ${text}`}>
      {icon}
      {status}
    </span>
  );
}
