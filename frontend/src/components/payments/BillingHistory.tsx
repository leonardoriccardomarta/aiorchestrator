import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Filter, FileText, ChevronUp, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { useAnimation } from '../../contexts/AnimationContextHooks';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
  }[];
  pdfUrl?: string;
}

interface BillingHistoryProps {
  invoices: Invoice[];
  onDownloadInvoice: (id: string) => void;
  onExportHistory: () => void;
}

export const BillingHistory: React.FC<BillingHistoryProps> = ({
  invoices,
  onDownloadInvoice,
  onExportHistory,
}) => {
  const [_expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null);
  const [_statusFilter, setStatusFilter] = useState<Invoice['status'] | 'all'>('all');
  const { getAnimationVariant } = useAnimation();

  const filteredInvoices = invoices.filter(
    (invoice) => _statusFilter === 'all' || invoice.status === _statusFilter
  );

  const getStatusColor = (status: Invoice['status']) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    }
  };

  const toggleInvoice = (id: string) => {
    setExpandedInvoiceId(_expandedInvoiceId === id ? null : id);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Billing History</CardTitle>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <select
                value={_statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as Invoice['status'] | 'all')}
                className="text-sm border-0 bg-transparent focus:ring-0"
              >
                <option value="all">All Status</option>
                <option value="paid">Paid</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <Button variant="outline" onClick={onExportHistory}>
              <Download className="h-4 w-4 mr-2" />
              Export History
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredInvoices.map((invoice) => (
            <motion.div
              key={invoice.id}
              variants={getAnimationVariant('listItem')}
              initial="initial"
              animate="animate"
              layout
            >
              <div
                className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
              >
                <div
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => toggleInvoice(invoice.id)}
                >
                  <div className="flex items-center space-x-4">
                    <FileText className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium">Invoice #{invoice.id}</div>
                      <div className="text-sm text-gray-500">{invoice.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(invoice.status)}`}>
                      {invoice.status}
                    </span>
                    <div className="text-right">
                      <div className="font-medium">${invoice.amount.toFixed(2)}</div>
                    </div>
                    {_expandedInvoiceId === invoice.id ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </div>
                </div>

                {_expandedInvoiceId === invoice.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-gray-200 dark:border-gray-700"
                  >
                    <div className="p-4 space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Items</h4>
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="text-gray-500">
                              <th className="text-left font-medium py-2">Description</th>
                              <th className="text-right font-medium py-2">Quantity</th>
                              <th className="text-right font-medium py-2">Unit Price</th>
                              <th className="text-right font-medium py-2">Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {invoice.items.map((item, index) => (
                              <tr key={index}>
                                <td className="py-2">{item.description}</td>
                                <td className="text-right py-2">{item.quantity}</td>
                                <td className="text-right py-2">${item.unitPrice.toFixed(2)}</td>
                                <td className="text-right py-2">
                                  ${(item.quantity * item.unitPrice).toFixed(2)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="border-t border-gray-200 dark:border-gray-700">
                              <td colSpan={3} className="text-right py-2 font-medium">
                                Total
                              </td>
                              <td className="text-right py-2 font-medium">
                                ${invoice.amount.toFixed(2)}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                      {invoice.pdfUrl && (
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDownloadInvoice(invoice.id)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download PDF
                          </Button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}

          {filteredInvoices.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              No invoices found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}; 