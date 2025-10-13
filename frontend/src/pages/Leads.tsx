import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Mail, Phone, MoreVertical, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAnimation } from '../contexts/AnimationContextHooks';
import { Toast } from '../components/ui/Toast';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
  source: string;
  date: string;
  starred?: boolean;
  notes?: string;
}

const mockLeads: Lead[] = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    status: 'New',
    source: 'Website',
    date: '2024-03-15',
    starred: false,
    notes: 'Interested in premium plan',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+1 (555) 234-5678',
    status: 'Contacted',
    source: 'Referral',
    date: '2024-03-14',
    starred: true,
    notes: 'Follow up next week',
  },
  {
    id: 3,
    name: 'Mike Johnson',
    email: 'mike.j@example.com',
    phone: '+1 (555) 345-6789',
    status: 'Qualified',
    source: 'LinkedIn',
    date: '2024-03-13',
    starred: false,
    notes: 'Ready for demo',
  },
  {
    id: 4,
    name: 'Sarah Williams',
    email: 'sarah.w@example.com',
    phone: '+1 (555) 456-7890',
    status: 'Lost',
    source: 'Cold Call',
    date: '2024-03-12',
    starred: false,
    notes: 'Budget constraints',
  },
];

export const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<keyof Lead>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [expandedLeadId, setExpandedLeadId] = useState<number | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const { getAnimationVariant } = useAnimation();

  const filteredLeads = leads
    .filter((lead) => {
      const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const aValue = String(a[sortField] || '');
      const bValue = String(b[sortField] || '');
      const direction = sortDirection === 'asc' ? 1 : -1;
      return aValue < bValue ? -1 * direction : aValue > bValue ? 1 * direction : 0;
    });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'Contacted':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Qualified':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Lost':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const handleSort = (field: keyof Lead) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleStarLead = (id: number) => {
    setLeads(prev => prev.map(lead => 
      lead.id === id ? { ...lead, starred: !lead.starred } : lead
    ));
    const lead = leads.find(l => l.id === id);
    setToastMessage(`${lead?.name} ${lead?.starred ? 'removed from' : 'added to'} favorites`);
    setShowToast(true);
  };

  const handleStatusChange = (id: number, newStatus: Lead['status']) => {
    setLeads(prev => prev.map(lead => 
      lead.id === id ? { ...lead, status: newStatus } : lead
    ));
    setToastMessage('Lead status updated');
    setShowToast(true);
  };

  const handleExpandLead = (id: number) => {
    setExpandedLeadId(prev => prev === id ? null : id);
  };

  const getSortIcon = (field: keyof Lead) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />;
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={getAnimationVariant('fade')}
    >
      <div className="flex items-center justify-between mb-8">
        <motion.h1 
          className="text-3xl font-bold tracking-tight"
          variants={getAnimationVariant('slideLeft')}
        >
          Leads
        </motion.h1>
        <motion.div variants={getAnimationVariant('slideRight')}>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Lead
          </Button>
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Leads</CardTitle>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500 dark:text-gray-400" />
                <input
                  type="text"
                  placeholder="Search leads..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800"
              >
                <option value="all">All Status</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Lost">Lost</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4">
                    <button 
                      className="flex items-center space-x-1 hover:text-primary-600"
                      onClick={() => handleSort('name')}
                    >
                      <span>Name</span>
                      {getSortIcon('name')}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">Contact</th>
                  <th className="text-left py-3 px-4">
                    <button 
                      className="flex items-center space-x-1 hover:text-primary-600"
                      onClick={() => handleSort('status')}
                    >
                      <span>Status</span>
                      {getSortIcon('status')}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <button 
                      className="flex items-center space-x-1 hover:text-primary-600"
                      onClick={() => handleSort('source')}
                    >
                      <span>Source</span>
                      {getSortIcon('source')}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">
                    <button 
                      className="flex items-center space-x-1 hover:text-primary-600"
                      onClick={() => handleSort('date')}
                    >
                      <span>Date Added</span>
                      {getSortIcon('date')}
                    </button>
                  </th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filteredLeads.map((lead) => (
                    <motion.tr
                      key={lead.id}
                      layout
                      variants={getAnimationVariant('listItem')}
                      className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                      onClick={() => handleExpandLead(lead.id)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <motion.div 
                            className="h-8 w-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center"
                            whileHover={{ scale: 1.1 }}
                          >
                            <span className="text-primary-700 dark:text-primary-300 font-medium">
                              {lead.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </motion.div>
                          <div>
                            <div className="font-medium">{lead.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{lead.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `mailto:${lead.email}`;
                            }}
                          >
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              window.location.href = `tel:${lead.phone}`;
                            }}
                          >
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={lead.status}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleStatusChange(lead.id, e.target.value as Lead['status']);
                          }}
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)} border-0 cursor-pointer`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Qualified">Qualified</option>
                          <option value="Lost">Lost</option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">{lead.source}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-sm">{lead.date}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStarLead(lead.id);
                            }}
                          >
                            <Star 
                              className={`h-4 w-4 ${lead.starred ? 'fill-yellow-400 text-yellow-400' : ''}`} 
                            />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                      {expandedLeadId === lead.id && (
                        <motion.td 
                          className="py-4 px-4 bg-gray-50 dark:bg-gray-800"
                          colSpan={6}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                        >
                          <div className="text-sm">
                            <h4 className="font-medium mb-2">Notes</h4>
                            <p className="text-gray-600 dark:text-gray-400">{lead.notes || 'No notes available.'}</p>
                          </div>
                        </motion.td>
                      )}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {showToast && (
        <Toast
          id="leads-toast"
          title="Success"
          message={toastMessage}
          type="success"
          onClose={() => setShowToast(false)}
        />
      )}
    </motion.div>
  );
};

export default Leads; 