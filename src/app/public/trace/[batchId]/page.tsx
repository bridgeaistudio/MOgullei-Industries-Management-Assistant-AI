import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { Factory, Leaf, Beaker, CheckCircle, SearchX } from 'lucide-react';
import { format } from 'date-fns';

interface Props {
  params: Promise<{ batchId: string }>;
}

export default async function PublicTraceabilityPage({ params }: Props) {
  const { batchId } = await params;

  const batch = await prisma.batch.findUnique({
    where: { id: batchId },
    include: {
      recipe: {
        include: {
          ingredients: {
            include: {
              rawMaterial: true,
            },
          },
        },
      },
    },
  });

  const settings = await prisma.settings.findFirst();

  if (!batch || !batch.recipe) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-stone-200 p-8 max-w-md w-full text-center">
          <SearchX className="w-12 h-12 text-stone-400 mx-auto mb-4" />
          <h2 className="text-xl font-medium text-slate-800 mb-2">Batch Not Found</h2>
          <p className="text-stone-500">The requested traceability record could not be found. Please check the QR code or link.</p>
        </div>
      </div>
    );
  }

  const recipe = batch.recipe;
  const factoryName = settings?.factoryName ?? 'MOgullei Industries';

  return (
    <div className="min-h-screen bg-stone-50 text-slate-800 p-4 md:p-8 flex justify-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-sm border border-stone-200 overflow-hidden print:shadow-none print:border-none print:p-0">

        {/* Header */}
        <div className="bg-emerald-900 text-emerald-50 p-8 text-center print:bg-white print:text-slate-900 print:border-b print:border-stone-200">
          <Factory className="w-12 h-12 mx-auto mb-4 text-emerald-400 print:text-slate-800" />
          <h1 className="text-2xl font-medium tracking-tight mb-1">{factoryName}</h1>
          <p className="text-emerald-300 print:text-stone-500">Public Traceability Certificate</p>
        </div>

        <div className="p-8 space-y-8">

          {/* Batch Info */}
          <section className="grid grid-cols-2 gap-6 pb-6 border-b border-stone-100">
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Batch Number</p>
              <p className="font-mono text-lg text-slate-800">#{batch.id}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Product</p>
              <p className="text-lg font-medium text-slate-800">{recipe.name}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Production Date</p>
              <p className="text-slate-800">{format(new Date(batch.startDate), 'MMMM d, yyyy')}</p>
            </div>
            <div>
              <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">Status</p>
              <p className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <CheckCircle className="w-4 h-4" /> Quality Passed
              </p>
            </div>
          </section>

          {/* Ingredients & Provenance */}
          <section>
            <h3 className="text-lg font-medium text-slate-800 flex items-center gap-2 mb-4">
              <Leaf className="w-5 h-5 text-emerald-600" />
              Ingredient Provenance
            </h3>
            <div className="bg-stone-50 rounded-xl border border-stone-100 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-stone-100/50 text-stone-500 font-medium border-b border-stone-100">
                  <tr>
                    <th className="px-4 py-3">Ingredient</th>
                    <th className="px-4 py-3">Source / Supplier</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {recipe.ingredients.map((ing, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 font-medium text-slate-700">{ing.rawMaterial?.name ?? 'Unknown'}</td>
                      <td className="px-4 py-3 text-stone-600">{ing.rawMaterial?.supplier ?? 'Verified Partner'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Maker Notes */}
          {recipe.notes && (
            <section>
              <h3 className="text-lg font-medium text-slate-800 flex items-center gap-2 mb-3">
                <Beaker className="w-5 h-5 text-emerald-600" />
                Maker&apos;s Notes
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed bg-stone-50 p-4 rounded-xl border border-stone-100">
                {recipe.notes}
              </p>
            </section>
          )}

          {/* Footer */}
          <footer className="pt-8 border-t border-stone-100 text-center text-xs text-stone-400 space-y-1">
            <p>Scan the QR code on your product packaging to view this record.</p>
            <p>&copy; {new Date().getFullYear()} {factoryName}. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
